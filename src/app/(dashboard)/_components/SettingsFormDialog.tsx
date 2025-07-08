import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';

interface SettingsFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    isEditing: boolean;
    form: {
        key: string;
        value: string;
        description: string;
    };
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const SettingsFormDialog = ({
    open,
    onOpenChange,
    onSubmit,
    isSubmitting,
    isEditing,
    form,
    onFormChange,
}: SettingsFormDialogProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)]">
            <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-bold text-center">
                    {isEditing ? 'Edit Setting' : 'Add New Setting'}
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 sm:space-y-6 sm:py-4">
                <div className="space-y-2">
                    <Label htmlFor="key">Key</Label>
                    <Input
                        id="key"
                        name="key"
                        placeholder="e.g., ApiToken"
                        value={form.key}
                        onChange={onFormChange}
                        disabled={isEditing}
                        className="text-sm sm:text-base w-full"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Textarea
                        id="value"
                        name="value"
                        placeholder="Enter value here..."
                        value={form.value}
                        onChange={onFormChange}
                        rows={3}
                        className="resize-y text-sm sm:text-base w-full break-all"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                        id="description"
                        name="description"
                        placeholder="Brief description of the setting..."
                        value={form.description}
                        onChange={onFormChange}
                        className="text-sm sm:text-base w-full"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
                    <Button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="flex-1"
                        size="sm"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? 'Save Changes' : 'Create Setting'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                        size="sm"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
);