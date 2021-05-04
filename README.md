# React Based Blog Demo

This project is a blog demo that uses React for the frontend and JSON Server for the backend

## Requirements

- Node.js
- Yarn

## Initializing

### Setup

1. Make a copy of `.env.example` and `api/.env.example` called `.env` and `api/.env`
1. In `.env`, set `REACT_APP_API_URL` to the URL of the API. This will usually be `localhost:3030`, where `3030` is the port the API will run on.
1. In `api/.env`, set `PORT` to the port the API will run on. Make sure this is the same as the port referenced in the URL above.

JSON Server will want to use port 3000 as the default, so it's a good idea to explicitly set the port for the API using the corresponding environment variable referenced above. Using port 3000 for the API will force you to change the port that the React frontend will run on.

### Installation

```
yarn init
```

## Starting

### Start the API

```
yarn api
```

Each time the API starts, it will make a copy of `data.json` as `db.json`. Any updates that are done through the API will be reflected in `db.json`. `data.json` will remain unchanged unless directly updated.

### Start the React App

```
yarn start
```

## Testing

```
yarn test
yarn test:watch
```

For doing a one time run through of the tests, use the `test` command. For running tests automatically as you're developing, use the `test:watch` command.

## Formatting

```
yarn format
yarn format:fix
```

Use the `format` command to view the formatting issues without actually fixing them. The `format:fix` command will automatically fix the issues and save the files.

## Linting

```
yarn lint
yarn lint:fix
```

Use the `lint` command to view the linting issues without actually fixing them. The `lint:fix` command will automatically fix the issues and save the files.

## Publishing

```
yarn build
```

Output from the `build` command will be placed in a `build` directory in the root of the project.
