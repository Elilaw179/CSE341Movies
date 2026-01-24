
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');


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
 *           example: Tom Hanks
 *         age:
 *           type: integer
 *           example: 65
 *         country:
 *           type: string
 *           example: USA
 *         movies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Forrest Gump", "Toy Story"]
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
    const result = await db.collection('actors').find().toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /actors/{id}:
 *   get:
 *     summary: Get an actor by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actor object
 */
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const actorId = new ObjectId(req.params.id);
    const result = await db.collection('actors').findOne({ _id: actorId });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 



/**
 * @swagger
 * /actors:
 *   post:
 *     summary: Create a new actor
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
 
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const actor = {
      name: req.body.name,
      age: req.body.age,
      country: req.body.country,
      movies: req.body.movies
    };
    const result = await db.collection('actors').insertOne(actor);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 

/**
 * @swagger
 * /actors/{id}:
 *   put:
 *     summary: Update an actor
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
 *     responses:
 *       204:
 *         description: Actor updated
 */


router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const actorId = new ObjectId(req.params.id);
    const actor = {
      name: req.body.name,
      age: req.body.age,
      country: req.body.country,
      movies: req.body.movies
    };
    const result = await db.collection('actors').replaceOne({ _id: actorId }, actor);
    if (result.modifiedCount > 0) res.status(204).send();
    else res.status(500).json({ error: 'Failed to update actor' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 
/**
 * @swagger
 * /actors/{id}:
 *   delete:
 *     summary: Delete an actor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actor deleted successfully
 *       500:
 *         description: Failed to delete actor
 */


router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const actorId = new ObjectId(req.params.id);
    const result = await db.collection('actors').deleteOne({ _id: actorId });
    if (result.deletedCount > 0) res.status(200).json({ message: 'Actor deleted' });
    else res.status(500).json({ error: 'Failed to delete actor' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
