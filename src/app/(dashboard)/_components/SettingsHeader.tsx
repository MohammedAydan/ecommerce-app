import { SettingsGroup } from '@/types/settings';

interface SettingsHeaderProps {
  group: SettingsGroup;
  title: string;
  description: string;
}

export const SettingsHeader = ({ group, title, description }: SettingsHeaderProps) => (
  <div className="text-center space-y-4">
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <div className="p-3 rounded-lg bg-primary text-primary-foreground">
        <group.icon className="w-6 h-6" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
        {title}
      </h1>
    </div>
    <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
      {description}
    </p>
  </div>
);