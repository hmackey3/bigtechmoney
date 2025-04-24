
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type { SignupFormValues, SignupFieldsProps } from "@/components/auth/types";

export const SignupFields = ({ 
  loading, 
  invitationToken, 
  invitationEmail,
  onSubmit
}: SignupFieldsProps) => {
  const form = useFormContext<SignupFormValues>();
  
  const handleSubmit = form.handleSubmit((values: SignupFormValues) => {
    onSubmit(values);
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  {...field}
                  readOnly={!!invitationToken}
                  className={invitationToken ? "bg-gray-100" : ""}
                  placeholder={invitationToken ? "" : "your.email@example.com"}
                />
              </FormControl>
              {invitationToken && invitationEmail && (
                <p className="text-xs text-muted-foreground">
                  This email is associated with your invitation
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || (invitationToken && !invitationEmail)}
        >
          {loading ? "Creating account..." : invitationToken ? "Join Organization" : "Create Account"}
        </Button>
      </CardFooter>
    </form>
  );
};
