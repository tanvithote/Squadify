const Tags = require('../models/tags');

exports.getTags = (req, res) => {
    const tags = Tags.find()
        .then((tags) => {
            res.json(tags);
        })

        .catch(err => console.log(err));
  };


  exports.putTags = (req, res) => {

  };