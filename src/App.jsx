import React from "react";

import AnimatedRoutes from "./components/AnimatedRoutes";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AnimatedCursor from "react-animated-cursor";

function AppContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <AnimatedCursor
        innerSize={8}
        outerSize={35}
        color={isDark ? "255, 255, 255" : "0, 0, 0"}
        outerAlpha={0}
        innerScale={0.7}
        outerScale={2}
        outerStyle={{
          border: `2px solid ${isDark ? "white" : "black"}`,
          backgroundColor: "transparent",
        }}
        trailingSpeed={3}
      />
      <AnimatedRoutes />
      <ThemeToggle />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
