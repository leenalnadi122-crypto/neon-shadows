const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Allow cross-origin requests from your frontend (adjust origin in production)
app.use(cors({
    origin: ["http://localhost:5500", "http://localhost:3000", "http://127.0.0.1:5500"], // add your frontend origin(s)
}));

// Create uploads folder if not exists
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Configure multer to store files in uploads/
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        // give file a unique name: timestamp-originalname
        const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
        cb(null, safeName);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 200 * 1024 * 1024 } // 200 MB limit (adjust if needed)
});

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOAD_DIR));

// For parsing non-file form fields (if any)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload endpoint: accepts "file" OR "link" (or both)
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        // If frontend sent a link field
        const link = req.body.link && req.body.link.trim() ? req.body.link.trim() : null;

        let videoUrl = null;

        if (req.file) {
            // If file was uploaded, create accessible URL for it
            videoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        } else if (link) {
            // If no file but link provided, use that link
            videoUrl = link;
        } else {
            return res.status(400).json({ error: "No file or link provided" });
        }

        // Example: simple mock keyword + timeline extraction
        // In real app you'd run analysis here (AI / processing)
        const keywords = ["demo", "auto-keyword"];
        const timeline = [
            { time: "00:00", label: "Start" },
            { time: "00:10", label: "Intro" }
        ];

        // Optional: you can store metadata on disk or DB (not implemented)
        // For now just reply with the data the frontend expects
        return res.json({
            videoUrl,
            keywords,
            timeline
        });
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: "Server error during upload" });
    }
});

// Simple health-check
app.get("/", (req, res) => {
    res.send("Clipy upload server is running.");
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
