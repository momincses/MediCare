import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import styles from "./Doctor.module.css";

const Doctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchAppointments = async () => {
    const token = localStorage.getItem("doctorToken");

    try {
      const response = await fetch("http://localhost:5000/api/doctor/allappointments", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setAppointments(result.appointments);
      } else {
        setError(result.error || "Failed to fetch appointments");
      }
    } catch (err) {
      setError("Error fetching appointments. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAllocateLeave = (appointment) => {
    setSelectedStudent(appointment);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("doctorToken");
  
    const leaveData = {
      studentId: selectedStudent._id,
      studentName: selectedStudent.name,
      registrationNo: selectedStudent.registrationNo,
      studentDepartment: selectedStudent.departmentName,
      studentYear: selectedStudent.year,
      fromDate,
      toDate,
      reason: leaveReason,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/doctor/allocateleave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(leaveData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Leave allocated successfully!");
        setShowModal(false);
        setLeaveReason("");
        setFromDate("");
        setToDate("");
      } else {
        alert(result.error || "Failed to allocate leave.");
      }
    } catch (err) {
      console.error("Error submitting leave:", err);
      alert("Error submitting leave. Please try again.");
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Doctor Dashboard</h1>

      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div>
          <h2>Appointments</h2>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Registration No</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>Visit Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.name}</td>
                  <td>{appointment.registrationNo}</td>
                  <td>{appointment.emailId}</td>
                  <td>{appointment.departmentName}</td>
                  <td>{appointment.year}</td>
                  <td>{new Date(appointment.visitDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleAllocateLeave(appointment)}>Allocate Leave</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Leave Allocation */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3>Allocate Leave</h3>
            <form onSubmit={handleFormSubmit}>
              <p>
                <strong>Name:</strong> {selectedStudent.name}
              </p>
              <p>
                <strong>Registration No:</strong> {selectedStudent.registrationNo}
              </p>
              <p>
                <strong>Department :</strong> {selectedStudent.departmentName}
              </p>
              <p>
                <strong>Year :</strong> {selectedStudent.year}
              </p>
              <div>
                <TextField
                  label="From Date"
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </div>
              <div>
                <TextField
                  label="To Date"
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </div>
              <div>
                <TextField
                  label="Reason for Leave"
                  variant="outlined"
                  fullWidth
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  margin="normal"
                />
              </div>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;
