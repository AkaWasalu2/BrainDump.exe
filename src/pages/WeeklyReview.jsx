import { ACCENT_SOFT, BORDER, CARD_BG } from "../data/constants";

const WeeklyReview = ({ tasks, onUpdate }) => {
  const now = Date.now(), week = 7*86400000;
  const done = tasks.filter(t=>t.status==="done" && now-t.lastUpdated<week);
  const overdue = tasks.filter(t=>t.deadline && new Date(t.deadline)<new Date() && t.status!=="done");
  const inProgress = tasks.filter(t=>t.status==="in_progress");
  return (
    <div style={{ padding:"28px 32px" }}>
      <h2 style={{ color:"#f1f5f9", fontWeight:800, fontSize:20, marginBottom:24 }}>Weekly Review</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"20px" }}>
          <h3 style={{ color:"#22c55e", fontSize:14, fontWeight:700, marginBottom:14 }}>Completed This Week ({done.length})</h3>
          {done.length===0 && <p style={{ color:"#475569", fontSize:13 }}>Nothing completed yet let's go!</p>}
          {done.map(t=><div key={t.id} style={{ fontSize:13, color:"#94a3b8", padding:"6px 0", borderBottom:`1px solid ${BORDER}` }}>{t.title}</div>)}
        </div>
        <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"20px" }}>
          <h3 style={{ color:"#ef4444", fontSize:14, fontWeight:700, marginBottom:14 }}>Overdue ({overdue.length})</h3>
          {overdue.length===0 && <p style={{ color:"#475569", fontSize:13 }}>All caught up!</p>}
          {overdue.map(t=>(
            <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${BORDER}` }}>
              <span style={{ fontSize:13, color:"#94a3b8" }}>{t.title}</span>
              <input type="date" defaultValue={t.deadline}
                onChange={e=>onUpdate({...t, deadline:e.target.value, lastUpdated:Date.now()})}
                style={{ background:"rgba(11,6,19,0.8)", border:"none", borderRadius:4, color:"#f59e0b", fontSize:11, padding:"2px 6px" }}/>
            </div>
          ))}
        </div>
        <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"20px" }}>
          <h3 style={{ color:ACCENT_SOFT, fontSize:14, fontWeight:700, marginBottom:14 }}>ðŸ”„ In Progress ({inProgress.length})</h3>
          {inProgress.map(t=><div key={t.id} style={{ fontSize:13, color:"#94a3b8", padding:"6px 0", borderBottom:`1px solid ${BORDER}` }}>{t.title}</div>)}
        </div>
        <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"20px" }}>
          <h3 style={{ color:"#f59e0b", fontSize:14, fontWeight:700, marginBottom:14 }}>ðŸ“Š Summary</h3>
          {[["Total tasks", tasks.length],["Done this week", done.length],["Overdue", overdue.length],["In progress", inProgress.length],["Not started", tasks.filter(t=>t.status==="not_started").length]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${BORDER}`, fontSize:13 }}>
              <span style={{ color:"#64748b" }}>{l}</span><span style={{ color:"#f1f5f9", fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default WeeklyReview;
