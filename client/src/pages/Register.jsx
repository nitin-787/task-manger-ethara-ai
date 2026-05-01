import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Loader2, ShieldCheck, User } from "lucide-react";
import api from "../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
        {/* Header - High Contrast */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-4 border border-indigo-500/20">
            <UserPlus size={40} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Join TaskFlow
          </h2>
          <p className="text-slate-400 mt-2 font-medium">
            Create your account to start managing projects.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8 text-sm font-bold flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-200 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-slate-500"
                size={18}
              />
              <input
                type="text"
                name="name"
                className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                onChange={handleChange}
                required
                placeholder="Nitin Sharma"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-200 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              onChange={handleChange}
              required
              placeholder="nitin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-200 uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-200 uppercase tracking-widest ml-1">
              Your Role
            </label>
            <div className="relative">
              <ShieldCheck
                className="absolute left-3 top-3 text-slate-500"
                size={18}
              />
              <select
                name="role"
                className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                onChange={handleChange}
                value={formData.role}
              >
                <option value="Member">Team Member</option>
                <option value="Admin">Project Manager (Admin)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-slate-200 text-slate-950 py-4 rounded-xl font-black text-lg transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-bold underline decoration-indigo-500/30 underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
