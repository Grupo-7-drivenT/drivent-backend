import Joi from 'joi';
import authenticationService, { SignInParams } from '@/services/authentication-service';

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
