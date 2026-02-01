
const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllMovies = async (req, res) => {
  try {
    const movies = await getDb().collection('movies').find().toArray();
    res.status(200).json(movies);
  } catch {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

// const createMovie = async (req, res) => {
//   try {
//     const { title, genre, year, rating, director, duration, language } = req.body;
//     if (!title || !genre || !year || !rating || !director || !duration || !language) {
//       return res.status(400).json({ error: 'All fields required' });
//     }
//     const result = await getDb().collection('movies').insertOne(req.body);
//     res.status(201).json({ id: result.insertedId });
//   } catch {
//     res.status(500).json({ error: 'Create failed' });
//   }
// };


const createMovie = async (req, res) => {
  try {
    const db = getDb();
    const { title, genre, director, releaseYear, rating, actors, boxOffice } = req.body;

    // ✅ VALIDATION
    if (!title) {
      return res.status(400).json({ error: 'Movie title is required' });
    }

    const movie = { title, genre, director, releaseYear, rating, actors, boxOffice };
    const result = await db.collection('movies').insertOne(movie);

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// const updateMovie = async (req, res) => {
//   try {
//     const id = new ObjectId(req.params.id);
//     const result = await getDb()
//       .collection('movies')
//       .replaceOne({ _id: id }, req.body);
//     result.modifiedCount
//       ? res.status(204).send()
//       : res.status(404).json({ error: 'Movie not found' });
//   } catch {
//     res.status(500).json({ error: 'Update failed' });
//   }
// };




const updateMovie = async (req, res) => {
  try {
    const db = getDb();
    const movieId = new ObjectId(req.params.id);
    const { title, genre, director, releaseYear, rating, actors, boxOffice } = req.body;

    // ✅ VALIDATION
    if (!title) {
      return res.status(400).json({ error: 'Movie title is required' });
    }

    const movie = { title, genre, director, releaseYear, rating, actors, boxOffice };

    const result = await db
      .collection('movies')
      .replaceOne({ _id: movieId }, movie);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const deleteMovie = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await getDb().collection('movies').deleteOne({ _id: id });
    result.deletedCount
      ? res.status(200).json({ message: 'Deleted' })
      : res.status(404).json({ error: 'Movie not found' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = { getAllMovies, createMovie, updateMovie, deleteMovie };
