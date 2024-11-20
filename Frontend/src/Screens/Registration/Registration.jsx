import React from "react";
import { useForm } from "react-hook-form";
import styles from "../Home/Home.module.css";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";

const Registration = () => {
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
    console.log("Registration Successful", data);
  };

  return (
    <div>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.logo}>MediCare</div>
        <div className={styles.nav}>
          <li><a href="/#instruction">Instructions</a></li>
          <li><a href="/#login">Login</a></li>
        </div>
      </div>

      {/* Hero Section */}
      

      {/* Registration Section */}
      <div className={styles.login}>
        <div className={styles.BlockTitle}>Register</div>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.formTitle}>Create your MediCare Account</div>

          {/* Name Field */}
          <FormControl
            sx={{
              width: "100%",
              maxWidth: 600,
              marginTop: "10px",
            }}
            error={!!errors.name}
          >
            <TextField
              label="Full Name"
              variant="outlined"
              {...register("name", {
                required: "Name is required",
              })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
              error={!!errors.name}
            />
            <FormHelperText>{errors.name && errors.name.message}</FormHelperText>
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
                  message: "Enter a valid college email address",
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
            <FormHelperText>{errors.email && errors.email.message}</FormHelperText>
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
            <FormHelperText>{errors.password && errors.password.message}</FormHelperText>
          </FormControl>

          {/* Confirm Password Field */}
          <FormControl
            sx={{
              width: "100%",
              maxWidth: 600,
              marginTop: "10px",
            }}
            error={!!errors.confirmPassword}
          >
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
              error={!!errors.confirmPassword}
            />
            <FormHelperText>{errors.confirmPassword && errors.confirmPassword.message}</FormHelperText>
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
            Register
          </Button>

          <div className={styles.formTitle} style={{ marginTop: "30px" }}>
            Already have a MediCare account?{" "}
            <Button
              type="button"
              variant="contained"
              sx={{
                marginTop: "-5px",
                color: "white",
                "&:hover": { backgroundColor: "royalblue" },
              }}
            >
              <a href="/#login">Login</a>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
