const bcrypt = require('bcrypt'); // Added bcrypt for password hashing
const prisma = require('../utils/prisma');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        providerProfile: { select: { id: true, isVerified: true } }, // Included id
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify provider
// @route   PUT /api/admin/verify/:id
// @access  Private/Admin
const verifyProvider = async (req, res) => {
  try {
    const provider = await prisma.providerProfile.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const updatedProvider = await prisma.providerProfile.update({
      where: { id: parseInt(req.params.id) },
      data: { isVerified: true },
    });

    res.json(updatedProvider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin reset user password
// @route   PUT /api/admin/reset-password/:id
// @access  Private/Admin
const adminResetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = parseInt(req.params.id);

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all support messages
// @route   GET /api/admin/support
// @access  Private/Admin
const getSupportMessages = async (req, res) => {
  try {
    const messages = await prisma.supportMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update support message status
// @route   PUT /api/admin/support/:id
// @access  Private/Admin
const updateSupportStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await prisma.supportMessage.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  verifyProvider,
  adminResetPassword,
  getSupportMessages,
  updateSupportStatus
};
