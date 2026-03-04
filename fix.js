#!/usr/bin/env bun

import iflow from "@3-/iflow";
import 遍历 from "./walk.js";
import oxfmt from "./oxfmt.js";
import ERR from "@3-/log/ERR.js";
import { OxlintNode } from "@teambit/oxc.linter.oxlint-node";

const oxlint = OxlintNode.create({
  fixesFlags: {
    all: true,
  },
});

const { stdout } = process,
  retry = async (fn, ...args) => {
    let catch_n, pre_err_n, pre;
    for (;;) {
      try {
        const goon = await fn(...args);
        catch_n = 0;
        if (goon) {
          if (goon == pre && ++pre_err_n > 3) {
            return;
          }
          pre = goon;
        } else {
          return;
        }
      } catch (e) {
        ERR(e);
        if (++catch_n > 3) {
          break;
        }
      }
    }
  },
  fix = async (fp) => {
    const err_li = await oxfmt(fp);
    if (err_li) {
      const err = err_li.map(({ codeframe }) => codeframe).join("\n\n");
      let prompt = "修复js错误 : " + err;
      await iflow(async (send, recv) => {
        await send(prompt.replaceAll(dir, "."));
        for await (const text of recv()) {
          stdout.write(text);
        }
      });
      return err;
    }
  },
  main = async (dir) => {
    const 文件列表 = 遍历(dir);
    for (const fp of 文件列表) {
      await retry(fix, fp);

      const r = await oxlint.run([fp]),
        { default: result } = r;
      console.log(r);
      if (!result.startsWith("Found 0 warnings and 0 errors.\n")) {
        console.log(fp, result);
      }
    }
  };

await main(process.cwd());
process.exit();
