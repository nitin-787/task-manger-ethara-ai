import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { Clock, Plus, Loader2 } from "lucide-react";
import AddTaskModal from "../components/AddTaskModal";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const projectRes = await api.get(`/projects/${id}`);
      setProject(projectRes.data.data);

      const tasksRes = await api.get(`/tasks/project/${id}`);
      setTasks(tasksRes.data.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 1. Simple Header */}
      <header className="border-b border-slate-800 pb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {project?.name}
            </h1>
            <p className="text-slate-400 text-sm">{project?.description}</p>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2"
          >
            <Plus size={14} /> Add Task
          </button>
        </div>

        {/* 2. Text-Based Team List */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Team:
          </span>

          {/* Admin Name */}
          {project?.admin && (
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {"Shivani"} (Admin)
            </span>
          )}

          {/* Member Names */}
          {project?.members?.map((member) => (
            <span
              key={member._id}
              className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
            >
              {"Zoro"} (member)
            </span>
          ))}
        </div>
      </header>

      {/* 3. Task List Header */}
      <div className="flex items-center gap-2 text-slate-400 mb-4">
        <Clock size={16} />
        <h2 className="text-sm font-semibold uppercase tracking-wider">
          Tasks ({tasks.length})
        </h2>
      </div>

      {/* 4. Simple Task Rows */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/10 divide-y divide-slate-800">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Assignee:{" "}
                  <span className="text-slate-400">
                    {task.assignedTo?.name || "Unassigned"}
                  </span>
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded border ${
                  task.status === "Done"
                    ? "text-green-500 border-green-500/20 bg-green-500/5"
                    : task.status === "In Progress"
                      ? "text-blue-400 border-blue-400/20 bg-blue-400/5"
                      : "text-slate-500 border-slate-700 bg-slate-800"
                }`}
              >
                {task.status.toUpperCase()}
              </span>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-600 text-sm italic">
            No tasks found.
          </div>
        )}
      </div>
      {/* In ProjectDetails.jsx */}
      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={id}
        // Ensure we pass the actual populated objects
        projectMembers={project?.members || []}
        projectAdmin={project?.admin || null}
        onTaskAdded={fetchDetails}
      />
    </div>
  );
};

export default ProjectDetails;
