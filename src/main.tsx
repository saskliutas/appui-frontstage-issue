import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UiFramework } from "@itwin/appui-react";
import { EmptyLocalization } from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import { App } from "./App";

import "@itwin/itwinui-react/styles.css";

// Same initialization order as `@itwin/viewer-react` BaseInitializer, minus iModel/presentation.
await IModelApp.startup({ localization: new EmptyLocalization() });
await UiFramework.initialize();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
