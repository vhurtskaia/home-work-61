let articles = [
  { id: 1, title: 'Перша стаття', content: 'Зміст першої статті', ownerId: 1 },
  { id: 2, title: 'Друга стаття', content: 'Зміст другої статті', ownerId: 2 },
];

let nextId = 3;

const ArticleModel = {
  findAll() {
    return articles;
  },

  findById(id) {
    return articles.find((a) => a.id === Number(id));
  },

  create({ title, content, ownerId }) {
    const article = { id: nextId++, title, content, ownerId: ownerId || null };
    articles.push(article);
    return article;
  },

  update(id, { title, content }) {
    const article = this.findById(id);
    if (!article) return null;
    if (title) article.title = title;
    if (content) article.content = content;
    return article;
  },

  remove(id) {
    const index = articles.findIndex((a) => a.id === Number(id));
    if (index === -1) return false;
    articles.splice(index, 1);
    return true;
  },
};

module.exports = ArticleModel;
