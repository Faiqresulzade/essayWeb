import * as yup from 'yup';

import { FULL_NAME_MAX_CHARS, PASSWORD_MIN_LENGTH } from '@/domain';
import { strings } from '@/shared/i18n/strings';

const { validation } = strings;

const email = yup.string().trim().required(validation.required).email(validation.emailInvalid);

const password = yup
  .string()
  .required(validation.required)
  .min(PASSWORD_MIN_LENGTH, validation.passwordMin)
  .matches(/[A-ZÜÖĞŞÇİI]/, validation.passwordUppercase)
  .matches(/[a-züöğşçıi]/, validation.passwordLowercase)
  .matches(/\d/, validation.passwordDigit);

const confirmPassword = (field: string) =>
  yup
    .string()
    .required(validation.required)
    .oneOf([yup.ref(field)], validation.passwordMatch);

export const loginSchema = yup.object({
  email,
  password: yup.string().required(validation.required),
});

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required(validation.required)
    .min(3, validation.fullNameMin)
    .max(FULL_NAME_MAX_CHARS, validation.maxLength(FULL_NAME_MAX_CHARS)),
  email,
  password,
  confirmPassword: confirmPassword('password'),
  acceptTerms: yup.boolean().oneOf([true], validation.acceptTermsRequired).required(),
});

export const forgotPasswordSchema = yup.object({ email });

export const resetPasswordSchema = yup.object({
  email,
  token: yup.string().trim().required(validation.required),
  newPassword: password,
  confirmPassword: confirmPassword('newPassword'),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required(validation.required),
  newPassword: password,
  confirmPassword: confirmPassword('newPassword'),
});

export const profileSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required(validation.required)
    .min(3, validation.fullNameMin)
    .max(FULL_NAME_MAX_CHARS, validation.maxLength(FULL_NAME_MAX_CHARS)),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;
export type ProfileFormValues = yup.InferType<typeof profileSchema>;
