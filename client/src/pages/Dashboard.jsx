import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/tasks";
import { toast } from "sonner";
import {
  LogOut,
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle,
  Clock,
  Plus,
  StickyNote,
  X,
  Save,
  Edit3,
  Trash2,
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State Modal dan Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "task",
    status: "todo",
  });

  // State Seacrh & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        if (
          err.message.includes("Token tidak valid") ||
          err.message.includes("Akses ditolak")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }
        setError(err.message);
        toast.error("Gagal memuat data", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Anda telah Logout", { duration: 2000 });
    navigate("/login", { replace: true });
  };

  // Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(q) ||
        (task.description || "").toLowerCase().includes(q);
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;
      const matchesType = filterType === "all" || task.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [tasks, searchQuery, filterStatus, filterType]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterType("all");
  };

  // Modal Handlers
  const openModal = (task = null) => {
    setEditingTask(task);
    setFormData(
      task
        ? {
            title: task.title,
            description: task.description || "",
            type: task.type,
            status: task.status,
          }
        : { title: "", description: "", type: "task", status: "todo" },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      let result;
      if (editingTask) {
        result = await updateTask(editingTask._id, formData);
        setTasks((prev) =>
          prev.map((t) => (t._id === result._id ? result : t)),
        );
        toast.success("Berhasil diperbarui");
      } else {
        result = await createTask(formData);
        setTasks((prev) => [result, ...prev]);
        toast.success("Berhasil ditambahkan");
      }
      closeModal();
    } catch (err) {
      toast.error("Gagal menyimpan", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus tugas ini?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Tugas berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus", { description: err.message });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto text-blue-500 mb-2" />
          <p className="text-gray-200">Memuat tugas</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center max-w-md">
          <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Kembali Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/30 shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-400 flex items-center gap-2">
            <FileText className="size-6 text-blue-500" /> Task & Notes
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Halo,{" "}
              <strong className="text-gray-200">
                {user.username || "User"}
              </strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium transition cursor-pointer"
            >
              <LogOut className="size-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border-gray-300 ring-gray-300 ring-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="todo">🟡 Todo</option>
              <option value="in-progress">🔵 Proses</option>
              <option value="done">🟢 Selesai</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
            >
              <option value="all">Semuat Tipe</option>
              <option value="task">📌 Tugas</option>
              <option value="note">📝 Catatan</option>
            </select>
            <button
              onClick={clearFilters}
              disabled={
                searchQuery === "" &&
                filterStatus === "all" &&
                filterType === "all"
              }
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800  disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <RotateCcw className="size-4 cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-200">
            Daftar Tugas & Catatan
          </h2>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="size-4" /> Tambah Baru
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <Filter className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {tasks.length === 0
                ? "Belum ada data"
                : "Tidak ada hasil yang cocok"}
            </h3>
            <p className="text-gray-500">
              {tasks.length === 0
                ? "Klik tombol 'Tambah Baru' untuk membuat tugas pertama"
                : "Coba ubah kata kunci atau filter pencarian anda"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition group relative"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.status === "done"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {task.status === "done"
                      ? "Selesai"
                      : task.status === "in-progress"
                        ? "Proses"
                        : "Todo"}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(task.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {task.description}
                  </p>
                )}
                <div
                  className={`flex items-center justify-between border-t border-gray-100 pt-3 ${task.description ? "mt-auto" : "mt-9"}`}
                >
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {task.type === "note" ? (
                      <>
                        <StickyNote className="size-3" />
                        Catatan
                      </>
                    ) : (
                      <>
                        <CheckCircle className="size-3" />
                        Tugas
                      </>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(task)}
                      className="p-1.5 text-gray-400 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-1.5 text-gray-400 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* {tasks.length === 0 ? (
          // Empty State
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <StickyNote className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              Belum ada data
            </h3>
            <p className="text-gray-400">
              Klik tombol "Tambah Baru" untuk membuat tugas atau catatan
              pertamamu.
            </p>
          </div>
        ) : (
          // Task List
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.status === "done"
                        ? "bg-green-200 text-green-700"
                        : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {task.status === "done"
                      ? "Selesai"
                      : task.status === "in-progress"
                        ? "Proses"
                        : "Todo"}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(task.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-700 mb-1 line-clamp-2">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-900 line-clamp-2 mb-3">
                    {task.description}
                  </p>
                )}

               // Action
                <div className="flex items-center gap-2 text-xs text-gray-700 border-t border-gray-100 pt-3 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {task.type === "note" ? (
                      <>
                        <StickyNote className="size-3" />
                        Catatan
                      </>
                    ) : (
                      <>
                        <CheckCircle className="size-3" />
                        Tugas
                      </>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(task)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )} */}
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">
              {editingTask ? "Edit Tugas / Catatan" : "Tambah Tugas / Catatan"}
            </h3>
            <form onSubmit={handleSubmitTask} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Judul (wajib)"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isSubmitting}
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsi (opsional)"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring0-2 focus:ring-blue-500 focus:outline-none resize-nonea"
                disabled={isSubmitting}
              ></textarea>
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="task">📌 Tugas</option>
                  <option value="note">📝 Catatan</option>
                </select>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="todo">🟡 Todo</option>
                  <option value="in-progress">🔵 Proses</option>
                  <option value="done">🟢 Selesai</option>
                </select>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {isSubmitting
                    ? "Menyimpan"
                    : editingTask
                      ? "Perbarui"
                      : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
