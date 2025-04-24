
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema, type SignupFormProps, type SignupFormValues } from "./types";
import { useSignupInvitation } from "@/hooks/useSignupInvitation";
import { useSignupWithLocation } from "@/hooks/signup/useSignupWithLocation";
import { InvitationLoading } from "./signup/InvitationLoading";
import { InvitationError } from "./signup/InvitationError";
import { SignupFields } from "./signup/SignupFields";

const SignupForm = ({ invitationToken }: SignupFormProps) => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { loading, handleSignup } = useSignupWithLocation();
  const { invitationEmail, fetchingInvitation, fetchError } = useSignupInvitation(invitationToken, form);

  const onSubmit = (values: SignupFormValues) => {
    handleSignup(values, invitationToken);
  };

  if (invitationToken && fetchingInvitation) {
    return <InvitationLoading />;
  }

  if (invitationToken && fetchError) {
    return <InvitationError errorMessage={fetchError} />;
  }

  return (
    <Form {...form}>
      <SignupFields
        loading={loading}
        invitationToken={invitationToken}
        invitationEmail={invitationEmail}
        onSubmit={onSubmit}
      />
    </Form>
  );
};

export default SignupForm;
