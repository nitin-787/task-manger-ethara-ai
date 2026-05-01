import { useState } from "react";
import api from "../utils/api";
import { X, UserCheck, AlertCircle } from "lucide-react";

const AddTaskModal = ({
  isOpen,
  onClose,
  projectId,
  projectMembers, // Array of member objects
  projectAdmin, // Admin object
  onTaskAdded,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure we are sending the project ID from the URL/Props
      await api.post("/tasks", {
        ...formData,
        project: projectId,
      });

      onTaskAdded();
      onClose();
      setFormData({ title: "", description: "", assignedTo: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  console.log("admin data", projectAdmin);
  console.log("admin data", projectMembers);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <UserCheck size={20} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Create Task
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Task Title
            </label>
            <input
              className="bg-slate-900 border border-slate-700 w-full p-3 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium"
              required
              placeholder="e.g. Build API endpoints"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Description
            </label>
            <textarea
              className="bg-slate-900 border border-slate-700 w-full p-3 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none h-28 resize-none transition-all text-sm leading-relaxed"
              placeholder="What specifically needs to be done?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Assignee Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Assign To
            </label>
            <select
              className="bg-slate-900 border border-slate-700 w-full p-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer font-semibold appearance-none"
              required
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
            >
              <option value="" disabled>
                Select a team member
              </option>

              {/* Handle Admin Option */}
              {projectAdmin && (
                <option
                  value={
                    typeof projectAdmin === "object"
                      ? projectAdmin._id
                      : projectAdmin
                  }
                >
                  {projectAdmin.name || "Project Admin"} (Admin)
                </option>
              )}

              {/* Handle Members Array */}
              {projectMembers && projectMembers.length > 0 ? (
                projectMembers.map((member) => (
                  <option
                    key={typeof member === "object" ? member._id : member}
                    value={typeof member === "object" ? member._id : member}
                  >
                    {member.name || "Team Member"}
                  </option>
                ))
              ) : (
                <option disabled>No members found</option>
              )}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-slate-200 text-slate-950 py-4 rounded-xl font-black text-sm transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
