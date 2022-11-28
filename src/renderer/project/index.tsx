import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "renderer/project/store/configureStore";
import { AppContainer } from "react-hot-loader";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ThemeProvider from "ui/theme/ThemeProvider";
import GlobalStyle from "ui/globalStyle";
import API from "renderer/lib/api";
import App from "./components/App";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import "../../styles/App.css";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import "../../styles/theme.css";
import { setLanguageData } from "shared/lib/l10n";
console.warn("@TODO Replace CSS imports with styled components");

const urlParams = new URLSearchParams(window.location.search);
const projectPath = urlParams.get("path") || undefined;

// Attach store to global scope for debugging
(
  window as unknown as {
    store: typeof store;
  }
).store = store;

const render = async () => {
  setLanguageData(await API.getL10NData());
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <ThemeProvider>
            <GlobalStyle />
            <App projectPath={projectPath} />
          </ThemeProvider>
        </DndProvider>
      </Provider>
    </AppContainer>,
    document.getElementById("App")
  );
};

render();

if (module.hot) {
  module.hot.accept(render);
}
