import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar/Navbar";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost , setNewPost] = useState({
    title: "",
    content:""
  });

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

  axios.post("http://localhost:4000/posts", newPost)
    .then((res) => {
      console.log("Post response:", res.data);
      setPosts([...posts, res.data]);
      setNewPost({ title: "", content: "" });
      
    })
    .catch((err) => console.error("Something went wrong:", err));
}



// DeletePost 

const deletePost = (id) => {
  axios.delete(`http://localhost:4000/posts/${id}`)
  .then(()=>{
    setPosts(posts.filter((post)=>post.id !== id));
  })
  .catch((err)=> console.log("Something Went wrong"));

}


const handleSubmit = () =>{
addpost()

}


  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="mb-5">
          <input
            type="text"
            className="form-control mb-2"
            onChange={(e)=>setNewPost({...newPost , title:e.target.value})}
            placeholder="Title"
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Content"
            onChange={(e)=>setNewPost({...newPost , content:e.target.value})}
          />

          <button onClick={handleSubmit} className="btn btn-success mt-2 px-3">Add Post </button>
        </div>

        <ul className="list-group mb-4 gap-2 ">
          {posts.map((post) => (
            <li key={post.id} className="list-group-item ">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <div className="d-flex gap-2 ">
                <button className="btn btn-warning px-4">Update</button>
                <button onClick={() => deletePost(post.id)} className="btn btn-danger px-4">Delete </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
