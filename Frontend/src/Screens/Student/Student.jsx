import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Student.module.css";

import Button from "@mui/material/Button";
import AppointmentForm from "../../Components/AppointmentForm/AppointmentForm";

const Student = () => {
  const [studentData, setStudentData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [allocatedLeaves, setAllocatedLeaves] = useState([]);
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem("studentToken");

      if (!token) {
        alert("You are not authenticated. Redirecting to the homepage.");
        return navigate("/");
      }

      try {
        const response = await fetch(`http://localhost:5000/api/auth/fetchStudent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(
            errorResponse.message || "Unable to fetch student data"
          );
        }

        const data = await response.json();
        setStudentData(data.student);

        // Fetch appointments
        const appointmentsResponse = await fetch(
          `http://localhost:5000/api/appointments?email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!appointmentsResponse.ok) {
          throw new Error("Unable to fetch appointments");
        }
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.appointments);

        // Fetch allocated leaves
        const leavesResponse = await fetch(
          console.log(studentData.email)
          `http://localhost:5000/api/allocatedLeaves/${studentData.eamil}}}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!leavesResponse.ok) {
          throw new Error("No leaves allocated.");
        }
        const leavesData = await leavesResponse.json();
        setAllocatedLeaves(leavesData.leaves);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStudentData();
  }, [email, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>MediCare</div>
        <div className={styles.nav}>
          <li>
            <a href="#login">Log out</a>
          </li>
        </div>
      </div>
      {studentData ? (
        <div className={styles.studentDetails}>
          <h2>Welcome, {studentData.name}</h2>
          <h3>What would you like to do today?</h3>
          <div className={styles.medicalDetails}>
            <div className={styles.yourLeaves}>
              <h3 className={styles.medicalDetailsTitle}>Allocated Leaves</h3>
              {allocatedLeaves.length > 0 ? (
                allocatedLeaves.map((leave) => (
                  <div key={leave._id} className={styles.leaveEntry}>
                    <p>
                      <strong>From:</strong> {formatDate(leave.fromDate)}
                    </p>
                    <p>
                      <strong>To:</strong> {formatDate(leave.toDate)}
                    </p>
                    <p>
                      <strong>Reason:</strong> {leave.reason}
                    </p>
                  </div>
                ))
              ) : (
                <p>No leaves allocated.</p>
              )}
            </div>
            <div className={styles.appointment}>
              <h3 className={styles.medicalDetailsTitle}>Your Appointments</h3>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <div key={index} className={styles.appointmentMade}>
                    <span>{formatDate(appointment.visitDate)}</span>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelAppointment(appointment._id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </Button>
                  </div>
                ))
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsPopupOpen(true)}
                >
                  Make an Appointment
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        !error && <p>Loading student data...</p>
      )}

      {isPopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button
              className={styles.closeButton}
              onClick={() => setIsPopupOpen(false)}
            >
              &times;
            </button>
            <h3>Make an Appointment</h3>
            <AppointmentForm data={studentData}></AppointmentForm>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
