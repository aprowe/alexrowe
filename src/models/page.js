import mongoose from 'mongoose';
import config from '../config';

let conn = mongoose.createConnection(config.MONGO_URL);

const COLLECTION_NAME = 'page';

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },

  // url identifier
  slug: {
    type: String,
    required: true,
    unique: true,
    match: /[a-zA-Z0-9_\-+]+/
  },

  folder: {
    type: String,
    match: /[a-zA-Z0-9_\-+]+/
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  update_at: {
    type: Date,
    default: Date.now
  }
});

schema.statics.findFolders = function(cb) {
  this.distinct('folder', cb);
};

export default conn.model(COLLECTION_NAME, schema);
