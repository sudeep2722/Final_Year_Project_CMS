import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import "../src/App.css";
import DashboardSidebar from "./components/DashboardSidebar"; 
import ChatBot from './components/ChatBot';

ChartJS.register(ArcElement, Tooltip, Legend);


// New components to add to App.js

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <div className=" main-home-page">
      <div className=" main-home-page-box">
        <div className=" main-home-page-left">
          <h1>Revolutionizing Schedules, One Class at a Time</h1>
          <p>
            We're revolutionizing the way you schedule your classes. With our
            automatic timetable generator, you can create, customize, and manage
            your timetable with just a few clicks. Join us in transforming the
            world of academic scheduling, one class at a time.
          </p>
          <p>
            We're revolutionizing the way you schedule your classes. With our
            automatic timetable generator, you can create, customize, and manage
            your timetable with just a few clicks. Join us in transforming the
            world of academic scheduling, one class at a time.
          </p>
          <button
            className="c-t-g double-border-button"
            onClick={() => navigate("/start")}
          >
            Start
          </button>
        </div>
        <div className="main-home-page-right">
          <img src="images\pexels-pixabay-256444.jpg" alt="" />
        </div>
      </div>
    </div>
  );
};

const StartPage = () => {
  const navigate = useNavigate();
  return (
    <div className="choose-page-main">
      <div className="choose-page-second">
          <h1>Choose Your Role</h1>
        <div className="choose-page-box">
          <div className="admin-coo-box">
            <img src="https://cdn-icons-png.flaticon.com/128/18570/18570983.png" alt="" />
            <button
            className="c-t-g-1"
            onClick={() => navigate("/admin")}
          >
            Admin
          </button>
          </div>
          <div className="teacher-coo-box">
            <img src="https://cdn-icons-png.flaticon.com/128/4832/4832469.png" alt="" />
            <button
            className="c-t-g-1"
            onClick={() => navigate("/teacher-login")}
          >
            Teacher
          </button>
          </div>
          <div className="student-coo-box">
            <img src="https://cdn-icons-png.flaticon.com/128/3135/3135810.png" alt="" />
            <button
            className="c-t-g-1 "
            onClick={() => navigate("/student-login")}
          >
            Student
          </button>
          </div>
          </div>
          </div>
    </div>
  );
};
const AdminPage = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    if (isRegistering) {
      // Register admin
      axios.post("http://localhost:3001/api/admin/register", { username, password })
        .then(response => {
          localStorage.setItem("adminToken", response.data.token);
          navigate("/admin-dashboard");
        })
        .catch(error => {
          setError(error.response?.data?.message || "Registration failed");
        });
    } else {
      // Login admin
      axios.post("http://localhost:3001/api/admin/login", { username, password })
        .then(response => {
          localStorage.setItem("adminToken", response.data.token);
          navigate("/admin-dashboard");
        })
        .catch(error => {
          setError("Invalid credentials");
        });
    }
  };

  return (
    <div className="admin-logreg">
      <div className={`admin-login-main ${!isRegistering ? "login-active" : ""}`}>
        <div className="admin-login-left">
          <div className="admin-login-left-box">
          <h1>{isRegistering ? "Admin Registration" : "Admin Login"}</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            
            <button 
              type="submit" 
              className="admin-login-button"
            >
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>
          
          <p>
            {isRegistering 
              ? "Already have an account? " 
              : "Don't have an account? "
            }
            <button 
              className="text-button"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        </div>
        </div>
        <div className="admin-login-right">
        </div>
      </div>
    </div>
  );
};

const StudentLoginPage = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [programId, setProgramId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const studentToken = localStorage.getItem("studentToken");
    if (studentToken) {
      navigate("/student-dashboard");
    }
    
    // Fetch programs for registration
    if (isRegistering) {
      axios.get("http://localhost:3001/api/programs")
        .then(response => setPrograms(response.data))
        .catch(error => console.error("Error fetching programs:", error));
    }
  }, [navigate, isRegistering]);
  
  // Fetch semesters when program is selected
  useEffect(() => {
    if (programId) {
      axios.get(`http://localhost:3001/api/semesters/${programId}`)
        .then(response => setSemesters(response.data))
        .catch(error => console.error("Error fetching semesters:", error));
    }
  }, [programId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegistering) {
      // Register student
      if (!registrationNumber || !password || !name || !programId || !semesterId) {
        setError("Please fill all fields");
        return;
      }
      
      axios.post("http://localhost:3001/api/student/register", { 
        registrationNumber, 
        password,
        name,
        programId,
        semesterId
      })
        .then(response => {
          localStorage.setItem("studentToken", response.data.token);
          localStorage.setItem("studentId", response.data.studentId);
          navigate("/student-dashboard");
        })
        .catch(error => {
          setError(error.response?.data?.message || "Registration failed");
        });
    } else {
      // Login student
      if (!registrationNumber || !password) {
        setError("Please fill all fields");
        return;
      }
      
      axios.post("http://localhost:3001/api/student/login", { registrationNumber, password })
        .then(response => {
          localStorage.setItem("studentToken", response.data.token);
          localStorage.setItem("studentId", response.data.studentId);
          navigate("/student-dashboard");
        })
        .catch(error => {
          setError("Invalid credentials");
        });
    }
  };

  return (
    <div className="student-logreg">
      <div className={`student-login-main ${!isRegistering ? "login-active" : ""}`}>
        <div className="student-login-left">
          <div className="student-login-left-box">
          <h1>{isRegistering ? "Student Registration" : "Student Login"}</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Registration Number</label>
              <input 
                type="text" 
                value={registrationNumber} 
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="Enter registration number"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            
            {isRegistering && (
              <>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Program</label>
                  <select value={programId} onChange={(e) => setProgramId(e.target.value)}>
                    <option value="">Select Program</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>{program.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Semester</label>
                  <select value={semesterId} onChange={(e) => setSemesterId(e.target.value)}>
                    <option value="">Select Semester</option>
                    {semesters.map(semester => (
                      <option key={semester.id} value={semester.id}>{semester.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            <button 
              type="submit" 
              className="student-login-button"
            >
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>
          
          <p>
            {isRegistering 
              ? "Already have an account? " 
              : "Don't have an account? "
            }
            <button 
              className="text-button"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        </div>
        </div>
        <div className="student-login-right"></div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedSchool, setSelectedSchool] = useState("1");
  const [selectedDepartment, setSelectedDepartment] = useState("1");
  const [selectedProgram, setSelectedProgram] = useState("1");
  const [selectedSemester, setSelectedSemester] = useState("1");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin");
    }

    axios.get("http://localhost:3001/api/schools").then(res => setSchools(res.data));
    axios.get(`http://localhost:3001/api/departments/1`).then(res => setDepartments(res.data));
    axios.get(`http://localhost:3001/api/programs/1`).then(res => setPrograms(res.data));
    axios.get(`http://localhost:3001/api/semesters/1`).then(res => setSemesters(res.data));

    fetchSubjects("1");
  }, [navigate]);

  const fetchSubjects = (semesterId) => {
    axios.get(`http://localhost:3001/api/subjects/${semesterId}`)
      .then(async res => {
        const subjects = res.data;
        const updatedSubjects = await Promise.all(subjects.map(async (subject) => {
          const response = await axios.get(`http://localhost:3001/api/attendance/unique-dates/${subject.id}`);
          return {
            ...subject,
            classesHeld: response.data.unique_dates_count || 0,
          };
        }));
        setSubjects(updatedSubjects);
      })
      .catch(err => console.error("Error fetching subjects:", err));
  };

  const generatePieData = (held, total) => ({
    labels: ['Classes Held', 'Remaining'],
    datasets: [{
      data: [held, Math.max(total - held, 0)],
      backgroundColor: ['#2196F3', '#E0E0E0'],
    }],
  });

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="dashboard" />
      <div className="content-area student-dashboard-page">
        <h1>Admin Dashboard - Class Summary</h1>
        <ChatBot/>
        <div className="filters">
          <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              fetchSubjects(e.target.value);
            }}
          >
            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
          {subjects.length === 0 ? (
            <p>Loading subject data...</p>
          ) : (
            subjects.map(subject => (
              <div key={subject.id} style={{ width: '250px', textAlign: 'center' }}>
                <h4>{subject.name}</h4>
                <Pie data={generatePieData(subject.classesHeld, subject.total_classes)} />
                <p>{subject.classesHeld} / {subject.total_classes} classes held</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const studentToken = localStorage.getItem("studentToken");
    if (!studentToken) {
      navigate("/student-login");
    }

    const studentId = localStorage.getItem("studentId");
    axios.get(`http://localhost:3001/api/student/attendance/${studentId}`)
      .then(response => {
        setAttendanceData(response.data.subjects);
      })
      .catch(error => {
        console.error("Error fetching attendance:", error);
      });
  }, [navigate]);

  const generateChartData = (attendancePercentage) => ({
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendancePercentage, 100 - attendancePercentage],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#EF5350'],
      },
    ],
  });

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="dashboard" />
      <div className="content-area student-dashboard-page">
        <h1>Welcome to Student Dashboard</h1>
        <p>Your Attendance Overview</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {attendanceData.length === 0 ? (
            <p>Loading attendance data...</p>
          ) : (
            attendanceData.map(subject => (
              <div key={subject.subject_id} style={{ width: '250px', textAlign: 'center' }}>
                <h4>{subject.subject_name}</h4>
                <Pie data={generateChartData(subject.attendance_percentage)} />
                <p>{subject.attendance_percentage.toFixed(2)}% Present</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TeacherLoginPage = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    const teacherToken = localStorage.getItem("teacherToken");
    if (teacherToken) {
      navigate("/teacher-dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegistering) {
      // Register teacher
      if (!teacherId || !password || !name) {
        setError("Please fill all fields");
        return;
      }
      
      axios.post("http://localhost:3001/api/teacher/register", { 
        teacherId, 
        password,
        name
      })
        .then(response => {
          localStorage.setItem("teacherToken", response.data.token);
          localStorage.setItem("teacherId", response.data.teacherId);
          navigate("/teacher-dashboard");
        })
        .catch(error => {
          setError(error.response?.data?.message || "Registration failed");
        });
    } else {
      // Login teacher
      if (!teacherId || !password) {
        setError("Please fill all fields");
        return;
      }
      
      axios.post("http://localhost:3001/api/teacher/login", { teacherId, password })
        .then(response => {
          localStorage.setItem("teacherToken", response.data.token);
          localStorage.setItem("teacherId", response.data.teacherId);
          navigate("/teacher-dashboard");
        })
        .catch(error => {
          setError("Invalid credentials");
        });
    }
  };

  return (
    <div className="teacher-logreg">
      <div className={`teacher-login-main ${!isRegistering ? "login-active" : ""}`}>
        <div className="teacher-login-left">
          <div className="teacher-login-left-box">
          <h1>{isRegistering ? "Teacher Registration" : "Teacher Login"}</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Teacher ID</label>
              <input 
                type="text" 
                value={teacherId} 
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="Enter teacher ID or name"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            
            {isRegistering && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <button 
              type="submit" 
              className="teacher-login-button"
            >
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>
          
          <p>
            {isRegistering 
              ? "Already have an account? " 
              : "Don't have an account? "
            }
            <button 
              className="text-button"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        </div>
        </div>
        <div className="teacher-login-right"></div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const teacherToken = localStorage.getItem("teacherToken");
    if (!teacherToken) {
      navigate("/teacher-login");
    }
  }, [navigate]);
  
  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="dashboard" />
      <div className="content-area">
        <h1>Welcome to Teacher Dashboard</h1>
        <p>Use the sidebar to navigate to different sections.</p>
      </div>
    </div>
  );
};

const DisplayAssignmentsPage = () => {
  const [session, setSession] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  // Fetch schools
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/schools")
      .then((response) => setSchools(response.data))
      .catch((error) => console.error("Error fetching schools:", error));
  }, []);

  // Fetch departments when school is selected
  useEffect(() => {
    if (school) {
      axios
        .get(`http://localhost:3001/api/departments/${school}`)
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error("Error fetching departments:", error));
    }
  }, [school]);

  // Fetch programs when department is selected
  useEffect(() => {
    if (department) {
      axios
        .get(`http://localhost:3001/api/programs/${department}`)
        .then((response) => setPrograms(response.data))
        .catch((error) => console.error("Error fetching programs:", error));
    }
  }, [department]);

  // Fetch semesters when program is selected
  useEffect(() => {
    if (program) {
      axios
        .get(
          `http://localhost:3001/api/semesters/${program}?session=${session}`
        )
        .then((response) => setSemesters(response.data))
        .catch((error) => console.error("Error fetching semesters:", error));
    }
  }, [program, session]);

  // Fetch subjects when semester is selected
  useEffect(() => {
    if (semester) {
      axios
        .get(`http://localhost:3001/api/subjects/${semester}`)
        .then((response) => setSubjects(response.data))
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [semester]);

  // Fetch assignments when subject is selected
  useEffect(() => {
    if (subject) {
      axios
        .get(`http://localhost:3001/api/assignments/${subject}`)
        .then((response) => setAssignments(response.data))
        .catch((error) => console.error("Error fetching assignments:", error));
    }
  }, [subject]);

  // Fetch submissions when assignment is selected
  useEffect(() => {
    if (selectedAssignment) {
      axios
        .get(
          `http://localhost:3001/api/assignment-submissions/${selectedAssignment}`
        )
        .then((response) => setSubmissions(response.data))
        .catch((error) => console.error("Error fetching submissions:", error));
    }
  }, [selectedAssignment]);

  return (

    <div className="dashboard-container">
      <DashboardSidebar activePage="display" />
      <div className="content-area">
    <div className="display-assignments-container">
      <h1>Display Assignment Submissions</h1>

      <div className="display-assignments-form">
        {/* <select value={session} onChange={(e) => setSession(e.target.value)}>
          <option value="">Select Session</option>
          <option value="Aug-Dec">Aug-Dec</option>
          <option value="Jan-Jul">Jan-Jul</option>
        </select> */}

        <select value={school} onChange={(e) => setSchool(e.target.value)}>
          <option value="">Select School</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select value={program} onChange={(e) => setProgram(e.target.value)}>
          <option value="">Select Program</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
        >
          <option value="">Select Assignment</option>
          {assignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.title} (Due: {assignment.due_date})
            </option>
          ))}
        </select>

        {submissions.length > 0 ? (
          <div className="submissions-table">
            <h2>Submissions</h2>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Registration Number</th>
                  <th>Submission Date</th>
                  <th>File</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.student_name}</td>
                    <td>{submission.registration_number}</td>
                    <td>
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </td>
                    <td>
                      <a
                        href={`http://localhost:3001/uploads/${submission.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </td>
                    <td>{submission.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedAssignment ? (
          <p>No submissions found for this assignment.</p>
        ) : null}

        <button className="attendance-next" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

const AddStudentPage = () => {
  const [session, setSession] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [studentName, setStudentName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const navigate = useNavigate();

  // Fetch schools
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/schools")
      .then((response) => setSchools(response.data))
      .catch((error) => console.error("Error fetching schools:", error));
  }, []);

  // Fetch departments when school is selected
  useEffect(() => {
    if (school) {
      axios
        .get(`http://localhost:3001/api/departments/${school}`)
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error("Error fetching departments:", error));
    }
  }, [school]);

  // Fetch programs when department is selected
  useEffect(() => {
    if (department) {
      axios
        .get(`http://localhost:3001/api/programs/${department}`)
        .then((response) => setPrograms(response.data))
        .catch((error) => console.error("Error fetching programs:", error));
    }
  }, [department]);

  // Fetch semesters when program is selected
  useEffect(() => {
    if (program) {
      axios
        .get(
          `http://localhost:3001/api/semesters/${program}?session=${session}`
        )
        .then((response) => setSemesters(response.data))
        .catch((error) => console.error("Error fetching semesters:", error));
    }
  }, [program, session]);

  const handleSubmit = () => {
    if (!studentName || !registrationNumber || !program || !semester) {
      alert("Please fill in all required fields");
      return;
    }

    const studentData = {
      name: studentName,
      registration_number: registrationNumber,
      program_id: program,
      semester_id: semester,
    };

    axios
      .post("http://localhost:3001/api/students", studentData)
      .then((response) => {
        alert("Student added successfully!");
        // Reset form
        setStudentName("");
        setRegistrationNumber("");
      })
      .catch((error) => {
        console.error("Error adding student:", error);
        alert("Failed to add student");
      });
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="addStudent" />
      <div className="content-area">
    <div className="add-student-container">
      <h1>Add New Student</h1>

      <div className="add-student-form">
        {/* <select value={session} onChange={(e) => setSession(e.target.value)}>
          <option value="">Select Session</option>
          <option value="Aug-Dec">Aug-Dec</option>
          <option value="Jan-Jul">Jan-Jul</option>
        </select> */}

        <select value={school} onChange={(e) => setSchool(e.target.value)}>
          <option value="">Select School</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select value={program} onChange={(e) => setProgram(e.target.value)}>
          <option value="">Select Program</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Registration Number"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
        />

        <button className="attendance-next" onClick={handleSubmit}>
          Add Student
        </button>
        <button
          className="attendance-next"
          onClick={() => navigate("/student-management")}
        >
          Back
        </button>
      </div>
    
    </div>
    </div>
    </div>
  );
};

const ShowStudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
      axios.get(`http://localhost:3001/api/student/attendance/${studentId}`)
          .then(response => {
              setAttendanceData(response.data.subjects);
              setTotalAttendance(response.data.totalAttendancePercentage);
          })
          .catch(error => {
              console.error("Error fetching attendance:", error);
          });
  }, [studentId]);

  return (
      <div className="dashboard-container">
          <DashboardSidebar activePage="showAttendance" />
          <div className="content-area">
              <h1>Your Attendance</h1>
              <table>
                  <thead>
                      <tr>
                          <th>Subject</th>
                          <th>Attendance (%)</th>
                      </tr>
                  </thead>
                  <tbody>
                      {attendanceData.map(subject => (
                          <tr key={subject.subject_id}>
                              <td>{subject.subject_name}</td>
                              <td>{subject.attendance_percentage.toFixed(2)}%</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              <h3>Total Attendance: {totalAttendance.toFixed(2)}%</h3>
          </div>
      </div>
  );
};

const ShowAdminAttendance = () => {
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/schools").then((res) => setSchools(res.data));
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      axios.get(`http://localhost:3001/api/departments/${selectedSchool}`)
        .then((res) => setDepartments(res.data));
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedDepartment) {
      axios.get(`http://localhost:3001/api/programs/${selectedDepartment}`)
        .then((res) => setPrograms(res.data));
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedProgram) {
      axios.get(`http://localhost:3001/api/semesters/${selectedProgram}`)
        .then((res) => setSemesters(res.data));
    }
  }, [selectedProgram]);

  const fetchAttendance = () => {
    if (!selectedSchool || !selectedDepartment || !selectedProgram || !selectedSemester) {
      alert("Please select all filters");
      return;
    }

    axios.get("http://localhost:3001/api/admin/attendance", {
      params: {
        schoolId: selectedSchool,
        departmentId: selectedDepartment,
        programId: selectedProgram,
        semesterId: selectedSemester
      }
    }).then((res) => setAttendanceData(res.data))
      .catch((err) => console.error("Error fetching attendance:", err));
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="showattendance" />
      <div className="content-area">
    <div className="show-attendance-container">
      <h1>Filter Attendance</h1>
      <div className="show-attendance-form">
        <br />
        <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
          <option value="">Select School</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </select>

        {/* <label>Department:</label> */}
        <br />
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>{department.name}</option>
          ))}
        </select>

        {/* <label>Program:</label> */}
        <br />
        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
          <option value="">Select Program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>

        {/* <label>Semester:</label> */}
        <br />
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>{semester.name}</option>
          ))}
        </select>

        <button className="attendance-next" onClick={fetchAttendance}>Show Attendance</button>
      </div>

      {attendanceData.length > 0 && (
        <div className="attendance-data">
          <h2>Attendance Data</h2>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Registration No</th>
                <th>Subject</th>
                <th>Attendance (%)</th>
                <th>Total (%)</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map(student => (
                <React.Fragment key={student.registration_number}>
                  {student.subjects.map((subject, index) => (
                    <tr key={`${student.registration_number}-${subject.subject_id}`}>
                      {index === 0 && (
                        <>
                          <td rowSpan={student.subjects.length}>{student.student_name}</td>
                          <td rowSpan={student.subjects.length}>{student.registration_number}</td>
                        </>
                      )}
                      <td>{subject.subject_name}</td>
                      <td>{subject.attendance_percentage.toFixed(2)}%</td>
                      {index === 0 && (
                        <td rowSpan={student.subjects.length}>
                          {student.totalAttendancePercentage.toFixed(2)}%
                        </td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};


const ShowAttendancePage = () => {
  const [session, setSession] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const navigate = useNavigate();

  // Fetch schools
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/schools")
      .then((response) => setSchools(response.data))
      .catch((error) => console.error("Error fetching schools:", error));
  }, []);

  // Fetch departments when school is selected
  useEffect(() => {
    if (school) {
      axios
        .get(`http://localhost:3001/api/departments/${school}`)
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error("Error fetching departments:", error));
    }
  }, [school]);

  // Fetch programs when department is selected
  useEffect(() => {
    if (department) {
      axios
        .get(`http://localhost:3001/api/programs/${department}`)
        .then((response) => setPrograms(response.data))
        .catch((error) => console.error("Error fetching programs:", error));
    }
  }, [department]);

  // Fetch semesters when program is selected
  useEffect(() => {
    if (program) {
      axios
        .get(
          `http://localhost:3001/api/semesters/${program}?session=${session}`
        )
        .then((response) => setSemesters(response.data))
        .catch((error) => console.error("Error fetching semesters:", error));
    }
  }, [program, session]);

  // Fetch subjects when semester is selected
  useEffect(() => {
    if (semester) {
      axios
        .get(`http://localhost:3001/api/subjects/${semester}`)
        .then((response) => setSubjects(response.data))
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [semester]);

  const fetchAttendance = () => {
    if (!subject || !date) {
      alert("Please select a subject and date");
      return;
    }

    axios
      .get(`http://localhost:3001/api/attendance/${subject}/${date}`)
      .then((response) => {
        setAttendanceRecords(response.data);
      })
      .catch((error) => {
        console.error("Error fetching attendance records:", error);
        alert("Failed to fetch attendance records");
      });
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="showattendance" />
      <div className="content-area">
    <div className="show-attendance-container">
      <h1>View Attendance Records</h1>

      <div className="show-attendance-form">
        {/* <select value={session} onChange={(e) => setSession(e.target.value)}>
          <option value="">Select Session</option>
          <option value="Aug-Dec">Aug-Dec</option>
          <option value="Jan-Jul">Jan-Jul</option>
        </select> */}

        <select value={school} onChange={(e) => setSchool(e.target.value)}>
          <option value="">Select School</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select value={program} onChange={(e) => setProgram(e.target.value)}>
          <option value="">Select Program</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="attendance-next" onClick={fetchAttendance}>
          View Attendance
        </button>

        {attendanceRecords.length > 0 && (
          <div className="attendance-records">
            <h2>Attendance for {date}</h2>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Registration Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.student_name}</td>
                    <td>{record.registration_number}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          className="attendance-next"
          onClick={() => navigate("/student-management")}
        >
          Back
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

const AttendancePage = () => {
  const [session, setSession] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [selectedStudents, setSelectedStudents] = useState({});
  // const navigate = useNavigate();

  // Fetch schools
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/schools")
      .then((response) => setSchools(response.data))
      .catch((error) => console.error("Error fetching schools:", error));
  }, []);

  // Fetch departments when school is selected
  useEffect(() => {
    if (school) {
      axios
        .get(`http://localhost:3001/api/departments/${school}`)
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error("Error fetching departments:", error));
    }
  }, [school]);

  // Fetch programs when department is selected
  useEffect(() => {
    if (department) {
      axios
        .get(`http://localhost:3001/api/programs/${department}`)
        .then((response) => setPrograms(response.data))
        .catch((error) => console.error("Error fetching programs:", error));
    }
  }, [department]);

  // Fetch semesters when program is selected
  useEffect(() => {
    if (program) {
      axios
        .get(
          `http://localhost:3001/api/semesters/${program}?session=${session}`
        )
        .then((response) => setSemesters(response.data))
        .catch((error) => console.error("Error fetching semesters:", error));
    }
  }, [program, session]);

  // Fetch subjects when semester is selected
  useEffect(() => {
    if (semester) {
      axios
        .get(`http://localhost:3001/api/subjects/${semester}`)
        .then((response) => setSubjects(response.data))
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [semester]);

  // Fetch students when subject is selected
  useEffect(() => {
    if (program && semester) {
      axios
        .get(`http://localhost:3001/api/students`, {
          params: { programId: program, semesterId: semester },
        })
        .then((response) => {
          setStudents(response.data);
          // Initialize attendance status for each student
          const initialStatus = response.data.reduce((acc, student) => {
            acc[student.id] = "Present";
            return acc;
          }, {});
          setAttendanceStatus(initialStatus);
          
          // Initialize selected students (all checked by default)
          const initialSelected = response.data.reduce((acc, student) => {
            acc[student.id] = true;
            return acc;
          }, {});
          setSelectedStudents(initialSelected);
        })
        .catch((error) => console.error("Error fetching students:", error));
    }
  }, [program, semester]);

  const handleAttendanceSubmit = () => {
    // Filter only selected students
    const attendanceRecords = students
      .filter(student => selectedStudents[student.id])
      .map((student) => ({
        studentId: student.id,
        status: attendanceStatus[student.id],
      }));

    axios
      .post("http://localhost:3001/api/attendance", {
        semesterId: semester,
        subjectId: subject,
        attendanceRecords,
        date: attendanceDate,
      })
      .then((response) => {
        alert("Attendance saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving attendance:", error);
        alert("Failed to save attendance");
      });
  };

  const handleCheckAll = () => {
    const allChecked = students.reduce((acc, student) => {
      acc[student.id] = true;
      return acc;
    }, {});
    setSelectedStudents(allChecked);
  };

  const handleUncheckAll = () => {
    const allUnchecked = students.reduce((acc, student) => {
      acc[student.id] = false;
      return acc;
    }, {});
    setSelectedStudents(allUnchecked);
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents({
      ...selectedStudents,
      [studentId]: !selectedStudents[studentId],
    });
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="attendance" />
      
      <div className="content-area">
        <div className="attendance-container">
          <h1>Take Attendance</h1>

          <div className="attendance-form">
            {/* <select value={session} onChange={(e) => setSession(e.target.value)}>
              <option value="">Select Session</option>
              <option value="Aug-Dec">Aug-Dec</option>
              <option value="Jan-Jul">Jan-Jul</option>
            </select> */}

            <select value={school} onChange={(e) => setSchool(e.target.value)}>
              <option value="">Select School</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select value={program} onChange={(e) => setProgram(e.target.value)}>
              <option value="">Select Program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />

            {students.length > 0 && (
              <div className="students-attendance">
                <h2>Students</h2>
                <div className="check-buttons">
                  <button className="check-all-btn" onClick={handleCheckAll}>
                    Check All
                  </button>
                  <button className="uncheck-all-btn" onClick={handleUncheckAll}>
                    Uncheck All
                  </button>
                </div>
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="student-attendance-row">
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedStudents[student.id] || false}
                            onChange={() => toggleStudentSelection(student.id)}
                          />
                        </td>
                        <td>{student.id}</td>
                        <td>
                          {student.name} ({student.registration_number})
                        </td>
                        <td>
                          <select
                            value={attendanceStatus[student.id]}
                            onChange={(e) =>
                              setAttendanceStatus({
                                ...attendanceStatus,
                                [student.id]: e.target.value,
                              })
                            }
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            {/* <option value="Late">Late</option> */}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button className="attendance-next" onClick={handleAttendanceSubmit}>
              Save Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step1 = ({
  session,
  setSession,
  school,
  setSchool,
  department,
  setDepartment,
  program,
  setProgram,
  semester,
  setSemester,
}) => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);

  // Set a default session value when component loads
  useEffect(() => {
    setSession("Aug-Dec"); // Setting a default session value
  }, []);

  // Fetch schools on component load
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/schools")
      .then((response) => {
        setSchools(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schools:", error);
      });
  }, []);

  // Fetch departments when a school is selected
  useEffect(() => {
    if (school) {
      axios
        .get(`http://localhost:3001/api/departments/${school}`)
        .then((response) => {
          setDepartments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
        });
    }
  }, [school]);

  // Fetch programs when a department is selected
  useEffect(() => {
    if (department) {
      axios
        .get(`http://localhost:3001/api/programs/${department}`)
        .then((response) => {
          setPrograms(response.data);
        })
        .catch((error) => {
          console.error("Error fetching programs:", error);
        });
    }
  }, [department]);

  // Fetch semesters when a program is selected
  useEffect(() => {
    if (program && session) {
      axios
        .get(`http://localhost:3001/api/semesters/${program}`, {
          params: { session },
        })
        .then((response) => {
          setSemesters(response.data);
        })
        .catch((error) => {
          console.error("Error fetching semesters:", error);
        });
    }
  }, [program, session]);

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="generate" />
      <div className="content-area">
    <div className="session-main">
      <div className="sec-page-main">
        <div className="select-wrapper">
          <select value={school} onChange={(e) => setSchool(e.target.value)}>
            <option value="">--Select School--</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        {school && (
          <div className="select-wrapper">
            <br />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">--Select Department--</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {department && (
          <div className="select-wrapper">
            <br />
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            >
              <option value="">--Select Program--</option>
              {programs.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {program && (
          <div className="select-wrapper">
            <br />
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">--Select Semester--</option>
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {semester && (
          <button className="semester-next" onClick={() => navigate("/step2")}>
            Next
          </button>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

const Step2 = ({
  semesterSubjects,
  department,
  program,
  semester,
  subjects,
  handleSubjectSelection,
  teachers,
  setTeachers, // Add this
  assignedTeachers,
  handleTeacherAssignment,
  generateTimetable,
}) => {
  const navigate = useNavigate();
  const [fetchedSubjects, setFetchedSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [subjectCredits, setSubjectCredits] = useState({});
  const [totalCredits, setTotalCredits] = useState(0);
  const TOTAL_ALLOWED_CREDITS = 36;

  // Fetch subjects from the database
  useEffect(() => {
    if (semester) {
      axios
        .get(`http://localhost:3001/api/subjects/${semester}`)
        .then((response) => {
          setFetchedSubjects(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    }
  }, [semester]);

  // Handle credit change for a subject
  const handleCreditChange = (subjectName, credits) => {
    const numCredits = parseInt(credits) || 0;
    const oldCredits = subjectCredits[subjectName] || 0;
    const creditDiff = numCredits - oldCredits;
    const newTotalCredits = totalCredits + creditDiff;

    if (newTotalCredits > TOTAL_ALLOWED_CREDITS) {
      alert(`Cannot exceed ${TOTAL_ALLOWED_CREDITS} total credits`);
      return;
    }

    setSubjectCredits({
      ...subjectCredits,
      [subjectName]: numCredits,
    });
    setTotalCredits(newTotalCredits);
  };

  // Add a new subject
  const handleAddSubject = () => {
    if (newSubject.trim() === "") {
      alert("Subject name cannot be empty.");
      return;
    }

    axios
      .post(`http://localhost:3001/api/subjects`, {
        semesterId: semester, // Send the semester ID
        name: newSubject, // Match the database column name
      })
      .then((response) => {
        // Update the local list with the newly added subject
        setFetchedSubjects([...fetchedSubjects, response.data.subject]);
        setNewSubject(""); // Clear the input field
        alert("Subject added successfully.");
      })
      .catch((error) => {
        console.error("Error adding subject:", error);
        alert("Failed to add subject. Please try again.");
      });
  };

  // Delete a subject
  const handleDeleteSubject = (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      axios
        .delete(`http://localhost:3001/api/subjects/${subjectId}`)
        .then(() => {
          setFetchedSubjects(
            fetchedSubjects.filter((sub) => sub.id !== subjectId)
          );
          alert("Subject deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting subject:", error);
          alert("Failed to delete subject. Please try again.");
        });
    }
  };

  const handleGenerateClick = () => {
    if (totalCredits !== TOTAL_ALLOWED_CREDITS) {
      alert(`Total credits must equal exactly ${TOTAL_ALLOWED_CREDITS}`);
      return;
    }

    const labSubjects = subjects.filter((subject) => subject.endsWith("Lab"));
    if (labSubjects.length > 5) {
      alert("Please select below 5 labs.");
      return;
    }

    generateTimetable(subjectCredits);
    navigate("/timetable");
  };

  // Add a new teacher
  const handleAddTeacher = () => {
    if (newTeacher.trim() === "") {
      alert("Teacher name cannot be empty.");
      return;
    }

    axios
      .post(`http://localhost:3001/api/teachers`, {
        name: newTeacher,
      })
      .then((response) => {
        // Update the local list with the newly added teacher
        setTeachers([...teachers, response.data.teacher.name]);
        setNewTeacher(""); // Clear the input field
        alert("Teacher added successfully.");
      })
      .catch((error) => {
        console.error("Error adding teacher:", error);
        alert("Failed to add teacher. Please try again.");
      });
  };

  // Delete a teacher
  const handleDeleteTeacher = (teacherName) => {
    if (
      window.confirm(`Are you sure you want to delete teacher ${teacherName}?`)
    ) {
      // Find the teacher's ID first
      axios
        .get("http://localhost:3001/api/teachers")
        .then((response) => {
          const teacherToDelete = response.data.find(
            (t) => t.name === teacherName
          );
          if (teacherToDelete) {
            return axios.delete(
              `http://localhost:3001/api/teachers/${teacherToDelete.id}`
            );
          }
          throw new Error("Teacher not found");
        })
        .then(() => {
          setTeachers(teachers.filter((t) => t !== teacherName));
          alert("Teacher deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting teacher:", error);
          alert("Failed to delete teacher. Please try again.");
        });
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="generate" />
      <div className="content-area">
    <div className="Subject-sel-co">
      {fetchedSubjects.length > 0 && (
        <div className="Subject-selec">
          <div className="sub-lab">
            <h1>Craft Your Class Schedule</h1>
            <p>
              Select the subjects, classes, and time slots for your students.
              Build a customized timetable that ensures a smooth flow of
              learning throughout the week.
            </p>
          </div>
          <div className="subjects-container">
            {fetchedSubjects.map((subject) => (
              <div key={subject.id} className="subject-list">
                <CustomCheckbox
                  label={subject.name}
                  checked={subjects.includes(subject.name)}
                  onChange={() => handleSubjectSelection(subject.name)}
                />
                {subjects.includes(subject.name) && (
                  <div className="credit-input">
                    <input
                      type="number"
                      min="1"
                      max={TOTAL_ALLOWED_CREDITS}
                      value={subjectCredits[subject.name] || ""}
                      onChange={(e) =>
                        handleCreditChange(subject.name, e.target.value)
                      }
                      placeholder="Credits"
                    />
                  </div>
                )}
                <button
                  className="delete-subject-btn"
                  onClick={() => handleDeleteSubject(subject.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="add-subject">
        <input
          type="text"
          placeholder="Enter new subject name"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <button onClick={handleAddSubject}>Add Subject</button>
      </div>

      {subjects.length > 0 && (
        <div className="assign-tec">
          <label className="assi-tec">Assign Teachers: </label>
          {subjects.map((subject) => (
            <div key={subject} className="select-wrapper">
              <label>{subject}: </label>
              <select
                value={assignedTeachers[subject] || ""}
                onChange={(e) =>
                  handleTeacherAssignment(subject, e.target.value)
                }
              >
                <option value="">--Select Teacher--</option>
                {teachers.map((teacher) => (
                  <option key={teacher} value={teacher}>
                    {teacher}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="teacher-management">
        <h3>Teacher Management</h3>
        <div className="add-teacher ">
          <input
            type="text"
            placeholder="Enter new teacher name"
            value={newTeacher}
            onChange={(e) => setNewTeacher(e.target.value)}
          />
          <button onClick={handleAddTeacher}>Add Teacher</button>
        </div>
        <h4>Current Teachers</h4>
        <div className="teacher-list">
          {teachers.map((teacher) => (
            <div key={teacher} className="teacher-item">
              {teacher}
              <button
                className="delete-teacher-btn"
                onClick={() => handleDeleteTeacher(teacher)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {subjects.length > 0 && (
        <button className="gene-tt" onClick={handleGenerateClick}>
          Generate Timetable
        </button>
      )}
    </div>
    </div>
    </div>
  );
};

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <div
      className={`checkbox-wrapper-16 ${
        checked ? "checkbox-wrapper-active" : ""
      }`}
    >
      <label className="checkbox-wrapper">
        <input
          type="checkbox"
          className="checkbox-input"
          checked={checked}
          onChange={onChange}
        />
        <span className="checkbox-tile">
          <span className="checkbox-label">{label}</span>
        </span>
      </label>
    </div>
  );
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TimetablePage = ({
  generatedTimetable,
  setGeneratedTimetable, // Add this prop
  subjects,
  assignedTeachers,
  downloadPDF,
  downloadPNG,
  downloadExcel,
  resetTimetable,
  session,
  school,
  department,
  program,
  semester,
}) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTimetable, setEditableTimetable] = useState([
    ...generatedTimetable,
  ]);
  const [conflicts, setConflicts] = useState([]);

  // Reset editable timetable when generated timetable changes
  useEffect(() => {
    setEditableTimetable([...generatedTimetable]);
  }, [generatedTimetable]);

  const checkForConflicts = async (timetable) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/check-conflicts",
        { timetable }
      );
      setConflicts(response.data.conflicts || []);
    } catch (error) {
      console.error("Error checking conflicts:", error);
    }
  };

  const handleFixConflicts = async () => {
    try {
      // Don't need to check for conflicts since we already have them in state
      if (conflicts.length === 0) {
        alert("No conflicts to resolve.");
        return;
      }
  
      // Create a copy of the timetable to work with
      const newTimetable = JSON.parse(JSON.stringify(generatedTimetable));
      let resolvedCount = 0;
  
      // For each conflict, try to find an alternative slot for the subject
      for (const conflict of conflicts) {
        const { day, timeSlot, subject } = conflict;
        const dayIndex = days.indexOf(day);
        
        if (dayIndex === -1) continue;
        
        // Convert timeSlot to slot index (you may need to adjust this based on your actual time slots)
        const timeSlots = ["8:45-9:45", "9:45-10:45", "10:45-11:45", "11:45-12:45", "12:00-1:45", "1:45-2:45", "2:45-3:45"];
        const slotIndex = timeSlots.indexOf(timeSlot);
        
        if (slotIndex === -1) continue;
        
        // Find all empty slots or non-lab slots that can be swapped
        const possibleSlots = [];
        for (let d = 0; d < newTimetable.length; d++) {
          for (let s = 0; s < newTimetable[d].length; s++) {
            // Skip lunch break (slot 3)
            if (s === 3) continue;
            
            // Skip the current conflict slot
            if (d === dayIndex && s === slotIndex) continue;
            
            // If empty slot or regular subject that can be swapped
            const currentSubject = newTimetable[d][s];
            
            if (currentSubject === "" || 
                (subjects.includes(currentSubject) && !currentSubject.endsWith("Lab"))) {
              possibleSlots.push({ day: d, slot: s, currentSubject });
            }
          }
        }
        
        if (possibleSlots.length > 0) {
          // Randomly select one of the possible slots to swap with
          const randomIndex = Math.floor(Math.random() * possibleSlots.length);
          const targetSlot = possibleSlots[randomIndex];
          
          // Perform the swap
          newTimetable[targetSlot.day][targetSlot.slot] = subject;
          newTimetable[dayIndex][slotIndex] = targetSlot.currentSubject;
          
          resolvedCount++;
        }
      }
  
      if (resolvedCount > 0) {
        // Update the timetable and clear conflicts
        setGeneratedTimetable(newTimetable);
        setConflicts([]);
        alert(`${resolvedCount} conflicts have been resolved by shuffling existing subjects!`);
        
        // Optionally, re-check for any remaining conflicts
        await checkForConflicts(newTimetable);
      } else {
        alert("Could not resolve conflicts. Try manually editing the timetable.");
      }
    } catch (error) {
      console.error("Error fixing conflicts:", error);
      alert("Failed to resolve conflicts. Please try again.");
    }
  };

  const saveTimetable = async () => {
    setIsSaving(true);
    const semesterNumber = semester.replace(/\D/g, "");
    try {
      const response = await axios.post(
        "http://localhost:3001/api/save-timetable",
        {
          session,
          schoolId: school,
          departmentId: department,
          programId: program,
          semesterId: semester,
          timetableData: generatedTimetable,
          teacherAssignments: assignedTeachers,
          semesterNumber,
        }
      );

      if (response.data) {
        alert("Timetable saved successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      if (error.response && error.response.data.conflicts) {
        // Store the conflicts for later resolution
        setConflicts(error.response.data.conflicts);

        // Display conflicts to the user
        const conflictDetails = error.response.data.conflicts
          .map(
            (conflict) =>
              `Conflict: ${conflict.day}, ${conflict.timeSlot}, Subject: ${conflict.subject}, Teacher: ${conflict.teacher}`
          )
          .join("\n");

        alert(
          `Timetable conflicts detected:\n${conflictDetails}\nClick "Fix Conflicts" to resolve.`
        );
      } else {
        console.error("Error saving timetable:", error);
        alert("Failed to save timetable. Please try again.");
      }
    }
    setIsSaving(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCellChange = (dayIndex, slotIndex, newValue) => {
    const updatedTimetable = [...editableTimetable];
    updatedTimetable[dayIndex][slotIndex] = newValue;
    setEditableTimetable(updatedTimetable);
  };

  return (
    <div className="last-page">
      <div className="last-sec-page">
        <h3>Generated Timetable</h3>
        <div id="timetable-wrapper">
          <div id="timetable">
            <table border="1">
              <thead>
                <tr>
                  <th>Time</th>
                  {[
                    "8:45-9:45",
                    "9:45-10:45",
                    "10:45-11:45",
                    "11:45-12:45",
                    "12:00-1:45",
                    "1:45-2:45",
                    "2:45-3:45",
                  ].map((time, index) => (
                    <th key={index}>{time}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, dayIndex) => (
                  <tr key={day}>
                    <td>{day}</td>
                    {(isEditing ? editableTimetable : generatedTimetable)[
                      dayIndex
                    ].map((subject, slotIndex) => (
                      <td key={slotIndex}>
                        {slotIndex === 3 ? (
                          "Lunch Break"
                        ) : isEditing ? (
                          <select
                            value={subject}
                            onChange={(e) =>
                              handleCellChange(
                                dayIndex,
                                slotIndex,
                                e.target.value
                              )
                            }
                          >
                            <option value="">--Select Subject--</option>
                            {subjects.map((sub) => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                          </select>
                        ) : (
                          subject
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Subject and Teacher Assignments</h3>
          <ul className="teach-lis" id="subject-teacher-assignments">
            {subjects.map((subject) => (
              <li key={subject}>
                {subject}: {assignedTeachers[subject]}
              </li>
            ))}
          </ul>
        </div>
        <div className="button-container">
          <button className="last-down" onClick={handleEditToggle}>
            {isEditing ? "Stop Editing" : "Edit Timetable"}
          </button>
          <button className="last-down" onClick={downloadPDF}>
            Download as PDF
          </button>
          <button className="last-down" onClick={downloadPNG}>
            Download as PNG
          </button>
          <button className="last-down" onClick={downloadExcel}>
            Download as Excel
          </button>

          <button
            className="last-down"
            onClick={saveTimetable}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Timetable"}
          </button>
          {conflicts.length > 0 && (
            <button className="last-down" onClick={handleFixConflicts}>
              Fix Conflicts
            </button>
          )}
          <button className="last-down" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignAssignmentPage = () => {
  const [session, setSession] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  // const [maxMarks, setMaxMarks] = useState("");
  const navigate = useNavigate();

  // Fetch schools
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/schools")
      .then((response) => setSchools(response.data))
      .catch((error) => console.error("Error fetching schools:", error));
  }, []);

  // Fetch departments when school is selected
  useEffect(() => {
    if (school) {
      axios
        .get(`http://localhost:3001/api/departments/${school}`)
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error("Error fetching departments:", error));
    }
  }, [school]);

  // Fetch programs when department is selected
  useEffect(() => {
    if (department) {
      axios
        .get(`http://localhost:3001/api/programs/${department}`)
        .then((response) => setPrograms(response.data))
        .catch((error) => console.error("Error fetching programs:", error));
    }
  }, [department]);

  // Fetch semesters when program is selected
  useEffect(() => {
    if (program) {
      axios
        .get(
          `http://localhost:3001/api/semesters/${program}?session=${session}`
        )
        .then((response) => setSemesters(response.data))
        .catch((error) => console.error("Error fetching semesters:", error));
    }
  }, [program, session]);

  // Fetch subjects when semester is selected
  useEffect(() => {
    if (semester) {
      axios
        .get(`http://localhost:3001/api/subjects/${semester}`)
        .then((response) => setSubjects(response.data))
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [semester]);

  // const handleSubmitAssignment = () => {
  //   if (!studentName || !registrationNumber || !selectedAssignment || !assignmentFile) {
  //     alert('Please fill in all fields and select a file');
  //     return;
  //   }
  const handlecreateAssignment = () => {
    if (!subject || !assignmentTitle || !dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    axios
      .post("http://localhost:3001/api/assignments", {
        semesterId: semester,
        subjectId: subject,
        title: assignmentTitle,
        description: assignmentDescription,
        dueDate: dueDate,
        // maxMarks: parseFloat(maxMarks),
      })
      .then((response) => {
        alert("Assignment created successfully!");
        // Reset form
        setAssignmentTitle("");
        setAssignmentDescription("");
        setDueDate("");
        // setMaxMarks("");
      })
      .catch((error) => {
        console.error("Error creating assignment:", error);
        alert("Failed to create assignment");
      });
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="assign" />
      <div className="content-area">
    <div className="assign-assignment-container">
      <h1>Assign Assignment</h1>

      <div className="assignment-form">
        {/* <select value={session} onChange={(e) => setSession(e.target.value)}>
          <option value="">Select Session</option>
          <option value="Aug-Dec">Aug-Dec</option>
          <option value="Jan-Jul">Jan-Jul</option>
        </select> */}

        <select value={school} onChange={(e) => setSchool(e.target.value)}>
          <option value="">Select School</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select value={program} onChange={(e) => setProgram(e.target.value)}>
          <option value="">Select Program</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Assignment Title"
          value={assignmentTitle}
          onChange={(e) => setAssignmentTitle(e.target.value)}
        />

        <textarea
          placeholder="Assignment Description"
          value={assignmentDescription}
          onChange={(e) => setAssignmentDescription(e.target.value)}
        />

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* <input
          type="number"
          placeholder="Max Marks"
          value={maxMarks}
          onChange={(e) => setMaxMarks(e.target.value)}
        /> */}

        <button className="attendance-next" onClick={handlecreateAssignment}>
          Create Assignment
        </button>
        <button className="attendance-next" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

const StudentAssignmentPage = () => {
  const [session, setSession] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [schools, setSchools] = useState([]); // Add this line
  const [departments, setDepartments] = useState([]); // Add this line
  const [programs, setPrograms] = useState([]); // Add this line
  const [semesters, setSemesters] = useState([]); // Add this line
  const [subjects, setSubjects] = useState([]); // Add this line
  const [studentName, setStudentName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const navigate = useNavigate();

  // Same fetch logic as previous components for schools, departments, etc.
  // [Reuse the useEffect hooks from AssignAssignmentPage]

  // Fetch schools
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/schools")
      .then((response) => setSchools(response.data))
      .catch((error) => console.error("Error fetching schools:", error));
  }, []);

  // Fetch departments when school is selected
  useEffect(() => {
    if (school) {
      axios
        .get(`http://localhost:3001/api/departments/${school}`)
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error("Error fetching departments:", error));
    }
  }, [school]);

  // Fetch programs when department is selected
  useEffect(() => {
    if (department) {
      axios
        .get(`http://localhost:3001/api/programs/${department}`)
        .then((response) => setPrograms(response.data))
        .catch((error) => console.error("Error fetching programs:", error));
    }
  }, [department]);

  // Fetch semesters when program is selected
  useEffect(() => {
    if (program) {
      axios
        .get(
          `http://localhost:3001/api/semesters/${program}?session=${session}`
        )
        .then((response) => setSemesters(response.data))
        .catch((error) => console.error("Error fetching semesters:", error));
    }
  }, [program, session]);

  // Fetch subjects when semester is selected
  useEffect(() => {
    if (semester) {
      axios
        .get(`http://localhost:3001/api/subjects/${semester}`)
        .then((response) => setSubjects(response.data))
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [semester]);

  useEffect(() => {
    if (subject) {
      axios
        .get(`http://localhost:3001/api/assignments/${subject}`)
        .then((response) => setAssignments(response.data))
        .catch((error) => console.error("Error fetching assignments:", error));
    }
  }, [subject]);

  const handleFileUpload = (event) => {
    setAssignmentFile(event.target.files[0]);
  };

  const handleSubmitAssignment = () => {
    if (
      !studentName ||
      !registrationNumber ||
      !selectedAssignment ||
      !assignmentFile
    ) {
      alert("Please fill in all fields and select a file");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", selectedAssignment);
    formData.append("studentName", studentName);
    formData.append("registrationNumber", registrationNumber);
    formData.append("assignmentFile", assignmentFile);

    axios
      .post("http://localhost:3001/api/student-assignments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Assignment submitted successfully!");
        // Reset form
        setSelectedAssignment(null);
        setAssignmentFile(null);
      })
      .catch((error) => {
        console.error("Error submitting assignment:", error);
        alert("Failed to submit assignment");
      });
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="assignment" />
      <div className="content-area">
    <div className="student-assignment-container">
      <h1>Student Assignment Submission</h1>

      <div className="student-assignment-form">
        {/* Reuse the select dropdowns from previous components */}
        {/* [Same dropdowns for session, school, department, program, semester, subject] */}

        {/* <select value={session} onChange={(e) => setSession(e.target.value)}>
          <option value="">Select Session</option>
          <option value="Aug-Dec">Aug-Dec</option>
          <option value="Jan-Jul">Jan-Jul</option>
        </select> */}

        <select value={school} onChange={(e) => setSchool(e.target.value)}>
          <option value="">Select School</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select value={program} onChange={(e) => setProgram(e.target.value)}>
          <option value="">Select Program</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Registration Number"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
        />

        <select
          value={selectedAssignment || ""}
          onChange={(e) => setSelectedAssignment(e.target.value)}
        >
          <option value="">Select Assignment</option>
          {assignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.title} (Due: {assignment.due_date})
            </option>
          ))}
        </select>

        <input type="file" onChange={handleFileUpload} />

        <button className="attendance-next" onClick={handleSubmitAssignment}>
          Submit Assignment
        </button>
        <button className="attendance-next" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

const TotalClassesPage = () => {
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/schools")
      .then(res => setSchools(res.data))
      .catch(err => console.error("Error fetching schools:", err));
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      axios.get(`http://localhost:3001/api/departments/${selectedSchool}`)
        .then(res => setDepartments(res.data))
        .catch(err => console.error("Error fetching departments:", err));
    } else {
      setDepartments([]);
    }
    setPrograms([]);
    setSemesters([]);
    setSubjects([]);
    setSelectedDepartment("");
    setSelectedProgram("");
    setSelectedSemester("");
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedDepartment) {
      axios.get(`http://localhost:3001/api/programs/${selectedDepartment}`)
        .then(res => setPrograms(res.data))
        .catch(err => console.error("Error fetching programs:", err));
    } else {
      setPrograms([]);
    }
    setSemesters([]);
    setSubjects([]);
    setSelectedProgram("");
    setSelectedSemester("");
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedProgram) {
      axios.get(`http://localhost:3001/api/semesters/${selectedProgram}`)
        .then(res => setSemesters(res.data))
        .catch(err => console.error("Error fetching semesters:", err));
    } else {
      setSemesters([]);
    }
    setSubjects([]);
    setSelectedSemester("");
  }, [selectedProgram]);

  const fetchSubjects = () => {
    if (!selectedSemester) {
      alert("Please select a semester first!");
      return;
    }
    axios.get(`http://localhost:3001/api/subjects/${selectedSemester}`)
      .then(res => setSubjects(res.data))
      .catch(err => console.error("Error fetching subjects:", err));
  };

  const handleTotalClassesChange = (id, newTotalClasses) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === id ? { ...subject, total_classes: newTotalClasses } : subject
    );
    setSubjects(updatedSubjects);
  };

  const handleSave = (id, totalClasses) => {
    axios.put(`http://localhost:3001/api/subjects/${id}`, { total_classes: totalClasses })
      .then(response => {
        alert("Total classes updated successfully");
      })
      .catch(error => {
        console.error("Error updating total classes:", error);
        alert("Error updating total classes");
      });
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar activePage="total-classes" />
      <div className="content-area total-classes-page">
        <h1>Subjects and Total Classes</h1>

        <div className="filters">
          <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
            <option value="">Select School</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </select>

          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>

          <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>{program.name}</option>
            ))}
          </select>

          <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>{semester.name}</option>
            ))}
          </select>

          <button className="attendance-next" onClick={fetchSubjects}>
            Show Subjects
          </button>
        </div>

        {subjects.length > 0 && (
          <div className="subject-table">
            <table>
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Total Classes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.name}</td>
                    <td>
                      <input
                        type="number"
                        value={subject.total_classes}
                        onChange={(e) => handleTotalClassesChange(subject.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSave(subject.id, subject.total_classes)}>
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};



const App = () => {
  const [teachers, setTeachers] = useState([]);
  const [session, setSession] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [assignedTeachers, setAssignedTeachers] = useState({});
  const [generatedTimetable, setGeneratedTimetable] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/teachers")
      .then((response) => {
        // Assuming the response contains an array of teacher objects with a 'name' property
        const teacherNames = response.data.map((teacher) => teacher.name);
        setTeachers(teacherNames);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
        // Optionally, set a default or empty array if fetch fails
        setTeachers([]);
      });
  }, []);

  const handleSubjectSelection = (subject) => {
    if (subjects.includes(subject)) {
      setSubjects(subjects.filter((s) => s !== subject));
    } else {
      setSubjects([...subjects, subject]);
    }
  };

  const handleTeacherAssignment = (subject, teacher) => {
    setAssignedTeachers({ ...assignedTeachers, [subject]: teacher });
  };

  const generateTimetable = (subjectCredits) => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const slotsPerDay = 7; // 6 slots + 1 lunch
    const timetable = Array.from({ length: days.length }, () =>
      Array(slotsPerDay).fill("")
    );

    const labSubjects = subjects.filter((subject) => subject.endsWith("Lab"));
    const regularSubjects = subjects.filter(
      (subject) => !subject.endsWith("Lab")
    );

    // Create a pool of subjects based on their credits
    const subjectPool = [];
    subjects.forEach((subject) => {
      const credits = subjectCredits[subject] || 0;
      for (let i = 0; i < credits; i++) {
        subjectPool.push(subject);
      }
    });

    // Helper function to count labs in a day
    const getLabCountForDay = (day) => {
      return timetable[day].filter((slot) => slot.endsWith("Lab")).length;
    };

    // Helper function to check if we can place a lab at a specific slot
    const canPlaceLab = (day, slot) => {
      // Don't place lab if:
      // 1. Already has 2 labs in this day
      if (getLabCountForDay(day) >= 2) return false;

      // 2. Slot is lunch or last period
      if (slot === 3 || slot >= slotsPerDay - 1) return false;

      // 3. Slot is period 3 (because next is lunch)
      if (slot === 2) return false;

      // 4. Next slot is not empty
      if (timetable[day][slot + 1] !== "") return false;

      // 5. Current slot is not empty
      if (timetable[day][slot] !== "") return false;

      return true;
    };

    const placeLab = (day, slot, lab) => {
      timetable[day][slot] = lab;
      timetable[day][slot + 1] = lab;
      // Remove two occurrences of the lab from the pool as it takes two slots
      const index = subjectPool.indexOf(lab);
      if (index > -1) subjectPool.splice(index, 2);
    };

    const canPlaceRegularSubject = (day, slot, subject) => {
      if (timetable[day][slot] !== "") return false;
      if (slot > 0 && timetable[day][slot - 1] === subject) return false;
      if (day > 0 && timetable[day - 1][slot] === subject) return false;
      return true;
    };

    // First, place labs - only at the start of the day or after lunch
    labSubjects.forEach((lab) => {
      const labCredits = subjectCredits[lab] || 0;
      let placedInstances = 0;

      for (
        let day = 0;
        day < days.length && placedInstances < labCredits;
        day++
      ) {
        // Try slots 0 (first period) and 4 (after lunch) only
        const possibleSlots = [0, 4];

        for (const slot of possibleSlots) {
          if (placedInstances < labCredits && canPlaceLab(day, slot)) {
            placeLab(day, slot, lab);
            placedInstances += 2; // Labs take two slots
            break; // Move to next day after placing a lab
          }
        }
      }
    });

    // Then place regular subjects
    for (let day = 0; day < days.length; day++) {
      for (let slot = 0; slot < slotsPerDay; slot++) {
        if (timetable[day][slot] === "" && slot !== 3) {
          // Skip lunch slot
          const availableSubjects = subjectPool.filter(
            (subject) =>
              !subject.endsWith("Lab") &&
              canPlaceRegularSubject(day, slot, subject)
          );

          if (availableSubjects.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * availableSubjects.length
            );
            const selectedSubject = availableSubjects[randomIndex];
            timetable[day][slot] = selectedSubject;

            // Remove the placed subject from the pool
            const poolIndex = subjectPool.indexOf(selectedSubject);
            if (poolIndex > -1) subjectPool.splice(poolIndex, 1);
          }
        }
      }
    }

    for (let day = 0; day < days.length; day++) {
      for (let slot = 0; slot < slotsPerDay; slot++) {
        if (timetable[day][slot] === "" && slot !== 3) {
          // Skip lunch break
          const subjectToPlace =
            regularSubjects[Math.floor(Math.random() * regularSubjects.length)];
          timetable[day][slot] = subjectToPlace;
        }
      }
    }

    setGeneratedTimetable(timetable);
  };

  const downloadPDF = () => {
    const input = document.getElementById("timetable-wrapper");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save("timetable.pdf");
    });
  };

  const downloadPNG = () => {
    const timetableElement = document.getElementById("timetable-wrapper");
    html2canvas(timetableElement).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = img;
      link.download = "timetable.png";
      link.click();
    });
  };

  const resetTimetable = () => {
    setSubjects([]);
    setAssignedTeachers({});
    setGeneratedTimetable([]);
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([]);
    const wb = XLSX.utils.book_new();
    const headers = [
      "Time",
      "8:45-9:45",
      "9:45-10:45",
      "10:45-11:45",
      "11:45-12:45",
      "12:00-1:45",
      "1:45-2:45",
      "2:45-3:45",
    ];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    days.forEach((day, index) => {
      let row = [day, ...generatedTimetable[index]];
      row[4] = "Lunch"; // Set "Lunch" in the appropriate column
      XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${index + 2}` });
    });

    XLSX.utils.book_append_sheet(wb, ws, "Timetable");
    XLSX.writeFile(wb, "Timetable.xlsx");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/step1"
          element={
            <Step1
              session={session}
              setSession={setSession}
              school={school}
              setSchool={setSchool}
              department={department}
              setDepartment={setDepartment}
              program={program}
              setProgram={setProgram}
              semester={semester}
              setSemester={setSemester}
            />
          }
        />
        <Route
          path="/step2"
          element={
            <Step2
              department={department}
              program={program}
              semester={semester}
              subjects={subjects}
              handleSubjectSelection={handleSubjectSelection}
              teachers={teachers}
              setTeachers={setTeachers}
              assignedTeachers={assignedTeachers}
              handleTeacherAssignment={handleTeacherAssignment}
              generateTimetable={generateTimetable}
            />
          }
        />
        <Route
          path="/timetable"
          element={
            <TimetablePage
              generatedTimetable={generatedTimetable}
              setGeneratedTimetable={setGeneratedTimetable}
              subjects={subjects}
              assignedTeachers={assignedTeachers}
              downloadPDF={downloadPDF}
              downloadPNG={downloadPNG}
              downloadExcel={downloadExcel}
              resetTimetable={resetTimetable}
              session={session}
              school={school}
              department={department}
              program={program}
              semester={semester}
            />
          }
        />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/assign-assignment" element={<AssignAssignmentPage />} />
        <Route path="/student" element={<StudentAssignmentPage />} />
        <Route path="/add-student" element={<AddStudentPage />} />
        <Route path="/show-attendance" element={<ShowAttendancePage />} />
        <Route
          path="/display-assignments"
          element={<DisplayAssignmentsPage />}
        />
        <Route path="/start" element={<StartPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/student-login" element={<StudentLoginPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/teacher-login" element={<TeacherLoginPage />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/show-student-attendance" element={<ShowStudentAttendance />} />
    <Route path="/show-admin-attendance" element={<ShowAdminAttendance />} />
    <Route path="/chatbot" element={<ChatBot />} />
    <Route path="/total-classes" element={<TotalClassesPage />} />

      </Routes>
    </Router>
  );
};

export default App;
