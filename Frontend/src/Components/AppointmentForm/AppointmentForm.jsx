import React, { useState } from 'react';
import axios from 'axios';
import styles from './AppointmentForm.module.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AppointmentForm = ({ data }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNo: '',
    emailId: '',
    departmentName: '',
    year: '',
    visitDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/appointments', formData);
      console.log('Appointment saved successfully:', response.data);
      window.location.reload(); // Refresh the page after submitting

      alert('Appointment created successfully!');
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Failed to save the appointment.');
    }
  };

  return (
    <div className={styles.AppointmentFormContainer}>
      <form onSubmit={handleSubmit}>
        <TextField
          id="name"
          name="name"
          label="Name"
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="registrationNo"
          name="registrationNo"
          label="Registration Number"
          variant="outlined"
          value={formData.registrationNo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="emailId"
          name="emailId"
          label="Email ID"
          variant="outlined"
          value={formData.emailId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="departmentName"
          name="departmentName"
          label="Department"
          variant="outlined"
          value={formData.departmentName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="year"
          name="year"
          label="Year"
          variant="outlined"
          value={formData.year}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          id="visitDate"
          name="visitDate"
          label="Visit Date"
          variant="outlined"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.visitDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AppointmentForm;
