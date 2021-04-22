const dotenv = require('dotenv');
const fs = require('fs');
const jsonServer = require('json-server');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

fs.copyFileSync(
  path.resolve(__dirname, 'data.json'),
  path.resolve(__dirname, 'db.json'),
  fs.constants.COPYFILE_FICLONE
);

const middlewares = jsonServer.defaults();
const router = jsonServer.router('api/db.json');
const server = jsonServer.create();

server.use(middlewares);
server.use(router);

server.listen(process.env.PORT, () => {
  console.log(`API server running on port ${process.env.PORT}...`);
});
