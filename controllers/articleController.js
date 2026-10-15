const ArticleModel = require('../models/articleModel');

function getArticles(req, res) {
  const articles = ArticleModel.findAll();
  const list = articles.map((a) => `#${a.id} ${a.title}`).join('\n');
  res.type('text/plain').send(`Список статей:\n${list}`);
}

function createArticle(req, res) {
  const { title, content } = req.body;
  const ownerId = req.user ? req.user.id : null;
  const article = ArticleModel.create({ title, content, ownerId });
  res.status(201).type('text/plain').send(`Статтю створено: #${article.id} ${article.title}`);
}

function getArticleById(req, res, next) {
  const article = ArticleModel.findById(req.params.articleId);
  if (!article) {
    const err = new Error(`Article with id ${req.params.articleId} not found`);
    err.status = 404;
    return next(err);
  }
  res.type('text/plain').send(`Стаття #${article.id}: ${article.title}\n\n${article.content}`);
}

function updateArticle(req, res, next) {
  const article = ArticleModel.update(req.params.articleId, req.body);
  if (!article) {
    const err = new Error(`Article with id ${req.params.articleId} not found`);
    err.status = 404;
    return next(err);
  }
  res.type('text/plain').send(`Статтю оновлено: #${article.id} ${article.title}`);
}

module.exports = { getArticles, createArticle, getArticleById, updateArticle };
