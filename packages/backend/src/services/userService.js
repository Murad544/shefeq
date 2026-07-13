const userRepository = require('../repositories/userRepository');

class UserService {
  /**
   * Return structured profile data for the given userId including
   * linked application and approval (when present).
   */
  async profileWithApplication(userId) {
    const row = await userRepository.findUserWithApplicationById(userId);
    if (!row) return null;

    // Extract user fields (filter out application_* and approval_* keys)
    const user = {};
    const application = {};

    for (const key of Object.keys(row)) {
      if (key.startsWith('application_')) {
        application[key.replace('application_', '')] = row[key];
      } else {
        // other keys ignored

        user[key] = row[key];
      }
    }

    // Fetch real game account data safely
    const gameData = await require('../repositories/gameRepository').getGameAccountByApplicationId(
      user.id
    );
    console.log(user.id);
    const sessionsArray = gameData && Array.isArray(gameData.sessions) ? gameData.sessions : [];
    const totalSeconds = sessionsArray.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const totalPlayTime = `${totalHours} saat ${totalMinutes} dəq`;
    const sessions = sessionsArray.map((s) => ({
      id: s.id,
      date: s.session_started_at,
      login: s.session_started_at,
      logout: s.session_ended_at,
      duration: s.duration_seconds
        ? `${Math.floor(s.duration_seconds / 3600)} saat ${Math.floor((s.duration_seconds % 3600) / 60)} dəq`
        : '-',
    }));
    const gameAccount = { totalPlayTime, sessions };
    return {
      user,
      application: Object.keys(application).length ? application : null,
      gameAccount,
    };
  }
}

module.exports = new UserService();
