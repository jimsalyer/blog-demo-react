# React Based Blog Demo

This project is a blog demo that uses React for the frontend and JSON Server for the backend

## Requirements

- Node.js
- Yarn

## Initializing

### Setup

Make a copy of `.env.example` and `api/.env.example` called `.env` and `api/.env`

In `.env`, set the following variables accordingly:

- `REACT_APP_API_URL`: URL of the API. Default value is `http://localhost:5000`.

In `api/.env`, set the following variables accordingly:

- `DELAY_MAX`: Maximum delay for API requests. Default value is 0.
- `DELAY_MIN`: Minimum delay for API requests. Default value is 0.
- `PORT`: Port the API will run on. Make sure this is the same as the port referenced in the `REACT_APP_API_URL` variable above. Default value is 5000.
- `USER_SESSION_TIMEOUT`: Amount of time (in milliseconds) a user session can be "dormant" before ending. A session is refreshed each time an API call is made with its corresponding access token. Default value is 1 hour.
- `USER_SESSION_TIMEOUT_REMEMBER`: Amount of time (in milliseconds) as user session can be "dormant" before ending. This variable controls the timeout for users that log in with "Remember Me" checked. Default value is 7 days.

Setting the `DELAY_*` variables above will add a random delay for each API request between the minimum and maximum values.

### Installation

```
yarn init
```

### Generating API Data

The following command will generate a `db.json` file in the `api` directory that will be used as the "database" for the API. If the file already exists, the command will overwrite it.

```
yarn api:generate
```

## Starting

### Start the API

```
yarn api:start
```

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
