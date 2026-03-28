# School Management Backend

## Features
- Node.js + Express + MongoDB (Mongoose)
- JWT Auth with Roles (admin, teacher, student, parent)
- Full MVC structure
- Role-based routes & ownership checks
- All required endpoints

## Setup
1. cd back end
2. Copy .env.example to .env (if exists) or edit .env:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/schoolmgmt
   JWT_SECRET=your-64-char-secret-key
   ```
   - Create free MongoDB Atlas cluster, get connection string
3. npm install (already done)
4. npm run dev (or npm start)

Server: http://localhost:5000

## API Docs

**Auth**
- POST /api/auth/register {name, email, password, role}
- POST /api/auth/login {email, password}

**Admin** (Bearer token)
- POST /api/admin/add-teacher {name,email,password,subject}
- GET /api/admin/users
- POST /api/blog {title,content,image}
- POST /api/gallery {imageUrl,caption}
- GET /api/admissions (admin)

**Teacher**
- POST /api/teacher/add-student {name,email,password,class,parentId}
- POST /api/teacher/marks {studentId,subject,marks}
- POST /api/teacher/attendance {studentId,date,status}

**Student/Parent**
- GET /api/marks/:studentId
- GET /api/attendance/:studentId

**Public**
- POST /api/admissions {studentName,class,parentName,phone,address}

## Test
Use Postman:
1. Register admin
2. Login, copy token
3. Add teacher etc.

Frontend CORS ready for localhost:3000 & your Netlify.

Enjoy!
