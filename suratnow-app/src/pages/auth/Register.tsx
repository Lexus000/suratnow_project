import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AnimatedPage } from "../../components/AnimatedPage";
import api, { ensureCsrfCookie } from "../../lib/api";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, role } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'petugas') return <Navigate to="/petugas" replace />;
    return <Navigate to="/user" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await ensureCsrfCookie();
      const response = await api.post("/register", { name, email, password });
      login(response.data.user);
      navigate("/user");
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat pendaftaran");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-light/20 rounded-full blur-3xl" />
      
      <motion.div 
        className="glass-card w-full max-w-md p-8 relative z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            SuratNow
          </h1>
          <p className="text-slate-500 mt-2">Daftar akun warga baru</p>
        </div>

        {error && (
          <div data-testid="register-error" className="mb-6 p-3 bg-red-50/50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="name"
                data-testid="register-name"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                data-testid="register-email"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                data-testid="register-password"
                type="password"
                required
                minLength={12}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="Minimal 12 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            data-testid="register-submit"
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Daftar Sekarang"}
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-8">
          Sudah punya akun? <Link to="/login" className="font-medium text-primary hover:underline">Masuk disini</Link>
        </p>
      </motion.div>
    </AnimatedPage>
  );
}
