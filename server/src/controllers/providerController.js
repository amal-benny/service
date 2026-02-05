const prisma = require('../utils/prisma');

// @desc    Update provider profile
// @route   PUT /api/providers/profile
// @access  Private (Provider only)
const updateProfile = async (req, res) => {
  const { phone, address, bio, idProofUrl, services } = req.body; // Services is array of { title, description, price, category }

  try {
    const profile = await prisma.providerProfile.update({
      where: { userId: req.user.id },
      data: {
        phone,
        address,
        bio,
        idProofUrl,
      },
    });

    // Update services if provided
    if (services && services.length > 0) {
      // For simplicity, delete all old services and create new ones (or handle updates selectively)
      // Here we just add new ones for simplicity or could be more complex
      // Better approach: Create separate endpoints for Service CRUD
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get provider profile by ID
// @route   GET /api/providers/:id
// @access  Public
const getProviderById = async (req, res) => {
  try {
    const provider = await prisma.providerProfile.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { name: true, email: true } },
        services: true,
        reviews: true,
      },
    });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all providers (with search)
// @route   GET /api/providers
// @access  Public
const getProviders = async (req, res) => {
  try {
    const providers = await prisma.providerProfile.findMany({
      where: {
        isVerified: true, // Only show verified providers
      },
      include: {
        user: { select: { name: true } },
        services: true,
      },
    });
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateProfile,
  getProviderById,
  getProviders,
};
