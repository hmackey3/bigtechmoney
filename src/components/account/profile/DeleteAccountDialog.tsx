import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/providers/auth-provider";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteAccountDialog = ({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) => {
  const [confirmation, setConfirmation] = useState("");
  const [newOwnerId, setNewOwnerId] = useState("");
  const [transferOwnership, setTransferOwnership] = useState<boolean | null>(
    null
  );
  const { deleteAccount, isDeleting, error } = useDeleteAccount();
  const { user } = useAuth();

  const handleDelete = async () => {
    if (confirmation !== "DELETE") return;

    const success = await deleteAccount(transferOwnership ? newOwnerId : null);
    if (success) {
      onOpenChange(false);
    }
  };

  const resetState = () => {
    setConfirmation("");
    setNewOwnerId("");
    setTransferOwnership(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newValue) => {
        if (!newValue) resetState();
        onOpenChange(newValue);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={
              isDeleting ||
              confirmation !== "DELETE" ||
              (transferOwnership === true && !newOwnerId)
            }
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
