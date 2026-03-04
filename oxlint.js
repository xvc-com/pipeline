import { r as 校验 } from "./node_modules/oxlint/dist/bindings.js";

let 加载插件 = null,
  设置规则配置 = null,
  校验文件 = null,
  创建工作区 = null,
  销毁工作区 = null,
  加载脚本配置 = null;

const 加载插件包装 = async (路径, 插件名, 插件名是别名, 工作区路径) => {
  if (加载插件 === null) {
    const 模块 = await import("./node_modules/oxlint/dist/plugins.js");
    ({ loadPlugin: 加载插件, lintFile: 校验文件, setupRuleConfigs: 设置规则配置 } = 模块);
  }
  return 加载插件(路径, 插件名, 插件名是别名, 工作区路径);
};

const 设置规则配置包装 = (选项) => 设置规则配置(选项);

const 校验文件包装 = (
  文件路径,
  缓冲区标识,
  缓冲区,
  规则标识,
  选项标识,
  设置,
  全局变量,
  工作区路径,
) => 校验文件(文件路径, 缓冲区标识, 缓冲区, 规则标识, 选项标识, 设置, 全局变量, 工作区路径);

const 创建工作区包装 = async (工作区) => {
  if (创建工作区 === null) {
    const 模块 = await import("./node_modules/oxlint/dist/workspace.js");
    ({ createWorkspace: 创建工作区, destroyWorkspace: 销毁工作区 } = 模块);
  }
  return 创建工作区(工作区);
};

const 销毁工作区包装 = (工作区) => 销毁工作区(工作区);

const 加载脚本配置包装 = async (路径) => {
  if (加载脚本配置 === null) {
    const 模块 = await import("./node_modules/oxlint/dist/js_config.js");
    加载脚本配置 = 模块.loadJsConfigs;
  }
  return 加载脚本配置(路径);
};

export default async (参数 = ["--fix", "."]) => {
  await 校验(
    参数,
    加载插件包装,
    设置规则配置包装,
    校验文件包装,
    创建工作区包装,
    销毁工作区包装,
    加载脚本配置包装,
  );
  return "";
};
