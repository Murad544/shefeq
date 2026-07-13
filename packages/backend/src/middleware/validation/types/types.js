const CLIENT_TYPES = Object.freeze({
  WEB: 'web',
  GAME: 'game',
});

const ALLOWED_CLIENT_TYPES = Object.values(CLIENT_TYPES);

module.exports = {
  CLIENT_TYPES,
  ALLOWED_CLIENT_TYPES,
};
