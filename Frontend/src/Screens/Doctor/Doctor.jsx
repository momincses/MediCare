import React, { useEffect, useState } from 'react';

const Doctor = () => {
  const [appointments, setAppointments] = useState([]); // State to store appointments
  const [loading, setLoading] = useState(true); // State to handle loading status
  const [error, setError] = useState(""); // State to handle errors

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
        setAppointments(result.appointments); // Update appointments state
      } else {
        setError(result.error || "Failed to fetch appointments");
      }
    } catch (err) {
      setError("Error fetching appointments. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false); // Stop loading regardless of success or error
    }
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Doctor;
