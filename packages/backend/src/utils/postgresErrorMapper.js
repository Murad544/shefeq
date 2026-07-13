const { AppError } = require('../middleware/error/errorMiddleware');

function mapPostgresError(error) {
  // Postgres unique violation
  if (error.code === '23505') {
    switch (error.constraint) {
      case 'applications_national_id_num_key':
        return AppError.conflict('National ID already exists', 'NATIONAL_ID_ALREADY_EXISTS');

      case 'applications_national_serial_num_key':
        return AppError.conflict(
          'National serial number already exists',
          'NATIONAL_SERIAL_ALREADY_EXISTS'
        );

      case 'applications_email_key':
        return AppError.conflict('Email already exists', 'EMAIL_ALREADY_EXISTS');

      default:
        return AppError.conflict('Duplicate value', 'DUPLICATE_VALUE');
    }
  }

  return null;
}

module.exports = mapPostgresError;
