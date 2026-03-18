import DashCard from "../components/DashCard";
import { ACCENT_SOFT, BORDER, CARD_BG, DASH_CATS } from "../data/constants";
import { calcScore, scoreColor } from "../utils/priority";
import { getTodayTasks } from "../utils/taskStats";

const DashboardView = ({ tasks, navTo, setSelectedTask }) => {
  return (
      <div style={{ padding:"28px 32px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <div>
            <h1 style={{ color:"#f1f5f9", fontWeight:900, fontSize:22, margin:0, letterSpacing:"-0.5px" }}>Life Dashboard</h1>
            <p style={{ color:"#475569", fontSize:13, margin:"4px 0 0" }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:"10px 16px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:800, color:"#22c55e" }}>{tasks.filter(t=>t.status==="done").length}</div>
              <div style={{ fontSize:11, color:"#475569" }}>Done</div>
            </div>
            <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:"10px 16px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:800, color:"#F59E0B" }}>{tasks.filter(t=>t.deadline&&new Date(t.deadline)<new Date()&&t.status!=="done").length}</div>
              <div style={{ fontSize:11, color:"#475569" }}>Overdue</div>
            </div>
            <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:"10px 16px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:800, color:ACCENT_SOFT }}>{tasks.length}</div>
              <div style={{ fontSize:11, color:"#475569" }}>Total</div>
            </div>
          </div>
        </div>
        <div style={{ height:1, background:BORDER, marginBottom:24 }}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
          {DASH_CATS.map(cat=>(
            <DashCard key={cat} cat={cat} tasks={tasks}
              onClick={()=>navTo(cat)}/>
          ))}
        </div>
        <div style={{ marginTop:28 }}>
          <h3 style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:1, marginBottom:14, fontWeight:600 }}>ðŸ”¥ Top Priority Today</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
            {getTodayTasks(tasks).slice(0,3).map(t=>{
              const score = calcScore(t.importance,t.impact,t.urgency,t.effortHours);
              return (
                <div key={t.id} onClick={()=>setSelectedTask(t)} style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:"14px 16px", cursor:"pointer", display:"flex", gap:12, alignItems:"center",
                  transition:"border-color 0.18s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(139,92,246,0.4)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:scoreColor(score), flexShrink:0, boxShadow:`0 0 6px ${scoreColor(score)}88` }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{t.title}</div>
                    <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{t.category}{t.effortHours}score {score}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
};

export default DashboardView;
