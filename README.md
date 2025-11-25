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
