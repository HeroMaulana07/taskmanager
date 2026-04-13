import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth";
import { User, Mail, Lock, Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strength = getPasswordStength(password);
  const strengthLabels = [
    "Sangat Lemah",
    "Lemah",
    "Cukup",
    "Kuat",
    "Sangat Kuat",
  ];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password tidak cocok", {
        description: "Pastikkan password dan konfirmasi password sama",
      });
      return;
    }

    if (strength < 3) {
      toast.error("Password terlalu lemah", {
        description:
          "Gunakan minimal 6 karakter, kombinasi huruf, angka dan simbol",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await register({ username, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Akun berhasil dibuat, ${data.user.username}`, {
        description: "Mengalihkan ke Dashboard....",
      });

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      toast.error("Registrasi Gagal", {
        description: err.message,
        cancelButton: "Tutup",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-black/30 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-12 rounded-full bg-indigo-100 mb-4">
            <User className="size-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-200">Buat Akun</h2>
          <p className="text-gray-400 text-sm mt-1">
            Daftar untuk mulai mengelola tugas & catatan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-200" />
              <input
                type="text"
                placeholder="minimal 3 karakter"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 text-white py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                required
                minLength={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-200" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 focus:text-gray-400 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < strength
                          ? strengthColors[strength - 1]
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs ${strength >= 3 ? "text-green-600" : "text-orange-600"}`}
                >
                  {strengthLabels[strength - 1] || "Sangat Lemah"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-200" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi Passowrd"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-white transition-all"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-gray-400 focus:outline-none"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {/* Match Indicator */}
            {confirmPassword && (
              <p
                className={`text-xs mt-1 flex items-center gap-1 ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}
              >
                {password === confirmPassword ? (
                  <>
                    <Check className="size-3" />
                    Password cocok
                  </>
                ) : (
                  <>
                    <X className="size-3" />
                    Password tidak cocok
                  </>
                )}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" Memproses />
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-gray-200">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-all"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
