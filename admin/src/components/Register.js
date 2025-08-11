import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  let emailRef = useRef();
  let passwordRef = useRef();
  let [loading, setLoading] = useState(false);
  let [errors, setErrors] = useState({ email: '', password: '' });

  axios.defaults.baseURL = 'http://localhost:4444';

  // Live validation on typing
  let handleInputChange = (field) => {
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    let newErrors = { ...errors };

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        newErrors.email = "Email is required.";
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Email must be in the format: example@domain.com";
      } else {
        newErrors.email = "";
      }
    }

    if (field === "password") {
      if (!password) {
        newErrors.password = "Password is required.";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long.";
      } else {
        newErrors.password = "";
      }
    }

    setErrors(newErrors);
  };

  let registerUser = async () => {
    // Prevent submit if there are any errors
    if (errors.email || errors.password) return;

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!email || !password) return;

    try {
      setLoading(true);

      let dataToSend = new FormData();
      dataToSend.append('email', email);
      dataToSend.append('password', password);

      let response = await axios.post('/register', dataToSend);

      alert(response.data.message);

      // Reset form
      emailRef.current.value = "";
      passwordRef.current.value = "";
      setErrors({ email: '', password: '' });

    } catch (error) {
      setErrors({ ...errors, email: error.response?.data?.message || "Server error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='registerform-container'>
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Register</legend>
          <div>
            <label>Email</label>
            <input
              type='email'
              ref={emailRef}
              onChange={() => handleInputChange("email")}
            />
            {errors.email && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.email}</p>}
          </div>

          <div>
            <label>Password</label>
            <input
              type='password'
              ref={passwordRef}
              onChange={() => handleInputChange("password")}
            />
            {errors.password && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.password}</p>}
          </div>

          <div>
            <button
              type='button'
              disabled={loading || errors.email || errors.password}
              onClick={registerUser}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </fieldset>
      </form>

      <br />
      <Link to='/'>← Back to Login</Link>
    </div>
  );
}

export default Register;
