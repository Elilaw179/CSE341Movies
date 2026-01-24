
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');



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
 *           example: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"]
 *         boxOffice:
 *           type: string
 *           example: "$829M"
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 */
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('movies').find().toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 /**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie object
 */

router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const movieId = new ObjectId(req.params.id);
    const result = await db.collection('movies').findOne({ _id: movieId });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 
/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie created
 */


router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const movie = {
      title: req.body.title,
      genre: req.body.genre,
      director: req.body.director,
      releaseYear: req.body.releaseYear,
      rating: req.body.rating,
      actors: req.body.actors,
      boxOffice: req.body.boxOffice
    };
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
 *     summary: Update a movie
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
 */


router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const movieId = new ObjectId(req.params.id);
    const movie = {
      title: req.body.title,
      genre: req.body.genre,
      director: req.body.director,
      releaseYear: req.body.releaseYear,
      rating: req.body.rating,
      actors: req.body.actors,
      boxOffice: req.body.boxOffice
    };
    const result = await db.collection('movies').replaceOne({ _id: movieId }, movie);
    if (result.modifiedCount > 0) res.status(204).send();
    else res.status(500).json({ error: 'Failed to update movie' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 
/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted
 */


router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const movieId = new ObjectId(req.params.id);
    const result = await db.collection('movies').deleteOne({ _id: movieId });
    if (result.deletedCount > 0) res.status(200).json({ message: 'Movie deleted' });
    else res.status(500).json({ error: 'Failed to delete movie' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;







