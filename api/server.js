const dotenv = require('dotenv');
const jsonServer = require('json-server');

dotenv.config({ path: '.env' });

const middlewares = jsonServer.defaults();
const router = jsonServer.router('db.json');
const server = jsonServer.create();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createUtc = new Date().toISOString();
    req.body.modifyUtc = req.body.createUtc;
  } else if (req.method === 'PATCH' || req.method === 'PUT') {
    req.body.modifyUtc = new Date().toISOString();
  }
  next();
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

server.listen(process.env.PORT, () => {
  console.log(`API server running on port ${process.env.PORT}...`);
});
