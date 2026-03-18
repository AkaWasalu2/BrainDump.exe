import { useEffect, useState } from "react";
import { ACCENT, ACCENT_DEEP, ACCENT_MUTED, BG, BORDER, CARD_BG } from "../data/constants";
import Icon from "./Icon";

const FocusMode = ({ task, onExit, onUpdate }) => {
  const totalSeconds = Math.round((task.effortHours || 1) * 3600);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [local, setLocal] = useState(task);
  useEffect(() => { let t; if (running && timeLeft > 0) { t = setInterval(()=>setTimeLeft(s=>s-1), 1000); } return ()=>clearInterval(t); }, [running, timeLeft]);
  const fmt = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const pct = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const toggleCheck = (id) => { const updated = {...local, checklist:(local.checklist||[]).map(c=>c.id===id?{...c,done:!c.done}:c), lastUpdated:Date.now()}; setLocal(updated); onUpdate(updated); };
  const markDone = () => { const updated = {...local, status:"done", lastUpdated:Date.now()}; onUpdate(updated); onExit(); };
  return (
    <div style={{ position:"fixed", inset:0, background:BG, zIndex:500, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <button onClick={onExit} style={{ position:"absolute", top:24, right:24, background:`rgba(139,92,246,0.1)`, border:`1px solid ${BORDER}`, borderRadius:8, color:"#94a3b8", padding:"8px 16px", cursor:"pointer", fontSize:13 }}>Exit Focus</button>
      <div style={{ textAlign:"center", maxWidth:580, width:"100%", padding:"0 24px" }}>
        <p style={{ color:ACCENT_MUTED, fontSize:13, marginBottom:8, textTransform:"uppercase", letterSpacing:2 }}>Focus Mode</p>
        <h1 style={{ color:"#f1f5f9", fontSize:26, fontWeight:800, marginBottom:32, lineHeight:1.3 }}>{local.title}</h1>
        <div style={{ position:"relative", width:200, height:200, margin:"0 auto 32px" }}>
          <svg width="200" height="200" style={{ transform:"rotate(-90deg)" }}>
            <circle cx="100" cy="100" r="88" fill="none" stroke={`rgba(139,92,246,0.2)`} strokeWidth="8"/>
            <circle cx="100" cy="100" r="88" fill="none" stroke={ACCENT} strokeWidth="8"
              strokeDasharray={`${2*Math.PI*88}`} strokeDashoffset={`${2*Math.PI*88*(1-pct/100)}`}
              style={{ transition:"stroke-dashoffset 1s linear" }}/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:28, fontWeight:800, color:"#f1f5f9", fontVariantNumeric:"tabular-nums" }}>{fmt(timeLeft)}</span>
            <span style={{ fontSize:11, color:ACCENT_MUTED }}>{running?"running":"paused"}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:32 }}>
          <button onClick={()=>setRunning(r=>!r)} style={{ background:`linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})`, border:"none", borderRadius:8, color:"#fff", padding:"10px 28px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            {running?"Pause":"Start"}
          </button>
          <button onClick={()=>setTimeLeft(totalSeconds)} style={{ background:`rgba(139,92,246,0.1)`, border:`1px solid ${BORDER}`, borderRadius:8, color:"#94a3b8", padding:"10px 18px", cursor:"pointer" }}>Reset</button>
        </div>
        {(local.checklist||[]).length > 0 && (
          <div style={{ background:CARD_BG, borderRadius:12, padding:"16px 20px", textAlign:"left", marginBottom:20 }}>
            {(local.checklist||[]).map(c=>(
              <label key={c.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", cursor:"pointer" }}>
                <div onClick={()=>toggleCheck(c.id)} style={{ width:20, height:20, borderRadius:4, border:`1.5px solid ${c.done?"#22c55e":BORDER}`, background:c.done?"#22c55e":"none", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {c.done && <Icon name="check" size={12} color="#fff"/>}
                </div>
                <span style={{ fontSize:14, color:c.done?"#475569":"#e2e8f0", textDecoration:c.done?"line-through":"none" }}>{c.text}</span>
              </label>
            ))}
          </div>
        )}
        <button onClick={markDone} style={{ background:"#22c55e", border:"none", borderRadius:8, color:"#fff", padding:"12px 32px", fontWeight:700, fontSize:15, cursor:"pointer" }}>
          Mark Complete
        </button>
      </div>
    </div>
  );
};


export default FocusMode;
