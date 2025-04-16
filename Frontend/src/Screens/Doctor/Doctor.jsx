// src/Pages/Doctor/Doctor.jsx

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import styles from "./Doctor.module.css";
import DoctorNavbar from "../../Components/Doctor/DoctorNavbar";

const Doctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("doctorToken");
  const todayStr = dayjs().format("YYYY-MM-DD");

  const showMessage = (msg) => {
    setSnackbar({ open: true, message: msg });
  };

  const fetchAppointments = async (date = null) => {
    setLoading(true);
    let url = "http://localhost:5000/api/doctor/allappointments";
    if (date) {
      url = `http://localhost:5000/api/doctor/appointments/by-date?date=${date}`;
    }

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setAppointments(result.appointments || []);
      } else {
        showMessage(result.error || "Could not fetch appointments.");
      }
    } catch (err) {
      console.error(err);
      showMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateLeave = (appointment) => {
    setSelectedStudent(appointment);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    const leaveData = {
      studentId: selectedStudent._id,
      studentName: selectedStudent.name,
      registrationNo: selectedStudent.registrationNo,
      studentDepartment: selectedStudent.departmentName,
      studentYear: selectedStudent.year,
      fromDate,
      toDate,
      reason: leaveReason,
      email: selectedStudent.emailId,
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
        showMessage("Leave allocated successfully!");
        setShowModal(false);
        setLeaveReason("");
        setFromDate("");
        setToDate("");
      } else {
        showMessage(result.error || "Failed to allocate leave.");
      }
    } catch (err) {
      console.error(err);
      showMessage("Error submitting leave. Please try again.");
    }
    finally {
      setLoading(false)
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/doctor/appointment/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (response.ok) {
        showMessage(`Appointment ${status}`);
        fetchAppointments(selectedDate || todayStr);
      } else {
        showMessage(result.error || "Could not update status.");
      }
    } catch (err) {
      console.error(err);
      showMessage("Server error updating status.");
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    setSelectedDate(todayStr);
    fetchAppointments(todayStr);
  }, []);

  const filteredAppointments = appointments.filter((a) => {
    if (filter === "all") return true;
    if (filter === "pending") return !a.appointmentStatus || a.appointmentStatus === "pending";
    return a.appointmentStatus === filter;
  });

  return (
    <div>
      <DoctorNavbar
  onTodayClick={() => {
    setSelectedDate(todayStr);
    fetchAppointments(todayStr);
  }}
  onDateClick={() => setDateDialogOpen(true)}
  filter={filter}
  onFilterChange={setFilter}
/>


      {loading ? (
        <div className={styles.loaderOverlay}>
        <CircularProgress color="primary" />
      </div>
      ) : appointments.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 20 }}>
          No appointments found.
        </p>
      ) : (
        
        <TableContainer
          component={Paper}
          sx={{ m: 3,p: "20px", maxWidth: "95%", fontSize: "20px" }}
        >
  Results for {dayjs(selectedDate).format("DD/MM/YYYY")}
  <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                {[
                  "Name",
                  "Reg. No",
                  "Email",
                  "Dept",
                  "Year",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: "bold" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((a, idx) => {
                const isToday =
                  dayjs(a.visitDate).format("YYYY-MM-DD") === todayStr;
                return (
                  <TableRow
                    key={a._id}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? "#fafafa" : "#ffffff",
                    }}
                  >
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.registrationNo}</TableCell>
                    <TableCell>{a.emailId}</TableCell>
                    <TableCell>{a.departmentName}</TableCell>
                    <TableCell>{a.year}</TableCell>
                    <TableCell>
                      {dayjs(a.visitDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      {a.appointmentStatus || "Pending"}
                    </TableCell>
                    <TableCell>
                      {isToday ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAllocateLeave(a)}
                        >
                          Allocate Leave
                        </Button>
                      ) : (
                        <>
                          <Button
                            color="success"
                            size="small"
                            onClick={() =>
                              handleUpdateStatus(a._id, "accepted")
                            }
                            sx={{ mr: 1 }}
                          >
                            Accept
                          </Button>
                          <Button
                            color="error"
                            size="small"
                            onClick={() =>
                              handleUpdateStatus(a._id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Date Picker Dialog */}
      <Dialog open={dateDialogOpen} onClose={() => setDateDialogOpen(false)}>
        <DialogTitle>Select Date</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            fullWidth
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ my: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            onClick={() => {
              setDateDialogOpen(false);
              fetchAppointments(selectedDate);
            }}
            variant="contained"
            fullWidth
          >
            Get Appointments
          </Button>
        </DialogContent>
      </Dialog>

      {/* Leave Allocation Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3>Allocate Leave</h3>
            <form onSubmit={handleFormSubmit}>
              <p>
                <strong>Name:</strong> {selectedStudent.name}
              </p>
              <p>
                <strong>Reg No:</strong> {selectedStudent.registrationNo}
              </p>
              <TextField
                label="From Date"
                type="date"
                fullWidth
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                label="To Date"
                type="date"
                fullWidth
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                label="Reason"
                fullWidth
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                margin="normal"
              />
              <Button type="submit" variant="contained" fullWidth>
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </div>
  );
};

export default Doctor;
