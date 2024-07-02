import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaUserCircle } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./NavBar.module.css";
import Posts from "./post";
import { useAuth, AuthProvider } from "../AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import SinglePost from "./SinglePost";
import { usePosts } from "./posts_hook";
function NavBar({ user }) {
  const baseURL = "http://localhost:8000";
  const { logout, token } = useAuth();

  const {
    posts,
    setPosts,
    fetchPosts: refetch,
    sortValue,
    setSortValue,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    onSearch,
    handleSortChange,
  } = usePosts(useAuth, user);
  const handleLogOut = () => {
    logout(null, null, null);
    // Navigate("/login");
  };
  // const fetchPosts = async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}/posts/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log("response.data.results", response.data.results);
  //     setPosts(response.data.results);
  //   } catch (err) {
  //     console.log("Error", err);
  //     setError(err);
  //   }
  // };
  // useEffect(() => {
  //   fetchPosts();
  // }, [token]);

  return (
    <div>
      <Navbar bg="light" expand="lg" className={styles.navbar}>
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          <Navbar.Brand as={Link} to="/" className={styles["navbar-brand"]}>
            Linked <FaLinkedin />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent" />
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link as={Link} to="/post">
                Home
              </Nav.Link>
            </Nav>
            {user ? (
              <Link
                to="/login"
                className={`btn btn-primary btn-sm mr-4 button ${styles["btn-primary"]}`}
                style={{ marginLeft: "50px" }}
                onClick={handleLogOut}
              >
                Logout
              </Link>
            ) : (
              " "
            )}
            <Nav className={styles["nav-user"]}>
              {console.log("user", user)}
              {user ? (
                <Link to="/profile" className="d-flex align-items-center">
                  <img
                    className={styles["image-css"]}
                    src={`${baseURL}${user.image}`}
                    alt="image"
                  />
                  {user.username || "--"}
                </Link>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
