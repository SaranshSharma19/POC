import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./LoginRegister.css";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("bio", bio);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/users/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Registration successful:", response.data);
      const user = { email, username, password };
      localStorage.setItem("user", JSON.stringify(user));
      Swal.fire({
        title: "Registered Successfully",
        toast: true,
        icon: "success",
        timer: 1200,
        position: "top",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      Swal.fire({
        title: "Failed to register. Please check your input and try again.",
        toast: true,
        icon: "error",
        timer: 1200,
        position: "top",
      });
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="wrapper-r">
      <div className="form-box login">
        <form onSubmit={handleRegister}>
          <h1>Registration</h1>

          <div className="input-box">
            <label>Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              maxLength={150}
              required
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <MdEmail className="icon" />
          </div>

          <div className="input-box">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <FaLock className="icon" />
          </div>

          <div className="input-box">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>

          <div className="input-box">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>

          <div className="input-box">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
            />
          </div>

          <div className="input-box">
            <label>Profile Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" required />I agree to the terms &
              conditions
            </label>
          </div>

          <button type="submit">Register</button>

          <div className="login-link">
            <p>
              Already have an account?{" "}
              <button onClick={redirectToLogin}>Login</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
