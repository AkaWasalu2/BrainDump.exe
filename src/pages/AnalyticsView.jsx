import { useMemo, useRef, useState } from "react";
import { ACCENT, ACCENT_MUTED, ACCENT_SOFT, BORDER, CARD_BG, CAT_COLORS } from "../data/constants";
import { projectDays } from "../utils/projectDays";
import { calcScore, scoreColor } from "../utils/priority";

const AnalyticsView = ({ tasks }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [transform, setTransform] = useState({ x:0, y:0, k:1 });
  const dragging = useRef(null);
  const lastPos = useRef({ x:0, y:0 });

  const nodes = useMemo(() => {
    return tasks.slice(0,30).map((t,i) => {
      const score = parseFloat(calcScore(t.importance,t.impact,t.urgency,t.effortHours));
      const r = Math.max(7, Math.min(18, 6 + score * 0.4));
      return {
        id:t.id, title:t.title, category:t.category, score,
        status:t.status,
        x: 100 + (i % 6) * 120 + (Math.random()-0.5)*50,
        y: 80  + Math.floor(i/6) * 100 + (Math.random()-0.5)*30,
        r
      };
    });
  }, [tasks]);

  const nodeMap = useMemo(()=>Object.fromEntries(nodes.map(n=>[n.id,n])), [nodes]);
  const edges = useMemo(()=>{
    const e = [];
    tasks.forEach(t=>{ (t.relatedIds||[]).forEach(rid=>{ if(nodeMap[t.id]&&nodeMap[rid]) e.push({a:nodeMap[t.id],b:nodeMap[rid]}); }); });
    return e;
  }, [tasks, nodeMap]);

  const weekly = useMemo(()=>{
    const now = Date.now(), week = 7*86400000;
    const done = tasks.filter(t=>t.status==="done" && now-t.lastUpdated<week);
    const overdue = tasks.filter(t=>t.deadline && new Date(t.deadline)<new Date() && t.status!=="done");
    const totalHours = done.reduce((s,t)=>s+t.effortHours,0);
    return { done:done.length, overdue:overdue.length, hours:totalHours.toFixed(1) };
  }, [tasks]);

  const catGroups = useMemo(()=>{
    return ["Study","Projects","Job Hunt","Concepts","Content","Newsletters","Ideas"].map(cat=>{
      const items = tasks.filter(t=>t.category===cat && t.status!=="archived");
      const hours = items.filter(t=>t.status!=="done").reduce((s,t)=>s+t.effortHours,0);
      return { cat, items:items.length, hours, days:projectDays(hours) };
    });
  }, [tasks]);

  const handleWheel = (e) => {
    e.preventDefault();
    const scale = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform(t=>({ ...t, k: Math.max(0.3, Math.min(3, t.k * scale)) }));
  };
  const handleMouseDown = (e) => { dragging.current=true; lastPos.current={x:e.clientX,y:e.clientY}; };
  const handleMouseMove = (e) => {
    if(!dragging.current) return;
    const dx=e.clientX-lastPos.current.x, dy=e.clientY-lastPos.current.y;
    lastPos.current={x:e.clientX,y:e.clientY};
    setTransform(t=>({...t, x:t.x+dx, y:t.y+dy}));
  };
  const handleMouseUp = () => { dragging.current=false; };

  return (
    <div style={{ padding:"28px 32px" }}>
      <h2 style={{ color:"#f1f5f9", fontWeight:800, fontSize:20, marginBottom:24 }}>Analytics &amp; Graph</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28 }}>
        {[["Done This Week", weekly.done,"#22c55e"],["Overdue", weekly.overdue,"#F43F5E"],["Hours Logged", `${weekly.hours}h`,ACCENT_SOFT]].map(([l,v,c])=>(
          <div key={l} style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontSize:13, color:"#64748b", marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Time Projection only Category Breakdown removed for cleaner layout */}
      <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"20px", marginBottom:28 }}>
        <h3 style={{ color:"#94a3b8", fontSize:13, fontWeight:600, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Time Projection</h3>
        <p style={{ fontSize:11, color:ACCENT_MUTED, marginBottom:14, opacity:0.7 }}>Based on 3h weekdays / 5h weekends availability. Total backlog pool per category.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"6px 24px" }}>
          {catGroups.map(g=>(
            <div key={g.cat} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:13, padding:"4px 0", borderBottom:`1px solid ${BORDER}` }}>
              <span style={{ color:"#94a3b8", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:CAT_COLORS[g.cat]||ACCENT, display:"inline-block" }}/>
                {g.cat}
              </span>
              <div style={{ textAlign:"right" }}>
                <span style={{ color:"#f1f5f9", fontWeight:600 }}>{g.hours.toFixed(1)}h</span>
                <span style={{ color:"#475569", marginLeft:8 }}>~{g.days}d</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* D3-style SVG graph */}
      <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:20, position:"relative" }}>
        <h3 style={{ color:"#94a3b8", fontSize:13, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Task Relationship Graph</h3>
        <p style={{ fontSize:11, color:"#475569", marginBottom:12 }}>Scroll to zoom· Drag to pan· Hover for details</p>
        <div style={{ position:"relative", overflow:"hidden", borderRadius:8, background:"#08041A", cursor:"grab", userSelect:"none" }}
          onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <svg ref={svgRef} width="100%" height="420" style={{ display:"block" }}>
            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
              {edges.map((e,i)=>(
                <line key={i} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y}
                  stroke={ACCENT_SOFT} strokeWidth={1} opacity={0.25}/>
              ))}
              {nodes.map(n=>{
                const priColor = scoreColor(n.score);
                const fillColor = CAT_COLORS[n.category]||ACCENT;
                return (
                  <g key={n.id}
                    onMouseEnter={e=>setTooltip({ n, mx:e.clientX, my:e.clientY })}
                    onMouseLeave={()=>setTooltip(null)}
                    style={{ cursor:"pointer" }}>
                    <circle cx={n.x} cy={n.y} r={n.r+3} fill="none" stroke={priColor} strokeWidth={1.5} opacity={0.7}/>
                    <circle cx={n.x} cy={n.y} r={n.r} fill={fillColor} opacity={0.9}/>
                    <text x={n.x+n.r+5} y={n.y+4} fill="#C4B5FD" fontSize="10" fontFamily="sans-serif">{n.title.slice(0,20)}</text>
                  </g>
                );
              })}
            </g>
          </svg>
          {tooltip && (
            <div style={{ position:"fixed", left:tooltip.mx+12, top:tooltip.my-10, background:"#1A0D2E", border:`1px solid ${BORDER}`, borderRadius:8, padding:"8px 12px", zIndex:9999, pointerEvents:"none", minWidth:160 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#f1f5f9", marginBottom:4 }}>{tooltip.n.title}</div>
              <div style={{ fontSize:11, color:scoreColor(tooltip.n.score) }}>Score: {tooltip.n.score.toFixed(2)}</div>
              <div style={{ fontSize:11, color:ACCENT_MUTED }}>{tooltip.n.category}</div>
              <div style={{ fontSize:11, color:"#64748b", textTransform:"capitalize" }}>{tooltip.n.status.replace("_"," ")}</div>
            </div>
          )}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:12 }}>
          {Object.entries(CAT_COLORS).filter(([k])=>k!=="Today"&&k!=="Inbox").map(([cat,color])=>(
            <span key={cat} style={{ fontSize:10, color:"#94a3b8", display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:color,display:"inline-block"}}/>
              {cat}
            </span>
          ))}
        </div>
        <p style={{ fontSize:11, color:"rgba(139,92,246,0.3)", marginTop:8 }}>Node size priority score· Border = priority level· Fill = category</p>
      </div>
    </div>
  );
};


export default AnalyticsView;
