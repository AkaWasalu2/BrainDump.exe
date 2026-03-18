import { BORDER, CARD_BG } from "../data/constants";
import Icon from "./Icon";

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:16, padding:28, width:"90%", maxWidth:560, maxHeight:"90vh", overflowY:"auto",
        animation:"modalPop 0.18s cubic-bezier(0.34,1.56,0.64,1)", transformOrigin:"center" }}>
        <style>{`@keyframes modalPop{from{transform:scale(0.94);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ margin:0, fontSize:18, fontWeight:700, color:"#f1f5f9" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer" }}><Icon name="x" size={20}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
