import Page from '../models/page';

const controller = {

  folders (req, res, next) {
    Page.findFolders((err,folders) => {
      res.json(err || folders);
      next();
    });
  },

  create (req, res, next) {
    Page.create({
      title: 'First Article',
      subtitle: 'First Article',
      slug: 'my_article',
      body: 'Lorem',
      folder: 'funtime',
    }, function (err, body){
      res.json(err || body);
    });
    next();
  }

};

export default controller;
