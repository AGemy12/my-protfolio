import { adminSettings } from "@/lib/admin-data";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function ProfilePage() {
  const { settings } = await adminSettings();
  return <SettingsForm initial={settings} />;
}
