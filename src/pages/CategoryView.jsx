import { useState } from "react";
import { ACCENT_MUTED, BORDER, HOVER_BG, STATUSES, STATUS_LABELS } from "../data/constants";
import { projectDays } from "../utils/projectDays";
import Icon from "../components/Icon";
import KanbanCard from "../components/KanbanCard";

const CategoryView = ({ cat, tasks, onBack, onUpdate, onOpen }) => {
  const [dragging, setDragging] = useState(null);
  const catTasks = tasks.filter(t=>t.category===cat);
  const pending = catTasks.filter(t=>t.status!=="done"&&t.status!=="archived");
  const totalHours = pending.reduce((s,t)=>s+t.effortHours,0);
  const days = projectDays(totalHours);
  const cols = STATUSES.map(s=>({ status:s, label:STATUS_LABELS[s], tasks:catTasks.filter(t=>t.status===s) }));
  const handleDrop = (targetStatus, e) => {
    e.preventDefault();
    if (dragging) onUpdate({...dragging, status:targetStatus, lastUpdated:Date.now()});
    setDragging(null);
  };
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"20px 28px", borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:16 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
          <Icon name="arrow_left" size={16}/> <span style={{ fontSize:13 }}>Dashboard</span>
        </button>
        <div style={{ flex:1 }}>
          <h2 style={{ color:"#f1f5f9", fontWeight:800, fontSize:18, margin:0 }}>{cat}</h2>
          <div style={{ display:"flex", gap:16, marginTop:4 }}>
            <span style={{ fontSize:12, color:"#475569" }}>{catTasks.length} tasks</span>
            <span style={{ fontSize:12, color:"#475569" }}>{totalHours.toFixed(1)}h pending</span>
            <span style={{ fontSize:12, color:"#f59e0b" }}>{days > 0 ? `~${days} days to clear backlog` : "Backlog clear!"}</span>
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowX:"auto", padding:"20px 28px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, minWidth:800 }}>
          {cols.map(col=>(
            <div key={col.status}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>handleDrop(col.status,e)}
              style={{ background:"#08041A", borderRadius:12, padding:"14px", minHeight:400, border:`1px solid ${BORDER}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:0.8 }}>{col.label}</span>
                <span style={{ fontSize:11, background:HOVER_BG, color:ACCENT_MUTED, borderRadius:10, padding:"1px 7px" }}>{col.tasks.length}</span>
              </div>
              {col.tasks.map(t=>(
                <KanbanCard key={t.id} task={t}
                  onClick={()=>onOpen(t)}
                  onDragStart={()=>setDragging(t)}/>
              ))}
              {col.tasks.length===0 && <div style={{ textAlign:"center", padding:"24px 0", color:BORDER, fontSize:12 }}>Drop here</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default CategoryView;
