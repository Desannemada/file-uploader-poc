# Proof of Concept: [File Directory]

## Overview

The application is designed as a place where users can upload as many files as they want and easily find them by searching for their name, file type, or even content for text-based files.

## Objectives

- Build an app that provides the best experience possible to upload files and search for content inside the files.

## Features

- Upload one or multiple files at a time to the directory, can be any file type.
- Search for any file based on its name, file type, and content.
- Delete files.
- View files with name, type and (if available) image.

## Technologies Used / Why

- Frontend:
  - React: component-based architecture, very reusable and modular UI elements. Great for efficient updates and rendering while coding, which enhances responsiveness and performance. It also has strong community support.
  - MUI: beautiful, modern, user-friendly and accessible components with minimal effort.
- Backend:
  - Node JS: event-driven architecture, very efficient for file uploads and real-time updates.
- Database:
  - Local file system: great for performance on a POC.

## Implementation Details

- Develop frontend and backend at the same github repository.
- Frontend:
  - Create a React project with TypeScript for the frontend.
  - Install MUI library.
  - Implement file upload, search, and delete functionalities using API calls to the backend.
  - Create a context for all the file handling and reusability through multiple components.
- Backend:
  - Create a Node project for the backend.
  - Install nodemon for better logging and server handling.
  - Set up API routes for file operations (upload, delete, list).

## Expected Outcomes

As an user, I want to be able to upload, view, delete, download, and search files available in the directory.

## Limitations and Future Work

- The backend would need to go into an actual server, available on the cloud so that anyone is able to use it anywhere via the internet. And have its own domain for the API.
- The front-end can also be hosted on a service like GitHub Pages or Vercel, so users don’t need to run it locally.
- Optimally, file data would be stored in a database like MongoDB with GridFS, as it handles large file sizes (if needed), allows easier backups, works with Atlas, and enables additional metadata storage. Other option could be firebase.

## Conclusion

This approach to managing file uploads and searches is both functional and scalable, covering all the project objectives. Using React, MUI, and Node.js makes the app fast, user-friendly, and easy to work with, while the local file system keeps things simple for now. In the future, moving to cloud hosting and a proper database would make it even more accessible and scalable.

---
