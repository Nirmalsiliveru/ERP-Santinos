# BodhiEdu ERP: Development Roadmap & Status

This document tracks the current state of the BodhiEdu ERP system and outlines the pending functionalities required to reach a production-ready state.

## ✅ Completed Functionalities

### Core Infrastructure
- **Authentication**: JWT-based secure login, token refresh, and password management.
- **RBAC (Role-Based Access Control)**: Granular permission system linked to roles (Admin, Teacher, Parent, Student).
- **Audit Logging**: System-wide "Who-Did-What" tracking for accountability.
- **Academic Hierarchy**: Management of Academic Years, Classes, and Sections with capacity limits.

### Student Management
- **Lifecycle**: Enrollment, Profile Management, and Batch Promotion Wizard.
- **Bulk Operations**: High-speed CSV Import for massive student onboarding.
- **Automated Provisioning**: Auto-generation of Parent accounts with email notifications.

### Teacher & Faculty
- **Profile Management**: Basic CRUD for teachers and workload tracking (Periods per week).
- **Class Assignment**: Linking teachers to specific classes/sections.

---

## 🚀 Pending Development (To-Be-Built)

### 1. Attendance Engine (Priority: High)
- **Backend**:
    - [x] `Attendance` model (Student, Date, Status, Section).
    - [x] API routes for daily marking and bulk updates.
    - [ ] Monthly reporting logic.
- **Frontend**:
    - [x] Connect the current Attendance UI shell to real API.
    - [x] Implement "Mark Attendance" interface for teachers.
    - [ ] Attendance summary dashboard for parents.

### 2. Fee Management System (Priority: High)
- **Backend**:
    - [ ] `FeeStructure` model (Grade-wise fees).
    - [ ] `Invoice` & `Payment` tracking.
    - [ ] Integration with payment gateways (Stripe/Razorpay/Paystack).
- **Frontend**:
    - [ ] Connect Fee Matrix UI shell.
    - [ ] Invoice generation and PDF download.
    - [ ] Parent-side fee payment portal.

### 3. Examination & Grading (Priority: Medium)
- **Backend**:
    - [ ] `Exam` model (Type, Term, Subject).
    - [ ] `Marksheet` / `ReportCard` generation logic.
    - [ ] Grade calculation engine (GPA/Percentage).
- **Frontend**:
    - [ ] Teacher interface for entering marks.
    - [ ] Parent/Student view for performance tracking.

### 4. Timetable & Scheduling (Priority: Medium)
- **Backend**:
    - [ ] `Timetable` model (Day, Time, Subject, Teacher, Section).
    - [ ] Conflict detection logic (prevent double-booking teachers/rooms).
- **Frontend**:
    - [ ] Interactive grid for weekly schedules.

### 5. Communication & Notifications (Priority: Low)
- **Backend**:
    - [ ] In-app notification system (Socket.io).
    - [ ] SMS Gateway integration for emergency alerts.
- **Frontend**:
    - [ ] Notification bell and real-time alerts.

### 6. Holidays & Calendar (Priority: Low)
- **Backend**:
    - [ ] `Holiday` model and API.
- **Frontend**:
    - [ ] Connect Holiday UI shell to backend.

---

## 🛠️ Maintenance & Refactoring
- [ ] **Performance**: Implement Redis caching for frequent academic lookups.
- [ ] **Security**: Add Two-Factor Authentication (2FA) for Admin roles.
- [ ] **Reporting**: Create an Analytics Dashboard using Chart.js/Recharts for student performance trends.

---
**Status**: Development Phase 2 (Functional Core & Feature Expansion)
**Backend**: FastAPI | **Frontend**: Next.js | **Database**: PostgreSQL
