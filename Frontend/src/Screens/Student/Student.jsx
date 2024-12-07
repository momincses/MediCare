import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Student.module.css";

import Button from "@mui/material/Button";
import AppointmentForm from "../../Components/AppointmentForm/AppointmentForm";

const Student = () => {
  const [studentData, setStudentData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [leaves, setLeaves] = useState([]); // New state for leaves
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const formatDateWithDay = (date) => {
    const options = { weekday: "long", year: "numeric", month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || "Unable to fetch student data");
        }

        const data = await response.json();
        setStudentData(data.student);

        const appointmentsResponse = await fetch(
          `http://localhost:5000/api/student/appointments?email=${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!appointmentsResponse.ok) {
          throw new Error("Unable to fetch appointments");
        }

        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.appointments);

        
        const allocatedLeavesResponse = await fetch(
          `http://localhost:5000/api/student/allocatedLeaves?email=${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!allocatedLeavesResponse.ok) {
          throw new Error("Unable to fetch allocated leaves");
        }

        const allocatedLeavesData = await allocatedLeavesResponse.json();
        setLeaves(allocatedLeavesData.leaves); // Store leaves in state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStudentData();
  }, [email, navigate]);

 

   // Handle Cancel Appointment
   const handleCancelAppointment = async (appointmentId) => {
    const token = localStorage.getItem("studentToken");

    if (!token) {
      alert("You are not authenticated. Redirecting to the homepage.");
      return navigate("/");
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/student/appointments/${appointmentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel the appointment.");
      }

      alert("Appointment canceled successfully.");

      // Update the appointments state
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
    } catch (err) {
      alert(err.message || "Something went wrong.");
    }
  };

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
            {/* Allocated Leaves Section */}
            <div className={styles.yourLeaves}>
              <h3 className={styles.medicalDetailsTitle}>Allocated Leaves</h3>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <div key={leave._id} className={styles.leaveDetail}>
                    <p>
                      <strong>From:</strong> {formatDateWithDay(leave.fromDate)}
                    </p>
                    <p>
                      <strong>To:</strong> {formatDateWithDay(leave.toDate)}
                    </p>
                    <p>
                      <strong>Reason:</strong> {leave.reason}
                    </p>
                  </div>
                ))
              ) : (
                <p>No leaves allocated yet.</p>
              )}
            </div>

            {/* Appointment Section */}
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
