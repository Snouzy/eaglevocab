import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSettingsSchema, type UpdateSettingsInput } from "@eagle-vocab/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <SettingsFormInner
      settings={settingsData?.data}
      languages={languagesData?.data || []}
    />
  );
}

interface SettingsFormInnerProps {
  settings: Record<string, unknown> | undefined;
  languages: Array<{ id: string; name: string; flag: string | null }>;
}

function SettingsFormInner({ settings, languages }: SettingsFormInnerProps) {
  const updateSettingsMutation = useUpdateSettings();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      nativeLanguageId: (settings?.nativeLanguageId as string) || "",
      showPronunciation: (settings?.showPronunciation as boolean) ?? true,
      showExamples: (settings?.showExamples as boolean) ?? true,
      showDefinition: (settings?.showDefinition as boolean) ?? true,
      readwiseToken: (settings?.readwiseToken as string) || "",
    },
  });

  const nativeLanguageId = watch("nativeLanguageId");
  const showPronunciation = watch("showPronunciation");
  const showExamples = watch("showExamples");
  const showDefinition = watch("showDefinition");
  const readwiseToken = watch("readwiseToken");

  async function onSubmit(data: UpdateSettingsInput) {
    try {
      await updateSettingsMutation.mutateAsync({
        ...data,
        readwiseToken: readwiseToken || null,
      });
      toast.success("Settings updated");
    } catch {
      toast.error("Failed to update settings");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errs) => console.error("Settings form errors:", errs))}
      className="space-y-6"
    >
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
            {languages.map((lang) => (
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
                setValue("showPronunciation", checked, { shouldDirty: true })
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
                setValue("showDefinition", checked, { shouldDirty: true })
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
                setValue("showExamples", checked, { shouldDirty: true })
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">Show example sentences</p>
        </div>
      </div>

      <div className="space-y-3 p-3 bg-muted rounded">
        <Label className="text-lg font-semibold">Readwise Integration</Label>
        <p className="text-sm text-muted-foreground">
          Connect your Readwise account to import highlighted words from your books.
        </p>
        <div>
          <Label htmlFor="readwiseToken" className="font-normal">API Token</Label>
          <Input
            id="readwiseToken"
            type="password"
            placeholder="Paste your Readwise token..."
            value={watch("readwiseToken") ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("readwiseToken", e.target.value, { shouldDirty: true })
            }
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Get your token at{" "}
            <a
              href="https://readwise.io/access_token"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline"
            >
              readwise.io/access_token
            </a>
          </p>
        </div>
        {settings?.readwiseToken && (
          <div className="flex items-center gap-2 text-sm text-success">
            <div className="h-2 w-2 rounded-full bg-success" />
            Connected
          </div>
        )}
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
