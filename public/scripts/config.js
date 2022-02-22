const config = {
  development: {
    SERVER_URI: 'localhost:5000',
  },
  production: {
    SERVER_URI: 'HEROKU_URI',
  },
};

export { config }
