const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth');
const authorizeArticleAccess = require('../middlewares/authorization');
const { validateArticleInput, validateArticleId } = require('../middlewares/validate');
const {
  getArticles,
  createArticle,
  getArticleById,
  updateArticle,
} = require('../controllers/articleController');

router.get('/', getArticles);

router.post('/', authenticate, authorizeArticleAccess, validateArticleInput, createArticle);

router.get(
  '/:articleId',
  validateArticleId,
  authenticate,
  authorizeArticleAccess,
  getArticleById
);

router.put(
  '/:articleId',
  validateArticleId,
  authenticate,
  authorizeArticleAccess,
  validateArticleInput,
  updateArticle
);

module.exports = router;
