const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Milestone Funding Backend API is running");
});

const projectSchema = new mongoose.Schema(
  {
    contractProjectId: {
      type: Number,
      required: true,
      
    },
    network: {
  type: String,
  default: "sepolia",
    },

    title: String,
    description: String,
    creatorAddress: String,
    funderAddress: String,
    imageUrl: String,
    milestones: [String],
    status: {
      type: String,
      default: "Active",
    
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

app.post("/api/projects", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/projects/:contractProjectId", async (req, res) => {
  try {
    const project = await Project.findOne({
      contractProjectId: req.params.contractProjectId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
