import { Setting } from '@/types/settings';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface SettingCardProps {
    setting: Setting;
    onEdit: (setting: Setting) => void;
    onDelete: (key: string) => void;
}

export const SettingCard = ({ setting, onEdit, onDelete }: SettingCardProps) => {
    return (
        <Card className="group hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <Badge variant="secondary" className="mb-2 text-xs sm:text-sm">
                            {setting.key}
                        </Badge>
                        {setting.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {setting.description}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(setting)}
                            className="h-7 w-7 p-0"
                        >
                            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        {!setting.default && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(setting.key)}
                                className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="bg-muted rounded-lg p-3 sm:p-4">
                    <code className="text-xs sm:text-sm font-mono break-all">
                        {setting.value}
                    </code>
                </div>
            </CardContent>
        </Card>
    );
}