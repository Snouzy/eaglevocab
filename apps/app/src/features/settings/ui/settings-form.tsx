import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSettingsSchema, type UpdateSettingsInput } from "@eagle-vocab/types";
import { toast } from "sonner";
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
import { useLanguages } from "@/features/cards/hooks/use-languages";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsForm() {
  const { data: settingsData, isLoading: isLoadingSettings } = useSettings();
  const { data: languagesData, isLoading: isLoadingLanguages } = useLanguages();
  const updateSettingsMutation = useUpdateSettings();

  const languages = languagesData?.data || [];

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      nativeLanguageId: "en",
      showPronunciation: true,
      showExamples: true,
      showDefinition: true,
    },
  });

  const settings = settingsData?.data;

  useEffect(() => {
    if (settings) {
      reset({
        nativeLanguageId: settings.nativeLanguageId || "",
        showPronunciation: settings.showPronunciation ?? true,
        showExamples: settings.showExamples ?? true,
        showDefinition: settings.showDefinition ?? true,
      });
    }
  }, [settings, reset]);

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

  if (isLoadingSettings || isLoadingLanguages) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    );
  }

  return (
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
                {languages.map((lang: any) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 p-3 bg-muted rounded">
            <Label className="text-lg font-semibold">Display Options</Label>
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
              <p className="text-sm text-muted-foreground">Show how the word is pronounced</p>
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
              <p className="text-sm text-muted-foreground">Show the word's definition</p>
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
              <p className="text-sm text-muted-foreground">Show example sentences</p>
            </div>
          </div>

          <Button
            type="submit"
            variant="success"
            disabled={!isDirty || updateSettingsMutation.isPending}
            className="w-full"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
  );
}
