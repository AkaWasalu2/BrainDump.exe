import { useState } from "react";
import { ACCENT_SOFT, BORDER, CARD_BG } from "../data/constants";
import { calcScore, scoreColor } from "../utils/priority";
import { getTodayTasks } from "../utils/taskStats";

const TodayView = ({ tasks, onOpen }) => {
  const suggested = getTodayTasks(tasks);
  const [manual, setManual] = useState([]);
  const display = [...new Map([...suggested, ...manual.map(id=>tasks.find(t=>t.id===id)).filter(Boolean)].map(t=>[t.id,t])).values()];
  return (
    <div style={{ padding:"28px 32px" }}>
      <h2 style={{ color:"#f1f5f9", fontWeight:800, fontSize:20, marginBottom:6 }}>Today</h2>
      <p style={{ color:"#475569", fontSize:13, marginBottom:24 }}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        <div>
          <h3 style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:1, marginBottom:14, fontWeight:600 }}>Auto Ranked Top Priority</h3>
          {display.map((t,i)=>{
            const score = calcScore(t.importance,t.impact,t.urgency,t.effortHours);
            const col = scoreColor(score);
            const s = parseFloat(score);
            const emoji = s > 30 ? "" : s >= 15 ? "" : "";
            return (
              <div key={t.id} onClick={()=>onOpen(t)} style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:"14px 16px", marginBottom:10, cursor:"pointer", display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${col}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>
                  {emoji}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:"#f1f5f9", marginBottom:4 }}>{t.title}</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, color:col, fontWeight:600 }}>Score: {score}</span>
                    <span style={{ fontSize:11, color:"#475569" }}>{t.effortHours}h{t.category}</span>
                    {t.deadline && <span style={{ fontSize:11, color:"#f59e0b" }}>due {t.deadline}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"20px", height:"fit-content" }}>
          <h3 style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:1, marginBottom:12, fontWeight:600 }}>Day Stats</h3>
          <div style={{ fontSize:28, fontWeight:800, color:ACCENT_SOFT, marginBottom:4 }}>{display.filter(t=>t.status==="done").length}/{display.length}</div>
          <div style={{ fontSize:12, color:"#475569", marginBottom:16 }}>tasks done today</div>
          <div style={{ background:"rgba(11,6,19,0.7)", borderRadius:8, height:8, marginBottom:16 }}>
            <div style={{ width:`${display.length>0?Math.round(display.filter(t=>t.status==="done").length/display.length*100):0}%`, height:"100%", background:"#22c55e", borderRadius:8 }}/>
          </div>
          <div style={{ fontSize:12, color:"#475569" }}>Est. total: <strong style={{ color:"#94a3b8" }}>{display.reduce((s,t)=>s+t.effortHours,0).toFixed(1)}h</strong></div>
        </div>
      </div>
    </div>
  );
};


export default TodayView;

