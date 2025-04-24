
import { CardContent } from "@/components/ui/card";

export const InvitationLoading = () => {
  return (
    <CardContent className="flex justify-center items-center py-8">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Loading invitation details...</p>
      </div>
    </CardContent>
  );
};
