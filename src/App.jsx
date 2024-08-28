import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar/Navbar";
import emptybox from "../src/assets/empty-box.png";
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });

  const [editing, setEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  const inputRef = useRef(null);

  // Get a Data

  useEffect(() => {
    axios
      .get("http://localhost:4000/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log("something went Wrong"));
  }, []);

  // post a newdata

  const addpost = () => {
    console.log("New post data:", newPost);

    axios
      .post("http://localhost:4000/posts", newPost)
      .then((res) => {
        setPosts([...posts, res.data]);
        setNewPost({ title: "", content: "" });
        toast.success('Add Post successfully!');
      })
      .catch((err) => console.error("Something went wrong:", err));
  };

  // DeletePost

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:4000/posts/${id}`)
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
        toast.success('Post deleted successfully!');
      })
      .catch((err) => console.log("Something Went wrong"));
     
  };

  const handleSubmit = () => {
    if (!newPost.title || !newPost.content) {
      alert("Please fill in both the title and content fields.");
      return;
    }

    if (editing) {
      updatePost();
    } else {
      addpost();
    }
  };

  // put

  const updatePost = () => {
    axios
      .put(`http://localhost:4000/posts/${currentPostId}`, newPost)
      .then((res) => {
        setPosts(
          posts.map((post) => (post.id === currentPostId ? res.data : post))
        );
        setNewPost({ title: "", content: "" });
        setEditing(false);
        setCurrentPostId(null);
        toast.success('Update Post successfully!');
      })
      .catch((err) => console.error("Something went wrong:", err));
  };

  // fill the data

  const handleEditClick = (post) => {
    setNewPost({ title: post.title, content: post.content });
    setEditing(true);
    setCurrentPostId(post.id);
    inputRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div
          className="mb-5 border p-5 border-warning bg-light rounded-5 shadow-lg"
          ref={inputRef}
        >
          <input
            type="text"
            className="form-control mb-2"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Enter a title details...."
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter your Comments here ..."
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            className="btn btn-outline-warning  shadow-lg rounded-4 fw-bold mt-2 px-5 p-2"
          >
            {editing ? "Update" : "Create"}
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center ">
            <p className=" display-6">No posts Available </p>
            <img src={emptybox} alt="" className="emptyboxcss" />
          </div>
        ) : (
          <ul className="list-group mb-4 gap-2  ">
            {posts.map((post) => (
              <li key={post.id} className="list-group-item ">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <div className="d-flex gap-2 ">
                  <button
                    onClick={() => handleEditClick(post)}
                    className="btn btn-outline-warning px-4"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="btn btn-outline-danger px-4"
                  >
                    Delete{" "}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default App;
