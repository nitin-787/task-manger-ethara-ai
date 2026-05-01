import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogIn, Loader2, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
        {/* Header - High Contrast Branding */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-4 border border-indigo-500/20">
            <LogIn size={40} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Sign In
          </h2>
          <p className="text-slate-400 mt-2 font-medium">
            Access your TaskFlow dashboard.
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
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-slate-500"
                size={18}
              />
              <input
                type="email"
                className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@test.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-200 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-slate-500"
                size={18}
              />
              <input
                type="password"
                className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
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
              "Login to Dashboard"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-slate-400 font-medium">
            New here?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-bold underline decoration-indigo-500/30 underline-offset-4 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
