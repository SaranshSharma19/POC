import { useState, useEffect } from "react";
import axios from "axios";

export function usePosts(useAuth, user) {
  const [pagination, setPagination] = useState({ next: null, prev: null });
  const baseURL = "http://localhost:8000";
  const [posts, setPosts] = useState([]);
  const [sortValue, setSortValue] = useState("Newest");
  const { token } = useAuth();
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const fetchPosts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${baseURL}/posts/?page=${page}&page_size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data.results", response.data.results);
      setPosts(response.data.results);
      setPagination({
        next: response.data.next,
        prev: response.data.previous,
      });
    } catch (err) {
      console.log("Error", err);
      setError(err);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [token]);

  const onSearch = async () => {
    fetch(`http://localhost:8000/posts/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((result) => {
        console.log("result", result);
        if (result && searchTerm.length > 0) {
          const filteredPosts = posts.filter((post) =>
            post.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setPosts(filteredPosts);
          console.log({ filteredPosts, searchTerm });
        } else if (result) {
          setPosts(result.results);
          console.log("posts ----- onSearch ", posts);
          console.log("user", user);
        } else {
          alert("Please enter search term");
        }
      });
  };

  const sortPosts = async () => {
    fetch(`http://localhost:8000/posts/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((result) => {
        const res = result.results;
        if (res && sortValue === "Newest") {
          const sortedPost = res.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          );
          setPosts(sortedPost);
        } else if (res && sortValue === "Oldest") {
          const sortedPost = res.sort(
            (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
          );
          setPosts(sortedPost);
        } else {
          alert("Please enter search term");
        }
      });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortValue(value);
    localStorage.setItem("sortValue", value);
    sortPosts();
  };
  return {
    posts,
    setPosts,
    fetchPosts,
    sortValue,
    setSortValue,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    onSearch,
    handleSortChange,
    baseURL,
    pagination,
    currentPage,
    setCurrentPage,
  };
}
