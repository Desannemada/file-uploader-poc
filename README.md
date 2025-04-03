# 📂 Public Directory

Welcome to **Public Directory**! 🚀 This is a simple yet powerful file management app that lets you upload, search, download, and delete files with ease. It features a clean and intuitive interface powered by React and a robust Node.js backend.

---

## 💬 Preparation

[POC](poc.md)

[Requirements](requirements.md)

---

## ✨ Features

- 📂 **Upload files** (Supports multiple files at once!)
- 🔍 **Search files** by name, type and content (text-only types)
- ⬇️ **Download files** directly from the UI
- 🗑️ **Delete files** (Uses timestamp-based deletion for accuracy)
- 🎨 **Beautiful UI** powered by Material-UI

---

## 🚀 Getting Started

Follow these simple steps to set up and run the project locally.

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/yourusername/public-directory.git
cd public-directory
```

---

## 🏗 Installation

You'll need to install dependencies for both the **frontend** and **backend**.

### **2️⃣ Install Backend Dependencies**

```sh
cd server
npm install
```

### **3️⃣ Install Frontend Dependencies**

```sh
npm install
```

---

## 🏃 Running the Project

Once dependencies are installed, run the frontend and backend in separate terminals.

### **4️⃣ Start the Backend**

```sh
cd server
node server.js
```

or (use nodemon if you have it installed)

```sh
nodemon server.js
```

- The backend runs on **http://localhost:5050**

### **5️⃣ Start the Frontend**

```sh
npm start
```

- The frontend runs on **http://localhost:3000**

---

## 🛠️ API Endpoints

### **📤 Upload Files**

- **Endpoint:** `POST /upload`
- **Payload:** `FormData` with files

### **🗑 Delete Files**

- **Endpoint:** `DELETE /delete/:timestamp`
- **Deletes files based on their unique timestamp.**

### **📂 Get All Files**

- **Endpoint:** `GET /files`
- **Response:** List of available files

---

## 🎨 Tech Stack

- **Frontend:** React, TypeScript, Material-UI
- **Backend:** Node.js, Express
- **File Storage:** Local file system

---

### 🎉 Happy Coding! 🚀
