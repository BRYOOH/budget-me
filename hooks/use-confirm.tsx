import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle } from "@/components/ui/dialog";

export const useConfirm = (
    title:string,
    message:string
): [() => JSX.Element | null, () => Promise<unknown> ] => {
  
    const [promise,setPromise] = useState<{ resolve: (value: boolean) => void} | null> (null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const confirm = () => new Promise((resolve, reject) => {
      setPromise({ resolve });  
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = () => {
        if (!promise) return null; 
        return (
            <Dialog open={!!promise} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> {title} </DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={handleCancel} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        )
        
    }
    return [ConfirmationDialog, confirm];
};