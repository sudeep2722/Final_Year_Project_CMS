import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardSidebar = ({ activePage }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check which token exists to determine user role
    if (localStorage.getItem("adminToken")) {
      setUserRole("admin");
    } else if (localStorage.getItem("teacherToken")) {
      setUserRole("teacher");
    } else if (localStorage.getItem("studentToken")) {
      setUserRole("student");
    } else {
      // If no token exists, redirect to home page
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    if (userRole === "admin") {
      localStorage.removeItem("adminToken");
    } else if (userRole === "teacher") {
      localStorage.removeItem("teacherToken");
      localStorage.removeItem("teacherId");
    } else if (userRole === "student") {
      localStorage.removeItem("studentToken");
      localStorage.removeItem("studentId");
    }
    navigate("/");
  };

  // If user role is still being determined, show loading
  if (!userRole) {
    return <div className="sidebar"><p>Loading...</p></div>;
  }

  return (
    <div className="sidebar">
      <h2>{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Panel</h2>
      
      {/* Admin Links */}
      {userRole === "admin" && (
        <>
          <button 
            className={activePage === "dashboard" ? "active" : ""} 
            onClick={() => navigate("/admin-dashboard")}
          >
            Dashboard
          </button>
          <button 
            className={activePage === "generate" ? "active" : ""} 
            onClick={() => navigate("/step1")}
          >
            Generate Timetable
          </button>
          <button 
            className={activePage === "attendance" ? "active" : ""} 
            onClick={() => navigate("/attendance")}
          >
            Take Attendance
          </button>
          <button 
            className={activePage === "assign" ? "active" : ""} 
            onClick={() => navigate("/assign-assignment")}
          >
            Assign Assignment
          </button>
          <button 
            className={activePage === "display" ? "active" : ""} 
            onClick={() => navigate("/display-assignments")}
          >
            Display Assignments
          </button>
          <button 
            className={activePage === "addStudent" ? "active" : ""} 
            onClick={() => navigate("/add-student")}
          >
            Add Student
          </button>
          <button 
            className={activePage === "showAttendance" ? "active" : ""} 
            onClick={() => navigate("/show-admin-attendance")}
          >
            Show Attendance
          </button>
          <button 
            className={activePage === "total-classes" ? "active" : ""} 
            onClick={() => navigate("/total-classes")}
          >
            Total Classes
          </button>
        </>
      )}

      {/* Teacher Links */}
      {userRole === "teacher" && (
        <>
          <button 
            className={activePage === "dashboard" ? "active" : ""} 
            onClick={() => navigate("/teacher-dashboard")}
          >
            Dashboard
          </button>
          <button 
            className={activePage === "attendance" ? "active" : ""} 
            onClick={() => navigate("/attendance")}
          >
            Take Attendance
          </button>
          <button 
            className={activePage === "assign" ? "active" : ""} 
            onClick={() => navigate("/assign-assignment")}
          >
            Assign Assignment
          </button>
          <button 
            className={activePage === "display" ? "active" : ""} 
            onClick={() => navigate("/display-assignments")}
          >
            Display Assignments
          </button>
          <button 
            className={activePage === "showAttendance" ? "active" : ""} 
            onClick={() => navigate("/show-admin-attendance")}
          >
            Show Attendance
          </button>
        </>
      )}

      {/* Student Links */}
      {userRole === "student" && (
        <>
          <button 
            className={activePage === "dashboard" ? "active" : ""} 
            onClick={() => navigate("/student-dashboard")}
          >
            Dashboard
          </button>
          <button 
            className={activePage === "assignments" ? "active" : ""} 
            onClick={() => navigate("/student")}
          >
            Student Assignment
          </button>
          <button 
            className={activePage === "showAttendance" ? "active" : ""} 
            onClick={() => navigate("/show-student-attendance")}
          >
            Show Attendance
          </button>
        </>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardSidebar;