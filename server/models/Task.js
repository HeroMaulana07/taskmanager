const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Judul wajib diisi"],
      trim: true,
      maxlength: [100, "Judul maksimal 100 karakter"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ["task", "note"],
      default: "task",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

taskSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("Task", taskSchema);
