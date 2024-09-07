import { z } from 'zod';


const emailSchema = z.string().email({ message: "Invalid email address" });


const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });


const userNameSchema = z.string()
  .min(2, { message: "Full name must be at least 2 characters long" })
  .regex(/^[a-zA-Z\s]+$/, { message: "Full name can only contain letters and spaces" });

export const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});


export const userSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userName: userNameSchema,
});
