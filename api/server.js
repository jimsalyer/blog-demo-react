const _ = require('lodash');
const dotenv = require('dotenv');
const jsonServer = require('json-server');

dotenv.config({ path: '.env' });

const middlewares = jsonServer.defaults();
const router = jsonServer.router('db.json');
const server = jsonServer.create();

const delayMax = parseInt(process.env.DELAY_MAX, 10);
const delayMin = parseInt(process.env.DELAY_MIN, 10);

server.use(middlewares);
server.use(jsonServer.bodyParser);

if (!Number.isNaN(delayMin) && !Number.isNaN(delayMax) && delayMax > delayMin) {
  server.use((req, res, next) => {
    const delay = _.random(delayMin, delayMax);
    return setTimeout(() => next(), delay);
  });
}

server.use((req, res, next) => {
  const isUsersRequest = req.path.startsWith('/users');
  const dateString = new Date().toISOString();

  if (req.method === 'POST') {
    if (isUsersRequest) {
      req.body.registerUtc = dateString;
    } else {
      req.body.createUtc = dateString;
    }
  } else if (/^(patch|put)$/i.test(req.method) && !isUsersRequest) {
    req.body.modifyUtc = dateString;
  }
  return next();
});

server.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const user = router.db.get('users').find({ username, password }).value();
    if (user) {
      return res.json(user);
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  return res.status(404).json({
    message: 'The username or password is incorrect.',
  });
});

server.use(router);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`API server running on port ${port}...`);
});
