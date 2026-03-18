import { ACCENT_MUTED, BORDER, HOVER_BG } from "../data/constants";
import { calcScore, scoreColor } from "../utils/priority";

const KanbanCard = ({ task, onClick, onDragStart }) => {
  const score = calcScore(task.importance, task.impact, task.urgency, task.effortHours);
  const col = scoreColor(score);
  const isDecayed = (Date.now() - task.lastUpdated) > 30 * 86400000;
  const now = new Date(); now.setHours(0,0,0,0);
  const isOverdue = task.deadline && new Date(task.deadline) < now && task.status !== "done";
  return (
    <div draggable onDragStart={onDragStart} onClick={onClick}
      style={{ background:"#0e0719", border:`1px solid ${BORDER}`, borderRadius:10, padding:"12px 14px", marginBottom:8, cursor:"pointer",
        opacity: isDecayed ? 0.4 : 1, transition:"all 0.2s", position:"relative", order: isDecayed ? 999 : 0 }}>
      {isDecayed && <span style={{ position:"absolute", top:8, right:8, fontSize:9, background:"rgba(109,40,217,0.3)", color:ACCENT_MUTED, borderRadius:10, padding:"2px 7px", fontWeight:700, border:`1px solid rgba(139,92,246,0.3)` }}>COLD</span>}
      <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:8 }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:col, marginTop:4, flexShrink:0, border:`1.5px solid ${col}`, boxShadow:`0 0 4px ${col}55` }}/>
        <span style={{ fontSize:13, fontWeight:600, color:"#e2e8f0", lineHeight:1.4 }}>{task.title}</span>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {task.deadline && <span style={{ fontSize:10, color: isOverdue?"#F43F5E":"#64748b", background: isOverdue?"rgba(244,63,94,0.1)":HOVER_BG, borderRadius:4, padding:"2px 6px" }}>
          {isOverdue?"":""}{task.deadline}
        </span>}
        {task.effortHours > 0 && <span style={{ fontSize:10, color:"#64748b", background:HOVER_BG, borderRadius:4, padding:"2px 6px" }}>{task.effortHours}h</span>}
        {task.source !== "Manual" && <span style={{ fontSize:10, color:ACCENT_MUTED, background:`rgba(139,92,246,0.12)`, borderRadius:4, padding:"2px 6px" }}>{task.source}</span>}
      </div>
    </div>
  );
};


export default KanbanCard;
