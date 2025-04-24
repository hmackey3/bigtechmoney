
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

export const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export interface SignupFormProps {
  invitationToken: string | null;
}

export interface SignupFormHookProps {
  form: UseFormReturn<SignupFormValues>;
  invitationToken: string | null;
}

export interface SignupFieldsProps {
  loading: boolean;
  invitationToken: string | null;
  invitationEmail: string | null;
  onSubmit: (values: SignupFormValues) => void;
}
