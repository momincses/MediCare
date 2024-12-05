import React, { useEffect, useState } from "react";
import styles from "./Student.module.css";
import { useLocation } from "react-router-dom";

import Button from "@mui/material/Button";
import AppointmentForm from "../../Components/AppointmentForm/AppointmentForm";

const Student = () => {
  const [studentData, setStudentData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const formatDateWithDay = (date) => {
    const options = { weekday: "long", year: "numeric", month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage
    
        if (!token) {
          throw new Error("User is not authenticated. Please log in.");
        }
    
        const response = await fetch(`http://localhost:5000/api/auth/fetchStudent`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
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
          `http://localhost:5000/api/appointments?email=${email}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token here as well if needed
            },
          }
        );
        if (!appointmentsResponse.ok) {
          throw new Error("Unable to fetch appointments");
        }
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.appointments);
      } catch (err) {
        setError(err.message);
      }
    };
    

    fetchStudentData();
  }, [email]);

  const handleCancelAppointment = async (appointmentId) => {
    console.log(appointmentId)
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      // Remove appointment from local state
      setAppointments(appointments.filter((appointment) => appointment.id !== appointmentId));
      alert("Appointment cancelled successfully!");
      window.location.reload(); // Refresh the page after canceling

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
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
            </div>
            <div className={styles.appointment}>
              <h3 className={styles.medicalDetailsTitle}>Your Appointments</h3>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <div key={index} className={styles.appointmentMade}>
                    <span>{formatDateWithDay(appointment.visitDate)}</span>
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

      {/* Appointment Form Popup */}
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
