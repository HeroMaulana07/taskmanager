import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Selamat Datang, ${data.user.username}`, {
        description: "Login Berhasil, Mengalihkan ke Dashboard",
      });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      toast.error("Login Gagal", {
        description: err.message,
        cancelButton: "Tutup",
      });
    } finally {
      setLoading(false);
    }
  };
  // bg-linear-to-br from-blue-50 to-indigo-100 min-h-screen
  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <div className="bg-black/30 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
            <LogIn className="size-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-200">Selamat Datang</h2>
          <p className="text-gray-400 text-sm mt-1">
            Masuk untuk mengelola tugas & catatanmu
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-200" />
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-200" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-white w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-gray-400 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 focus:otuline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Memproses
              </>
            ) : (
              <>
                <LogIn className="size-5" />
                Masuk
              </>
            )}
          </button>
        </form>
        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
