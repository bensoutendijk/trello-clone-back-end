import jwt, { GetTokenCallback } from 'express-jwt';
import keys from './config/keys';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const handleErrorMiddleware: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError' ) {
        return res.status(err.status).send(err.inner);
    }
}

const getHttpOnlyToken: GetTokenCallback = (req) => {
    const { httpOnlyToken } = req.cookies;
    if (httpOnlyToken && httpOnlyToken.split(' ')[0] === 'Token') {
        return httpOnlyToken.split(' ')[1];
    }
    return null;
};

const getToken: GetTokenCallback = (req) => {
    const { token } = req.cookies;
    if (token && token.split(' ')[0] === 'Token') {
        return token.split(' ')[1];
    }
    return null;
};

const auth = {
    required: [
        jwt({
            secret: keys.jwtHttpOnlyKey,
            userProperty: 'user',
            getToken: getHttpOnlyToken,
        }),
        jwt({
            secret: keys.jwtKey,
            userProperty: 'user',
            getToken,
        }),
        handleErrorMiddleware
    ],
    optional: [
        jwt({
            secret: keys.jwtHttpOnlyKey,
            userProperty: 'user',
            getToken: getHttpOnlyToken,
            credentialsRequired: false,
        }),
        jwt({
            secret: keys.jwtKey,
            userProperty: 'user',
            getToken,
            credentialsRequired: false,
        }),
    ],
};

export default auth;
