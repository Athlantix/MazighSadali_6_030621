
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sha256 = require('sha256');
const validator = require("email-validator");
const passwordValidator = require('password-validator');

require('dotenv').config();
exports.signup = (req, res, next) => {
  let verifiPassword= new RegExp("^([a-z0-9]{5,})$");

    try{
        if(validator.validate(req.body.email)===true && verifiPassword.test(req.body.password)===true ){
          bcrypt.hash(req.body.password, 10)
          .then(
            hash => {
              validator.validate(req.body.email);
              console.log(validator.validate(req.body.email))
            const user = new User({
              email: sha256.x2(req.body.email),
              password: hash
            });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
        }else{
          throw 'Invalid';
         
          
        }
      }catch {
          res.status(500).json({
            error: new Error('Invalid request!')
          });
        }
     
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: sha256.x2(req.body.email) })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.TOKEN_EXPIRE_IN }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };