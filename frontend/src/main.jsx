import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Content from "./content";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Content />
    </BrowserRouter>
  </StrictMode>,
);
