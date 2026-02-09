 

 const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { checkJwt } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Actor:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - country
 *         - movies
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *         country:
 *           type: string
 *         movies:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /actors:
 *   get:
 *     summary: Get all actors
 *     responses:
 *       200:
 *         description: List of actors
 */
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const actors = await db.collection('actors').find().toArray();
    res.status(200).json(actors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /actors/{id}:
 *   get:
 *     summary: Get actor by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actor found
 */
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const actor = await db
      .collection('actors')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!actor) return res.status(404).json({ error: 'Actor not found' });

    res.status(200).json(actor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /actors:
 *   post:
 *     summary: Create actor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actor'
 *     responses:
 *       201:
 *         description: Actor created
 */
router.post('/', checkJwt, async (req, res) => {
  try {
    const { name, age, country, movies } = req.body;
    if (!name || !age || !country || !movies) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDb();
    const result = await db.collection('actors').insertOne({ name, age, country, movies });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /actors/{id}:
 *   put:
 *     summary: Update actor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actor'
 */
router.put('/:id', checkJwt, async (req, res) => {
  try {
    const { name, age, country, movies } = req.body;
    if (!name || !age || !country || !movies) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDb();
    const result = await db.collection('actors').replaceOne(
      { _id: new ObjectId(req.params.id) },
      { name, age, country, movies }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /actors/{id}:
 *   delete:
 *     summary: Delete actor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', checkJwt, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('actors')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }

    res.status(200).json({ message: 'Actor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
