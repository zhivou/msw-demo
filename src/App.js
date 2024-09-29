import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Container, TextField, Card, CardContent, Box, Typography, Modal } from '@mui/material';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const [editPost, setEditPost] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetch('/posts')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []);

  const createPost = () => {
    fetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    })
      .then(response => response.json())
      .then(post => setPosts([...posts, post]));
  };

  const updatePost = async () => {
    try {
      console.log('Updating post:', editPost);
      const response = await fetch(`/posts/${editPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost = await response.json();
      console.log('Updated post response:', updatedPost);
      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
      handleCloseModal();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = (id) => {
    fetch(`/posts/${id}`, { method: 'DELETE' })
      .then(() => setPosts(posts.filter(post => post.id !== id)));
  };

  const handleOpenModal = (post) => {
    setEditPost(post);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditPost(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>MSW for demoes example</p>
      </header>
      
      <Container maxWidth="lg">
        <Card sx={{ mt: 4, borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              Posts
            </Typography>
            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Content</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map(post => (
                    <TableRow key={post.id}>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{post.content}</TableCell>
                      <TableCell><em>{post.author}</em></TableCell>
                      <TableCell>
                        <Button variant="outlined" onClick={() => handleOpenModal(post)}>Edit</Button>
                        <Button onClick={() => deletePost(post.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Create Post
              </Typography>
              <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                <TextField
                  label="Title"
                  variant="outlined"
                  value={newPost.title}
                  onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                />
                <TextField
                  label="Content"
                  variant="outlined"
                  value={newPost.content}
                  onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                />
                <TextField
                  label="Author"
                  variant="outlined"
                  value={newPost.author}
                  onChange={e => setNewPost({ ...newPost, author: e.target.value })}
                />
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={createPost}>Create</Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="edit-post-modal"
          aria-describedby="modal-to-edit-post"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Edit Post
            </Typography>
            {editPost && (
              <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                <TextField
                  label="Title"
                  variant="outlined"
                  value={editPost.title}
                  onChange={e => setEditPost({ ...editPost, title: e.target.value })}
                />
                <TextField
                  label="Content"
                  variant="outlined"
                  value={editPost.content}
                  onChange={e => setEditPost({ ...editPost, content: e.target.value })}
                />
                <TextField
                  label="Author"
                  variant="outlined"
                  value={editPost.author}
                  onChange={e => setEditPost({ ...editPost, author: e.target.value })}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={handleCloseModal} sx={{ mr: 1 }}>Cancel</Button>
                  <Button variant="contained" onClick={updatePost}>Save</Button>
                </Box>
              </Box>
            )}
          </Box>
        </Modal>
      </Container>
    </div>
  );
}

export default App;
