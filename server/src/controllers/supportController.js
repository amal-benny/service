const prisma = require('../utils/prisma');

// @desc    Create a support message
// @route   POST /api/support
// @access  Public (or authenticated)
const createSupportMessage = async (req, res) => {
  const { name, email, subject, message, userId } = req.body;

  try {
    const supportMessage = await prisma.supportMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        userId: userId ? parseInt(userId) : null,
      },
    });

    res.status(201).json(supportMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user's support messages
// @route   GET /api/support/my-messages
// @access  Private
const getUserSupportMessages = async (req, res) => {
  try {
    const messages = await prisma.supportMessage.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSupportMessage,
  getUserSupportMessages,
};
