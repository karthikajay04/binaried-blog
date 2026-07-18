const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Server error fetching post' });
  }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Please provide title and content' });
    }

    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      author: req.user.id
    });

    // Populate author before returning
    const populatedPost = await post.populate('author', 'name email');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ error: 'Server error creating post' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (Author only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'User not authorized to update this post' });
    }

    // Update fields
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;

    const updatedPost = await post.save();
    const populatedPost = await updatedPost.populate('author', 'name email');

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error('Error updating post:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Server error updating post' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (Author only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'User not authorized to delete this post' });
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post removed successfully' });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Server error deleting post' });
  }
});

module.exports = router;
