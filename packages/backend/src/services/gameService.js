const { AppError } = require('../middleware/error/errorMiddleware');
const gameRepository = require('../repositories/gameRepository');

class GameService {
  async startSession({ userId }) {
    return await gameRepository.startSession({ userId });
  }

  async endSession({ sessionId, endReason }) {
    const session = await gameRepository.endSession({ sessionId, endReason });

    if (!session) {
      throw AppError.notFound('Session not found or already ended', 'SESSION_NOT_FOUND');
    }

    return session;
  }

  async listGameSessions({ userId }) {
    const sessions = await gameRepository.listGameSessions({ userId });
    return sessions;
  }

  async getUserMapStats({ userId }) {
    const stats = await gameRepository.getUserMapStats({ userId });
    return stats;
  }

  async getLeaderboard() {
    const topLeaders = await gameRepository.getTopLeaders(3);
    const mapLeaders = await gameRepository.getAllMapsWithLeaders(5);
    
    return {
      topLeaders: topLeaders.map(leader => ({
        id: leader.user_id,
        name: leader.name,
        time: this.formatSeconds(leader.best_time_seconds),
        timeSeconds: leader.best_time_seconds,
        rank: leader.rank,
        totalRuns: leader.total_runs,
        completedRuns: leader.completed_runs,
      })),
      mapLeaders: mapLeaders.map(map => ({
        map: map.map_name,
        mapId: map.map_id,
        mapCode: map.map_code,
        leaders: (map.leaders || []).map(leader => ({
          id: leader.user_id,
          name: leader.name,
          time: this.formatSeconds(leader.time_seconds),
          timeSeconds: leader.time_seconds,
          rank: leader.rank,
        })),
      })),
    };
  }

  formatSeconds(seconds) {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  async getUserStreak(userId) {
    const streak = await gameRepository.getUserStreak(userId);
    return streak;
  }
}

module.exports = new GameService();
