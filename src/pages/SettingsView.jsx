import { ACCENT_SOFT, BORDER, CARD_BG } from "../data/constants";

const SettingsView = ({ tasks, onReset }) => {
  const totalSize = JSON.stringify(tasks).length;
  return (
    <div style={{ padding:"28px 32px" }}>
      <h2 style={{ color:"#f1f5f9", fontWeight:800, fontSize:20, marginBottom:24 }}>Settings</h2>
      <div style={{ maxWidth:480 }}>
        <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"20px", marginBottom:16 }}>
          <h3 style={{ color:"#94a3b8", fontSize:14, fontWeight:600, marginBottom:12 }}>Data Storage</h3>
          <p style={{ fontSize:13, color:"#475569", marginBottom:8 }}>All data is stored in your browser's localStorage.</p>
          <p style={{ fontSize:13, color:"#475569", marginBottom:16 }}>Storage used: <strong style={{ color:ACCENT_SOFT }}>{(totalSize/1024).toFixed(1)} KB</strong></p>
          <button onClick={onReset} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, color:"#ef4444", padding:"8px 16px", cursor:"pointer", fontSize:13 }}>
            Reset to Demo Data
          </button>
        </div>
        <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"20px" }}>
          <h3 style={{ color:"#94a3b8", fontSize:14, fontWeight:600, marginBottom:12 }}>Priority Algorithm</h3>
          <p style={{ fontSize:13, color:"#475569" }}>Score = (Importance Ã— Impact Ã— Urgency) / Effort Hours</p>
          <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
            {[["> 30", "High Priority", "#F43F5E"],["1530", "Medium Priority","#F59E0B"],["< 15","Low Priority","#22D3EE"]].map(([r,l,c])=>(
              <div key={r} style={{ background:"rgba(11,6,19,0.7)", borderRadius:6, padding:"6px 12px", display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
                <span style={{ fontSize:11, color:"#94a3b8" }}>{r}{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default SettingsView;
