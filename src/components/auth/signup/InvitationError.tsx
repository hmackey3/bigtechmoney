
import { CardContent } from "@/components/ui/card";

interface InvitationErrorProps {
  errorMessage: string;
}

export const InvitationError = ({ errorMessage }: InvitationErrorProps) => {
  return (
    <CardContent className="flex justify-center items-center py-8">
      <div className="text-center">
        <p className="text-destructive mb-2">Invalid or expired invitation</p>
        <p className="text-muted-foreground text-sm">{errorMessage}</p>
      </div>
    </CardContent>
  );
};
