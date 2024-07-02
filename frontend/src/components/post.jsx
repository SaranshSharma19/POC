import React, { useEffect, useState } from "react";
import axios from "axios";
import "./post.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { usePosts } from "./posts_hook";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import styles from "./NavBar.module.css";
import Button from "react-bootstrap/Button";

const Posts = () => {
  const { user, token } = useAuth();
  const {
    posts,
    setPosts,
    fetchPosts: refetch,
    sortValue,
    searchTerm,
    setSearchTerm,
    onSearch,
    handleSortChange,
    pagination,
    currentPage,
    setCurrentPage,
  } = usePosts(useAuth, user);
  console.log("All Posts", posts);
  useEffect(() => {
    console.log("changed");
    console.log(posts);
  }, [posts]);

  const [newComment, setNewComment] = useState({});
  const history = useNavigate();
  const baseURL = "http://localhost:8000";
  const singlepost = true;

  const handleCommentChange = (postId, value) => {
    setNewComment((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = async (postId) => {
    const commentText = newComment[postId];
    if (!commentText) return;

    const commentData = {
      author: user.id,
      post: postId,
      text: commentText,
    };

    try {
      const response = await axios.post(`${baseURL}/comments/`, commentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Comment submitted:", response.data);
      refetch();
      setNewComment((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/like/${postId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: response.data.liked,
              like_count: response.data.like_count,
            }
          : post
      );
      refetch();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async (postId) => {
    fetch(`http://localhost:8000/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    })
      .then((resp) => resp.json(), console.log("Hi"))
      .then((result) => {
        console.log("result", result);
        if (
          result &&
          result.message !== "You are not authorized to perform this action"
        ) {
          refetch();
          const filteredPosts = posts.filter((post) => post.id !== postId);
          Swal.fire({
            title: "Post Deleted",
            toast: true,
            icon: "success",
            timer: 1200,
            position: "top",
          });
        } else {
          Swal.fire({
            title: "This is not your post",
            toast: true,
            icon: "error",
            timer: 1200,
            position: "top",
          });
        }
      });
  };
  const handleClick = (postId, post) => {
    console.log(postId);
    history(`/single-post/${postId}`, {
      state: {
        post,
        backUrl: window.location.href,
      },
    });
  };

  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage(currentPage + 1);
      refetch(currentPage + 1);
      setSearchTerm("");
      console.log("searchTerm", searchTerm);
    }
  };

  const handlePrevPage = () => {
    if (pagination.prev && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      refetch(currentPage - 1);
      setSearchTerm("");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [handlePrevPage, handleNextPage]);

  return (
    <div>
      <div className={styles["box"]}>
        <select
          className={styles["sorting"]}
          value={sortValue}
          onChange={handleSortChange}
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
        <Form className={`d-flex ${styles["search-form"]}`} role="search">
          <FormControl
            type="search"
            placeholder="Search"
            className={styles["search-input"]}
            aria-label="Search"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          <Button
            variant="outline-success"
            type="button"
            className={styles["button"]}
            value={searchTerm}
            onClick={onSearch}
          >
            Search
          </Button>
        </Form>
        <Link
          to="/addpost"
          className={`btn btn-primary btn-sm mr-4 but ${styles["btn-primary add"]}`}
          style={{ marginLeft: "50px" }}
        >
          Add Post
        </Link>
      </div>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <img
                src={`${baseURL}${post.author_image}`}
                alt={post.author}
                className="author-image"
              />
              <h3>{post.author}</h3>
            </div>
            <div className="Title">
              <p onClick={() => handleClick(post.id, post)}>{post.title}</p>
            </div>
            <div
              className="Description"
              onClick={() => handleClick(post.id, post)}
            >
              <p>{post.description}</p>
            </div>
            <img
              onClick={() => handleClick(post.id, post)}
              src={`${baseURL}${post.image}?#${post.title}_${post.description}`}
              alt="Post"
              className="post-image"
            />
            <div className="post-interactions">
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <img
                    src={`${baseURL}${comment.author_image}`}
                    alt={comment.author}
                    className="comment-author-image"
                  />
                  <p>
                    <strong>{comment.author}</strong>: {comment.text}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between mb-4 space-x-2">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`px-2 py-1 bg-white text-gray-800 rounded-md 
              ${post.liked ? "bg-blue-300" : "hover:bg-blue-300"} text-sm`}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  LIKE {post.likes.length}
                </button>
              </div>
              <div>
                <input
                  type="text"
                  value={newComment[post.id] || ""}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  placeholder="Add a comment..."
                  className="border rounded w-full py-2 px-3"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                  style={{ backgroundColor: "black" }}
                >
                  Submit
                </button>

                <div className="flex justify-between mb-4 space-x-2">
                  <button
                    onClick={() => handleDelete(post.id)}
                    className={`px-2 py-1 bg-white text-gray-800 rounded-md`}
                    style={{ backgroundColor: "black" }}
                  >
                    Delete
                  </button>
                </div>
                <div className="flex justify-between mb-4 space-x-2">
                  {user.username === post.author ? (
                    <Link
                      to={`/update-post/${post.id}`}
                      className="d-flex align-items-center"
                    >
                      Update
                    </Link>
                  ) : (
                    " "
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          <blockquote>Not Data Found</blockquote>
        </>
      )}
      <div className="Pagination_btn">
        <button onClick={handlePrevPage} disabled={!pagination.prev}>
          Previous
        </button>
        <span> Page {currentPage} </span>
        <button onClick={handleNextPage} disabled={!pagination.next}>
          {" "}
          Next
        </button>
      </div>
    </div>
  );
};

export default Posts;
