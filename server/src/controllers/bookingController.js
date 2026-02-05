const prisma = require('../utils/prisma');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Client)
const createBooking = async (req, res) => {
  const { serviceId, providerId, date, notes } = req.body;

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Prevent double booking (simple check)
    // In real world, check availability slots
    const existing = await prisma.booking.findFirst({
      where: {
        providerId,
        date: new Date(date),
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });

    if (existing) {
        return res.status(400).json({ message: 'Slot already booked' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        providerId,
        serviceId,
        date: new Date(date),
        notes,
        status: 'PENDING',
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    let where = {};

    if (req.user.role === 'CLIENT') {
      where.userId = req.user.id;
    } else if (req.user.role === 'PROVIDER') {
      // Find provider profile id
      const provider = await prisma.providerProfile.findUnique({ where: { userId: req.user.id } });
      if (!provider) return res.status(404).json({ message: 'Provider profile not found' });
      where.providerId = provider.id;
    } 
    // Admin sees all (empty where)

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
        client: { select: { name: true, email: true } },
        provider: { select: { user: { select: { name: true } } } },
      },
        orderBy: { date: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Provider/Client)
const updateBooking = async (req, res) => {
  const { status } = req.body; // ACCEPTED, REJECTED, CANCELLED, COMPLETED

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Logic to check permissions
    // Provider can Accept/Reject/Complete
    // Client can Cancel
    // Logic to check permissions
    // Provider can Accept/Reject/Complete
    // Client can Cancel or Mark as Complete
    if (req.user.role === 'CLIENT' && !['CANCELLED', 'COMPLETED'].includes(status)) {
        return res.status(403).json({ message: 'Clients can only Cancel or Complete bookings' });
    }
    
    // TODO: Add more strict checks if necessary (e.g. only if already accepted)
    
    const updated = await prisma.booking.update({
        where: { id: parseInt(req.params.id) },
        data: { status }
    });
    
    // Create Notification
    let notifyUserId = booking.userId;
    if (req.user.id === booking.userId) { // If client updated, notify provider (need to lookup provider user id)
         // implementation skipped for brevity
    } else {
        // Provider updated, notify client
         await prisma.notification.create({
            data: {
                userId: notifyUserId,
                message: `Your booking status is now ${status}`
            }
        });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
};
