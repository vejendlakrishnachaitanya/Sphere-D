**Sphere-D: Enterprise Resource & Workspace Management System**

Sphere-D is a modern, full-stack enterprise platform built to simplify and streamline office workspace booking and hardware asset management. It brings together workspace allocation and IT inventory into one unified system, making it easier for employees to reserve seats and request hardware, while giving IT staff and administrators complete visibility and control over resources.

The platform is designed with automation, security, and scalability in mind, helping organizations improve operational efficiency and maintain accurate asset tracking.

** Key Features**
** Workspace Booking**

Live Availability Map
Administrators can easily view which seats are free or occupied for any office area and date. This provides clear visibility into workspace usage and helps with planning and capacity management.

Conflict-Free Booking
Sphere-D uses database-level pessimistic locking to ensure that no two users can book the same seat at the same time, even during high traffic periods. This guarantees reliable and consistent booking behavior.

** Asset & Inventory Management**

Smart Request Validation
Employees can request hardware such as laptops or monitors only if they have an active seat booking. This ensures that assets are allocated efficiently and only when needed.

Automated Fulfillment Workflow
Hardware requests move through a structured lifecycle:

Draft → Submitted → Approved → Assigned

This makes the fulfillment process transparent, organized, and easy to track.

Hardware Maintenance and Replacement
If a user reports an asset as broken, the system automatically updates its status and generates a replacement request for IT staff. This reduces manual effort and ensures faster issue resolution.

** Administrative Control**

Centralized User Management
Administrators can create and manage employee, IT staff, and admin accounts from a single interface, ensuring proper access control across the system.

Flexible Capacity Configuration
Office seating capacity can be configured and adjusted as needed, allowing the system to scale with organizational requirements.

** Technical Architecture**

Sphere-D follows a modern client-server architecture, ensuring flexibility, maintainability, and scalability.

Frontend

Framework: React.js

Routing: React Router for secure and role-based navigation

API Communication: Axios with interceptors to automatically attach authentication tokens

Purpose: Provides an intuitive and responsive user interface for all roles

Backend

Framework: Spring Boot 3.x

Security: Spring Security with JWT-based authentication

Persistence: Spring Data JPA with Hibernate ORM

Exception Handling: Global exception handler for consistent and clear API responses

Purpose: Handles business logic, security, and database interactions

** Setup and Installation**
Prerequisites

Make sure the following are installed:

Java JDK 17 or higher

Node.js (v16 or higher) and npm

Maven

MySQL or PostgreSQL database

1. Backend Setup

Navigate to the backend directory:

cd sphered

Configure your database connection in:

src/main/resources/application.properties

Start the backend server:

mvn spring-boot:run

The backend will run at:

http://localhost:8080
2. Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the frontend application:

npm start

The frontend will run at:

http://localhost:3000

** Core Workflows**

Employee Workflow

Book a Workspace Seat
Employees can select a date and reserve an available seat.

Request Hardware Assets
Once a seat is booked, employees can request assets such as laptops or monitors.

Manage Assigned Assets
Users can view their assigned hardware and report issues if any asset becomes faulty.

IT Staff Workflow

Monitor Request Queue
IT staff can view all incoming asset requests waiting for approval.

Approve and Assign Assets
Once approved, assets are assigned to users and tracked within the system.

Administrator Workflow

Manage Users and Roles
Administrators can create and manage system users and assign appropriate roles.

Configure Inventory and Workspace
Admins can add new hardware assets and configure seating capacity.

** Security**

Sphere-D uses a secure Role-Based Access Control (RBAC) system to protect resources and enforce permissions.

Public Endpoints

Login

Registration

Protected Endpoints

All booking, asset, and administrative operations require authentication.

Authentication Method

JWT (JSON Web Tokens) are used for secure, stateless authentication.

Password Security

All passwords are encrypted using BCrypt before being stored in the database.
