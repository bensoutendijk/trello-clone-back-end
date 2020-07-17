import mongoose from 'mongoose';
import passport from 'passport';
import express, { Request, Response } from 'express';
import auth from '../../../auth';
import { LocalUser } from '../../../models/LocalUser';

const router = express.Router();
const LocalUser = mongoose.model<LocalUser>('LocalUser');

// POST new user route (optional, everyone has access)
router.post('/', ...auth.optional, async (req, res) => {
  const { body: user } = req;

  if (!user.email) {
    return res.status(422).json({
      email: 'is required',
    });
  }

  if (!user.password) {
    return res.status(422).json({
      password: 'is required',
    });
  }

  if (!user.passwordConfirmation) {
    return res.status(422).json({
      passwordConfirmation: 'is required',
    });
  }

  if (user.password !== user.passwordConfirmation) {
    return res.status(442).json({
      passwordConfirmation: 'does not match',
    });
  }

  const existingUser = await LocalUser.findOne({ email: user.email });

  if (!existingUser) {
    const finalUser = new LocalUser(user);

    finalUser.setPassword(user.password);
    try {
      await finalUser.save();
    } catch (err) {
      return res.json({
        user: 'Something went wrong',
      });
    }
    res.cookie('token', `Token ${finalUser.generateHttpOnlyJWT()}`, {
      expires: new Date(Date.now() + 1000 * 60 * 30),
      httpOnly: true,
    });
    res.cookie('token2', `Token ${finalUser.generateJWT()}`, {
      expires: new Date(Date.now() + 1000 * 60 * 30),
    });
    return res.json(finalUser.toJSON());
  }
  return res.status(442).json({
    email: 'already exists',
  });
});

// POST login route (optional, everyone has access)
router.post('/login', ...auth.optional, (req, res, next) => {
  const { body: user } = req;

  if (!user.email) {
    return res.status(422).json({
      email: 'is required',
    });
  }

  if (!user.password) {
    return res.status(422).json({
      password: 'is required',
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      res.cookie('httpOnlyToken', `Token ${passportUser.generateHttpOnlyJWT()}`, {
        expires: new Date(Date.now() + 1000 * 60 * 30),
        httpOnly: true,
      });
      res.cookie('token', `Token ${passportUser.generateJWT()}`, {
        expires: new Date(Date.now() + 1000 * 60 * 30),
      });
      return res.json(passportUser.toJSON());
    }

    return res.status(422).json({
      authentication: 'email not registered',
    });
  })(req, res, next);
});

// GET current route (required, only authenticated users have access)
router.get('/current', ...auth.required, async (req: Request, res: Response) => {
  const { user } = req;
  const localUser = await LocalUser.findOne({ id: user.id });

  if (localUser === null) {
    throw new Error('user not found');
  }

  res.cookie('httpOnlyToken', `Token ${localUser.generateHttpOnlyJWT()}`, {
    expires: new Date(Date.now() + 1000 * 60 * 30),
    httpOnly: true,
  });
  res.cookie('token', `Token ${localUser.generateJWT()}`, {
    expires: new Date(Date.now() + 1000 * 60 * 30),
  });

  return res.json(localUser.toJSON());
});

export default router;
