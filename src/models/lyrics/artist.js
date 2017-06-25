import mongoose from 'mongoose';
import config from '../../config';

const COLLECTION_NAME = 'artists';

let connection = mongoose.createConnection(config.LYRICS_DB_URL);

const schema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
  },

  name: {
    type: String,
    required: true,
  },

  link: {
    type: String,
  },

  songs: [{
    type: Number,
    ref: 'songs',
  }],

  analysis: {
    language: String,
    score: Number,
    percent: Number,
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date,
    default: Date.now
  }
});

export default connection.model(COLLECTION_NAME, schema);
