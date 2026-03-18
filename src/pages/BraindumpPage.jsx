import { useCallback, useEffect, useState } from "react";
import FocusMode from "../components/FocusMode";
import QuickCapture from "../components/QuickCapture";
import Sidebar from "../components/Sidebar";
import TaskDetail from "../components/TaskDetail";
import { BG } from "../data/constants";
import { makeDemoData } from "../data/demoData";
import AnalyticsView from "./AnalyticsView";
import CategoryView from "./CategoryView";
import DashboardView from "./DashboardView";
import InboxView from "./InboxView";
import SettingsView from "./SettingsView";
import TodayView from "./TodayView";
import WeeklyReview from "./WeeklyReview";
import { loadState, saveState } from "../utils/storage";

export default function BraindumpPage() {
  const [tasks, setTasks] = useState(()=>{
    const saved = loadState();
    return saved || makeDemoData();
  });
  const [view, setView] = useState("dashboard"); // dashboard | category | analytics | weekly | settings | inbox | today
  const [activeCategory, setActiveCategory] = useState(null);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [focusTask, setFocusTask] = useState(null);

  useEffect(()=>{ saveState(tasks); }, [tasks]);

  const updateTask = useCallback((updated) => {
    setTasks(prev => prev.map(t=>t.id===updated.id?updated:t));
    setSelectedTask(prev=>prev&&prev.id===updated.id?updated:prev);
  }, []);
  const deleteTask = useCallback((id) => {
    setTasks(prev=>prev.filter(t=>t.id!==id));
    setSelectedTask(null);
  }, []);
  const archiveTask = useCallback((task) => {
    updateTask({...task, status:"archived", lastUpdated:Date.now()});
    setSelectedTask(null);
  }, [updateTask]);
  const addTask = useCallback((task) => {
    setTasks(prev=>[...prev, task]);
  }, []);
  const resetToDemo = useCallback(()=>{
    const data = makeDemoData();
    setTasks(data);
    saveState(data);
  }, []);

  const navTo = (id) => {
    if (["Study","Projects","Job Hunt","Concepts","Content","Newsletters","Ideas"].includes(id)) {
      setActiveCategory(id); setView("category"); setSelectedTask(null);
    } else if (id==="Inbox") { setView("inbox"); setSelectedTask(null); }
    else if (id==="Today") { setView("today"); setSelectedTask(null); }
    else if (id==="analytics") { setView("analytics"); setSelectedTask(null); }
    else if (id==="weekly") { setView("weekly"); setSelectedTask(null); }
    else if (id==="settings") { setView("settings"); setSelectedTask(null); }
    else { setView("dashboard"); setSelectedTask(null); }
  };

  if (focusTask) {
    return <FocusMode task={focusTask} onExit={()=>setFocusTask(null)} onUpdate={t=>{updateTask(t);setFocusTask(t);}}/>;
  }

  const renderMain = () => {
    if (view==="category") return (
      <CategoryView cat={activeCategory} tasks={tasks} onBack={()=>setView("dashboard")}
        onUpdate={updateTask} onOpen={t=>{setSelectedTask(t);}}/>
    );
    if (view==="analytics") return <AnalyticsView tasks={tasks}/>;
    if (view==="weekly") return <WeeklyReview tasks={tasks} onUpdate={updateTask}/>;
    if (view==="settings") return <SettingsView tasks={tasks} onReset={resetToDemo}/>;
    if (view==="inbox") return <InboxView tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} onOpen={t=>setSelectedTask(t)}/>;
    if (view==="today") return <TodayView tasks={tasks} onOpen={t=>setSelectedTask(t)}/>;
    return <DashboardView tasks={tasks} navTo={navTo} setSelectedTask={setSelectedTask} />;
  };

  return (
    <div style={{ fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:BG, minHeight:"100vh", width:"100%", color:"#f1f5f9" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:#0B0613; }
        ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.3); border-radius:4px; }
        input[type=date]::-webkit-calendar-picker-indicator { filter:invert(0.5); }
        select option { background:#140A1F; }
      `}</style>
      <Sidebar active={view==="category"?activeCategory:view} onNav={navTo} onCapture={()=>setCaptureOpen(true)} tasks={tasks}/>
      <QuickCapture open={captureOpen} onClose={()=>setCaptureOpen(false)} onSave={addTask}/>
      <div style={{ marginLeft:240, minHeight:"100vh", position:"relative" }}>
        <div style={{ minHeight:"100vh", paddingRight: selectedTask ? "58%" : 0, transition:"padding-right 0.2s" }}>
          {renderMain()}
        </div>
        <TaskDetail
          task={selectedTask} tasks={tasks} open={!!selectedTask}
          onClose={()=>setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={()=>deleteTask(selectedTask?.id)}
          onArchive={()=>archiveTask(selectedTask)}
          onFocus={()=>{ setFocusTask(selectedTask); setSelectedTask(null); }}/>
      </div>
    </div>
  );
}
