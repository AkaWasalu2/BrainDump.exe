import { useState } from "react";
import { ACCENT, ACCENT_DEEP, BORDER, SOURCES } from "../data/constants";
import { calcScore, scoreColor } from "../utils/priority";
import Modal from "./Modal";
import Slider from "./Slider";

const QuickCapture = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    title:"", category:"Study", source:"Manual", importance:3, impact:3, urgency:3,
    effortHours:1, deadline:"", tags:"", description:""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const score = calcScore(form.importance, form.impact, form.urgency, form.effortHours);
  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      category: "Inbox",
      source: form.source,
      priority: parseFloat(score) >= 20 ? "high" : parseFloat(score) >= 8 ? "medium" : "low",
      importance: form.importance, impact: form.impact, urgency: form.urgency,
      effortHours: form.effortHours,
      deadline: form.deadline,
      status: "not_started",
      tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean),
      relatedIds: [],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      notes: "", checklist: [], newsletterState: "", contentState: ""
    });
    setForm({ title:"", category:"Study", source:"Manual", importance:3, impact:3, urgency:3, effortHours:1, deadline:"", tags:"", description:"" });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Quick Capture">
    <input placeholder="Title *" value={form.title} onChange={e=>set("title",e.target.value)}
        style={{ width:"100%", background:"#0f0a1a", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 14px", color:"#f1f5f9", fontSize:14, marginBottom:12, boxSizing:"border-box", outline:"none", transition:"box-shadow 0.2s" }}
        onFocus={e=>e.target.style.boxShadow=`0 0 0 2px rgba(139,92,246,0.4)`}
        onBlur={e=>e.target.style.boxShadow="none"}/>
      <textarea placeholder="Description" value={form.description} onChange={e=>set("description",e.target.value)}
        style={{ width:"100%", background:"#0f0a1a", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 14px", color:"#f1f5f9", fontSize:14, marginBottom:12, boxSizing:"border-box", minHeight:60, resize:"vertical", outline:"none", transition:"box-shadow 0.2s" }}
        onFocus={e=>e.target.style.boxShadow=`0 0 0 2px rgba(139,92,246,0.4)`}
        onBlur={e=>e.target.style.boxShadow="none"}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div>
          <label style={{ fontSize:12, color:"#94a3b8", display:"block", marginBottom:4 }}>Source</label>
          <select value={form.source} onChange={e=>set("source",e.target.value)}
            style={{ width:"100%", background:"#0f0a1a", border:`1px solid ${BORDER}`, borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:14 }}>
            {SOURCES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:12, color:"#94a3b8", display:"block", marginBottom:4 }}>Effort (hrs)</label>
          <input type="number" min={0.25} step={0.25} value={form.effortHours} onChange={e=>set("effortHours",parseFloat(e.target.value)||1)}
            style={{ width:"100%", background:"#0f0a1a", border:`1px solid ${BORDER}`, borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:14, boxSizing:"border-box" }}/>
        </div>
      </div>
      <Slider label="Importance" value={form.importance} onChange={v=>set("importance",v)}/>
      <Slider label="Impact" value={form.impact} onChange={v=>set("impact",v)}/>
      <Slider label="Urgency" value={form.urgency} onChange={v=>set("urgency",v)}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <div>
          <label style={{ fontSize:12, color:"#94a3b8", display:"block", marginBottom:4 }}>Deadline</label>
          <input type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)}
            style={{ width:"100%", background:"#0f0a1a", border:`1px solid ${BORDER}`, borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:14, boxSizing:"border-box" }}/>
        </div>
        <div>
          <label style={{ fontSize:12, color:"#94a3b8", display:"block", marginBottom:4 }}>Tags (comma sep)</label>
          <input value={form.tags} onChange={e=>set("tags",e.target.value)}
            style={{ width:"100%", background:"#0f0a1a", border:`1px solid ${BORDER}`, borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:14, boxSizing:"border-box" }}/>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:13, color:"#64748b" }}>Priority Score: <strong style={{ color:scoreColor(score), fontSize:15 }}>{score}</strong></span>
        <button onClick={handleSave} style={{ background:`linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})`, color:"#fff", border:"none", borderRadius:8, padding:"10px 24px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
          Capture
        </button>
      </div>
    </Modal>
  );
};

export default QuickCapture;
