import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

function LoginPage() {
  let emailRef = useRef();
  let passwordRef = useRef();
  let dispatchObj = useDispatch();
  let navObject = useNavigate();

  let [loading, setLoading] = useState(false);
  let [errors, setErrors] = useState({ email: '', password: '' });

  // axios.defaults.baseURL = 'http://localhost:4444';

  // Live input validation
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

  let userLogin = async () => {
    if (errors.email || errors.password) return;

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    if (!email || !password) {
      alert('enter the email and password')
      return;
    }
      
    try {
      setLoading(true);
      let response = await axios.get(`/login/${email}/${password}`);

      console.log('teh response data in client side is:',response.data)
      if (response.data.status === 'success') {
        alert(response.data.message)
        dispatchObj({ type: 'employeesLogData', data: response.data.data });
        navObject('/DashBoard', { state: { message: 'Welcome to Admin Dashboard' } });
      } else {
        setErrors({ ...errors, password: response.data.message || "Invalid credentials." });
      }
    } catch (error) {
      setErrors({ ...errors, password: error.response?.data?.message || "Server error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='loginform-container'>
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Admin Login</legend>

          <div>
            <label>Email</label>
            <input
              type='email'
              required
              ref={emailRef}
              onChange={() => handleInputChange("email")}
            />
            {errors.email && <p style={{ color: 'red', fontSize: '0.75rem',fontWeight:'bold' }}>{errors.email}</p>}
          </div>

          <div>
            <label>Password</label>
            <input
              type='password'
              required
              ref={passwordRef}
              onChange={() => handleInputChange("password")}
            />
            {errors.password && <p style={{ color: 'red', fontSize: '0.75rem',fontWeight:'bold' }}>{errors.password}</p>}
          </div>

          <div>
            <button
              type='button'
              disabled={loading || errors.email || errors.password}
              onClick={userLogin}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </fieldset>
      </form>
      <br />
      <Link to='/Register'>Register here , if you have not Registered</Link>
    </div>
  );
}

export default LoginPage;
