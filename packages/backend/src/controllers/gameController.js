const { ErrorHandler } = require('../middleware/error/errorMiddleware');
const { sendSuccess } = require('../utils/responseHelper');
const gameService = require('../services/gameService');
const realtimeManager = require('../utils/realtime');

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

    // Broadcast updated sessions to real-time clients
    try {
      const sessions = await gameService.listGameSessions({ userId });
      realtimeManager.broadcastSessions(userId, sessions);
    } catch (broadcastError) {
      console.error('Failed to broadcast session start update:', broadcastError);
    }

    sendSuccess(res, { session }, 'Game session started successfully');
  });

  endGameSession = ErrorHandler.asyncWrapper(async (req, res) => {
    const { sessionId, endReason } = req.body;

    const session = await gameService.endSession({ sessionId, endReason });

    // Broadcast updated sessions to real-time clients
    if (session && session.user_id) {
      try {
        const sessions = await gameService.listGameSessions({ userId: session.user_id });
        realtimeManager.broadcastSessions(session.user_id, sessions);
      } catch (broadcastError) {
        console.error('Failed to broadcast session end update:', broadcastError);
      }
    }

    sendSuccess(res, { session }, 'Game session ended successfully');
  });

  listGameSessions = ErrorHandler.asyncWrapper(async (req, res) => {
    const userId = req.user.id;

    if (req.headers.accept === 'text/event-stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.setHeader('x-no-compression', 'true');
      res.flushHeaders();

      // Send initial data immediately
      const sessions = await gameService.listGameSessions({ userId });
      res.write(`data: ${JSON.stringify({ sessions })}\n\n`);
      if (typeof res.flush === 'function') {
        res.flush();
      }

      // Add to realtime manager
      realtimeManager.addClient(userId, res);

      // Keep connection alive with heartbeat
      const keepAlive = setInterval(() => {
        res.write(': ping\n\n');
        if (typeof res.flush === 'function') {
          res.flush();
        }
      }, 30000);

      req.on('close', () => {
        clearInterval(keepAlive);
        realtimeManager.removeClient(userId, res);
      });
      return;
    }

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
