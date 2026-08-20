const userRepository = require('../repositories/userRepository');
const fileRepository = require('../repositories/fileRepository');

class UserService {
  /**
   * Return structured profile data for the given userId including
   * linked application, approval (when present), and uploaded files.
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
        user[key] = row[key];
      }
    }

    // Fetch uploaded files linked to the application if application exists
    let files = [];
    if (application.id) {
      const rawFiles = await fileRepository.getFilesByApplicationId(application.id);
      files = (rawFiles || []).map((f) => ({
        id: f.id,
        name: f.original_name,
        storedName: f.stored_name,
        type: f.file_type,
        size: f.file_size,
        uploadedAt: f.uploaded_at,
      }));
    }

    // Fetch real game account data safely
    const gameData = await require('../repositories/gameRepository').getGameAccountByApplicationId(
      user.id,
    );
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
      files,
      gameAccount,
    };
  }
}

module.exports = new UserService();
