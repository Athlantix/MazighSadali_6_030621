const Like = require('../models/like');

exports.postLikes  = (req, res, next) => {
    const likeObject = req.body.like;
    const newLike = new Like({
    
        likes:likeObject,
        dislikes:likeObject,
        usersLiked:req.body.userId,
        usersDisliked:req.body.userId
        
      });
     console.log(newLike);
      newLike.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.getAllLike = (req, res, next) => {
  Like.find().then(
    (like) => {
      res.status(200).json(like);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );

};