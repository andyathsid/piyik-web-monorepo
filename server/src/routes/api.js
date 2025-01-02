const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const prisma = require('../config/prisma');

// Get data from both Firebase and Prisma
router.get('/data', async (req, res) => {
  try {
    // Get Firebase data
    const firebaseData = await db.ref('test')
      .limitToFirst(10)
      .once('value')
      .then(snapshot => snapshot.val());

    // Get Prisma data
    const prismaData = await prisma.user.findMany({
      take: 10
    });

    res.json({
      success: true,
      data: {
        firebase: firebaseData,
        database: prismaData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add data to both Firebase and Prisma
router.post('/data', async (req, res) => {
  try {
    const { name, email } = req.body;

    // Add to Firebase
    const firebaseRef = await db.ref('test').push({
      name,
      email,
      timestamp: admin.database.ServerValue.TIMESTAMP
    });

    // Add to Prisma
    const prismaUser = await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        name: name,
      },
      create: {
        email: email,
        name: name,
      },
    });

    res.json({
      success: true,
      data: {
        firebase: { id: firebaseRef.key },
        database: prismaUser
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
    res.json({
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;