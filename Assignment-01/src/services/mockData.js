/**
 * Mock initial data for FUNewsManagementSystem
 * Entities:
 * - Categories: id, name, description, status (1: Active, 0: Inactive)
 * - News Articles: id, title, content, categoryId, createdBy, createdAt, status (1: Active, 0: Inactive), tags
 * - Accounts/Users: id, username, password, fullName, email, role (1: Admin, 2: Staff), status (1: Active, 0: Inactive)
 */

export const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Campus Technology & AI",
    description: "Cutting-edge tech, artificial intelligence initiatives, and modern computing labs at FPT University.",
    status: 1
  },
  {
    id: 2,
    name: "Academic Highlights",
    description: "Updates on curricula, degree accreditations, international exchange semesters, and scholarships.",
    status: 1
  },
  {
    id: 3,
    name: "Student Life & Events",
    description: "Club activities, campus fests, cultural nights, and student community engagements.",
    status: 1
  },
  {
    id: 4,
    name: "Sports & Esports",
    description: "Varsity tournament results, football cups, chess competitions, and gaming leagues.",
    status: 1
  },
  {
    id: 5,
    name: "Career & Enterprise Partnerships",
    description: "On-the-job training (OJT) opportunities, enterprise day visits, and corporate hiring fairs.",
    status: 0
  }
];

export const INITIAL_NEWS = [
  {
    id: 1,
    title: "FPT University Unveils New High-Performance AI Research Lab",
    content: "The cutting-edge lab offers students hands-on access to GPU clusters and deep learning frameworks for building real-world computer vision and natural language processing solutions.",
    categoryId: 1,
    createdBy: "Admin",
    createdAt: "2026-10-01",
    status: 1,
    tags: "AI, Hardware, Innovation, Tech"
  },
  {
    id: 2,
    title: "Global Student Exchange Program Opens Applications for Spring Semester",
    content: "Undergraduate students in Software Engineering and Business Administration can now apply for study-abroad terms with partner universities in Japan, South Korea, and Germany.",
    categoryId: 2,
    createdBy: "LamHoangKhang",
    createdAt: "2026-10-04",
    status: 1,
    tags: "Academic, Global, Scholarship"
  },
  {
    id: 3,
    title: "Annual Campus TechFest 2026 Draws Over 2,000 Student Innovators",
    content: "The three-day hackathon and exhibition showcased innovative student projects ranging from smart IoT campus assistants to automated green energy monitoring gadgets.",
    categoryId: 3,
    createdBy: "Staff",
    createdAt: "2026-10-06",
    status: 1,
    tags: "Event, Hackathon, Campus"
  },
  {
    id: 4,
    title: "FPT Varsity Football Team Triumphs in Regional Collegiate Tournament",
    content: "A thrilling 3-2 comeback victory in the finals secures the regional collegiate trophy for the second consecutive year.",
    categoryId: 4,
    createdBy: "Admin",
    createdAt: "2026-10-08",
    status: 1,
    tags: "Sports, Championship, Victory"
  },
  {
    id: 5,
    title: "Top Tier IT Enterprises Sign Strategic Training & Hiring Agreement",
    content: "Leading software development firms commit to providing over 300 guaranteed OJT internship positions for junior and senior engineering students this semester.",
    categoryId: 5,
    createdBy: "Admin",
    createdAt: "2026-10-09",
    status: 1,
    tags: "Career, Internship, Enterprise"
  },
  {
    id: 6,
    title: "Workshop: Building Secure Full-Stack Web Services with React & Spring Boot",
    content: "A dedicated weekend technical workshop exploring best practices in React 19 architecture, RESTful endpoints design, and defensive security measures.",
    categoryId: 1,
    createdBy: "LamHoangKhang",
    createdAt: "2026-10-10",
    status: 0,
    tags: "Workshop, React, SpringBoot, Web"
  }
];

export const INITIAL_USERS = [
  {
    id: 1,
    username: "Admin",
    password: "Admin",
    fullName: "Lam Hoang Khang (Administrator)",
    email: "admin.funews@fpt.edu.vn",
    role: 1, // 1: Admin
    status: 1 // 1: Active
  },
  {
    id: 2,
    username: "staff01",
    password: "Password123",
    fullName: "Nguyen Van A",
    email: "nguyenvana.staff@fpt.edu.vn",
    role: 2, // 2: Staff
    status: 1
  },
  {
    id: 3,
    username: "editor02",
    password: "Password123",
    fullName: "Tran Thi B",
    email: "tranthib.editor@fpt.edu.vn",
    role: 2, // 2: Staff
    status: 1
  },
  {
    id: 4,
    username: "intern_demo",
    password: "Password123",
    fullName: "Le Van C",
    email: "levanc.intern@fpt.edu.vn",
    role: 2, // 2: Staff
    status: 0 // Inactive
  }
];
