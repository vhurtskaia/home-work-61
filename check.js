const { spawn } = require('child_process');
const path = require('path');

const PORT = 3000;
const BASE = `http://localhost:${PORT}`;

let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    console.log(`  PASS  ${name}`);
    passed++;
  } else {
    console.log(`  FAIL  ${name}`);
    failed++;
  }
}

async function request(method, url, { headers = {}, body } = {}) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, text };
}

async function runChecks() {
  console.log('\n=== Перевірка маршрутів home-work-61 ===\n');

  // GET /
  {
    const r = await request('GET', `${BASE}/`);
    check('GET /  -> 200', r.status === 200);
  }

  // GET /users без токена -> 401
  {
    const r = await request('GET', `${BASE}/users`);
    check('GET /users без Authorization -> 401', r.status === 401);
  }

  // GET /users з токеном -> 200
  {
    const r = await request('GET', `${BASE}/users`, {
      headers: { Authorization: 'Bearer test-token' },
    });
    check('GET /users з Authorization -> 200', r.status === 200);
  }

  // POST /users без обов'язкових полів -> 400
  {
    const r = await request('POST', `${BASE}/users`, {
      headers: { Authorization: 'Bearer test-token' },
      body: { username: 'onlyusername' },
    });
    check('POST /users без password -> 400', r.status === 400);
  }

  // POST /users з валідними даними -> 201
  {
    const r = await request('POST', `${BASE}/users`, {
      headers: { Authorization: 'Bearer test-token' },
      body: { username: 'checker', password: 'pw' },
    });
    check('POST /users з валідними даними -> 201', r.status === 201);
  }

  // GET /users/:userId з нечисловим id -> 400
  {
    const r = await request('GET', `${BASE}/users/abc`, {
      headers: { Authorization: 'Bearer test-token' },
    });
    check('GET /users/abc (невалідний id) -> 400', r.status === 400);
  }

  // GET /users/:userId існуючий -> 200
  {
    const r = await request('GET', `${BASE}/users/1`, {
      headers: { Authorization: 'Bearer test-token' },
    });
    check('GET /users/1 -> 200', r.status === 200);
  }

  // GET /users/:userId неіснуючий -> 404
  {
    const r = await request('GET', `${BASE}/users/9999`, {
      headers: { Authorization: 'Bearer test-token' },
    });
    check('GET /users/9999 (не існує) -> 404', r.status === 404);
  }

  // GET /articles публічний -> 200
  {
    const r = await request('GET', `${BASE}/articles`);
    check('GET /articles (публічний) -> 200', r.status === 200);
  }

  // GET /articles/:articleId без токена -> 401
  {
    const r = await request('GET', `${BASE}/articles/1`);
    check('GET /articles/1 без Authorization -> 401', r.status === 401);
  }

  // GET /articles/:articleId з токеном -> 200
  {
    const r = await request('GET', `${BASE}/articles/1`, {
      headers: { Authorization: 'Bearer test-token' },
    });
    check('GET /articles/1 з Authorization -> 200', r.status === 200);
  }

  // POST /articles з валідними даними -> 201
  {
    const r = await request('POST', `${BASE}/articles`, {
      headers: { Authorization: 'Bearer test-token' },
      body: { title: 'Тестова стаття', content: 'Зміст' },
    });
    check('POST /articles з валідними даними -> 201', r.status === 201);
  }

  // Неіснуючий маршрут -> 404
  {
    const r = await request('GET', `${BASE}/no-such-route`);
    check('GET /no-such-route -> 404', r.status === 404);
  }

  console.log(`\n=== Результат: ${passed} passed, ${failed} failed ===\n`);
  return failed === 0;
}

function main() {
  const server = spawn('node', [path.join(__dirname, 'src/server.js')], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', () => {});
  server.stderr.on('data', (d) => process.stderr.write(d));

  // Даємо серверу час стартувати
  setTimeout(async () => {
    try {
      const ok = await runChecks();
      server.kill();
      process.exit(ok ? 0 : 1);
    } catch (err) {
      console.error('Помилка під час перевірки:', err.message);
      server.kill();
      process.exit(1);
    }
  }, 800);
}

main();
