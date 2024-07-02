import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import Addpost from "./components/Addpost";
import UserProfile from "./components/UserProfile";
import { useContext, useState } from "react";
import { AuthProvider } from "./AuthContext";
import UpdatePost from "./components/UpdatePost";
import SinglePost from "./components/SinglePost";
import Posts from "./components/post";
// import { PostsProvider } from "./components/PostContext";

function App() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({});

  return (
    <AuthProvider>
      {({ user = "Sign In" }) => (
          <Router>
            <NavBar user={user} posts={posts} />
            <Routes>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/addpost" element={<Addpost />} />
              {/* <Route path="/Navbar" element={<NavBar user={user} />} /> */}
              <Route path="/post" element={<Posts posts={posts} />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/update-post/:postId/" element={<UpdatePost />} />
              <Route path="/single-post/:postId/" element={<SinglePost />} />
              <Route path="/" element={<Login setUser={setUser} />} />
            </Routes>
          </Router>
      )}
    </AuthProvider>
  );
}

export default App;
