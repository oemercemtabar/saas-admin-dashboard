import { useEffect, useState } from "react";
import { useSettings, useUpdateSettings } from "../../features/settings/queries";
import type { Settings as SettingsType } from "../../features/settings/types";

export default function Settings() {
  const settings = useSettings();
  const save = useUpdateSettings();

  const [form, setForm] = useState<SettingsType>({
    refreshIntervalSec: 15,
    enableCrashReporting: true,
    enableActivityTracking: true,
    environment: "demo",
  });

  useEffect(() => {
    if (settings.data) setForm(settings.data);
  }, [settings.data]);

  const isDirty = settings.data
    ? JSON.stringify(settings.data) !== JSON.stringify(form)
    : false;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-gray-600">Configure dashboard preferences.</p>
      </div>

      {settings.isLoading ? (
        <div className="text-gray-600">Loading settings…</div>
      ) : settings.isError ? (
        <div className="text-red-600">Failed to load settings.</div>
      ) : (
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-6 max-w-2xl">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <div className="text-sm font-medium">Refresh Interval (seconds)</div>
              <input
                type="number"
                min={5}
                max={120}
                value={form.refreshIntervalSec}
                onChange={(e) =>
                  setForm((p) => ({ ...p, refreshIntervalSec: Number(e.target.value) }))
                }
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
              <div className="text-xs text-gray-500">Recommended: 10–30 seconds</div>
            </label>

            <label className="space-y-1">
              <div className="text-sm font-medium">Environment</div>
              <select
                value={form.environment}
                onChange={(e) => setForm((p) => ({ ...p, environment: e.target.value }))}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="demo">demo</option>
                <option value="staging">staging</option>
                <option value="production">production</option>
              </select>
              <div className="text-xs text-gray-500">Affects labels and default toggles</div>
            </label>
          </div>

          <div className="grid gap-3">
            <label className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <div className="text-sm font-medium">Crash Reporting</div>
                <div className="text-xs text-gray-500">Collect crash reports for troubleshooting</div>
              </div>
              <input
                type="checkbox"
                checked={form.enableCrashReporting}
                onChange={(e) =>
                  setForm((p) => ({ ...p, enableCrashReporting: e.target.checked }))
                }
                className="h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <div className="text-sm font-medium">Activity Tracking</div>
                <div className="text-xs text-gray-500">Track admin activity and key actions</div>
              </div>
              <input
                type="checkbox"
                checked={form.enableActivityTracking}
                onChange={(e) =>
                  setForm((p) => ({ ...p, enableActivityTracking: e.target.checked }))
                }
                className="h-4 w-4"
              />
            </label>
          </div>

          {save.isError ? (
            <div className="text-sm text-red-600">Failed to save settings.</div>
          ) : save.isSuccess ? (
            <div className="text-sm text-green-700">Settings saved.</div>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              className="rounded-xl bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
              disabled={!isDirty || save.isPending}
              onClick={() => save.mutate(form)}
            >
              {save.isPending ? "Saving…" : "Save changes"}
            </button>

            <button
              className="rounded-xl border px-4 py-2 text-sm disabled:opacity-60"
              disabled={!settings.data || save.isPending}
              onClick={() => settings.data && setForm(settings.data)}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}