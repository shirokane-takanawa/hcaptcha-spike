import React from "react";
import "./App.css";
import FormWithCheckbox from "./FormWithCheckbox";
import FormWithInvisibleBadge from "./FormWithInvisibleBadge";
import clsx from "clsx";

enum Mode {
  Checkbox,
  Invisible,
}

const App = () => {
  const [mode, setMode] = React.useState(Mode.Checkbox);

  return (
    <div className="App">
      <div className="Tabs">
        <button
          className={clsx("TabButton", { Active: mode === Mode.Checkbox })}
          onClick={() => setMode(Mode.Checkbox)}
        >
          <h2>Checkbox</h2>
        </button>
        <button
          className={clsx("TabButton", { Active: mode === Mode.Invisible })}
          onClick={() => setMode(Mode.Invisible)}
        >
          <h2>Invisible</h2>
        </button>
      </div>

      <div className="TabContent">
        <div className={mode === Mode.Checkbox ? "Visible" : "Invisible"}>
          <FormWithCheckbox />
        </div>

        <div className={mode === Mode.Invisible ? "Visible" : "Invisible"}>
          <FormWithInvisibleBadge />
        </div>
      </div>
    </div>
  );
};

export default App;
