import config from '../../config';
import songs from '../../models/lyrics/song';
import _ from 'lodash';

const controller = {};


controller.list = function (query) {
  query = _.merge({
    limit: 10
  }, query);

  return songs.find().limit(Number(query.limit));
}

controller.search = function (query) {
  return songs.find(query);
}

controller.find = function (query) {
  return songs.findOne(query);
}

export default controller;
