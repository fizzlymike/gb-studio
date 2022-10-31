// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, nativeTheme } from "electron";
import path from "path";
import l10n from "lib/helpers/l10n";

export const SplashAPI = {
  platform: process.platform,
  l10n: (key: string, params?: Record<string, string | number>) =>
    l10n(key, params),
  openExternal: (path: string) => ipcRenderer.invoke("open-external", path),
  theme: {
    getShouldUseDarkColors: () => nativeTheme?.shouldUseDarkColors,
    getThemeSetting: () => ipcRenderer.invoke("settings-get", "theme"),
    onChange: (callback: () => void) => {
      nativeTheme?.on("updated", callback);
      ipcRenderer?.on("update-theme", callback);
    },
  },
  getRecentProjects: (): Promise<string[]> =>
    ipcRenderer.invoke("get-recent-projects"),
  path: {
    basename: (input: string) => path.basename(input),
    dirname: (input: string) => path.dirname(input),
  },
} as const;

contextBridge.exposeInMainWorld("SplashAPI", SplashAPI);

export default contextBridge;