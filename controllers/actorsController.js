

const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllActors = async (req, res) => {
  try {
    const result = await getDb().collection('actors').find();
    res.status(200).json(await result.toArray());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingleActor = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });
    const actor = await getDb().collection('actors').findOne({ _id: new ObjectId(id) });
    res.status(200).json(actor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createActor = async (req, res) => {
  try {
    const actor = req.body;
    if (!actor.name || !actor.age || !actor.country || !actor.movies) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const response = await getDb().collection('actors').insertOne(actor);
    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateActor = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });
    const actor = req.body;
    await getDb().collection('actors').replaceOne({ _id: new ObjectId(id) }, actor);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteActor = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });
    await getDb().collection('actors').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: 'Actor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllActors, getSingleActor, createActor, updateActor, deleteActor };
