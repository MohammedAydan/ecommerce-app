export interface Setting {
  key: string;
  value: string;
  description: string;
  default?: boolean;
}

export interface SettingsGroup {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}