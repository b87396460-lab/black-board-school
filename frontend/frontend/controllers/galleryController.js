const Gallery = require('../models/Gallery');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Add gallery image
// @route   POST /api/gallery
// @access  Private Admin
const addGalleryImage = asyncHandler(async (req, res) => {
    const { imageUrl, caption } = req.body;

    const galleryItem = await Gallery.create({
        imageUrl,
        caption,
        createdBy: req.user.id
    });

    res.status(201).json(galleryItem);
});

module.exports = { addGalleryImage };
