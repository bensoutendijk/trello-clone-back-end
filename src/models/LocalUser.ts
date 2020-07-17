/* eslint-disable func-names */
import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import keys from '../config/keys';

export interface LocalUser extends Document {
  email: string;
  permissions: string[];
  services: string[];
  hash: string;
  salt: string;
  setPassword: (password: string) => void;
  validatePassword: (password: string) => boolean;
  generateHttpOnlyJWT: () => string;
  generateJWT: () => string;
  toJSON: () => LocalUser;
}

const userSchema = new Schema({
  email: { type: String, index: true },
  permissions: [{ type: String }],
  services: [{ type: String }],
  hash: String,
  salt: String,
}, { timestamps: true });

userSchema.methods.setPassword = function setPassword(password: string): void {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function validatePassword(password: string): boolean {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateHttpOnlyJWT = function generateHttpOnlyJWT(): string {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setTime(today.getTime() + 1000 * 60 * 30);

  return jwt.sign({
    email: this.email,
    _id: this._id,
    permissions: this.permissions,
    services: this.services,
    exp: Math.floor(expirationDate.getTime() / 1000),
  }, keys.jwtHttpOnlyKey);
};

userSchema.methods.generateJWT = function generateJWT(): string {
  const today: Date = new Date();
  const expirationDate: Date = new Date(today);
  expirationDate.setTime(today.getTime() + 1000 * 60 * 30);

  return jwt.sign({
    email: this.email,
    _id: this._id,
    permissions: this.permissions,
    services: this.services,
    exp: Math.floor(expirationDate.getTime() / 1000),
  }, keys.jwtKey);
};

userSchema.methods.toJSON = function toJSON() {
  return {
    _id: this._id,
    email: this.email,
    permissions: this.permissions,
    services: this.services,
  };
};

mongoose.model<LocalUser>('LocalUser', userSchema);
export default LocalUser;