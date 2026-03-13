
import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Clock, MapPin, 
  ChevronRight, Play, Check,
  User, Settings, Filter
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { OrderDocV2 } from '../types/inventory.types';
import { motion, AnimatePresence } from 'framer-motion';

const TaskManagementView = () => {
  const [tasks, setTasks] = useState<OrderDocV2[]>([]);
  const [selectedTask, setSelectedTask] = useState<OrderDocV2 | null>(null);
  const [loading, setLoading] = useState(true);
  const filter = 'all';

  // Mock technician ID (in a real app, this comes from auth context)
  const technicianId = "tech_ricardo_01";

  useEffect(() => {
    const unsub = taskService.subscribeToTechnicianTasks(technicianId, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: OrderDocV2['status']) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus, {
        location: { lat: -23.5505, lng: -46.6333 }, // Mock location
        report: newStatus === 'completed' ? {
          diagnostic: "Manutenção preventiva realizada com sucesso. Limpeza de filtros e verificação de gás.",
          partsUsed: ["Filtro HEPA", "Gás R410A"]
        } : undefined
      });
      if (selectedTask?.id === taskId) {
        setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Minhas Tarefas</h1>
            <p className="text-xs text-slate-500">Técnico: Ricardo Santos</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-100 rounded-full text-slate-600">
              <Filter size={20} />
            </button>
            <button className="p-2 bg-slate-100 rounded-full text-slate-600">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'open').length}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Abertas</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-amber-600">{tasks.filter(t => t.status === 'in_progress').length}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Em Curso</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-emerald-600">{tasks.filter(t => t.status === 'completed').length}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Feitas</p>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
              <ClipboardList className="mx-auto text-slate-300 mb-2" size={40} />
              <p className="text-slate-500">Nenhuma tarefa encontrada.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layoutId={task.id}
                onClick={() => setSelectedTask(task)}
                className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">#{task.orderCode}</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Manutenção: {task.assetId}</h3>
                <div className="flex items-center text-xs text-slate-500 gap-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>Rua das Flores, 123</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
          >
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => setSelectedTask(null)} className="p-2 bg-slate-100 rounded-full">
                  <ChevronRight className="rotate-180" size={24} />
                </button>
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Detalhes da OS</h2>
                <div className="w-10"></div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Status Atual</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedTask.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></div>
                    <span className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">
                      {selectedTask.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Ações Rápidas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedTask.status === 'open' && (
                      <button 
                        onClick={() => handleStatusChange(selectedTask.id, 'in_progress')}
                        className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200"
                      >
                        <Play size={20} />
                        <span>Check-in</span>
                      </button>
                    )}
                    {selectedTask.status === 'in_progress' && (
                      <button 
                        onClick={() => handleStatusChange(selectedTask.id, 'completed')}
                        className="flex items-center justify-center gap-2 p-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200"
                      >
                        <Check size={20} />
                        <span>Finalizar</span>
                      </button>
                    )}
                    <button className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold">
                      <MapPin size={20} />
                      <span>Rota</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Cliente</p>
                      <p className="font-bold text-slate-800">Condomínio Solar das Palmeiras</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                      <Settings size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Equipamento</p>
                      <p className="font-bold text-slate-800">Split Cassete 36.000 BTU - Carrier</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex justify-around items-center z-10">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <ClipboardList size={24} />
          <span className="text-[10px] font-bold uppercase">Tarefas</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Clock size={24} />
          <span className="text-[10px] font-bold uppercase">Histórico</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <User size={24} />
          <span className="text-[10px] font-bold uppercase">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default TaskManagementView;
