const db = require('../config/database');

class FileRepository {
  async findById(id) {
    const sql = 'SELECT * FROM files WHERE id = $1 LIMIT 1';
    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
  }

  async getFilesByApplicationId(applicationId) {
    const sql = `
      SELECT id, application_id, file_type, file_size, original_name, stored_name, uploaded_at
      FROM files WHERE application_id = $1 ORDER BY id ASC
    `;
    const { rows } = await db.query(sql, [applicationId]);
    return rows;
  }

  async createFiles(client, applicationId, filesArray, fileType) {
    if (!filesArray?.length) return;

    const sql = `
    INSERT INTO files (application_id, file_type, original_name, stored_name, file_size)
    VALUES ${filesArray.map((_, i) => `($1, $2, $${3 + i * 3}, $${4 + i * 3}, $${5 + i * 3})`).join(',')}
  `;
    const params = [
      applicationId,
      fileType,
      ...filesArray.flatMap((f) => [f.originalname, f.storedName, f.fileSize]),
    ];

    await client.query(sql, params);
  }
}

module.exports = new FileRepository();
