import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSettingsSchema, type UpdateSettingsInput } from "@eagle-vocab/types";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSettings, useUpdateSettings } from "../hooks/use-settings";
import { Skeleton } from "@/components/ui/skeleton";

const LANGUAGES = [
  { id: "en", name: "English" },
  { id: "fr", name: "French" },
  { id: "es", name: "Spanish" },
  { id: "de", name: "German" },
  { id: "it", name: "Italian" },
  { id: "pt", name: "Portuguese" },
  { id: "ja", name: "Japanese" },
  { id: "zh", name: "Chinese" },
  { id: "ko", name: "Korean" },
  { id: "ru", name: "Russian" },
];

export function SettingsForm() {
  const { data: settingsData, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      nativeLanguageId: settingsData?.data?.nativeLanguageId || "en",
      showPronunciation: settingsData?.data?.showPronunciation ?? true,
      showExamples: settingsData?.data?.showExamples ?? true,
      showDefinition: settingsData?.data?.showDefinition ?? true,
    },
  });

  const nativeLanguageId = watch("nativeLanguageId");
  const showPronunciation = watch("showPronunciation");
  const showExamples = watch("showExamples");
  const showDefinition = watch("showDefinition");

  async function onSubmit(data: UpdateSettingsInput) {
    try {
      await updateSettingsMutation.mutateAsync(data);
      toast.success("Settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="nativeLanguage">Native Language</Label>
            <Select
              value={nativeLanguageId}
              onValueChange={(value) =>
                setValue("nativeLanguageId", value, { shouldDirty: true })
              }
            >
              <SelectTrigger id="nativeLanguage" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 p-3 bg-muted rounded">
            <Label className="text-base font-semibold">Display Options</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="showPronunciation" className="font-normal">
                  Show Pronunciation
                </Label>
                <Switch
                  id="showPronunciation"
                  checked={showPronunciation ?? true}
                  onCheckedChange={(checked) =>
                    setValue("showPronunciation", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showDefinition" className="font-normal">
                  Show Definition
                </Label>
                <Switch
                  id="showDefinition"
                  checked={showDefinition ?? true}
                  onCheckedChange={(checked) =>
                    setValue("showDefinition", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showExamples" className="font-normal">
                  Show Examples
                </Label>
                <Switch
                  id="showExamples"
                  checked={showExamples ?? true}
                  onCheckedChange={(checked) =>
                    setValue("showExamples", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isDirty || updateSettingsMutation.isPending}
            className="w-full"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
