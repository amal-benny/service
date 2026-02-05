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
        providerProfile: { select: { id: true, isVerified: true } },
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
  getSupportMessages,
  updateSupportStatus
};
