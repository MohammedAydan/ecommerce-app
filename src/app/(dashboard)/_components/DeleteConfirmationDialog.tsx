import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting: boolean;
    confirmKey: string;
    onConfirmKeyChange: (value: string) => void;
    itemToDelete: string;
}

export const DeleteConfirmationDialog = ({
    open,
    onOpenChange,
    onConfirm,
    isDeleting,
    confirmKey,
    onConfirmKeyChange,
    itemToDelete,
}: DeleteConfirmationDialogProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)]">
            <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-bold text-center text-destructive flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                    Confirm Delete
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
                <p className="text-center text-muted-foreground text-sm sm:text-base">
                    Type <span className="font-bold text-destructive">{itemToDelete}</span> to confirm deletion:
                </p>
                <Input
                    placeholder="Enter key to confirm..."
                    value={confirmKey}
                    onChange={(e) => onConfirmKeyChange(e.target.value)}
                    className="text-sm sm:text-base"
                />
                <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={confirmKey !== itemToDelete || isDeleting}
                        onClick={onConfirm}
                        className="flex-1"
                        size="sm"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
);