export default (name, tip) => {
  let prompt = "我是风险投资人，想了解下『" + name + "』这家创业公司。";

  tip = tip.trim();
  if (tip) {
    prompt += "公司背景:" + tip;
  }
  prompt += "\n请搜索，找到相符合的公司，生成公司简介。";
  return prompt;
};
