import mongoose from 'mongoose';
import config from '../../config';

const COLLECTION_NAME = 'songs';

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

  lyrics: {
    type: String,
  },

  artist_id: {
    type: Number,
    ref: 'artist',
  },

  analysis: {
    language: String,
    stantzas: Number,
    lines: Number,
    length: Number,
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
