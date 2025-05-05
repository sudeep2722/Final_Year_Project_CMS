from fastapi import FastAPI, Request
from pydantic import BaseModel
import uvicorn
import mysql.connector
from mysql.connector import Error
import re

app = FastAPI()

class Question(BaseModel):
    text: str

# Database connection function
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',  # Add your MySQL password here
            database='final project',
            port=3306
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Function to get student attendance data
def get_student_attendance(registration_number):
    connection = get_db_connection()
    if connection is None:
        return None
    
    cursor = connection.cursor(dictionary=True)
    try:
        # Get basic student info using registration number
        cursor.execute(
            """SELECT s.id, s.name, s.registration_number 
               FROM students s 
               WHERE s.registration_number = %s""", 
            (registration_number,)
        )
        student_info = cursor.fetchone()
        
        if not student_info:
            return {"error": f"No student found with registration number {registration_number}"}
        
        student_id = student_info['id']
        
        # Get attendance by subject
        cursor.execute(
            """SELECT sub.name AS subject_name, 
                      COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) AS present_days,
                      COUNT(ar.id) AS total_days
               FROM attendance_records ar
               JOIN subjects sub ON ar.subject_id = sub.id
               WHERE ar.student_id = %s
               GROUP BY sub.name""",
            (student_id,)
        )
        attendance_by_subject = cursor.fetchall()
        
        # Calculate overall attendance
        cursor.execute(
            """SELECT 
                COUNT(CASE WHEN status = 'Present' THEN 1 END) AS total_present,
                COUNT(*) AS total_classes
               FROM attendance_records 
               WHERE student_id = %s""",
            (student_id,)
        )
        overall = cursor.fetchone()
        
        return {
            "student": student_info,
            "attendance": attendance_by_subject,
            "overall": overall
        }
        
    except Error as e:
        print(f"Database error: {e}")
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()

# Find students with lowest attendance
def get_lowest_attendance():
    connection = get_db_connection()
    if connection is None:
        return None
    
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT s.id, s.name, s.registration_number,
                  COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) AS present_count,
                  COUNT(ar.id) AS total_classes,
                  ROUND(COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) * 100.0 / COUNT(ar.id), 2) AS attendance_percentage
               FROM students s
               JOIN attendance_records ar ON s.id = ar.student_id
               GROUP BY s.id, s.name, s.registration_number
               ORDER BY attendance_percentage ASC
               LIMIT 5"""
        )
        return cursor.fetchall()
    except Error as e:
        print(f"Database error: {e}")
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()

# Get attendance summary by day of week
def get_attendance_summary():
    connection = get_db_connection()
    if connection is None:
        return None
    
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT 
                DAYNAME(date) as day_of_week,
                COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
                COUNT(*) AS total_count,
                ROUND(COUNT(CASE WHEN status = 'Present' THEN 1 END) * 100.0 / COUNT(*), 2) AS attendance_percentage
               FROM attendance_records
               GROUP BY day_of_week
               ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')"""
        )
        return cursor.fetchall()
    except Error as e:
        print(f"Database error: {e}")
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()

@app.post("/api/attendance/analyze")
async def analyze(question: Question):
    print("Received query:", question.text)
    query = question.text.lower()
    
    # Check for registration number pattern
    reg_match = re.search(r"(?:registration\s*(?:number|no|#)?\s*|reg\s*(?:number|no|#)?\s*|student\s*|attendance\s*)([0-9]{8,12})", query)
    if reg_match:
        registration_number = reg_match.group(1)
        attendance_data = get_student_attendance(registration_number)
        
        if attendance_data and "error" not in attendance_data:
            student = attendance_data["student"]
            overall = attendance_data["overall"]
            
            if overall["total_classes"] > 0:
                attendance_percent = (overall["total_present"] / overall["total_classes"]) * 100
                return {"answer": f"Student {student['name']} (Registration #{registration_number}) has attended {overall['total_present']} out of {overall['total_classes']} classes ({attendance_percent:.2f}%)."}
            else:
                return {"answer": f"Student {student['name']} (Registration #{registration_number}) has no attendance records yet."}
        else:
            return {"answer": "Sorry, I couldn't find attendance data for that registration number."}
    
    # Also check for roll number pattern (keeping backward compatibility)
    roll_match = re.search(r"(?:roll\s*number\s*|roll\s*|student\s*id\s*|id\s*)(\d+)", query)
    if roll_match:
        student_id = roll_match.group(1)
        # Get registration number from student id
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor(dictionary=True)
            try:
                cursor.execute("SELECT registration_number FROM students WHERE id = %s", (student_id,))
                result = cursor.fetchone()
                if result:
                    registration_number = result['registration_number']
                    attendance_data = get_student_attendance(registration_number)
                    
                    if attendance_data and "error" not in attendance_data:
                        student = attendance_data["student"]
                        overall = attendance_data["overall"]
                        
                        if overall["total_classes"] > 0:
                            attendance_percent = (overall["total_present"] / overall["total_classes"]) * 100
                            return {"answer": f"Student {student['name']} (Registration #{registration_number}) has attended {overall['total_present']} out of {overall['total_classes']} classes ({attendance_percent:.2f}%)."}
                        else:
                            return {"answer": f"Student {student['name']} (Registration #{registration_number}) has no attendance records yet."}
                else:
                    return {"answer": f"Sorry, I couldn't find a student with roll number {student_id}."}
            finally:
                cursor.close()
                connection.close()
    
    # Check for lowest attendance query
    if "lowest" in query and ("attendance" in query or "present" in query):
        lowest_students = get_lowest_attendance()
        if lowest_students and len(lowest_students) > 0:
            worst = lowest_students[0]
            return {"answer": f"Student with registration number {worst['registration_number']} ({worst['name']}) has the lowest attendance at {worst['attendance_percentage']}%."}
        else:
            return {"answer": "I couldn't retrieve the attendance rankings at this time."}
    
    # Check for summary request
    if "summary" in query:
        summary = get_attendance_summary()
        if summary and len(summary) > 0:
            # Find day with highest and lowest attendance
            highest_day = max(summary, key=lambda x: x['attendance_percentage'])
            lowest_day = min(summary, key=lambda x: x['attendance_percentage'])
            return {"answer": f"This week, attendance was highest on {highest_day['day_of_week']} ({highest_day['attendance_percentage']}%) and lowest on {lowest_day['day_of_week']} ({lowest_day['attendance_percentage']}%)."}
        else:
            return {"answer": "I couldn't generate an attendance summary at this time."}
    
    # Generic queries about attendance
    if "attendance" in query:
        return {"answer": "I can help with attendance information. Try asking about a specific registration number, the lowest attendance, or for an attendance summary."}
    
    return {"answer": "I'm not sure how to help with that query. Try asking about attendance for a specific registration number or request an attendance summary."}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=5000)