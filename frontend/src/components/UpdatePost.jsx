import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";
import { usePosts } from "./posts_hook";
import Posts from "./post";

const UpdatePost = () => {
  const { postId } = useParams(); // Extract postId from URL
  const { user, token, refreshAccessToken } = useAuth();
  const { fetchPosts: refetch } = usePosts(useAuth, user);
  const baseURL = "http://localhost:8000";
  const [post, setPost] = useState({
    title: "",
    description: "",
    image: null,
    author: user.id,
  });
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(post.image);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPost({
          title: response.data.title,
          description: response.data.description,
          image: response.data.image,
          author: response.data.author,
        });
        setImagePreview(response.data.image);
        console.log("Posts", post);
        // refetch();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            await refreshAccessToken();
            const refreshedToken = localStorage.getItem("token");
            const response = await axios.get(
              `http://localhost:8000/posts/${postId}`,
              {
                headers: {
                  Authorization: `Bearer ${refreshedToken}`,
                },
              }
            );
            setPost({
              title: response.data.title,
              description: response.data.description,
              image: response.data.image,
              author: response.data.author,
            });
            setImagePreview(response.data.image);
            // refetch();
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
          }
        }
      }
    };

    if (token) {
      fetchPost();
    }
  }, [token, refreshAccessToken, postId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPost((prevPost) => ({
      ...prevPost,
      image: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description);
      formData.append("author", post.author);
      if (post.image instanceof File) {
        formData.append("image", post.image);
      }

      const response = await axios.put(
        `http://localhost:8000/posts/${postId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        title: "Post Updated Successfully",
        toast: true,
        icon: "success",
        timer: 1200,
        position: "top",
      });
      navigate("/post");
    } catch (error) {
      Swal.fire({
        title: "Unable To Update Post ",
        toast: true,
        icon: "error",
        timer: 1200,
        position: "top",
      });
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSave}>
      <div className="flex p-4">
        <div className="w-1/3 flex flex-col items-center">
          <h1>Update Post</h1>
        </div>
        <div className="w-2/3 p-4">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">Title:</label>
              <input
                type="char"
                name="title"
                value={post.title}
                className="border rounded w-full py-2 px-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description:</label>
              <input
                type="text"
                name="description"
                value={post.description}
                className="border rounded w-full py-2 px-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Author:</label>
              <input
                type="string"
                name="author"
                value={post.author}
                className="border rounded w-full py-2 px-3"
              />
            </div>
            <div className="input-box">
              <label>Post Image</label>
              <img
                src={`${baseURL}${imagePreview}`}
                style={{ height: "100px", width: "100px" }}
                alt="Post"
                className="post-image"
              />
              <input
                type="file"
                name="image"
                src={`${baseURL}${post.image}`}
                className="border rounded w-full py-2 px-3"
                onChange={handleFileChange}
                style={{ backgroundColor: "black" }}
              />
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-4"
              type="submit"
              style={{
                backgroundColor: "black",
                width: "200px",
                marginTop: "110px",
              }}
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

export default UpdatePost;
