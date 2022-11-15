import { Dispatch, Middleware } from "@reduxjs/toolkit";
import ScripTracker from "lib/vendor/scriptracker/scriptracker";
import { RootState } from "renderer/project/store/configureStore";
import soundfxActions from "renderer/project/store/features/soundfx/soundfxActions";
import navigationActions from "renderer/project/store/features/navigation/navigationActions";
import actions from "./musicActions";
import { musicSelectors } from "renderer/project/store/features/entities/entitiesState";
import { assetFilename } from "lib/helpers/gbstudio";
import { MusicSettings } from "renderer/project/store/features/entities/entitiesTypes";
// import { ipcRenderer } from "electron";
// import { readFile } from "fs-extra";
// import { loadUGESong } from "lib/helpers/uge/ugeHelper";
// import toArrayBuffer from "lib/helpers/toArrayBuffer";

let modPlayer: ScripTracker;

export function initMusic() {
  modPlayer = new ScripTracker();
  modPlayer.on(ScripTracker.Events.playerReady, onSongLoaded);
  window.removeEventListener("click", initMusic);
  window.removeEventListener("keydown", initMusic);
  return modPlayer;
}

// Initialise audio on first click
window.addEventListener("click", initMusic);
window.addEventListener("keydown", initMusic);

function onSongLoaded(player: ScripTracker) {
  player.play();
}

function playMOD(filename: string, settings: MusicSettings) {
  if (modPlayer) {
    modPlayer.loadModule(
      `file://${filename}`,
      !!settings.disableSpeedConversion
    );
  }
}

async function playUGE(filename: string, _settings: MusicSettings) {
  // const fileData = toArrayBuffer(await readFile(filename));
  // const data = loadUGESong(fileData);
  // const listener = async (_event: any, d: any) => {
  //   if (d.action === "initialized") {
  //     ipcRenderer.send("music-data-send", {
  //       action: "play",
  //       song: data,
  //       position: [0, 0],
  //     });
  //   }
  // };
  // ipcRenderer.once("music-data", listener);
  // ipcRenderer.send("open-music");
  console.warn("@TODO Handle play UGE init");
}

function pause() {
  if (modPlayer && modPlayer.isPlaying) {
    modPlayer.stop();
  }
  // if (ipcRenderer) {
  //   ipcRenderer.send("close-music");
  // }
  console.warn("@TODO Handle close music");
}

const musicMiddleware: Middleware<Dispatch, RootState> =
  (store) => (next) => (action) => {
    if (actions.playMusic.match(action)) {
      const state = store.getState();
      const track = musicSelectors.selectById(state, action.payload.musicId);
      if (track) {
        const projectRoot = state.document.root;
        const filename = assetFilename(projectRoot, "music", track);
        if (track.type === "uge") {
          playUGE(filename, track.settings);
        } else {
          playMOD(filename, track.settings);
        }
      }
    } else if (actions.pauseMusic.match(action)) {
      pause();
    } else if (
      soundfxActions.playSoundFxBeep.match(action) ||
      soundfxActions.playSoundFxTone.match(action) ||
      soundfxActions.playSoundFxCrash.match(action) ||
      navigationActions.setSection.match(action) ||
      navigationActions.setNavigationId.match(action)
    ) {
      store.dispatch(actions.pauseMusic());
    }

    return next(action);
  };

export default musicMiddleware;
