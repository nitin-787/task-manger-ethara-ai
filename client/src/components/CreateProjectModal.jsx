import { useState } from "react";
import api from "../utils/api";

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: "", // String input for comma-separated IDs
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert the comma-separated string into a clean array of IDs
      const memberArray = formData.members
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "");

      const projectData = {
        name: formData.name,
        description: formData.description,
        members: memberArray,
      };

      await api.post("/projects", projectData);
      onProjectCreated();
      onClose();
      setFormData({ name: "", description: "", members: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create New Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Project Name
            </label>
            <input
              required
              className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white outline-none focus:ring-2 focus:ring-indigo-500 h-24"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Initial Members (User IDs)
            </label>
            <input
              placeholder="ID1, ID2, ID3..."
              className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.members}
              onChange={(e) =>
                setFormData({ ...formData, members: e.target.value })
              }
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Separate multiple IDs with commas.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 text-white py-2 rounded font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded font-bold transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
