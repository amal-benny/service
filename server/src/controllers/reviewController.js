const prisma = require('../utils/prisma');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private (Client)
const createReview = async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id) {
       return res.status(401).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'COMPLETED') {
        return res.status(400).json({ message: 'Booking must be completed to review' });
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        reviewerId: req.user.id,
        providerId: booking.providerId,
        rating,
        comment,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createReview };
