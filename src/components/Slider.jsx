import { ACCENT, ACCENT_SOFT } from "../data/constants";

const Slider = ({ label, value, onChange, min=1, max=5 }) => (
  <div style={{ marginBottom:12 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
      <span style={{ fontSize:12, color:"#94a3b8" }}>{label}</span>
      <span style={{ fontSize:12, color:ACCENT_SOFT, fontWeight:600 }}>{value}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}
      style={{ width:"100%", accentColor:ACCENT, cursor:"pointer", background:`linear-gradient(90deg, ${ACCENT} ${(value-min)/(max-min)*100}%, rgba(139,92,246,0.2) ${(value-min)/(max-min)*100}%)`, borderRadius:4, height:4, outline:"none", WebkitAppearance:"none" }}/>
  </div>
);


export default Slider;
