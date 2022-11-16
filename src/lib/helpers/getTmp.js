import os from "os";
import isElectron from "./isElectron";

const getTmp = () => {
  let tmpPath = os.tmpdir();
  if (isElectron()) {
    // eslint-disable-next-line global-require
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const settings = require("electron-settings");
    if (settings.get("tmpDir")) {
      tmpPath = settings.get("tmpDir");
    }
  }
  if (
    tmpPath.indexOf(" ") === -1 &&
    tmpPath.indexOf(".itch") === -1 &&
    (process.platform !== "win32" || tmpPath.length < 35)
  ) {
    // Ok
  } else if (process.platform === "win32") {
    tmpPath = "C:\\tmp";
  } else tmpPath = "/tmp";
  return tmpPath;
};

export default getTmp;
