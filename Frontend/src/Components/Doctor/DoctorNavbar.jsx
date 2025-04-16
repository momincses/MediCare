// src/Components/Doctor/DoctorNavbar.jsx

import React from "react";
import { AppBar, Toolbar, Button, Tabs, Tab } from "@mui/material";

const DoctorNavbar = ({ onTodayClick, onDateClick, filter, onFilterChange }) => {
  return (
    <AppBar position="static" color="default" sx={{ px: 2, width : "100vw"
     }}>
      <Toolbar sx={{ flexWrap: "wrap", justifyContent: "space-between" }}>
        <div>
          <Button onClick={onTodayClick} variant="outlined" sx={{ mr: 2 }}>
            Today
          </Button>
          <Button onClick={onDateClick} variant="outlined">
            Pick Date
          </Button>
        </div>
        <Tabs
          value={filter}
          onChange={(e, newValue) => onFilterChange(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="all" label="All" />
          <Tab value="pending" label="Pending" />
          <Tab value="accepted" label="Approved" />
          <Tab value="rejected" label="Rejected" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default DoctorNavbar;
