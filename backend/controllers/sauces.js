const Thing = require('../models/sauces');
const fs = require('fs');

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then((data) => res.status(200).json({data }))
    .catch(error => res.status(400).json({ error }));
};
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


//gestion des likes
exports.postLike = (req, res, next) => {

switch (req.body.like) {
  
case 1:
    Thing.updateOne({_id:req.params.id}, {$push: {usersLiked: req.body.userId},$inc: {likes: 1}})
      .then(() => res.status(200).json({message: 'Like ajouté !'}))
      .catch((error) => res.status(400).json({error}))
  break;

case -1:
    Thing.updateOne({_id: req.params.id}, {$push: {usersDisliked: req.body.userId},$inc: {dislikes: 1}})
      .then(() => {res.status(200).json({message: 'Dislike ajouté !'})})
      .catch((error) => res.status(400).json({error}))
      break;

case 0:
    Thing.findOne({_id:req.params.id})
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Thing.updateOne({_id:req.params.id}, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
            .then(() => res.status(200).json({message: 'Like enlevé !'}))
            .catch((error) => res.status(400).json({error}))
        }
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Thing.updateOne({ _id:req.params.id}, {$pull: {usersDisliked:req.body.userId},$inc: {dislikes: -1}})
            .then(() => res.status(200).json({message: 'Dislike enlevé !'}))
            .catch((error) => res.status(400).json({error}))
          }
      })
      .catch((error) => res.status(404).json({
        error
      }));
      break;

      default: console.error('Veuillez reformuler votre requête');
  }
}