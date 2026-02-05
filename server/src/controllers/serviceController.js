const prisma = require('../utils/prisma');

// @desc    Create a service
// @route   POST /api/services
// @access  Private (Provider)
const createService = async (req, res) => {
  const { title, description, price, category } = req.body;

  try {
    const provider = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    let imageUrl = req.body.imageUrl; // Allow manual URL if provided
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const service = await prisma.service.create({
      data: {
        providerId: provider.id,
        title,
        description,
        price: parseFloat(price), // ensure float
        category,
        imageUrl,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  const { category, search } = req.query;

  try {
    const where = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        provider: {
          select: {
            user: { select: { name: true } },
            address: true,
            isVerified: true,
            id: true, // Needed for booking
          },
        },
      },
    });

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Provider)
const updateService = async (req, res) => {
  const { title, description, price, category } = req.body;

  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { provider: true },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check ownership
    // Retrieve provider profile for current user again to allow comparison
    const provider = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
    });
    
    if (service.providerId !== provider.id) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedService = await prisma.service.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        price,
        category,
      },
    });

    res.json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Provider)
const deleteService = async (req, res) => {
  try {
      const service = await prisma.service.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

     const provider = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (service.providerId !== provider.id) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    await prisma.service.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Service removed' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createService,
  getServices,
  updateService,
  deleteService,
};
