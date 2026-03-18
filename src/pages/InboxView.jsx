import { BORDER, CARD_BG, CATEGORIES, HOVER_BG } from "../data/constants";
import { calcScore, scoreColor } from "../utils/priority";
import Icon from "../components/Icon";

const InboxView = ({ tasks, onUpdate, onDelete, onOpen }) => {
  const inbox = tasks.filter(t=>t.category==="Inbox");
  return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <h2 style={{ color:"#f1f5f9", fontWeight:800, fontSize:20, margin:0 }}>Inbox <span style={{ fontSize:14, color:"#475569", fontWeight:400 }}>({inbox.length} items)</span></h2>
      </div>
      {inbox.length===0 && <div style={{ textAlign:"center", padding:"60px 0", color:"#475569" }}><Icon name="inbox" size={40} color={BORDER}/><p style={{ marginTop:12, fontSize:14 }}>Inbox is empty great job!</p></div>}
      {inbox.map(t=>{
        const score = calcScore(t.importance,t.impact,t.urgency,t.effortHours);
        return (
          <div key={t.id} style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:"14px 16px", marginBottom:10, display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ flex:1, cursor:"pointer" }} onClick={()=>onOpen(t)}>
              <div style={{ fontSize:14, fontWeight:600, color:"#f1f5f9", marginBottom:4 }}>{t.title}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <span style={{ fontSize:10, color:"#64748b", background:HOVER_BG, borderRadius:4, padding:"2px 6px" }}>{t.source}</span>
                <span style={{ fontSize:10, color:scoreColor(score), background:`${scoreColor(score)}18`, borderRadius:4, padding:"2px 6px" }}>score: {score}</span>
              </div>
            </div>
            <select value={t.category} onChange={e=>onUpdate({...t, category:e.target.value, lastUpdated:Date.now()})}
              style={{ background:"rgba(11,6,19,0.8)", border:`1px solid ${BORDER}`, borderRadius:6, color:"#94a3b8", fontSize:12, padding:"4px 8px" }}>
              {CATEGORIES.filter(c=>c!=="Today"&&c!=="Inbox").map(c=><option key={c}>{c}</option>)}
            </select>
            <button onClick={()=>onUpdate({...t, status:"archived", lastUpdated:Date.now()})} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer" }}><Icon name="archive" size={14}/></button>
            <button onClick={()=>onDelete(t.id)} style={{ background:"none", border:"none", color:"#ef4444", cursor:"pointer" }}><Icon name="trash" size={14}/></button>
          </div>
        );
      })}
    </div>
  );
};


export default InboxView;
