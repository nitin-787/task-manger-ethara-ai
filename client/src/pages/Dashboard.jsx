import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import {
  Plus,
  Users,
  Folder,
  Loader2,
  ArrowRight,
  Rocket,
  Shield,
  Zap,
} from "lucide-react";
import CreateProjectModal from "../components/CreateProjectModal";

const Dashboard = () => {
  const { user } = useContext(AuthContext); // Get user from context
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    if (!user) return; // Don't fetch if not logged in
    try {
      setLoading(true);
      const projRes = await api.get("/projects");
      setProjects(projRes.data.data);
    } catch (err) {
      console.error("Dashboard load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // --- 1. LANDING PAGE STATE (Logged Out) ---
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest animate-bounce">
            <Rocket size={14} /> v1.0 is now live
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Manage projects <br />
            <span className="text-indigo-500">without the chaos.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            TaskFlow is the minimalist project management tool for developers.
            Track tasks, manage teams, and ship faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-700 transition-all active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full">
          {[
            {
              icon: <Zap className="text-yellow-400" />,
              title: "Lightning Fast",
              desc: "Built with React for a snappy, zero-lag experience.",
            },
            {
              icon: <Shield className="text-blue-400" />,
              title: "Secure Teams",
              desc: "Role-based access to keep your project data safe.",
            },
            {
              icon: <Users className="text-indigo-400" />,
              title: "Collaborative",
              desc: "Assign tasks and track progress in real-time.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl text-left space-y-3"
            >
              <div className="p-3 bg-slate-800 w-fit rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-lg">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 2. DASHBOARD STATE (Logged In) ---
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Welcome back, <span className="text-indigo-400">{user?.name}</span>!
        </h1>
        <p className="text-slate-400 text-lg">
          Here is what's happening with your projects.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            to={`/project/${project._id}`}
            key={project._id}
            className="group bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all duration-300 shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Folder size={24} />
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 uppercase tracking-wider">
                {project.admin?._id === user?._id || project.admin === user?._id
                  ? "Admin"
                  : "Member"}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-2 mb-6">
              {project.description}
            </p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <Users size={14} />
                <span>{1 + (project.members?.length || 0)} Team Members</span>
              </div>
              <ArrowRight
                size={16}
                className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all"
              />
            </div>
          </Link>
        ))}

        {user?.role === "Admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 transition-all group bg-slate-800/10"
          >
            <div className="p-3 bg-slate-800/50 rounded-full group-hover:bg-indigo-500/10 transition-colors">
              <Plus size={32} />
            </div>
            <span className="font-bold">New Project</span>
          </button>
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
