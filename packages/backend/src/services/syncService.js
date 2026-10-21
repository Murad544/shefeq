const { AppError } = require('../middleware/error/errorMiddleware');
const syncRepository = require('../repositories/syncRepository');

class SyncService {
  async getAllLevelData(userId) {
    return await syncRepository.getAllMapsForUser(userId);
  }

  async startMapRun(userId, payload) {
    const { mapId, mapCode } = payload;
    const sessionId = payload.sessionId || payload.gameSessionId;

    let map = null;
    if (mapCode) {
      map = await syncRepository.findMapByCode(mapCode);
    } else if (mapId) {
      map = await syncRepository.findMapById(mapId);
    }

    if (!map) {
      throw AppError.notFound('Map not found', 'NOT_FOUND');
    }

    if (sessionId) {
      const session = await syncRepository.findGameSessionByIdForUser(sessionId, userId);
      if (!session) {
        throw AppError.notFound('Session not found', 'NOT_FOUND');
      }
    }

    return await syncRepository.insertMapRun(userId, map.id, {
      ...payload,
      gameSessionId: sessionId,
      sessionId,
    });
  }

  async finishMapRun(userId, payload) {
    const { runId } = payload;
    const sessionId = payload.sessionId || payload.gameSessionId;

    const existing = await syncRepository.findMapRunByIdForUser(runId, userId);
    if (!existing) {
      throw AppError.notFound('Map run not found', 'NOT_FOUND');
    }

    if (sessionId) {
      const session = await syncRepository.findGameSessionByIdForUser(sessionId, userId);
      if (!session) {
        throw AppError.notFound('Session not found', 'NOT_FOUND');
      }
    }

    const timeMs = payload.timeMs !== undefined
      ? payload.timeMs
      : (payload.objectiveTimeSeconds !== undefined ? payload.objectiveTimeSeconds * 1000 : null);
    const objectiveTimeSeconds = payload.objectiveTimeSeconds !== undefined
      ? payload.objectiveTimeSeconds
      : (timeMs !== null ? Math.round(timeMs / 1000) : null);

    const prevBest = await syncRepository.getPreviousBestExcludingRun(
      userId,
      existing.map_id,
      runId,
    );

    const updated = await syncRepository.updateMapRunById(
      runId,
      userId,
      {
        ...payload,
        sessionId,
        gameSessionId: sessionId,
        timeMs,
        objectiveTimeSeconds,
      },
      { setEndedAt: true },
    );

    if (!updated) {
      throw AppError.internal('Unable to update map run', 'SERVER_ERROR');
    }

    const isCompleted = payload.completed === true || (payload.completed === undefined && existing.completed === true);
    let isNewPersonalBest = false;
    if (isCompleted && timeMs !== null) {
      if (!prevBest) {
        isNewPersonalBest = true;
      } else {
        const prevBestMs = prevBest.time_ms != null
          ? prevBest.time_ms
          : (prevBest.objective_time_seconds * 1000);
        if (timeMs < prevBestMs) {
          isNewPersonalBest = true;
        }
      }
    }

    const currentBest = await syncRepository.getPersonalBestForUserAndMap(userId, existing.map_id);
    let personalBest = null;
    if (currentBest) {
      const pbTimeMs = currentBest.time_ms != null
        ? currentBest.time_ms
        : (currentBest.objective_time_seconds * 1000);
      personalBest = {
        timeMs: Number(pbTimeMs),
        runId: currentBest.id,
        achievedAt: new Date(currentBest.run_ended_at || currentBest.created_at).toISOString(),
      };
    }

    return {
      run: {
        id: updated.id,
        timeMs: timeMs !== null ? Number(timeMs) : null,
      },
      personalBest,
      isNewPersonalBest,
    };
  }

  async getPersonalBest(userId, mapCode) {
    if (!mapCode) {
      throw AppError.validationError('mapCode query parameter is required');
    }

    const map = await syncRepository.findMapByCode(mapCode);
    if (!map) {
      throw AppError.notFound('Map not found', 'NOT_FOUND');
    }

    const best = await syncRepository.getPersonalBestForUserAndMap(userId, map.id);
    if (!best) {
      return null;
    }

    const pbTimeMs = best.time_ms != null
      ? best.time_ms
      : (best.objective_time_seconds * 1000);
    return {
      timeMs: Number(pbTimeMs),
      runId: best.id,
      achievedAt: new Date(best.run_ended_at || best.created_at).toISOString(),
    };
  }

  async getAllPersonalBests(userId) {
    const rows = await syncRepository.getAllPersonalBestsForUser(userId);
    return rows.map((r) => ({
      mapCode: r.map_code,
      timeMs: Number(r.best_time_ms),
    }));
  }
}

module.exports = new SyncService();
