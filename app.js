const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6510bcc24c4f0230a4762769', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(bodyParser.json());

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница не существует.' });
});

app.listen(PORT, () => {
  // console.log(`listen ${PORT}`);
});
