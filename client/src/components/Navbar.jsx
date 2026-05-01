import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Layout, LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900/80 border-b border-slate-800 p-4 sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Branding - Vivid Indigo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-black text-white hover:text-indigo-400 transition-colors tracking-tighter"
        >
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Layout size={20} className="text-white" />
          </div>
          <span>TaskFlow</span>
        </Link>

        <div className="flex items-center gap-8">
          {user ? (
            <>
              {/* User Profile - High Visibility White/Slate */}
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <User size={18} className="text-indigo-400" />
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black text-white">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Logout - Brightened Red */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-white text-slate-950 text-sm font-black py-2 px-5 rounded-xl hover:bg-slate-200 transition-all shadow-lg shadow-white/5 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
