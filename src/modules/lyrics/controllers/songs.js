import config from 'config';
import songs from '../models/song';

const controller = {};

controller.list = function ({
  limit = 10
}) {
  return songs.find().limit(limit).populate('artist_id');
}

controller.search = function (query) {
  return songs.find(query);
}

controller.find = function (query) {
  return songs.findOne(query);
}

export default controller;
