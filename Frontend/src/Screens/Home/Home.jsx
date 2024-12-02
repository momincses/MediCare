import React from "react";
import { useForm } from "react-hook-form";
import styles from "./Home.module.css";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";

import { Link } from "react-router-dom";

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,

    clearErrors, // To clear errors dynamically
  } = useForm({
    mode: "onChange",
  });

  const watchRole = watch("role"); // Watch the "role" field for changes

  // Clear the "role" error when a valid value is selected
  if (watchRole && errors.role) {
    clearErrors("role");
  }

  const onSubmit = (data) => {
    console.log("Form Submitted Successfully", data);
  };

  return (
    <div>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.logo}>MediCare</div>
        <div className={styles.nav}>
          <li> <a href="#instructions">Instructions</a></li>
          <li><a href="#login"> Login </a></li>
        </div>
      </div>

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.title}>MediCare</div>
        <img src="doctor.svg" alt="" />
        <div className={styles.description}>
          Effortless appointment booking, leave management, and instant teacher
          notifications for smooth campus health care
        </div>
        <div className={styles.btn}>Book Consultation ➤ </div>
      </div>

      <div className={styles.instructions} id="instructions">
        <div className={styles.BlockTitle}>Instructions</div>
        <div className={styles.instructionBlocks}>
          <div
            className={styles.instructionBlock}
            style={{ backgroundColor: "#A3DAC2" }}
          >
            <div className={styles.nos}>01</div>
            Go to the login page and enter your college email and password to
            log in.
          </div>
          <div
            className={styles.instructionBlock}
            style={{ backgroundColor: "#F0DA69" }}
          >
            <div className={styles.nos}>02</div>
            Navigate to the Appointment section and fill in the required details
            like reason and preferred time.
          </div>
          <div
            className={styles.instructionBlock}
            style={{ backgroundColor: "#e7c2c2" }}
          >
            <div className={styles.nos}>03</div>
            Click Submit to book your appointment and receive confirmation.
          </div>
          <div
            className={styles.instructionBlock}
            style={{ backgroundColor: "#92BDF6" }}
          >
            <div className={styles.nos}>04</div>
            After doctor approval, the leave report will be automatically sent
            to your teachers via email.
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className={styles.login} id="login">
        <div className={styles.BlockTitle}>Login</div>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.formTitle}>
            Enter your College Email for login
          </div>

          {/* Role Selection */}
          <FormControl
            sx={{
              width: "100%",
              maxWidth: 600,
              marginTop: "30px",
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": {
                color: "black",
                "& fieldset": { borderColor: "black" },
                "&.Mui-focused fieldset": { borderColor: "black" },
              },
            }}
            error={!!errors.role}
          >
            <InputLabel id="role-label">Login As</InputLabel>
            <Select
              labelId="role-label"
              defaultValue=""
              {...register("role", { required: "Please select a role" })}
              sx={{
                width: "100%",
                maxWidth: 600,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Teacher">Doctor</MenuItem>
            </Select>
            <FormHelperText>
              {errors.role && errors.role.message}
            </FormHelperText>
          </FormControl>

          {/* Email Field */}
          <FormControl
            sx={{
              width: "100%",
              maxWidth: 600,
              marginTop: "10px",
            }}
            error={!!errors.email}
          >
            <TextField
              label="Email"
              variant="outlined"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[0-9]{4}[a-zA-Z]{3,5}[0-9]{1,5}@sggs\.ac\.in$/,
                  message:
                    "Enter a valid college email address (e.g., 2022bcs100@sggs.ac.in)",
                },
              })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
              error={!!errors.email}
            />
            <FormHelperText>
              {errors.email && errors.email.message}
            </FormHelperText>
          </FormControl>

          {/* Password Field */}
          <FormControl
            sx={{
              width: "100%",
              maxWidth: 600,
              marginTop: "10px",
            }}
            error={!!errors.password}
          >
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
              error={!!errors.password}
            />
            <FormHelperText>
              {errors.password && errors.password.message}
            </FormHelperText>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "200px",
              marginTop: "20px",
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "gray" },
            }}
          >
            Login
          </Button>

          <div className={styles.formTitle} style={{ marginTop: "30px" }}>
            Dont have MediCare account? 
            
            <Button
            type="button"
            variant="contained"
            sx={{
              // width: "200px",
              marginTop: "-5px",
              // backgroundColor: "red",
              color: "white",
              "&:hover": { backgroundColor: "royalblue" },
            }}
          >
            <Link to='/register'>
            create now
            </Link>
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
