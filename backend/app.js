const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const path = require('path');
const likeRoutes = require('./routes/like');
const stuffRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');



mongoose.connect('mongodb+srv://mazigh:athlantix@cluster0.6eesu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/sauces/:id', likeRoutes);

/*app.use('/api/sauces/:id', (req, res, next) => {
  const like = [
    {
      usersLiked: '60bca35b5e0b4f159416a9ce',
      usersDisliked:'testok',
      likes:0,
      dislikes:0
      
    }];
    res.status(200).json(like);
  })*/


module.exports = app;