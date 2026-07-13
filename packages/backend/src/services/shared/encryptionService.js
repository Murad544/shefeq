const bcrypt = require('bcrypt');
const crypto = require('crypto');

class EncryptionService {
  async hashPassword(password) {
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    return await bcrypt.hash(password, rounds);
  }

  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  generateSecretKey(length = 16) {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
  }
}

module.exports = new EncryptionService();
