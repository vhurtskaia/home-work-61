const express = require('express');

const logRequests = require('./middlewares/logger');
const sessionMiddleware = require('./middlewares/session');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Глобальні мідлвари ----
app.use(express.json()); // парсинг JSON-тіла запитів
app.use(express.urlencoded({ extended: true })); // парсинг form-урlencoded тіла
app.use(sessionMiddleware); // управління сесіями
app.use(logRequests); // логування всіх запитів, включно з "/"

// ---- Маршрути (MVC: Router -> Controller -> Model) ----
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

// ---- Обробка неіснуючих маршрутів ----
app.use(notFoundHandler);

// ---- Централізована обробка помилок (підключається останньою) ----
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});

module.exports = app;
