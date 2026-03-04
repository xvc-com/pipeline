import { globbySync } from "globby";
import x from "path";
export default (dirPath) =>
  globbySync(["**/*.js"], {
    cwd: dirPath,
    gitignore: true,
    absolute: true,
  });
