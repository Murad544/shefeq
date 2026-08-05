const trainingRepository = require('../repositories/trainingRepository');
const { AppError } = require('../middleware/error/errorMiddleware');

class TrainingService {
  async getTrainingModules(userId) {
    const rows = await trainingRepository.getAllModulesWithLessons(userId);
    const modulesById = new Map();

    for (const row of rows) {
      if (!modulesById.has(row.module_id)) {
        modulesById.set(row.module_id, {
          id: row.module_id,
          title: row.module_title,
          description: row.module_description || null,
          sort_order: row.module_sort_order,
          lessons: [],
        });
      }

      if (row.lesson_id) {
        modulesById.get(row.module_id).lessons.push({
          id: row.lesson_id,
          title: row.lesson_title,
          type: row.lesson_type,
          link: row.lesson_link,
          completed: row.completed,
        });
      }
    }

    return Array.from(modulesById.values());
  }

  async markLessonCompletion(userId, lessonId, completed) {
    const lesson = await trainingRepository.findLessonById(lessonId);
    if (!lesson) {
      throw AppError.notFound('Training lesson not found');
    }

    const result = await trainingRepository.upsertLessonProgress(userId, lessonId, completed);

    return {
      lessonId: result.lesson_id,
      completed: result.completed,
    };
  }
}

module.exports = new TrainingService();
