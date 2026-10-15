function getHome(req, res) {
  res.type('text/plain').send('Головна сторінка сервера. Запит залоговано.');
}

module.exports = { getHome };
