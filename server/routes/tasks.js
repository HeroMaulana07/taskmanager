const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Task = require("../models/Task");

router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data tugas" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, type, status } = req.body;
    if (!title) return res.status(400).json({ error: "Judul Wajib diisisx" });

    const newTask = new Task({
      title,
      description: description || "",
      type: type || "task",
      status: status || "todo",
      owner: req.user.id,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Gagal membuat tugas" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, type, status } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type) updateData.type = type;
    if (status) updateData.status = status;

    const updateTask = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      updateData,
      { new: true, runValidators: true },
    );

    if (!updateTask) {
      return res
        .status(404)
        .json({ error: "Tugas tidak ditemukan atau bukan milik anda" });
    }
    res.json(updateTask);
  } catch (err) {
    res.status(500).json({ error: "Gagal memperbarui tugas" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!deletedTask) {
      return res
        .stastus(404)
        .json({ error: "Tugas tidak ditemukan atau bukan milik anda" });
    }
    res.json({ message: "Tugas berjasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus tugas" });
  }
});

module.exports = router;
