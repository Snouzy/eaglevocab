import { apiClient } from "@/shared/lib/api-client";
import { UpdateSettingsInput } from "@eagle-vocab/types";
import { ApiResponse } from "@eagle-vocab/types";

export async function getSettings() {
  return apiClient<ApiResponse<any>>("/api/settings");
}

export async function updateSettings(data: UpdateSettingsInput) {
  return apiClient<ApiResponse<any>>("/api/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
