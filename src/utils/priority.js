export const calcScore = (imp, impact, urg, effort) =>
  effort > 0 ? ((imp * impact * urg) / effort).toFixed(2) : 0;

export const scoreColor = (score) => {
  const s = parseFloat(score);
  if (s > 30) return "#F43F5E";
  if (s >= 15) return "#F59E0B";
  return "#22D3EE";
};