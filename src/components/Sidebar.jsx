import { ACCENT, ACCENT_DEEP, ACCENT_SOFT, BORDER, HOVER_BG, SIDEBAR_BG, SIDEBAR_ITEMS } from "../data/constants";
import Icon from "./Icon";

const Sidebar = ({ active, onNav, onCapture, tasks }) => {
  const inboxCount = tasks.filter(t=>t.category==="Inbox").length;
  return (
    <div style={{ width:240, background:SIDEBAR_BG, borderRight:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", height:"100vh", position:"fixed", left:0, top:0, zIndex:100, overflowY:"auto" }}>
      <div style={{ padding:"24px 20px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:6, background:`linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:14, fontWeight:900, color:"#fff" }}>BD</span>
          </div>
          <span style={{ fontWeight:800, fontSize:16, color:"#f1f5f9", letterSpacing:"-0.5px" }}>BrainDump.exe</span>
        </div>
      </div>
      <nav style={{ flex:1, padding:"8px 12px" }}>
        {SIDEBAR_ITEMS.map(item => {
          const isActive = active === item.id;
          const badge = item.id === "Inbox" ? inboxCount : null;
          return (
            <button key={item.id}
              onClick={() => item.action ? onCapture() : onNav(item.id)}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                borderRadius:8, border:"none",
                borderLeft: isActive ? `3px solid ${ACCENT}` : "3px solid transparent",
                background: item.action ? `rgba(139,92,246,0.15)` : isActive ? HOVER_BG : "transparent",
                color: item.action ? ACCENT_SOFT : isActive ? ACCENT_SOFT : "#64748b",
                cursor:"pointer", fontSize:13, fontWeight: isActive ? 600 : 400, marginBottom:2,
                transition:"all 0.18s ease", textAlign:"left"
              }}>
              <Icon name={item.icon} size={15} color={item.action ? ACCENT_SOFT : isActive ? ACCENT_SOFT : "#64748b"}/>
              <span style={{ flex:1 }}>{item.label}</span>
              {badge > 0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:10, fontSize:10, fontWeight:700, padding:"1px 6px" }}>{badge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"12px 20px", borderTop:`1px solid ${BORDER}` }}>
        <p style={{ fontSize:11, color:"rgba(139,92,246,0.3)", margin:0 }}>All data stored locally</p>
      </div>
    </div>
  );
};

export default Sidebar;
