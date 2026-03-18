import { useState } from "react";
import { BORDER, CARD_BG } from "../data/constants";
import { getCatStats } from "../utils/taskStats";
import Icon, { catIcon } from "./Icon";

const DashCard = ({ cat, tasks, onClick }) => {
  const stats = getCatStats(tasks, cat);
  const topColor = stats.topScore > 30 ? "#F43F5E" : stats.topScore >= 15 ? "#F59E0B" : "#22D3EE";
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:CARD_BG, border:`1px solid ${hov?"rgba(139,92,246,0.4)":BORDER}`, borderRadius:16, padding:0, cursor:"pointer",
        transform: hov?"scale(1.02)":"scale(1)", transition:"all 0.2s", overflow:"hidden", position:"relative" }}>
      <div style={{ height:4, background:topColor, borderRadius:"16px 16px 0 0" }}/>
      <div style={{ padding:"20px 20px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`${topColor}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name={catIcon(cat)} size={16} color={topColor}/>
            </div>
            <span style={{ fontWeight:700, fontSize:15, color:"#f1f5f9" }}>{cat}</span>
          </div>
          <span style={{ fontSize:24, fontWeight:800, color:"#f1f5f9" }}>{stats.total}</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[["Due Week", stats.dueWeek, "#f59e0b"], ["Overdue", stats.overdue, "#F43F5E"], ["Done", `${stats.pct}%`, "#22c55e"]].map(([l,v,c])=>(
            <div key={l} style={{ textAlign:"center", background:"rgba(11,6,19,0.6)", borderRadius:8, padding:"6px 4px" }}>
              <div style={{ fontSize:16, fontWeight:700, color:c }}>{v}</div>
              <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(11,6,19,0.7)", borderRadius:8, height:6, overflow:"hidden" }}>
          <div style={{ width:`${stats.pct}%`, height:"100%", background:`linear-gradient(90deg, ${topColor}, ${topColor}88)`, borderRadius:8, transition:"width 0.5s" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
          <span style={{ fontSize:11, color:"#475569" }}>{stats.pct}% complete</span>
        </div>
      </div>
    </div>
  );
};

export default DashCard;
