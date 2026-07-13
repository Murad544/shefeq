jest.mock('../repositories/applicationRepository', () => ({
  findByUserId: jest.fn(),
  updateApplication: jest.fn(),
}));

jest.mock('../repositories/userRepository', () => ({
  findById: jest.fn(),
  updateUser: jest.fn(),
}));

jest.mock('../services/shared/encryptionService', () => ({
  hashPassword: jest.fn(),
}));

const adminService = require('../services/adminService');
const applicationRepository = require('../repositories/applicationRepository');
const userRepository = require('../repositories/userRepository');
const encryptionService = require('../services/shared/encryptionService');

describe('adminService.updateUserDataForAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('blocks non-superadmin users from editing user data', async () => {
    await expect(
      adminService.updateUserDataForAdmin({ role: 'admin', id: 'admin-1' }, 'user-1', {
        name: 'Ali',
      })
    ).rejects.toMatchObject({ statusCode: 403 });

    expect(applicationRepository.updateApplication).not.toHaveBeenCalled();
  });

  it('updates application details and password for superadmins', async () => {
    userRepository.findById.mockResolvedValue({ id: 'user-1' });
    applicationRepository.findByUserId.mockResolvedValue({ id: 'application-1' });
    applicationRepository.updateApplication.mockResolvedValue({ id: 'application-1' });
    userRepository.updateUser.mockResolvedValue({ id: 'user-1' });
    encryptionService.hashPassword.mockResolvedValue('hashed-password');

    const result = await adminService.updateUserDataForAdmin(
      { role: 'superadmin', id: 'admin-1' },
      'user-1',
      {
        name: 'Ali',
        surname: 'Hüseynov',
        phoneNumber: '+994501234567',
        password: 'new-password-123',
      }
    );

    expect(applicationRepository.updateApplication).toHaveBeenCalledWith('application-1', {
      name: 'Ali',
      surname: 'Hüseynov',
      phone_number: '+994501234567',
    });
    expect(encryptionService.hashPassword).toHaveBeenCalledWith('new-password-123');
    expect(userRepository.updateUser).toHaveBeenCalledWith('user-1', {
      password_hash: 'hashed-password',
    });
    expect(result).toEqual({ updated: true });
  });
});
