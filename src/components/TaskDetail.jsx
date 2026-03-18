import { useEffect, useState } from "react";
import { ACCENT, ACCENT_SOFT, BORDER, CATEGORIES, CONTENT_STATES, NEWSLETTER_STATES, STATUSES, STATUS_LABELS, CARD_BG } from "../data/constants";
import { calcScore, scoreColor } from "../utils/priority";
import Icon from "./Icon";
import Slider from "./Slider";

const TaskDetail = ({ task, tasks, open, onClose, onUpdate, onDelete, onArchive, onFocus }) => {
  const [local, setLocal] = useState(task || {});
  const [newCheckItem, setNewCheckItem] = useState("");
  useEffect(() => { setLocal(task || {}); }, [task]);
  if (!open || !task) return null;
  const set = (k,v) => {
    const updated = { ...local, [k]:v, lastUpdated:Date.now() };
    setLocal(updated); onUpdate(updated);
  };
  const score = calcScore(local.importance, local.impact, local.urgency, local.effortHours);
  const addCheck = () => {
    if (!newCheckItem.trim()) return;
    set("checklist", [...(local.checklist||[]), { id:Date.now().toString(), text:newCheckItem, done:false }]);
    setNewCheckItem("");
  };
  const toggleCheck = (id) => set("checklist", (local.checklist||[]).map(c=>c.id===id?{...c,done:!c.done}:c));
  const removeCheck = (id) => set("checklist", (local.checklist||[]).filter(c=>c.id!==id));
  const relatedTasks = tasks.filter(t=>t.id!==task.id && t.status!=="archived");
  return (
    <div style={{ position:"fixed", right:0, top:0, bottom:0, width:"58%", background:CARD_BG, borderLeft:`1px solid ${BORDER}`, zIndex:200, display:"flex", flexDirection:"column", overflowY:"auto",
      animation:"slideIn 0.2s ease" }}>
      <style>{`@keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      <div style={{ padding:"20px 24px", borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:CARD_BG, zIndex:10 }}>
        <div style={{ display:"flex", gap:8 }}>
          <select value={local.status||"not_started"} onChange={e=>set("status",e.target.value)}
            style={{ background:"rgba(11,6,19,0.8)", border:`1px solid ${BORDER}`, borderRadius:6, color:"#f1f5f9", fontSize:12, padding:"4px 8px" }}>
            {STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button onClick={onFocus} style={{ background:`rgba(139,92,246,0.15)`, border:`1px solid rgba(139,92,246,0.4)`, borderRadius:6, color:ACCENT_SOFT, fontSize:12, padding:"4px 12px", cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
            <Icon name="play" size={12} color={ACCENT_SOFT}/> Focus
          </button>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={onArchive} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer" }}><Icon name="archive" size={16}/></button>
          <button onClick={onDelete} style={{ background:"none", border:"none", color:"#ef4444", cursor:"pointer" }}><Icon name="trash" size={16}/></button>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer" }}><Icon name="x" size={18}/></button>
        </div>
      </div>
      <div style={{ padding:"24px", flex:1 }}>
        <input value={local.title||""} onChange={e=>set("title",e.target.value)}
          style={{ width:"100%", background:"none", border:"none", borderBottom:`1px solid ${BORDER}`, color:"#f1f5f9", fontSize:20, fontWeight:700, padding:"0 0 12px", marginBottom:16, outline:"none", boxSizing:"border-box" }}/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <div>
            <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:4 }}>Deadline</label>
            <input type="date" value={local.deadline||""} onChange={e=>set("deadline",e.target.value)}
              style={{ background:"rgba(11,6,19,0.8)", border:`1px solid ${BORDER}`, borderRadius:6, color:"#f1f5f9", fontSize:13, padding:"6px 10px", width:"100%", boxSizing:"border-box" }}/>
          </div>
          <div>
            <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:4 }}>Effort (hrs)</label>
            <input type="number" min={0.25} step={0.25} value={local.effortHours||1} onChange={e=>set("effortHours",parseFloat(e.target.value)||1)}
              style={{ background:"rgba(11,6,19,0.8)", border:`1px solid ${BORDER}`, borderRadius:6, color:"#f1f5f9", fontSize:13, padding:"6px 10px", width:"100%", boxSizing:"border-box" }}/>
          </div>
        </div>
        <div style={{ background:"rgba(11,6,19,0.6)", borderRadius:10, padding:"14px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>PRIORITY SCORE</span>
            <span style={{ fontSize:22, fontWeight:800, color:scoreColor(score) }}>{score}</span>
          </div>
          <Slider label="Importance" value={local.importance||3} onChange={v=>set("importance",v)}/>
          <Slider label="Impact" value={local.impact||3} onChange={v=>set("impact",v)}/>
          <Slider label="Urgency" value={local.urgency||3} onChange={v=>set("urgency",v)}/>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6 }}>DESCRIPTION</label>
          <textarea value={local.description||""} onChange={e=>set("description",e.target.value)}
            style={{ width:"100%", background:"rgba(11,6,19,0.8)", border:`1px solid ${BORDER}`, borderRadius:8, color:"#e2e8f0", fontSize:13, padding:"10px 12px", minHeight:72, resize:"vertical", outline:"none", boxSizing:"border-box" }}/>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:8 }}>CHECKLIST ({(local.checklist||[]).filter(c=>c.done).length}/{(local.checklist||[]).length})</label>
          {(local.checklist||[]).map(c=>(
            <div key={c.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <button onClick={()=>toggleCheck(c.id)} style={{ width:18, height:18, borderRadius:4, border:`1.5px solid ${c.done?"#22c55e":BORDER}`, background:c.done?"#22c55e":"none", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {c.done && <Icon name="check" size={11} color="#fff"/>}
              </button>
              <span style={{ fontSize:13, color:c.done?"#475569":"#e2e8f0", textDecoration:c.done?"line-through":"none", flex:1 }}>{c.text}</span>
              <button onClick={()=>removeCheck(c.id)} style={{ background:"none", border:"none", color:"rgba(139,92,246,0.3)", cursor:"pointer" }}><Icon name="x" size={12}/></button>
            </div>
          ))}
          <div style={{ display:"flex", gap:6, marginTop:6 }}>
            <input value={newCheckItem} onChange={e=>setNewCheckItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCheck()}
              placeholder="Add checklist item..." style={{ flex:1, background:"rgba(11,6,19,0.8)", border:`1px solid ${BORDER}`, borderRadius:6, color:"#f1f5f9", fontSize:12, padding:"6px 10px", outline:"none" }}/>
            <button onClick={addCheck} style={{ background:`rgba(139,92,246,0.2)`, border:`1px solid rgba(139,92,246,0.4)`, borderRadius:6, color:ACCENT_SOFT, fontSize:12, padding:"4px 10px", cursor:"pointer" }}>Add</button>
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6 }}>NOTES</label>
          <textarea value={local.notes||""} onChange={e=>set("notes",e.target.value)} placeholder="Add notes..."
            style={{ width:"100%", background:"rgba(11,6,19,0.8)", border:`1px solid ${BORDER}`, borderRadius:8, color:"#e2e8f0", fontSize:13, padding:"10px 12px", minHeight:80, resize:"vertical", outline:"none", boxSizing:"border-box" }}/>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6 }}>TAGS</label>
          <input value={(local.tags||[]).join(", ")} onChange={e=>set("tags",e.target.value.split(",").map(t=>t.trim()).filter(Boolean))}
            style={{ width:"100%", background:"rgba(11,6,19,0.8)", border:`1px solid ${BORDER}`, borderRadius:6, color:"#f1f5f9", fontSize:13, padding:"6px 10px", outline:"none", boxSizing:"border-box" }}/>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
            {(local.tags||[]).map(t=><span key={t} style={{ fontSize:10, background:`rgba(139,92,246,0.15)`, color:ACCENT_SOFT, borderRadius:4, padding:"2px 7px" }}>{t}</span>)}
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6 }}>CATEGORY</label>
          <select value={local.category||"Study"} onChange={e=>set("category",e.target.value)}
            style={{ background:"rgba(11,6,19,0.8)", border:`1px solid ${BORDER}`, borderRadius:6, color:"#f1f5f9", fontSize:13, padding:"6px 10px", width:"100%", boxSizing:"border-box" }}>
            {CATEGORIES.filter(c=>c!=="Today").map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        {local.category==="Newsletters" && (
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6 }}>NEWSLETTER STATUS</label>
            <div style={{ display:"flex", gap:6 }}>
              {NEWSLETTER_STATES.map(s=><button key={s} onClick={()=>set("newsletterState",s)}
                style={{ flex:1, padding:"6px", borderRadius:6, border:`1px solid ${local.newsletterState===s?ACCENT:BORDER}`,
                  background:local.newsletterState===s?`rgba(139,92,246,0.18)`:"none", color:local.newsletterState===s?ACCENT_SOFT:"#64748b", fontSize:11, cursor:"pointer" }}>{s}</button>)}
            </div>
          </div>
        )}
        {local.category==="Content" && (
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6 }}>CONTENT STATUS</label>
            <div style={{ display:"flex", gap:6 }}>
              {CONTENT_STATES.map(s=><button key={s} onClick={()=>{ if(s==="discard") set("status","archived"); set("contentState",s); }}
                style={{ flex:1, padding:"6px", borderRadius:6, border:`1px solid ${local.contentState===s?ACCENT:BORDER}`,
                  background:local.contentState===s?`rgba(139,92,246,0.18)`:"none", color:local.contentState===s?ACCENT_SOFT:"#64748b", fontSize:11, cursor:"pointer" }}>{s}</button>)}
            </div>
          </div>
        )}
        <div>
          <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6 }}>RELATED TASKS</label>
          <div style={{ maxHeight:120, overflowY:"auto" }}>
            {relatedTasks.map(t=>{
              const isRelated = (local.relatedIds||[]).includes(t.id);
              return (
                <label key={t.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", cursor:"pointer" }}>
                  <input type="checkbox" checked={isRelated} onChange={()=>{
                    const ids = isRelated ? (local.relatedIds||[]).filter(id=>id!==t.id) : [...(local.relatedIds||[]),t.id];
                    set("relatedIds",ids);
                  }} style={{ accentColor:ACCENT }}/>
                  <span style={{ fontSize:12, color:"#94a3b8" }}>{t.title}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


export default TaskDetail;
