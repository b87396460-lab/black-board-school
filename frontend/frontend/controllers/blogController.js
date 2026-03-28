const Blog = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create blog
// @route   POST /api/blog
// @access  Private Admin
const createBlog = asyncHandler(async (req, res) => {
    const { title, content, image } = req.body;

    const blog = await Blog.create({
        title,
        content,
        image,
        createdBy: req.user.id
    });

    res.status(201).json(blog);
});

module.exports = { createBlog };
