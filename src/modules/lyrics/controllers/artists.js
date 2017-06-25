import config from 'config';
import Artist from '../models/artist';
import Song from '../models/song';
import Promise from 'bluebird';

const controller = {};

controller.list = async function ({limit = 4, with_songs=false}) {
  let artistList = await Artist.find().limit(limit);

  if (with_songs) {
    for (let artist of artistList) {
      artist.songs = await Song.find({artist_id: artist.id});
    }
  }

  return artistList;
}

controller.search = function (query) {
  return Artist.find(query);
}

controller.find = function (query) {
  return Artist.findOne(query);
}

export default controller;
