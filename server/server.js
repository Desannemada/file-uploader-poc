const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { isTextFile, extractRtfText } = require("./utils/fileUtils");

const app = express();
const PORT = 5050;

// Use CORS with proper settings
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

//  Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//  File upload setup
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Upload route
app.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const fileNames = req.files.map((file) => file.filename);
    res.json({ message: "Files uploaded successfully!", files: fileNames });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Error uploading files. Please try again." });
  }
});

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// Get uploaded files
app.get("/files", async (req, res) => {
  const searchQuery = req.query.search?.toLowerCase() || "";

  fs.readdir(uploadDir, async (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error reading files" });
    }

    try {
      const filteredFiles = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(uploadDir, file);
          const fileExt = path.extname(file).toLowerCase();
          const fileName = path.basename(file, fileExt).toLowerCase();

          // Check if searchQuery matches file name or extension
          if (fileName.includes(searchQuery) || fileExt.includes(searchQuery)) {
            return file;
          }

          // Check inside text-based files (if query is not empty)
          if (searchQuery && isTextFile(file)) {
            try {
              let content = await fs.promises.readFile(filePath, "utf-8");

              // Extract text from .rtf files
              if (fileExt === ".rtf") {
                content = await extractRtfText(filePath);
              }

              if (content.toLowerCase().includes(searchQuery)) {
                return file;
              }
            } catch (err) {
              console.warn(`Could not read file: ${filePath}`, err);
            }
          }

          return null;
        })
      );

      // Remove null values (files that didn't match the search)
      res.json(filteredFiles.filter(Boolean));
    } catch (error) {
      res.status(500).json({ error: "Error filtering files" });
    }
  });
});

// Delete a specific file
app.delete("/delete/:timestamp", async (req, res) => {
  const timestamp = req.params.timestamp;

  try {
    // Get all files in the upload directory
    const files = await fs.promises.readdir(uploadDir);

    // Find a file that starts with the given timestamp
    const fileToDelete = files.find((file) => file.startsWith(timestamp + "-"));

    if (!fileToDelete) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(uploadDir, fileToDelete);

    await fs.promises.unlink(filePath);
    res.json({ message: `File "${fileToDelete}" deleted successfully!` });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
});

// Start server
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
