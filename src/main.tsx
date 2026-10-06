import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const lang = location.pathname.startsWith("/en") ? "en" : "it";
const root = document.getElementById("root")!;
const app = <StrictMode><App initialLang={lang} /></StrictMode>;
// En build el HTML viene prerenderizado por idioma; en dev se monta desde cero.
root.hasChildNodes() ? hydrateRoot(root, app) : createRoot(root).render(app);
