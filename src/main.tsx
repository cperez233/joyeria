import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const lang = location.pathname.startsWith("/en") ? "en" : "it";
const root = document.getElementById("root")!;
const app = <StrictMode><App initialLang={lang} /></StrictMode>;
// En build el HTML viene prerenderizado por idioma; en dev se monta desde cero
// (el root trae solo el comentario <!--app-->: se hidrata solo si hay HTML de verdad).
root.firstElementChild ? hydrateRoot(root, app) : createRoot(root).render(app);
// Red de seguridad: si la página se sirvió sin prerender, la pestaña no muestra "%TITLE%".
if (document.title.includes("%")) {
  import("./data").then(({ copy }) => { document.title = copy[lang].meta.title; document.documentElement.lang = lang; });
}
