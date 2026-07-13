const { ErrorHandler } = require('../middleware/error/errorMiddleware');
const { sendSuccess } = require('../utils/responseHelper');
const gameService = require('../services/gameService');

function getClientIp(req) {
  const xff = req.get('X-Forwarded-For') || req.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  const xReal = req.get('X-Real-IP') || req.get('x-real-ip');
  if (xReal) return xReal.trim();

  const cf = req.get('CF-Connecting-IP');
  if (cf) return cf.trim();

  const ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || null;
  return ip ? ip.replace(/^::ffff:/, '') : null;
}

class GameController {
  startGameSession = ErrorHandler.asyncWrapper(async (req, res) => {
    const clientIp = getClientIp(req);
    console.log('clientIp:', clientIp);
    const userId = req.user.id;
    const session = await gameService.startSession({ userId });
    sendSuccess(res, { session }, 'Game session started successfully');
  });

  endGameSession = ErrorHandler.asyncWrapper(async (req, res) => {
    const { sessionId, endReason } = req.body;

    const session = await gameService.endSession({ sessionId, endReason });
    sendSuccess(res, { session }, 'Game session ended successfully');
  });

  listGameSessions = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const sessions = await gameService.listGameSessions({ userId });
    sendSuccess(res, { sessions }, 'Sessions retrieved successfully');
  });

  getMapStats = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const stats = await gameService.getUserMapStats({ userId });
    sendSuccess(res, { stats }, 'Map stats retrieved successfully');
  });

  getLeaderboard = ErrorHandler.asyncWrapper(async (req, res) => {
    const leaderboard = await gameService.getLeaderboard();
    sendSuccess(res, leaderboard, 'Leaderboard retrieved successfully');
  });

  getUserStreak = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const streak = await gameService.getUserStreak(userId);
    sendSuccess(res, { streak }, 'Streak retrieved successfully');
  });
}

module.exports = new GameController();
