import { calcScore } from "./priority";

export const getCatStats = (tasks, cat) => {
  const items = tasks.filter(t => t.category === cat);
  const now = new Date(); now.setHours(0,0,0,0);
  const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);
  const dueWeek = items.filter(t => t.deadline && new Date(t.deadline) <= weekEnd && t.status !== "done").length;
  const overdue = items.filter(t => t.deadline && new Date(t.deadline) < now && t.status !== "done").length;
  const done = items.filter(t => t.status === "done").length;
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;
  const maxScore = items.reduce((m, t) => {
    const s = parseFloat(calcScore(t.importance, t.impact, t.urgency, t.effortHours));
    return s > m ? s : m;
  }, 0);
  return { total: items.length, dueWeek, overdue, pct, topScore: maxScore };
};

export const getTodayTasks = (tasks) => {
  const active = tasks.filter(t => t.status !== "done" && t.status !== "archived" && t.category !== "Inbox");
  const scored = active.map(t => ({ ...t, _score: parseFloat(calcScore(t.importance, t.impact, t.urgency, t.effortHours)) }));
  scored.sort((a,b) => b._score - a._score);
  const high = scored.filter(t => t._score > 30).slice(0,3);
  const med = scored.filter(t => t._score >= 15 && t._score <= 30).slice(0,2);
  const low = scored.filter(t => t._score < 15).slice(0,1);
  return [...high, ...med, ...low];
};
