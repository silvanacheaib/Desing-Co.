'use client';
import React, { useState, useEffect } from 'react';
import { usePosStore } from '../store/usePosStore';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Circle,
  ClipboardList,
  AlertCircle,
  Send,
  History,
  Info
} from 'lucide-react';

export const StaffSchedule = () => {
  const { staffShifts, currentStaff } = usePosStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  
  // Leave Form State
  const [leaveForm, setLeaveForm] = useState({ 
    type: 'holiday', 
    start: '', 
    end: '', 
    reason: '' 
  });
  const [myRequests, setMyRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchTodayTasks();
    fetchMyLeaves();

    const taskChannel = supabase
      .channel('task-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'daily_tasks', filter: `staff_id=eq.${currentStaff?.id}` }, 
        () => fetchTodayTasks()
      )
      .subscribe();

    return () => { supabase.removeChannel(taskChannel); };
  }, [currentStaff]);

  const fetchTodayTasks = async () => {
    if (!currentStaff) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('staff_id', currentStaff.id)
      .eq('task_date', today)
      .order('priority', { ascending: false }); // High priority first
    
    if (data) setTasks(data);
    setLoadingTasks(false);
  };

  const fetchMyLeaves = async () => {
    if (!currentStaff) return;
    const { data } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('staff_id', currentStaff.id)
      .order('created_at', { ascending: false });
    if (data) setMyRequests(data);
  };

  const toggleTask = async (taskId: string, currentState: boolean) => {
    // When a user interacts with the task, we also mark it as 'not new' (seen)
    const { error } = await supabase
      .from('daily_tasks')
      .update({ is_completed: !currentState, is_new: false })
      .eq('id', taskId);
    
    if (!error) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, is_completed: !currentState, is_new: false } : t));
    }
  };

  const submitLeave = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const { error } = await supabase.from('leave_requests').insert([{
    staff_id: currentStaff?.id,
    staff_name: currentStaff?.full_name, // Save the name directly
    leave_type: leaveForm.type,
    start_date: leaveForm.start,
    end_date: leaveForm.end,
    reason: leaveForm.reason
  }]);

  if (!error) {
    alert("Request submitted!");
    // ... reset form
  }
};

  // Helper for priority colors
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-red-500 bg-red-500/10';
      case 'medium': return 'border-l-4 border-l-orange-400 bg-orange-400/10';
      default: return 'border-l-4 border-l-slate-400 bg-slate-400/10';
    }
  };

  const newTasksCount = tasks.filter(t => t.is_new).length;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* 1. Persistant Notification Banner */}
      {newTasksCount > 0 && (
        <div className="bg-blue-600 p-4 rounded-3xl text-white flex items-center justify-between shadow-lg animate-bounce-subtle">
          <div className="flex items-center gap-3 px-4">
            <div className="bg-white/20 p-2 rounded-full"><AlertCircle size={20}/></div>
            <p className="font-black text-sm uppercase tracking-tight">You have {newTasksCount} new tasks assigned today!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: Tasks & Schedule */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tasks Section */}
          <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <ClipboardList className="text-blue-400" /> Today's Roles & Duties
            </h3>
            <div className="space-y-4">
              {tasks.map(task => (
                <button 
                  key={task.id}
                  onClick={() => toggleTask(task.id, task.is_completed)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border border-white/5
                    ${getPriorityStyles(task.priority)} ${task.is_completed ? 'opacity-40 grayscale' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    {task.is_completed ? <CheckCircle2 className="text-emerald-400" /> : <Circle className="text-slate-500" />}
                    <div>
                      <p className={`font-black text-sm ${task.is_completed ? 'line-through' : ''}`}>{task.task_title}</p>
                      <span className="text-[10px] font-bold uppercase opacity-50 tracking-widest">{task.priority} Priority</span>
                    </div>
                  </div>
                  {task.is_new && <span className="bg-blue-500 text-[8px] font-black px-2 py-1 rounded-full">NEW</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-50 font-black text-sm uppercase tracking-widest flex items-center gap-2">
               <History size={16} className="text-slate-400"/> Work History
             </div>
             <table className="w-full text-left">
               <tbody className="divide-y divide-slate-50">
                 {staffShifts.slice(0, 5).map((shift) => (
                   <tr key={shift.id} className="hover:bg-slate-50/50">
                     <td className="px-8 py-5 font-bold text-sm text-slate-700">
                        {new Date(shift.shift_date).toLocaleDateString('en-LB', { weekday: 'short', day: 'numeric', month: 'short' })}
                     </td>
                     <td className="px-8 py-5 text-right font-black text-[10px] text-blue-500 uppercase">{shift.status}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* RIGHT COL: Leave Management */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-slate-800">
              <Send size={20} className="text-blue-600"/> Request Leave
            </h3>
            <form onSubmit={submitLeave} className="space-y-4">
              <select 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm"
                value={leaveForm.type}
                onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}
              >
                <option value="holiday">Full Holiday</option>
                <option value="sick">Sick Leave</option>
                <option value="half_day">Half Day / Permission</option>
                <option value="emergency">Emergency</option>
              </select>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Start & End Dates</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="p-4 bg-slate-50 rounded-2xl border-none font-bold text-xs" 
                         onChange={e => setLeaveForm({...leaveForm, start: e.target.value})} />
                  <input type="date" className="p-4 bg-slate-50 rounded-2xl border-none font-bold text-xs"
                         onChange={e => setLeaveForm({...leaveForm, end: e.target.value})} />
                </div>
              </div>

              <textarea 
                placeholder="Reason for request..." 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm h-24"
                value={leaveForm.reason}
                onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})}
              />
              
              <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black hover:bg-black transition-all shadow-lg shadow-slate-200">
                SUBMIT REQUEST
              </button>
            </form>
          </div>

          {/* Leave Status Tracking */}
          <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
             <h4 className="text-xs font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
               <Info size={14}/> Recent Requests
             </h4>
             <div className="space-y-3">
               {myRequests.slice(0, 3).map(req => (
                 <div key={req.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-start mb-1">
                     <span className="text-[10px] font-black uppercase text-blue-600">{req.leave_type}</span>
                     <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase
                       ${req.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                         req.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                       {req.status}
                     </span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400">{req.start_date} → {req.end_date}</p>
                   {req.admin_note && (
                     <div className="mt-2 p-2 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 italic">
                       Note: {req.admin_note}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};