class TokenBlacklistService {
  constructor() {
    this.blacklistedTokens = new Set();
  }

  async blacklistToken(token, expirationTime = null) {
    this.blacklistedTokens.add(token);
    return true;
  }

  async isTokenBlacklisted(token) {
    return this.blacklistedTokens.has(token);
  }

  async getStats() {
    return {
      blacklistedTokens: this.blacklistedTokens.size,
      storageType: 'memory',
    };
  }
}

module.exports = new TokenBlacklistService();
