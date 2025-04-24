import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenConfirmDeleteModal: () => void; // opens your existing confirm delete modal
  onOpenTransferOwnershipModal: () => void; // opens your existing transfer modal
  systemName?: string;
}

const DeleteSystemDialog = ({
  open,
  onOpenChange,
  onOpenConfirmDeleteModal,
  onOpenTransferOwnershipModal,
}: DeleteSystemDialogProps) => {
  const handleTransferClick = () => {
    onOpenChange(false); // close this dialog
    onOpenTransferOwnershipModal(); // open transfer ownership modal
  };

  const handleDeleteAnywayClick = () => {
    onOpenChange(false); // close this dialog
    onOpenConfirmDeleteModal(); // open confirm deletion modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>You have the Owner role.</DialogTitle>
          <DialogDescription>
            Before deleting your account, you must either transfer ownership to
            another member or confirm that you want to permanently delete it.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleTransferClick}>
            Transfer Ownership
          </Button>
          <Button variant="destructive" onClick={handleDeleteAnywayClick}>
            Delete Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSystemDialog;
