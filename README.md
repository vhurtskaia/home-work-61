# Express MVC Middleware Server

Express-сервер, побудований за патерном **MVC** (Model–View–Controller, без
окремого View-шару, оскільки всі відповіді текстові), розширений набором
мідлварів для логування, автентифікації, валідації даних, перевірки прав
доступу та управління сесіями.

## Швидка перевірка

Після `npm install` достатньо виконати одну команду:

```bash
npm run check
```

Скрипт `check.js` сам підніме сервер, надішле запити до всіх маршрутів
(`/`, `/users`, `/users/:userId`, `/articles`, `/articles/:articleId`) і
виведе список `PASS`/`FAIL` по кожній перевірці (всього 13), а наприкінці —
підсумок. Завершується кодом `0`, якщо всі перевірки пройдені, і `1` —
якщо хоча б одна провалена. Сервер після перевірки зупиняється автоматично.

## Технології

- Node.js
- Express.js
- express-session (управління сесіями)

## Структура проекту

```
home-work-61/
├── server.js                  # Точка входу, підключення глобальних мідлварів і роутерів
├── middlewares/
│   ├── logger.js               # Логування кожного запиту
│   ├── auth.js                 # Базова автентифікація (Authorization: Bearer <token>)
│   ├── validate.js             # Валідація тіла запитів та параметрів :userId / :articleId
│   ├── authorization.js        # Перевірка прав доступу до статей
│   ├── session.js               # Налаштування express-session
│   └── errorHandler.js         # Централізована обробка помилок і 404
├── controllers/
│   ├── indexController.js
│   ├── userController.js
│   └── articleController.js
├── models/
│   ├── userModel.js            # In-memory "база даних" користувачів
│   └── articleModel.js         # In-memory "база даних" статей
├── routes/
│   ├── index.js                 # Маршрут "/"
│   ├── users.js                 # Маршрути "/users", "/users/:userId"
│   └── articles.js              # Маршрути "/articles", "/articles/:articleId"
├── package.json
└── README.md
```

## Встановлення та запуск

1. Переконайтесь, що встановлено Node.js (версія 18+ рекомендована).
2. Встановіть залежності:

   ```bash
   npm install
   # або
   yarn install
   ```

3. Запустіть сервер:

   ```bash
   npm start
   # або
   node server.js
   ```

4. За замовчуванням сервер слухає порт **3000**. Його можна змінити через
   змінну оточення `PORT`:

   ```bash
   PORT=4000 npm start
   ```

Сервер доступний за адресою `http://localhost:3000`.

## Мідлвари

| Мідлвар | Файл | Призначення |
|---|---|---|
| `logRequests` | `middlewares/logger.js` | Логує дату/час, метод і URL кожного запиту. Підключений глобально (`app.use`), тому діє і на `/`, і на всі інші маршрути. |
| `authenticate` | `middlewares/auth.js` | Перевіряє заголовок `Authorization: Bearer <token>`. За відсутності або некоректного формату повертає `401 Unauthorized`. Записує `req.user`. |
| `validateUserInput` / `validateUserId` | `middlewares/validate.js` | Валідують тіло запиту (`username`, `password`) та параметр `:userId` (має бути числом). |
| `validateArticleInput` / `validateArticleId` | `middlewares/validate.js` | Валідують тіло запиту (`title`, `content`) та параметр `:articleId` (має бути числом). |
| `authorizeArticleAccess` | `middlewares/authorization.js` | Перевіряє, що користувач автентифікований перед доступом до операцій над статтями; точка розширення для перевірки ролі/власника. |
| `sessionMiddleware` | `middlewares/session.js` | Підключає `express-session` для управління сесіями користувача (cookie-based). |
| `errorHandler` / `notFoundHandler` | `middlewares/errorHandler.js` | Централізована обробка помилок (`4 аргументи`) та відповідь `404` для невідомих маршрутів. Підключаються останніми в `server.js`. |

## Опис маршрутів

Усі відповіді сервера — **текстові** (`Content-Type: text/plain`).

### `GET /`

Головна сторінка. Застосовується мідлвар логування (глобально).

- **200 OK** — текстове привітання.

### `GET /users`

Отримати список усіх користувачів.

- Мідлвари: `authenticate`.
- **401** — якщо відсутній або некоректний заголовок `Authorization`.
- **200** — список користувачів у форматі `#id username`.

### `POST /users`

Створити нового користувача.

- Мідлвари: `authenticate`, `validateUserInput`.
- Тіло запиту (JSON): `{ "username": "...", "password": "..." }`.
- **401** — немає автентифікації.
- **400** — відсутні `username`/`password`.
- **201** — користувача створено.

### `GET /users/:userId`

Отримати користувача за ідентифікатором.

- Мідлвари: `authenticate`, `validateUserId`.
- **401** — немає автентифікації.
- **400** — `:userId` не числовий.
- **404** — користувача не знайдено.
- **200** — дані користувача.

### `PUT /users/:userId`

Оновити користувача за ідентифікатором.

- Мідлвари: `authenticate`, `validateUserId`, `validateUserInput`.
- Тіло запиту (JSON): `{ "username": "...", "password": "..." }`.
- **401 / 400 / 404 / 200** — аналогічно до вищезазначених.

### `GET /articles`

Отримати список усіх статей (публічний маршрут, без автентифікації).

- **200** — список статей у форматі `#id title`.

### `POST /articles`

Створити нову статтю.

- Мідлвари: `authenticate`, `authorizeArticleAccess`, `validateArticleInput`.
- Тіло запиту (JSON): `{ "title": "...", "content": "..." }`.
- **401** — немає автентифікації / прав доступу.
- **400** — відсутні `title`/`content`.
- **201** — статтю створено.

### `GET /articles/:articleId`

Отримати статтю за ідентифікатором.

- Мідлвари: `validateArticleId`, `authenticate`, `authorizeArticleAccess`.
- **400** — `:articleId` не числовий.
- **401** — немає автентифікації / прав доступу.
- **404** — статтю не знайдено.
- **200** — заголовок і зміст статті.

### `PUT /articles/:articleId`

Оновити статтю за ідентифікатором.

- Мідлвари: `validateArticleId`, `authenticate`, `authorizeArticleAccess`, `validateArticleInput`.
- Тіло запиту (JSON): `{ "title": "...", "content": "..." }`.
- **400 / 401 / 404 / 200** — аналогічно до вищезазначених.

### Будь-який інший маршрут

- **404 Not Found** — текстове повідомлення про відсутність маршруту (`notFoundHandler`).

## Приклади запитів (curl)

```bash
curl http://localhost:3000/

# Список користувачів (потрібна автентифікація)
curl -H "Authorization: Bearer mytoken" http://localhost:3000/users

# Створення користувача
curl -X POST -H "Authorization: Bearer mytoken" \
     -H "Content-Type: application/json" \
     -d '{"username":"carol","password":"pw"}' \
     http://localhost:3000/users

# Отримати статтю за id
curl -H "Authorization: Bearer mytoken" http://localhost:3000/articles/1
```

## Примітка про дані

Для спрощення демонстрації моделі `User` і `Article` зберігають дані
**в пам'яті процесу** (масиви в `models/`). Під час реального розгортання
їх слід замінити на підключення до бази даних (наприклад, MongoDB або
PostgreSQL), не змінюючи інтерфейс контролерів і маршрутів.
