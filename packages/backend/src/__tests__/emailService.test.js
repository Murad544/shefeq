const mockSend = jest.fn().mockResolvedValue({ data: { id: 'email-123' }, error: null });

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: mockSend } })),
}));
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

process.env.RESEND_API_KEY = 'test-key';
const { sendActivationEmail } = require('../utils/emailService');

describe('activation email', () => {
  afterAll(() => {
    delete process.env.RESEND_API_KEY;
  });

  it('sends the branded email and plain text link to the applicant', async () => {
    const url = 'https://example.com/activate/token?a=1&b=2';

    await sendActivationEmail('applicant@example.com', url);

    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      to: 'applicant@example.com',
      subject: 'Müraciətiniz təsdiqləndi — hesabınızı aktivləşdirin',
      text: expect.stringContaining(url),
      html: expect.stringContaining('FPV Tədris Alt Sistemi'),
    }));
    const { html } = mockSend.mock.calls[0][0];
    expect(html).toContain('href="https://example.com/activate/token?a=1&amp;b=2"');
    expect(html).toContain('Hesabı aktivləşdirin');
  });
});
