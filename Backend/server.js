const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'final project',
  port:3306
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

app.get('/api/student/attendance/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  const query = `
      SELECT 
          sub.id AS subject_id,
          sub.name AS subject_name,
          COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) AS present_count,
          COUNT(*) AS total_classes,
          (COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) / COUNT(*)) * 100 AS attendance_percentage
      FROM attendance_records ar
      JOIN subjects sub ON ar.subject_id = sub.id
      WHERE ar.student_id = ?
      GROUP BY sub.id, sub.name
  `;

  db.query(query, [studentId], (err, results) => {
      if (err) {
          return res.status(500).json({ error: "Database error", details: err });
      }

      const totalPresent = results.reduce((sum, row) => sum + row.present_count, 0);
      const totalClasses = results.reduce((sum, row) => sum + row.total_classes, 0);
      const totalAttendancePercentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;

      res.json({ subjects: results, totalAttendancePercentage });
  });
});


// Fetch Schools
app.get('/api/schools', (req, res) => {
  db.query('SELECT * FROM schools', (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Fetch Departments for a school
app.get('/api/departments/:schoolId', (req, res) => {
  const schoolId = req.params.schoolId;
  db.query('SELECT * FROM departments WHERE school_id = ?', [schoolId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Fetch Programs for a department
app.get('/api/programs/:departmentId', (req, res) => {
  const departmentId = req.params.departmentId;
  db.query('SELECT * FROM programs WHERE department_id = ?', [departmentId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Fetch Semesters for a program
app.get('/api/semesters/:programId', (req, res) => {
  const programId = req.params.programId;
  db.query('SELECT * FROM semesters WHERE program_id = ?', [programId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Fetch Subjects for a semester
app.get('/api/subjects/:semesterId', (req, res) => {
  const semesterId = req.params.semesterId;
  db.query('SELECT * FROM subjects WHERE semester_id = ?', [semesterId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Fetch Teachers
app.get('/api/teachers', (req, res) => {
  db.query('SELECT * FROM teachers', (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});


// Fetch Students for a specific semester and program
app.get('/api/students', (req, res) => {
  const { programId, semesterId } = req.query;
  
  if (!programId || !semesterId) {
    return res.status(400).json({ message: 'Program ID and Semester ID are required' });
  }

  const query = `
    SELECT id, name, registration_number 
    FROM students 
    WHERE program_id = ? AND semester_id = ?
  `;

  db.query(query, [programId, semesterId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


app.get("/api/attendance/unique-dates/:subjectId", (req, res) => {
  const subjectId = req.params.subjectId;

  const query = `
    SELECT COUNT(DISTINCT date) AS unique_dates_count
    FROM attendance_records
    WHERE subject_id = ?
  `;

  db.query(query, [subjectId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    const count = results[0]?.unique_dates_count || 0;
    res.json({ unique_dates_count: count });
  });
});



// Route requests to Python AI service
app.post("/api/ai", async (req, res) => {
  const { question } = req.body;

  try {
    // Add metadata about the available data
    const enhancedQuestion = question;
    const aiRes = await axios.post("http://localhost:5000/api/attendance/analyze", {
      text: enhancedQuestion,
    });
    res.json({ answer: aiRes.data.answer });
  } catch (error) {
    console.error("Error communicating with AI service:", error.message);
    res
      .status(500)
      .json({ answer: "Error from AI service. Please try again later." });
  }
});

// Handle direct attendance queries
app.post('/api/attendance/save', (req, res) => {
  const question = req.body.question;

  // Extract registration number from question
  const regMatch = question.match(
    /(?:registration\s*(?:number|no|#)?\s*|reg\s*(?:number|no|#)?\s*|student\s*)?([0-9]{8,12})/i
  );

  // Also try to extract roll number for backward compatibility
  const rollMatch = question.match(
    /(?:roll\s*number\s*|roll\s*|student\s*id\s*|id\s*)?(\d{2,5})/i
  );

  let registrationNumber = null;
  let useRollNumber = false;
  
  if (regMatch) {
    registrationNumber = regMatch[1];
  } else if (rollMatch) {
    // We'll use roll number to find registration number
    useRollNumber = true;
    const rollNumber = rollMatch[1];
    
    // First look up the registration number from the roll number
    db.query(
      "SELECT registration_number FROM students WHERE id = ?",
      [rollNumber],
      (err, rollResult) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ answer: "Database error. Please try again later." });
        }
        
        if (rollResult.length === 0) {
          return res.json({
            answer: `No student found with roll number ${rollNumber}.`,
          });
        }
        
        // Use the found registration number
        registrationNumber = rollResult[0].registration_number;
        processRegistrationNumber(registrationNumber);
      }
    );
  } else {
    return res.json({
      answer:
        "Sorry, I couldn't understand the registration number. Please specify like 'registration number 210310007054'.",
    });
  }
  
  // Only proceed if we're using registration number directly
  if (!useRollNumber && registrationNumber) {
    processRegistrationNumber(registrationNumber);
  }
  
  // Process the query with registration number
  function processRegistrationNumber(regNum) {
    // Get student details first using registration number
    db.query(
      "SELECT id, name, registration_number FROM students WHERE registration_number = ?",
      [regNum],
      (err, studentResult) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ answer: "Database error. Please try again later." });
        }

        if (studentResult.length === 0) {
          return res.json({
            answer: `No student found with registration number ${regNum}.`,
          });
        }

        const student = studentResult[0];
        const studentId = student.id;

        // Now get attendance data using the student ID from the previous query
        db.query(
          `SELECT 
            COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_days,
            COUNT(*) AS total_days
          FROM attendance_records 
          WHERE student_id = ?`,
          [studentId],
          (err, attendanceResult) => {
            if (err) {
              console.error("Database error:", err);
              return res
                .status(500)
                .json({ answer: "Database error. Please try again later." });
            }

            const attendance = attendanceResult[0];
            let attendancePercentage = 0;

            if (attendance.total_days > 0) {
              attendancePercentage =
                (attendance.present_days / attendance.total_days) * 100;
            }

            // Get subject-wise breakdown
            db.query(
              `SELECT 
                s.name AS subject_name,
                COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) AS present_days,
                COUNT(ar.id) AS total_days
              FROM attendance_records ar
              JOIN subjects s ON ar.subject_id = s.id
              WHERE ar.student_id = ?
              GROUP BY s.name
              ORDER BY 
                (COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) * 1.0) / COUNT(ar.id) DESC`,
              [studentId],
              (err, subjectsResult) => {
                if (err) {
                  console.error("Database error:", err);
                  return res
                    .status(500)
                    .json({ answer: "Database error. Please try again later." });
                }

                // Format a comprehensive answer
                let answer = `${student.name} (Registration #${regNum}) has attended ${
                  attendance.present_days
                } out of ${
                  attendance.total_days
                } classes (${attendancePercentage.toFixed(2)}%).`;

                // Add subject data if available
                if (subjectsResult.length > 0) {
                  const bestSubject = subjectsResult[0];
                  const worstSubject = subjectsResult[subjectsResult.length - 1];

                  if (subjectsResult.length > 1) {
                    answer += ` Best attendance is in ${bestSubject.subject_name} and needs improvement in ${worstSubject.subject_name}.`;
                  }
                }

                res.json({ answer: answer });
              }
            );
          }
        );
      }
    );
  }
});

// Get general attendance statistics
app.post("/api/attendance/stats", (req, res) => {
  db.query(
    `SELECT 
      students.id, 
      students.name,
      students.registration_number,
      COUNT(CASE WHEN attendance_records.status = 'Present' THEN 1 END) AS present_count,
      COUNT(attendance_records.id) AS total_classes,
      ROUND(COUNT(CASE WHEN attendance_records.status = 'Present' THEN 1 END) * 100.0 / COUNT(attendance_records.id), 2) AS attendance_percentage
    FROM students
    JOIN attendance_records ON students.id = attendance_records.student_id
    GROUP BY students.id, students.name, students.registration_number
    ORDER BY attendance_percentage ASC
    LIMIT 5`,
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ answer: "Database error. Please try again later." });
      }

      if (result.length === 0) {
        return res.json({ answer: "No attendance data available." });
      }

      const lowestAttendance = result[0];
      res.json({
        answer: `Student with registration number ${lowestAttendance.registration_number} (${lowestAttendance.name}) has the lowest attendance at ${lowestAttendance.attendance_percentage}%.`,
      });
    }
  );
});

// Teacher registration endpoint
app.post('/api/teacher/register', async (req, res) => {
  try {
    const { teacherId, password, name } = req.body;
    
    // Validate input
    if (!teacherId || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if teacher already exists
    db.query(
      'SELECT * FROM teachers WHERE id = ? OR name = ?',
      [teacherId, teacherId],
      async (err, existingTeachers) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (existingTeachers.length > 0) {
          return res.status(409).json({ message: 'Teacher already exists' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert the new teacher
        // If teacherId is numeric, use it as id, otherwise create a new id and use teacherId as name
        if (!isNaN(teacherId)) {
          db.query(
            'INSERT INTO teachers (id, name, password) VALUES (?, ?, ?)',
            [teacherId, name, hashedPassword],
            (err, result) => {
              if (err) {
                console.error('Error inserting teacher:', err);
                return res.status(500).json({ message: 'Internal server error' });
              }
              
              // Get the inserted teacher
              db.query(
                'SELECT * FROM teachers WHERE id = ?',
                [teacherId],
                (err, newTeacher) => {
                  if (err) {
                    console.error('Error getting new teacher:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                  }
                  
                  // Generate JWT token
                  const token = jwt.sign(
                    { id: newTeacher[0].id, role: 'teacher' },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                  );
                  
                  res.status(201).json({ 
                    message: 'Teacher registered successfully',
                    token,
                    teacherId: newTeacher[0].id
                  });
                }
              );
            }
          );
        } else {
          // Add password column to teachers table and use name as identifier
          db.query(
            'INSERT INTO teachers (name, password) VALUES (?, ?)',
            [name, hashedPassword],
            (err, result) => {
              if (err) {
                console.error('Error inserting teacher:', err);
                return res.status(500).json({ message: 'Internal server error' });
              }
              
              // Get the inserted teacher
              db.query(
                'SELECT * FROM teachers WHERE name = ?',
                [name],
                (err, newTeacher) => {
                  if (err) {
                    console.error('Error getting new teacher:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                  }
                  
                  // Generate JWT token
                  const token = jwt.sign(
                    { id: newTeacher[0].id, role: 'teacher' },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                  );
                  
                  res.status(201).json({ 
                    message: 'Teacher registered successfully',
                    token,
                    teacherId: newTeacher[0].id
                  });
                }
              );
            }
          );
        }
      }
    );
  } catch (error) {
    console.error('Error registering teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Teacher login endpoint
app.post('/api/teacher/login', async (req, res) => {
  try {
    const { teacherId, password } = req.body;
    
    // Validate input
    if (!teacherId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find teacher by id or name
    db.query(
      'SELECT * FROM teachers WHERE id = ? OR name = ?',
      [teacherId, teacherId],
      async (err, teachers) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (teachers.length === 0) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const teacher = teachers[0];
        
        // Check if the password column exists, if not, handle legacy accounts
        if (!teacher.password) {
          return res.status(401).json({ 
            message: 'Please reset your password or register a new account' 
          });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, teacher.password);
        
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { id: teacher.id, role: 'teacher' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.json({ 
          message: 'Login successful',
          token,
          teacherId: teacher.id
        });
      }
    );
  } catch (error) {
    console.error('Error logging in teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// JWT token verification middleware for teachers
const verifyTeacherToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if the decoded token is for a teacher
    if (decoded.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: Not authorized as a teacher' });
    }
    
    req.teacher = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

// Protected route for teacher profile
app.get('/api/teacher/profile', verifyTeacherToken, (req, res) => {
  try {
    db.query(
      'SELECT id, name FROM teachers WHERE id = ?',
      [req.teacher.id],
      (err, teachers) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (teachers.length === 0) {
          return res.status(404).json({ message: 'Teacher not found' });
        }
        
        res.json(teachers[0]);
      }
    );
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Add these endpoints to your backend server.js or index.js file

const JWT_SECRET = 'your_secret_key_change_this_in_production';

// Admin Registration
app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin already exists
    db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert admin
      db.query(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Registration failed' });
          }
          
          // Generate JWT
          const token = jwt.sign(
            { id: result.insertId, username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '30d' }
          );
          
          res.status(201).json({ 
            message: 'Admin registered successfully',
            token
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find admin
    db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const admin = results[0];
      
      // Compare password
      const isMatch = await bcrypt.compare(password, admin.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      res.json({ 
        message: 'Login successful',
        token
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Student Registration
app.post('/api/student/register', async (req, res) => {
  try {
    const { registrationNumber, password, name, programId, semesterId } = req.body;
    
    // Check if student already exists
    db.query(
      'SELECT * FROM students WHERE registration_number = ?', 
      [registrationNumber], 
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length > 0) {
          return res.status(400).json({ message: 'Registration number already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert student
        db.query(
          'INSERT INTO students (name, program_id, semester_id, registration_number, password) VALUES (?, ?, ?, ?, ?)',
          [name, programId, semesterId, registrationNumber, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: 'Registration failed', error: err.message });
            }
            
            // Generate JWT
            const token = jwt.sign(
              { id: result.insertId, registrationNumber, role: 'student' },
              JWT_SECRET,
              { expiresIn: '30d' }
            );
            
            res.status(201).json({ 
              message: 'Student registered successfully',
              token,
              studentId: result.insertId
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Student Login
app.post('/api/student/login', async (req, res) => {
  try {
    const { registrationNumber, password } = req.body;
    
    // Find student
    db.query(
      'SELECT * FROM students WHERE registration_number = ?', 
      [registrationNumber], 
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const student = results[0];
        
        // Check if password exists (migrate old accounts)
        if (!student.password) {
          return res.status(401).json({ message: 'Please register first' });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, student.password);
        
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT
        const token = jwt.sign(
          { id: student.id, registrationNumber, role: 'student' },
          JWT_SECRET,
          { expiresIn: '30d' }
        );
        
        res.json({ 
          message: 'Login successful',
          token,
          studentId: student.id
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

// Get all programs (for student registration)
app.get('/api/programs', (req, res) => {
  db.query('SELECT * FROM programs', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Add a new student
app.post('/api/students', (req, res) => {
  const { name, registration_number, program_id, semester_id } = req.body;
  
  if (!name || !registration_number || !program_id || !semester_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const query = `
    INSERT INTO students (name, registration_number, program_id, semester_id) 
    VALUES (?, ?, ?, ?)
  `;
  
  db.query(query, [name, registration_number, program_id, semester_id], (error, results) => {
    if (error) {
      console.error('Error adding student:', error);
      return res.status(500).json({ error: 'Failed to add student' });
    }
    
    res.status(201).json({ 
      id: results.insertId,
      message: 'Student added successfully' 
    });
  });
});

// Get attendance records for a specific subject and date
app.get('/api/attendance/:subject_id/:date', (req, res) => {
  const { subject_id, date } = req.params;
  
  const query = `
    SELECT ar.id, ar.status, s.name as student_name, s.registration_number
    FROM attendance_records ar
    JOIN students s ON ar.student_id = s.id
    WHERE ar.subject_id = ? AND ar.date = ?
  `;
  
  db.query(query, [subject_id, date], (error, results) => {
    if (error) {
      console.error('Error fetching attendance records:', error);
      return res.status(500).json({ error: 'Failed to fetch attendance records' });
    }
    
    res.json(results);
  });
});



// Save Attendance Records
app.post('/api/attendance', (req, res) => {
  const { 
    semesterId, 
    subjectId, 
    attendanceRecords, 
    date 
  } = req.body;

  if (!semesterId || !subjectId || !attendanceRecords || !date) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  // Prepare batch insert for attendance records
  const attendanceEntries = attendanceRecords.map(record => [
    record.studentId, 
    subjectId, 
    date, 
    record.status
  ]);

  const query = `
    INSERT INTO attendance_records 
    (student_id, subject_id, date, status) 
    VALUES ?
  `;

  db.query(query, [attendanceEntries], (err, result) => {
    if (err) {
      console.error('Attendance save error:', err);
      return res.status(500).json({ 
        message: 'Error saving attendance', 
        error: err.message 
      });
    }

    res.json({ 
      message: 'Attendance saved successfully', 
      recordsSaved: result.affectedRows 
    });
  });
});

app.get('/api/admin/attendance', (req, res) => {
  const { schoolId, departmentId, programId, semesterId } = req.query;

  if (!schoolId || !departmentId || !programId || !semesterId) {
    return res.status(400).json({ message: "All filters are required" });
  }

  const query = `
      SELECT 
          s.id AS student_id,
          s.name AS student_name,
          s.registration_number,
          sub.id AS subject_id,
          sub.name AS subject_name,
          COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) AS present_count,
          COUNT(*) AS total_classes,
          (COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) / COUNT(*)) * 100 AS attendance_percentage
      FROM attendance_records ar
      JOIN students s ON ar.student_id = s.id
      JOIN subjects sub ON ar.subject_id = sub.id
      JOIN programs p ON s.program_id = p.id
      JOIN departments d ON p.department_id = d.id
      JOIN schools sch ON d.school_id = sch.id
      WHERE sch.id = ? AND d.id = ? AND p.id = ? AND s.semester_id = ?
      GROUP BY s.id, s.name, s.registration_number, sub.id, sub.name
  `;

  db.query(query, [schoolId, departmentId, programId, semesterId], (err, results) => {
      if (err) {
          return res.status(500).json({ error: "Database error", details: err });
      }

      const studentData = {};
      results.forEach(row => {
          if (!studentData[row.student_id]) {
              studentData[row.student_id] = {
                  student_name: row.student_name,
                  registration_number: row.registration_number,
                  subjects: [],
                  totalPresent: 0,
                  totalClasses: 0
              };
          }
          studentData[row.student_id].subjects.push({
              subject_id: row.subject_id,
              subject_name: row.subject_name,
              present_count: row.present_count,
              total_classes: row.total_classes,
              attendance_percentage: row.attendance_percentage
          });

          studentData[row.student_id].totalPresent += row.present_count;
          studentData[row.student_id].totalClasses += row.total_classes;
      });

      const response = Object.values(studentData).map(student => ({
          ...student,
          totalAttendancePercentage: student.totalClasses > 0 
              ? (student.totalPresent / student.totalClasses) * 100 
              : 0
      }));

      res.json(response);
  });
});



// Assignment Routes
app.post('/api/assignments', (req, res) => {
  const { semesterId, subjectId, title, description, dueDate } = req.body;
  
  const query = `
    INSERT INTO assignments 
    (semester_id, subject_id, title, description, due_date) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(query, [semesterId, subjectId, title, description, dueDate], 
    (err, result) => {
      if (err) {
        console.error('Error creating assignment:', err);
        return res.status(500).json({ error: 'Failed to create assignment' });
      }
      res.status(201).json({ 
        message: 'Assignment created successfully', 
        assignmentId: result.insertId 
      });
    }
  );
});

// Get Assignments for a Subject
app.get('/api/assignments/:subjectId', (req, res) => {
  const query = `
    SELECT id, title, description, due_date 
    FROM assignments 
    WHERE subject_id = ?
  `;
  
  db.query(query, [req.params.subjectId], (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      return res.status(500).json({ error: 'Failed to fetch assignments' });
    }
    res.json(results);
  });
});

// Student Assignment Submission
// Update your API endpoint for submitting assignments
app.post('/api/student-assignments', upload.single('assignmentFile'), (req, res) => {
  const { assignmentId, registrationNumber } = req.body;
  const filePath = req.file.filename;

  // First find the student by registration number
  db.query(
    'SELECT id FROM students WHERE registration_number = ?',
    [registrationNumber],
    (err, studentResults) => {
      if (err) {
        console.error("Error finding student:", err);
        return res.status(500).json({ error: "Failed to submit assignment" });
      }

      if (studentResults.length === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      const studentId = studentResults[0].id;

      // Now insert the assignment submission
      db.query(
        'INSERT INTO student_assignments (assignment_id, student_id, file_path) VALUES (?, ?, ?)',
        [assignmentId, studentId, filePath],
        (err, results) => {
          if (err) {
            console.error("Error submitting assignment:", err);
            return res.status(500).json({ error: "Failed to submit assignment" });
          }
          
          return res.json({ message: "Assignment submitted successfully" });
        }
      );
    }
  );
});


// Submit Grades Route
app.post('/api/submit-grades', (req, res) => {
  const { grades } = req.body;

  // Use a transaction to ensure all grades are updated
  const updateGradeQuery = `
    UPDATE student_assignments 
    SET grade = ?, status = 'Graded', graded_at = NOW() 
    WHERE id = ?
  `;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) { 
      return res.status(500).json({ error: 'Transaction failed' }); 
    }

    // Create an array of promises for grade updates
    const gradePromises = grades.map(gradeInfo => 
      new Promise((resolve, reject) => {
        db.query(
          updateGradeQuery, 
          [gradeInfo.grade, gradeInfo.assignmentId], 
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      })
    );

    // Execute all grade updates
    Promise.all(gradePromises)
      .then(() => {
        // Commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: 'Failed to commit grades' });
            });
          }
          res.json({ message: 'Grades submitted successfully' });
        });
      })
      .catch((err) => {
        // Rollback the transaction on error
        return db.rollback(() => {
          console.error('Error submitting grades:', err);
          res.status(500).json({ error: 'Failed to submit grades' });
        });
      });
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Updated server.js - Add a new endpoint for conflict resolution
app.post('/api/resolve-conflicts', async (req, res) => {
  const {
    departmentId, 
    programId, 
    semesterNumber, 
    conflicts
  } = req.body;

  try {
    // Function to find alternative subjects for a conflicting slot
    const findAlternativeSubject = (subject, usedSubjects) => {
      // Get all subjects from the current department and program
      const query = `
        SELECT DISTINCT s.name FROM subjects s
        JOIN semesters sem ON s.semester_id = sem.id
        WHERE sem.program_id = ? AND s.name NOT IN (?)
      `;
      
      return new Promise((resolve, reject) => {
        db.query(query, [programId, usedSubjects], (err, results) => {
          if (err) {
            console.error('Error finding alternative subjects:', err);
            reject(err);
          }
          
          // Randomly select an alternative subject if available
          if (results && results.length > 0) {
            const alternatives = results.map(r => r.name);
            resolve(alternatives[Math.floor(Math.random() * alternatives.length)]);
          } else {
            resolve(null);
          }
        });
      });
    };

    // Resolve conflicts
    const resolvedConflicts = [];
    for (let conflict of conflicts) {
      const usedSubjects = [conflict.subject];
      
      // Try to find an alternative subject for the conflicting slot
      const alternativeSubject = await findAlternativeSubject(
        conflict.subject, 
        usedSubjects
      );

      if (alternativeSubject) {
        resolvedConflicts.push({
          original: conflict.subject,
          replacement: alternativeSubject,
          day: conflict.day,
          timeSlot: conflict.timeSlot
        });
      } else {
        console.error(`No alternative found for subject: ${conflict.subject}`);
      }
    }

    if (resolvedConflicts.length > 0) {
      res.json({
        message: 'Conflicts resolved',
        resolvedConflicts
      });
    } else {
      res.status(400).json({ 
        message: 'No conflicts could be resolved', 
        conflicts 
      });
    }
  } catch (error) {
    console.error('Conflict resolution error:', error);
    res.status(500).json({ 
      message: 'Error resolving conflicts', 
      error: error.message 
    });
  }
});

// Save timetable
// Save timetable with advanced conflict checking
app.post('/api/save-timetable', async (req, res) => {
  const {
    session,
    schoolId,
    departmentId,
    programId,
    semesterId,
    timetableData,
    teacherAssignments,
    semesterNumber
  } = req.body;

  // Add more robust input validation
  if (!session || !schoolId || !departmentId || !programId || !semesterId || !timetableData) {
    return res.status(400).json({ 
      message: 'Missing required parameters',
      details: {
        session: !!session,
        schoolId: !!schoolId,
        departmentId: !!departmentId,
        programId: !!programId,
        semesterId: !!semesterId,
        timetableData: !!timetableData
      }
    });
  }

  try {
    // Determine the semesters to check based on the current semester
    const semestersToCheck = determineSemestersToCheck(semesterNumber);

    // Check for conflicts in existing timetables
    const conflicts = await checkTimetableConflicts(
      departmentId, 
      programId, 
      semestersToCheck, 
      timetableData, 
      teacherAssignments
    );

    // If conflicts exist, return them
    if (conflicts.length > 0) {
      return res.status(400).json({ 
        message: 'Timetable conflicts detected', 
        conflicts 
      });
    }

    // Start a database transaction for better error handling
    db.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction start error:', err);
        return res.status(500).json({ message: 'Database transaction error' });
      }

      try {
        // Insert into saved_timetables
        const timetableSaveResult = await new Promise((resolve, reject) => {
          db.query(
            'INSERT INTO saved_timetables (session, school_id, department_id, program_id, semester_id) VALUES (?, ?, ?, ?, ?)',
            [session, schoolId, departmentId, programId, semesterId],
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        });

        const timetableId = timetableSaveResult.insertId;

        // Prepare timetable entries
        const entries = [];
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const timeSlots = [
          "8:45-9:45", "9:45-10:45", "10:45-11:45", "11:45-12:45", 
          "12:00-1:45", "1:45-2:45", "2:45-3:45"
        ];

        timetableData.forEach((dayData, dayIndex) => {
          dayData.forEach((subject, slotIndex) => {
            if (subject && subject !== "Lunch Break") {
              entries.push([
                timetableId,
                days[dayIndex],
                timeSlots[slotIndex],
                subject,
                teacherAssignments[subject] || '',
                semesterNumber
              ]);
            }
          });
        });

        // Insert timetable entries
        if (entries.length > 0) {
          await new Promise((resolve, reject) => {
            const query = 'INSERT INTO timetable_entries (timetable_id, day, time_slot, subject, teacher, semester_number) VALUES ?';
            db.query(query, [entries], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }

        // Commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Commit error:', err);
              res.status(500).json({ message: 'Error committing transaction' });
            });
          }
          res.json({ 
            message: 'Timetable saved successfully', 
            timetableId 
          });
        });

      } catch (insertError) {
        // Rollback the transaction on error
        return db.rollback(() => {
          console.error('Insertion error:', insertError);
          res.status(500).json({ 
            message: 'Error saving timetable', 
            error: insertError.message 
          });
        });
      }
    });

  } catch (error) {
    console.error('Timetable save error:', error);
    res.status(500).json({ 
      message: 'Error checking timetable conflicts', 
      error: error.message 
    });
  }
});

// Helper function to determine semesters to check based on current semester
function determineSemestersToCheck(currentSemester) {
  const semesterNum = parseInt(currentSemester);
  
  // For odd semesters (1, 3, 5, 7)
  if (semesterNum % 2 !== 0) {
    return [3, 5, 7].filter(sem => sem !== semesterNum);
  }
  
  // For even semesters (2, 4, 6, 8)
  return [2, 4, 6, 8].filter(sem => sem !== semesterNum);
}

// Function to check timetable conflicts
function checkTimetableConflicts(departmentId, programId, semestersToCheck, newTimetable, teacherAssignments) {
  return new Promise((resolve, reject) => {
    // Prepare the days and time slots
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = [
      "8:45-9:45", "9:45-10:45", "10:45-11:45", "11:45-12:45", 
      "12:00-1:45", "1:45-2:45", "2:45-3:45"
    ];

    // Collect all potential conflicts
    const conflicts = [];

    // Iterate through the new timetable
    newTimetable.forEach((daySchedule, dayIndex) => {
      daySchedule.forEach((subject, slotIndex) => {
        // Skip lunch break and empty slots
        if (!subject || subject === "Lunch Break") return;

        // Get the teacher for this subject
        const teacher = teacherAssignments[subject];
        if (!teacher) return;

        // Prepare the query to check conflicts
        const query = `
          SELECT * FROM timetable_entries te
          JOIN saved_timetables st ON te.timetable_id = st.id
          WHERE 
            st.department_id = ? AND 
            st.program_id = ? AND 
            te.day = ? AND 
            te.time_slot = ? AND 
            (te.teacher = ? OR te.subject = ?) AND 
            te.semester_number IN (?)
        `;

        db.query(
          query, 
          [
            departmentId, 
            programId, 
            days[dayIndex], 
            timeSlots[slotIndex], 
            teacher, 
            subject, 
            semestersToCheck
          ], 
          (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            if (results.length > 0) {
              conflicts.push({
                day: days[dayIndex],
                timeSlot: timeSlots[slotIndex],
                subject: subject,
                teacher: teacher,
                conflictingEntries: results
              });
            }

            // If this is the last check, resolve the promise
            if (dayIndex === newTimetable.length - 1 && 
                slotIndex === daySchedule.length - 1) {
              resolve(conflicts);
            }
          }
        );
      });
    });
  });
}

//display assignments

// In your backend server file (likely server.js or index.js)

// Add this API endpoint
app.get('/api/assignment-submissions/:assignmentId', (req, res) => {
  const assignmentId = req.params.assignmentId;
  
  const query = `
    SELECT sa.id, sa.file_path, sa.status, sa.submitted_at, 
           s.name as student_name, s.registration_number
    FROM student_assignments sa
    JOIN students s ON sa.student_id = s.id
    WHERE sa.assignment_id = ?
  `;
  
  db.query(query, [assignmentId], (err, results) => {
    if (err) {
      console.error("Error fetching assignment submissions:", err);
      return res.status(500).json({ error: "Failed to fetch submissions" });
    }
    
    return res.json(results);
  });
});

// Get saved timetable
app.get('/api/timetables/:semesterId', (req, res) => {
  const semesterId = req.params.semesterId;
  db.query(
      'SELECT * FROM saved_timetables WHERE semester_id = ? ORDER BY created_at DESC',
      [semesterId],
      (err, timetables) => {
          if (err) {
              return res.status(500).send(err);
          }
          res.json(timetables);
      }
  );
});

// Get timetable details
app.get('/api/timetable/:timetableId', (req, res) => {
  const timetableId = req.params.timetableId;
  db.query(
      'SELECT * FROM timetable_entries WHERE timetable_id = ?',
      [timetableId],
      (err, entries) => {
          if (err) {
              return res.status(500).send(err);
          }
          res.json(entries);
      }
  );
});

//Total_class
app.get('/api/subjects', (req, res) => {
  const sql = 'SELECT * FROM subjects';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching subjects:', err);
      res.status(500).send('Error fetching subjects');
    } else {
      res.json(results);
    }
  });
});

app.put('/api/subjects/:id', (req, res) => {
  const { id } = req.params;
  const { total_classes } = req.body;

  const sql = 'UPDATE subjects SET total_classes = ? WHERE id = ?';
  db.query(sql, [total_classes, id], (err, result) => {
    if (err) {
      console.error('Error updating total classes:', err);
      res.status(500).send('Error updating total classes');
    } else {
      res.send('Total classes updated successfully');
    }
  });
});



// Add Subject
app.post('/api/subjects', (req, res) => {
  const { semesterId, name } = req.body;

  if (!semesterId || !name) {
    return res.status(400).json({ message: 'Semester ID and subject name are required.' });
  }

  db.query(
    'INSERT INTO subjects (semester_id, name) VALUES (?, ?)',
    [semesterId, name],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ 
        message: 'Subject added successfully', 
        subject: { id: result.insertId, name } // Send back the newly added subject
      });
    }
  );
});


// Delete Subject
app.delete('/api/subjects/:subjectId', (req, res) => {
  const subjectId = req.params.subjectId;
  
  db.query('DELETE FROM subjects WHERE id = ?', [subjectId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  });
});


app.listen(3001, () => {
  console.log('Server is running on port 3001');
});


// Add Teacher
app.post('/api/teachers', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Teacher name is required.' });
  }

  db.query(
    'INSERT INTO teachers (name) VALUES (?)',
    [name],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ 
        message: 'Teacher added successfully', 
        teacher: { id: result.insertId, name } 
      });
    }
  );
});

// Delete Teacher
app.delete('/api/teachers/:teacherId', (req, res) => {
  const teacherId = req.params.teacherId;
  
  db.query('DELETE FROM teachers WHERE id = ?', [teacherId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  });
});

// Modify Semesters route to include session filtering
app.get('/api/semesters/:programId', (req, res) => {
  const programId = req.params.programId;
  const { session } = req.query;

  let query = 'SELECT * FROM semesters WHERE program_id = ?';
  let queryParams = [programId];

  // Add session-based filtering
  if (session === 'Aug-Dec') {
    query += ' AND (name LIKE "1st" OR name LIKE "3rd" OR name LIKE "5th" OR name LIKE "7th")';
  } else if (session === 'Jan-Jul') {
    query += ' AND (name LIKE "2nd" OR name LIKE "4th" OR name LIKE "6th" OR name LIKE "8th")';
  }

  db.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});