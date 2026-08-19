const { AppError } = require('../middleware/error/errorMiddleware');
const syncRepository = require('../repositories/syncRepository');

class SyncService {
  async getAllLevelData(userId) {
    return await syncRepository.getAllMapsForUser(userId);
  }

  async startMapRun(userId, payload) {
    const { mapId, mapCode } = payload;

    let resolvedMapId = mapId;
    if (!resolvedMapId && mapCode) {
      const map = await syncRepository.findMapByCode(mapCode);
      if (!map) {
        throw AppError.notFound('Map not found', 'MAP_NOT_FOUND');
      }
      resolvedMapId = map.id;
    }

    if (!resolvedMapId) {
      throw AppError.badRequest('mapId or mapCode is required', 'MAP_ID_REQUIRED');
    }

    if (payload.gameSessionId) {
      const session = await syncRepository.findGameSessionByIdForUser(
        payload.gameSessionId,
        userId,
      );
      if (!session) {
        throw AppError.badRequest(
          'Invalid or unauthorized gameSessionId',
          'INVALID_GAME_SESSION_ID',
        );
      }
    }

    return await syncRepository.insertMapRun(userId, resolvedMapId, payload);
  }

  async finishMapRun(userId, payload) {
    const { runId } = payload;
    const existing = await syncRepository.findMapRunByIdForUser(runId, userId);
    if (!existing) {
      throw AppError.notFound('Map run not found', 'MAP_RUN_NOT_FOUND');
    }

    if (payload.gameSessionId) {
      const session = await syncRepository.findGameSessionByIdForUser(
        payload.gameSessionId,
        userId,
      );
      if (!session) {
        throw AppError.badRequest(
          'Invalid or unauthorized gameSessionId',
          'INVALID_GAME_SESSION_ID',
        );
      }
    }

    const updated = await syncRepository.updateMapRunById(runId, userId, payload, {
      setEndedAt: true,
    });
    if (!updated) {
      throw AppError.internal('Unable to update map run', 'MAP_RUN_UPDATE_FAILED');
    }
    return updated;
  }
}

module.exports = new SyncService();
