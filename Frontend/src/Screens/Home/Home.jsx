import React, { useState } from "react";
import styles from "./Home.module.css";

const Home = () => {
  const [studentLogin, setStudentLogin] = useState(true);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.logo}>MediCare</div>
        <div className={styles.nav}>
          <li>Instructions</li>
          <li>Login</li>
        </div>
      </div>
      <div className={styles.hero}>
        <div className={styles.title}>MediCare</div>
        <img src="doctor.svg" alt="" />

        <div className={styles.description}>
          Effortless appointment booking, leave management, and instant teacher
          notifications for smooth campus health care
        </div>
        <div className={styles.btn}>Book Consultation ➤ </div>
      </div>
      <div className={styles.instructions}>
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
      <div className={styles.login}>
        <div className={styles.BlockTitle}>Login</div>

        <div className={styles.form}>
          <div className={`${styles.loginAs} `}>
            <p className={styles.BlockTitle}>Login As</p>
            <div className={styles.loginAsBtns}>
              <div className={`${styles.loginAsBtn} ${studentLoginstyles.selected}`} > Student</div>
              <div className={`${styles.loginAsBtn}`}>Doctor</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
