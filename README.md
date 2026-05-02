# 🏥 Clinic Management System

A full-stack web application designed to streamline and digitize clinic operations by managing patients, appointments, queue flow, and billing efficiently.

---

## 🎯 Problem Statement

Traditional clinic workflows often involve manual processes that lead to:

- Long patient waiting times  
- Poor queue management  
- Scheduling conflicts  
- Billing inconsistencies  

This system solves these issues by providing a **centralized, automated solution** for clinic management.

---

## 🚀 Key Features

- 👤 Patient Registration & Search  
- 📅 Appointment Scheduling with conflict prevention  
- 🎟️ Token-based Queue System (doctor-wise, daily reset)  
- 🩺 Consultation Management  
- 💰 Billing & Payment Processing  
- 🔐 Role-based Authentication using Django Groups  

---

## 🧠 Core System Logic

- Patients enter the queue **only after arrival**
- Token numbers are generated **per doctor per day**
- Queue is dynamically updated based on **appointment status**
- Consultation must be completed before **billing is enabled**
- System prevents:
  - Double booking  
  - Invalid payments  
  - Duplicate billing  

---

## ⚙️ Backend Design Highlights

- REST APIs built using Django REST Framework  
- Serializer-based validation for data integrity  
- Status-driven workflow (Scheduled → Waiting → Completed)  
- Token generation based on doctor and date  
- Secure endpoints using JWT authentication  

---

## 🎨 Frontend Highlights

- Responsive UI built with Tailwind CSS  
- API integration using fetch/axios  
- Dynamic dashboard updates  
- Role-based routing after login  
- Clean and user-friendly interface  

---

## 🔄 Workflow

Patient Registration  
        ↓  
Appointment Creation  
        ↓  
Patient Arrival (Waiting)  
        ↓  
Token Generation  
        ↓  
Doctor Queue  
        ↓  
Consultation Completion  
        ↓  
Billing & Payment  

---

## 🛠 Tech Stack

### 🔙 Backend
- Django  
- Django REST Framework  
- JWT Authentication  

### 🎨 Frontend
- React (Vite)  
- Tailwind CSS  

---

## 📂 Project Structure

clinic-management-system/  
│  
├── backend/   → Django REST API  
├── frontend/  → React UI  
├── README.md  
└── .gitignore  

---

## ▶️ How to Run the Project

### 🔹 Backend Setup

cd backend  
pip install -r requirements.txt  
python manage.py runserver  

---

### 🔹 Frontend Setup

cd frontend  
npm install  
npm run dev  

---

## 🔐 Authentication & Authorization

- Token-based authentication using JWT  
- Role management using Django Groups  
- Secure API access using authenticated users  

---

## 📊 System Highlights

- Real-world clinic workflow implementation  
- Modular and scalable backend architecture  
- Clean separation of frontend and backend  
- Responsive and user-friendly UI  
- Secure and validated data handling  

---

## 🧪 Sample Use Case

1. Receptionist registers a patient  
2. Appointment is created for a doctor  
3. Patient arrives → marked as "Waiting"  
4. Token is generated automatically  
5. Doctor completes consultation  
6. Billing is generated and payment is processed  

---

## 📌 Future Improvements

- Online patient appointment booking  
- Doctor dashboard module  
- Notifications (SMS/Email)  
- Analytics and reporting dashboard  

---

## 📌 Author

Akshaya K Sandeep
