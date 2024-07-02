import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext"; // Update the path accordingly

const UserProfile = () => {
  const { token, refreshAccessToken } = useAuth();
  const [user, setUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    image: "",
  });
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user-logged/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setImagePreview(response.data.image);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response && error.response.status === 401) {
          try {
            await refreshAccessToken();
            const refreshedToken = localStorage.getItem("token");
            const response = await axios.get(
              "http://localhost:8000/user-logged/",
              {
                headers: {
                  Authorization: `Bearer ${refreshedToken}`,
                },
              }
            );
            setUser(response.data);
            setImagePreview(response.data.image);
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
          }
        }
      }
    };
    if (token) {
      fetchUserProfile();
    }
  }, [token, refreshAccessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser((prevUser) => ({
      ...prevUser,
      image: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    navigate("/post");

    try {
      const formData = new FormData();
      Object.keys(user).forEach((key) => {
        formData.append(key, user[key]);
      });

      const response = await axios.put(
        "http://127.0.0.1:8000/user-logged/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("User profile saved successfully:", response.data);
      navigate("/post");
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSave}>
      <div className="flex p-4">
        <div className="w-1/3 flex flex-col items-center">
          <h1>Update Profile</h1>
        </div>
        <div className="w-2/3 p-4">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">Username:</label>
              <input
                type="text"
                name="username"
                value={user.username}
                className="border rounded w-full py-2 px-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                type="text"
                name="email"
                value={user.email}
                className="border rounded w-full py-2 px-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">First Name:</label>
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                className="border rounded w-full py-2 px-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={user.last_name}
                className="border rounded w-full py-2 px-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Bio:</label>
              <input
                type="text"
                name="bio"
                value={user.bio}
                className="border rounded w-full py-2 px-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="input-box">
              <label>Profile Image</label>
              <input
                type="file"
                name="image"
                src={user.image}
                className="border rounded w-full py-2 px-3"
                onChange={handleFileChange}
                style={{ backgroundColor: "black" }}
              />
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-4"
              type="submit"
              style={{ backgroundColor: "black", width: "200px" }}
            >
              <span role="img" aria-label="Save">
                &#128190;
              </span>{" "}
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserProfile;
