import config from '../../config';
import artists from '../../models/lyrics/artist';
import songs from '../../models/lyrics/song';

const controller = {};

let attachSongs = artist => new Promise(
  (res, rej)=>{
    songs.find({artist_id: artist.id}).then(songList => {
      res()
    });
  }
);

controller.list = function ({limit = 4, with_songs=false}) {

  let ret = [];
  return new Promise((resolve, reject) => {
    artists.find().limit(limit).then (artistList => {
      if (!with_songs) {
        return resolve(artistList);
      }
      
      async.each(artistList, (artist, cb) => {
        songs.find({artist_id: artist.id}).then(songList => {
          console.log(songList);
          artist.songs = songList;
          cb();
        });
      }, resolve);
    });
  });

}

controller.search = function (query) {
  return artists.find(query);
}

controller.find = function (query) {
  return artists.findOne(query);
}

export default controller;
