import { SettingsForm } from "@/features/settings/ui/settings-form";

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
