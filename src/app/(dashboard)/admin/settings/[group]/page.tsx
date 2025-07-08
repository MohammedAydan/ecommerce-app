'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Settings, Plus, Globe, Mail } from 'lucide-react';
import { Setting, SettingsGroup } from '@/types/settings';
import { SettingsHeader } from '@/app/(dashboard)/_components/SettingsHeader';
import { SettingsTabs } from '@/app/(dashboard)/_components/SettingsTabs';
import { SettingsFormDialog } from '@/app/(dashboard)/_components/SettingsFormDialog';
import { DeleteConfirmationDialog } from '@/app/(dashboard)/_components/DeleteConfirmationDialog';
import { SettingCard } from '@/app/(dashboard)/_components/SettingCard';

const groups: SettingsGroup[] = [
    { id: 'apisettings', name: 'ApiSettings', icon: Globe },
    { id: 'emailconfig', name: 'EmailConfig', icon: Mail },
    { id: 'paymentconfig', name: 'PaymentConfig', icon: Plus },
    { id: 'jwt', name: 'JWT', icon: Settings },
];

export default function SettingsPage() {
    const { group } = useParams() as { group: string };
    const queryClient = useQueryClient();

    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState({
        key: '',
        value: '',
        description: ''
    });
    const [editing, setEditing] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState({
        key: '',
        open: false
    });
    const [deleteConfirmKey, setDeleteConfirmKey] = useState('');

    const currentGroup = groups.find(g => g.id === group?.toLowerCase()) || groups[0];

    useEffect(() => {
        if (!openDialog && !editing) {
            setForm({ key: '', value: '', description: '' });
        }
    }, [openDialog, editing]);

    const { data: settings = [], isLoading } = useQuery<Setting[]>({
        queryKey: ['settings', group],
        queryFn: async () => {
            const { data } = await apiClient.get(`/settings/${group}`);
            return data;
        },
    });

    const addSetting = useMutation({
        mutationFn: async () => {
            const trimmedKey = form.key.trim();
            const trimmedValue = form.value.trim();

            if (!trimmedKey || !trimmedValue) {
                toast.error('Key and Value are required');
                return Promise.reject();
            }

            if (editing) {
                await apiClient.put(`/settings/${editing}`, {
                    value: trimmedValue,
                    description: form.description.trim()
                });
            } else {
                await apiClient.post('/settings/add', {
                    key: `${group}:${trimmedKey}`,
                    value: trimmedValue,
                    description: form.description.trim(),
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', group] });
            toast.success(`Setting ${editing ? 'updated' : 'added'} successfully`);
            setOpenDialog(false);
            setEditing(null);
            setForm({ key: '', value: '', description: '' });
        },
        onError: () => toast.error('Error saving the setting'),
    });

    const deleteSetting = useMutation({
        mutationFn: async (key: string) => {
            await apiClient.delete(`/settings/${key}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', group] });
            toast.success('Setting deleted successfully');
            setDeleteDialog({ key: '', open: false });
            setDeleteConfirmKey('');
        },
        onError: () => toast.error('Failed to delete setting'),
    });

    const handleEdit = (setting: Setting) => {
        const [, key] = setting.key.split(':');
        setForm({
            key,
            value: setting.value,
            description: setting.description
        });
        setEditing(setting.key);
        setOpenDialog(true);
    };

    const handleDelete = (key: string) => {
        setDeleteDialog({ key, open: true });
    };

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-background w-full">
            <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
                <SettingsHeader
                    group={currentGroup}
                    title="System Settings"
                    description="Manage and customize your system settings according to your needs"
                />

                <SettingsTabs
                    groups={groups}
                    currentGroupId={group}
                />

                <Card>
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <currentGroup.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                <div>
                                    <CardTitle className="text-lg sm:text-xl">
                                        {currentGroup.name} Settings
                                    </CardTitle>
                                    <CardDescription className="text-sm sm:text-base">
                                        Manage settings for {currentGroup.name}
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                onClick={() => setOpenDialog(true)}
                                size="sm"
                                className="w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Setting
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {isLoading ? (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="h-4 bg-muted rounded mb-3 animate-pulse"></div>
                                    <div className="h-3 bg-muted rounded mb-2 animate-pulse"></div>
                                    <div className="h-8 bg-muted rounded animate-pulse"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : settings.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 sm:p-12 text-center">
                            <div className="text-muted-foreground mb-4">
                                <Settings className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                                    No Settings Found
                                </h3>
                                <p className="text-sm sm:text-base">
                                    There are no settings configured for this section
                                </p>
                            </div>
                            <Button
                                onClick={() => setOpenDialog(true)}
                                className="mt-4"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Setting
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {settings.map((setting) => (
                            <SettingCard
                                key={setting.key}
                                setting={setting}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                <SettingsFormDialog
                    open={openDialog}
                    onOpenChange={(v) => {
                        setOpenDialog(v);
                        if (!v) {
                            setForm({
                                key: '',
                                value: '',
                                description: ''
                            });
                            setEditing(null);
                        }
                    }}
                    onSubmit={() => addSetting.mutate()}
                    isSubmitting={addSetting.isPending}
                    isEditing={!!editing}
                    form={form}
                    onFormChange={handleFormChange}
                />

                <DeleteConfirmationDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) => setDeleteDialog({ key: '', open })}
                    onConfirm={() => deleteSetting.mutate(deleteDialog.key)}
                    isDeleting={deleteSetting.isPending}
                    confirmKey={deleteConfirmKey}
                    onConfirmKeyChange={setDeleteConfirmKey}
                    itemToDelete={deleteDialog.key}
                />
            </div>
        </div>
    );
}