import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ConfigurableUiContent,
  FrontstageDef,
  FrontstageUtilities,
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  UiFramework,
  UiItemsManager,
  useActiveFrontstageDef,
  useSpecificWidgetDef,
  WidgetState,
} from "@itwin/appui-react";
import { ThemeProvider } from "@itwin/itwinui-react";

import type { UiItemsProvider } from "@itwin/appui-react";

const WIDGET_ID = "scene-control-widget";

const frontstage = FrontstageUtilities.createStandardFrontstage({
  id: "main-frontstage",
  usage: StageUsage.General,
  contentGroupProps: {
    id: "content-group",
    layout: { id: "single-content" },
    contents: [{ id: "content", classId: "", content: <div style={{ height: "100%", background: "#ccd" }}>Viewport</div> }],
  },
  // Same left panel defaults as the `@itwin/viewer-react` default frontstage: collapsed (Minimized) and unpinned.
});

const widgetsProvider: UiItemsProvider = {
  id: "widgets-provider",
  getWidgets: () => [
    {
      id: WIDGET_ID,
      label: "Scene",
      content: <button>Create new layer</button>,
      layouts: { standard: { section: StagePanelSection.End, location: StagePanelLocation.Left } },
    },
  ],
};
UiItemsManager.register(widgetsProvider);

export function App() {
  useOpenWidgetWhenFrontstageReady();
  return (
    <ThemeProvider style={{ height: "100%" }}>
      <Frontstage />
    </ThemeProvider>
  );
}

function Frontstage() {
  const [frontstageDef, setFrontstageDef] = useState<FrontstageDef>();
  useEffect(() => {
    if (frontstageDef) {
      void UiFramework.frontstages.setActiveFrontstageDef(frontstageDef);
    }
  }, [frontstageDef]);
  useEffect(() => {
    UiFramework.frontstages.addFrontstage(frontstage);
    void UiFramework.frontstages.getFrontstageDef(frontstage.id).then((def) => def && setFrontstageDef(def));
    return () => UiFramework.frontstages.clearFrontstages();
  }, []);
  return <ConfigurableUiContent />;
}

function useOpenWidgetWhenFrontstageReady() {
  const widgetDef = useSpecificWidgetDef(WIDGET_ID);
  const isFrontstageReady = useIsActiveFrontstageReady();
  useEffect(() => {
    if (!isFrontstageReady || !widgetDef) {
      return;
    }
    widgetDef.setWidgetState(WidgetState.Open);
  }, [widgetDef, isFrontstageReady]);
}

function subscribeToFrontstageReady(onChange: () => void) {
  return UiFramework.frontstages.onFrontstageReadyEvent.addListener(onChange);
}

function useIsActiveFrontstageReady(): boolean {
  const frontstageDef = useActiveFrontstageDef();
  return useSyncExternalStore(subscribeToFrontstageReady, () => !!frontstageDef?.isReady);
}