import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";

const Addpost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const { user, token } = useAuth();

  const handlePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", user.id);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/posts/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        title: "Post Added Successfully",
        toast: true,
        icon: "success",
        timer: 1200,
        position: "top",
      });
      navigate("/post");
    } catch (error) {
      Swal.fire({
        title: "Failed to add post. Please check your input and try again.",
        toast: true,
        icon: "error",
        timer: 1200,
        position: "top",
      });
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="wrapper-r">
      <div className="form-box login">
        <form onSubmit={handlePost}>
          <h1>Add Post</h1>
          <div className="input-box">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              maxLength={200}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <label>Description *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              maxLength={200}
              // required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <label>Profile Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </div>
          <button type="submit">Add Post</button>
        </form>
      </div>
    </div>
  );
};

export default Addpost;
