import { http, HttpResponse } from 'msw'
import { Map } from 'immutable'
import { posts as initialPosts } from '../data/posts.js';

/**
 * Mock Service Worker (MSW) handlers for Post-related API endpoints.
 * 
 * This module defines handlers for CRUD operations on posts:
 * - GET /posts: Retrieve all posts
 * - POST /posts: Create a new post
 * - GET /posts/:id: Retrieve a specific post
 * - PUT /posts/:id: Update a specific post
 * - DELETE /posts/:id: Delete a specific post
 * 
 * The handlers use an Immutable.js Map to store posts in memory,
 * simulating a database for testing and development purposes.
 * 
 * @module postHandlers
 */


const allPosts = new Map(initialPosts.map(post => [post.id, post]));

export const handlers = [
    // INDEX
    http.get('/posts', () => {
        console.log('GET /posts', Array.from(allPosts.entries()));
        return HttpResponse.json(Array.from(allPosts.values()))
    }),

    // CREATE
    http.post('/posts', async ({ request }) => {
        const newPost = await request.json();
        const postId = Date.now().toString();
        newPost.id = postId;
        allPosts = allPosts.set(postId, newPost);  // Reassign updated Map
        console.log('POST /posts', newPost, Array.from(allPosts.entries()));
        return HttpResponse.json(newPost, { status: 201 });
    }),

    // SHOW
    http.get('/posts/:id', ({ params }) => {
        console.log('GET /posts/:id', params.id, allPosts.has(params.id));
        const post = allPosts.get(params.id);
        if (!post) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(post);
    }),

    // UPDATE
    http.put('/posts/:id', async ({ params, request }) => {
        console.log('PUT /posts/:id', params.id, allPosts.has(params.id));
        const existingPost = allPosts.get(params.id);
        if (!existingPost) {
            return new HttpResponse(null, { status: 404 });
        }
        const updatedPost = await request.json();
        updatedPost.id = params.id;
        allPosts = allPosts.set(params.id, updatedPost);  // Reassign updated Map
        console.log('Updated post', updatedPost);
        return HttpResponse.json(updatedPost);
    }),

    // DELETE
    http.delete('/posts/:id', ({ params }) => {
        console.log('DELETE /posts/:id', params.id, allPosts.has(params.id));
        const post = allPosts.get(params.id);
        if (!post) {
            return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        allPosts = allPosts.delete(params.id);  // Reassign updated Map
        return HttpResponse.json(post);
    }),
];