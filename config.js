const fs = require('fs');

const configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath));

// We have to export each object in order to access them separately
exports.crypto = parsed.crypto;
exports.expressSession = parsed.expressSession;
exports.mailgun = parsed.mailgun;
exports.port = parsed.port;
exports.url = parsed.url;

