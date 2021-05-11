const _ = require('lodash');
const dotenv = require('dotenv');
const jsonServer = require('json-server');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: '.env' });

const middlewares = jsonServer.defaults();
const router = jsonServer.router('db.json');
const server = jsonServer.create();

const delayMax = parseInt(process.env.DELAY_MAX, 10);
const delayMin = parseInt(process.env.DELAY_MIN, 10);

let userSessionTimeout = parseInt(process.env.USER_SESSION_TIMEOUT, 10);
if (Number.isNaN(userSessionTimeout)) {
  userSessionTimeout = 60 * 60 * 1000;
}

let userSessionTimeoutRemember = parseInt(
  process.env.USER_SESSION_TIMEOUT_REMEMBER,
  10
);

if (Number.isNaN(userSessionTimeoutRemember)) {
  userSessionTimeoutRemember = 7 * 24 * 60 * 60 * 1000;
}

function isAccessTokenExpired(accessToken) {
  const currentTime = Date.UTC();
  const expireTime =
    new Date(accessToken.refreshUtc).getTime() +
    (accessToken.remember ? userSessionTimeoutRemember : userSessionTimeout);
  return expireTime <= currentTime;
}

function isAccessTokenValid(token) {
  if (typeof token === 'string') {
    const accessToken = router.db.get('accessTokens').find({ token }).value();
    if (accessToken && !isAccessTokenExpired(accessToken)) {
      return router.db.get('users').some({ id: accessToken.userId }).value();
    }
  }
  return false;
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

if (!Number.isNaN(delayMin) && !Number.isNaN(delayMax) && delayMax > delayMin) {
  server.use((req, res, next) => {
    const delay = _.random(delayMin, delayMax);
    return setTimeout(() => next(), delay);
  });
}

server.use((req, res, next) => {
  router.db
    .get('accessTokens')
    .filter((x) => isAccessTokenExpired(x))
    .pull()
    .write();
  return next();
});

server.post('/auth/login', (req, res) => {
  const { username, password, remember } = req.body;
  try {
    const user = router.db.get('users').find({ username, password }).value();
    if (user) {
      const token = uuidv4();
      const rememberValue = Boolean(remember);
      const userId = user.id;
      const refreshDate = new Date();
      const refreshUtc = refreshDate.toISOString();

      const maxAccessToken = router.db
        .get('accessTokens')
        .maxBy((x) => x.id)
        .value();

      const accessToken = {
        id: maxAccessToken ? maxAccessToken.id + 1 : 1,
        token,
        remember: rememberValue,
        userId,
        refreshUtc,
      };

      router.db.get('accessTokens').push(accessToken).write();
      return res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        accessToken: token,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    message: 'The username or password is incorrect.',
  });
});

server.post('/auth/logout', (req, res) => {
  const { accessToken } = req.body;
  try {
    const currentAccessToken = router.db
      .get('accessTokens')
      .find({ token: accessToken })
      .value();

    if (currentAccessToken) {
      router.db.get('accessTokens').pull(currentAccessToken).write();
      return res.json({});
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    message: 'Could not find login token.',
  });
});

server.use((req, res, next) => {
  const date = new Date();
  const utc = date.toISOString();

  if (
    /^(delete|patch|post|put)$/i.test(req.method) &&
    !isAccessTokenValid(req.body.accessToken)
  ) {
    return res.status(401).json({
      message: 'The user is not logged in or their session has expired.',
    });
  }

  if (req.method === 'POST') {
    req.body.createUtc = utc;
  } else if (/^(patch|put)$/i.test(req.method)) {
    req.body.modifyUtc = utc;
  }

  return next();
});

server.use('/accessTokens', (req, res) => {
  return res.status(405).json({
    message: 'Access tokens cannot be accessed directly.',
  });
});

server.use(router);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`API server running on port ${port}...`);
});
