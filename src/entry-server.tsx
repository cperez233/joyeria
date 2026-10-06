import { renderToString } from "react-dom/server";
import App from "./App";
import type { Lang } from "./data";

export { jsonLd, fillHead } from "./seo";
export { site, copy, langs, langPath, navIds } from "./data";
export const render = (lang: Lang) => renderToString(<App initialLang={lang} />);
