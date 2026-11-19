const jwt = require('jsonwebtoken');
const AuthService = require('../../src/services/authService');
const env = require('../../src/config/env');

describe('Unit Test: AuthService', () => {
  describe('generateToken', () => {
    it('should generate a verifiable JWT token for given user id', () => {
      const mockUserId = '660000000000000000000099';
      const token = AuthService.generateToken(mockUserId);

      expect(typeof token).toBe('string');
      const decoded = jwt.verify(token, env.JWT_SECRET);
      expect(decoded.id).toBe(mockUserId);
    });
  });
});
