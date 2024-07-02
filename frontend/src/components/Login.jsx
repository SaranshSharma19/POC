import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import "./LoginRegister.css";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        username,
        password,
      });
      const { access, refresh } = response.data;

      const userResponse = await axios.get(
        "http://localhost:8000/user-logged/",
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      login(access, refresh, userResponse.data);
      console.log(userResponse.data);
      console.log("hello2 : ", userResponse.data);
      setUser(userResponse.data);
      Swal.fire({
        title: "Logged In Successfully",
        toast: true,
        icon: "success",
        timer: 1200,
        position: "top",
      });
      navigate("/post");
    } catch (err) {
      Swal.fire({
        title: "Unable To Logged In",
        toast: true,
        icon: "error",
        timer: 1200,
        position: "top",
      });
      setError("Invalid username and password. Please retry.");
    }
  };

  const redirectToRegister = () => {
    navigate("/Register");
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          <div className="input-box">
            <label>Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username/Email"
              required
            ></input>
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <label>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            ></input>
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" required />
              Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit">Login</button>

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <button type="button" onClick={redirectToRegister}>
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
