 

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { checkJwt } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - genre
 *         - director
 *         - releaseYear
 *         - rating
 *         - actors
 *         - boxOffice
 *       properties:
 *         title:
 *           type: string
 *           example: Inception
 *         genre:
 *           type: string
 *           example: Sci-Fi
 *         director:
 *           type: string
 *           example: Christopher Nolan
 *         releaseYear:
 *           type: integer
 *           example: 2010
 *         rating:
 *           type: number
 *           example: 8.8
 *         actors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Leonardo DiCaprio"]
 *         boxOffice:
 *           type: string
 *           example: $829 million
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of movies
 */
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const movies = await db.collection('movies').find().toArray();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 */
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const movie = await db.collection('movies')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie created
 *       400:
 *         description: Validation error
 */
router.post('/', checkJwt, async (req, res) => {
  try {
    const movie = req.body;

    if (
      !movie.title ||
      !movie.genre ||
      !movie.director ||
      movie.releaseYear === undefined ||
      movie.rating === undefined ||
      !Array.isArray(movie.actors) ||
      !movie.boxOffice
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDb();
    const result = await db.collection('movies').insertOne(movie);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update movie
 *     tags: [Movies]
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
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       204:
 *         description: Movie updated
 *       404:
 *         description: Movie not found
 */
router.put('/:id', checkJwt, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('movies').replaceOne(
      { _id: new ObjectId(req.params.id) },
      req.body
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted
 *       404:
 *         description: Movie not found
 */
router.delete('/:id', checkJwt, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('movies')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
