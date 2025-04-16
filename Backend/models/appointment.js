const mongoose = require('mongoose');

// Appointment Schema
// Ye schema ek appointment ka structure define karta hai (name, registrationNo, emailId, etc.).
const appointmentSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true // Student ka naam lazmi hai
    },
    registrationNo: { 
      type: String, 
      required: true // Student ka registration number lazmi hai
    },
    emailId: { 
      type: String, 
      required: true // Student ka email lazmi hai
    },
    departmentName: { 
      type: String, 
      required: true // Student ka department ka naam (e.g., CS, ME) lazmi hai
    },
    year: { 
      type: String, 
      required: true // Student ka current year (e.g., 1st, 2nd) lazmi hai
    },
    visitDate: { 
      type: Date, 
      required: true // Appointment ki tareekh lazmi hai
    },
    appointmentStatus: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'], // Only allow these 3 values
      default: 'pending', // Optional default
      required: true 
    },
  },
  { 
    timestamps: true // Automatically createdAt aur updatedAt fields ko include karta hai
  }
);

// Model ko export karte hain
// Ye schema ko "Appointment" naam ke model ke taur par export karte hain.
module.exports = mongoose.model('Appointment', appointmentSchema);
