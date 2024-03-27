import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api/posts/';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null });

  useEffect(() => {
    axios.get(API_URL)
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setNewPost({ ...newPost, image: e.target.files[0] });
    } else {
      setNewPost({ ...newPost, [e.target.name]: e.target.value });
    }
  };

  const handleAddPost = () => {
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    formData.append('image', newPost.image);

    axios.post(API_URL, formData)
      .then(response => {
        setPosts([...posts, response.data]);
        setNewPost({ title: '', content: '', image: null });
      })
      .catch(error => console.error('Error adding post:', error));
  };

  const handleDeletePost = (postId) => {
    axios.delete(`${API_URL}${postId}/`)
      .then(() => {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
      })
      .catch(error => console.error('Error deleting post:', error));
  };


  const handleLikePost = (postId) => {
    axios.post(`${API_URL}${postId}/`)
      .then(response => {
        const updatedPosts = posts.map(post => {
          if (post.id === postId) {
            return { ...post, likes: response.data.likes };
          }
          return post;
        });
        setPosts(updatedPosts);
      })
      .catch(error => console.error('Error liking post:', error));
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">My Blog</h1>

      <div className="mb-4">
        <h2>Add New Post</h2>
        <form encType="multipart/form-data">
          <div className="mb-3">
            <input  
              type="text"
              className="form-control"
              placeholder="Title"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Content"
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={handleInputChange}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleAddPost}>
            Add Post
          </button>
        </form>
      </div>

      <div className="row">
        {posts.map(post => (
          <div key={post.id} className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h3 className="card-title">{post.title}</h3>
                <p className="card-text">{post.content}</p>
                {post.image && (
                  <img
                    src={`http://127.0.0.1:8000${post.image}`}
                    alt="Post"
                    className="img-fluid mb-3"
                  />
                )}
                <p>Likes: {post.likes}</p>
                <button
                  type="button"
                  className="btn btn-primary mr-2"
                  onClick={() => handleLikePost(post.id)}
                >
                  Like
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
