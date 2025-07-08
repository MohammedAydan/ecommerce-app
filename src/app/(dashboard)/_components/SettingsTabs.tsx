import { SettingsGroup } from '@/types/settings';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

interface SettingsTabsProps {
  groups: SettingsGroup[];
  currentGroupId: string;
}

export const SettingsTabs = ({ groups, currentGroupId }: SettingsTabsProps) => {
  const router = useRouter();

  return (
    <Tabs
      value={currentGroupId}
      onValueChange={(g) => router.push(`/admin/settings/${g.toLowerCase()}`)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 gap-2">
        {groups.map((g) => (
          <TabsTrigger
            key={g.id}
            value={g.id}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <g.icon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate">{g.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};