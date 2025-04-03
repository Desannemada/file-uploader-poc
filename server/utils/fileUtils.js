const fs = require("fs");
const path = require("path");
const rtfParser = require("rtf-parser");

// Checks if a file is a text-based file
const isTextFile = (fileName) => {
  const textFileExtensions = [".txt", ".md", ".csv", ".json", ".log", ".rtf"];
  return textFileExtensions.includes(path.extname(fileName).toLowerCase());
};

// Extracts plain text from .rtf files
const extractRtfText = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }

      rtfParser.string(data, (err, doc) => {
        if (err) {
          return reject(err);
        }

        // Recursive function to extract text
        const extractText = (blocks) => {
          let text = "";

          blocks.forEach((block) => {
            if (block.value) {
              text += block.value + "\n";
            }
            if (block.content && Array.isArray(block.content)) {
              text += extractText(block.content); // Recursively extract nested content
            }
          });

          return text;
        };

        const extractedText = extractText(doc.content).trim();
        resolve(extractedText);
      });
    });
  });
};

module.exports = { isTextFile, extractRtfText };
