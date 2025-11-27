# 🗓️ AgendaJS

AgendaJS is a lightweight full-stack application built with **NestJS**, **React**, and **MongoDB**, designed to keep track of personal events, notes, and job interviews.  
The goal of this project is to provide a fast, minimal, and pleasant agenda tool — fully containerized and easy to run on any machine through Docker.

---

## ✨ Features

- 📅 Create, edit, and delete personal events  
- 📝 Keep track of job interviews and reminders  
- ⚡ Fast and clean React interface (minimal and distraction-free UI)  
- 🧩 Modular backend built with NestJS  
- 📦 Lightweight MongoDB integration  
- 🐳 Fully dockerized (backend, frontend, and database)  
- 🔌 REST API between React (client) and NestJS (server)

---

## 🏗️ Tech Stack

### **Frontend**
- React (Hooks + modern components)
- Minimal design (clean, essential UI)
- Axios for API communication

### **Backend**
- NestJS (Modules, Controllers, Services)
- Mongoose for MongoDB integration
- REST API architecture

### **Database**
- MongoDB (documents for events and interviews)

### **DevOps / Tooling**
- Docker & Docker Compose
- Node.js 18+
- Lightweight containers for local development

---

## 🚀 Installation

### **Prerequisites**
Make sure you have installed:

- Docker & Docker Compose  
- Node.js (only if running outside Docker)

### **Run with Docker (recommended)**

```sh
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

---

## 📚 API Documentation

The backend exposes interactive API documentation via **Swagger/OpenAPI**:

- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api/docs-json

### Development

When running the backend in development mode, you can view and test all available endpoints directly in the browser:

```sh
cd backend
npm run start:dev
```

Then visit **http://localhost:3001/api/docs** to explore and test the REST API endpoints.

---
