export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error, context = '') => {
  console.error(`API Error in ${context}:`, error);

  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'İnternet bağlantısını yoxlayın və yenidən cəhd edin.',
      userMessage: 'Şəbəkə xətası'
    };
  }

  // API errors with status codes
  if (error.status) {
    switch (error.status) {
      case 400:
        return {
          type: 'VALIDATION_ERROR',
          message: error.message || 'Göndərilən məlumatlar səhvdir.',
          userMessage: 'Məlumat xətası',
          validationErrors: error.validationErrors
        };
      case 401:
        return {
          type: 'UNAUTHORIZED',
          message: 'İcazəniz yoxdur.',
          userMessage: 'İcazə xətası'
        };
      case 403:
        return {
          type: 'FORBIDDEN',
          message: 'Bu əməliyyat üçün icazəniz yoxdur.',
          userMessage: 'Qadağan'
        };
      case 404:
        return {
          type: 'NOT_FOUND',
          message: 'Axtarılan məlumat tapılmadı.',
          userMessage: 'Tapılmadı'
        };
      case 409:
        return {
          type: 'CONFLICT',
          message: error.message || 'Bu məlumat artıq mövcuddur.',
          userMessage: 'Dublikat məlumat'
        };
      case 413:
        return {
          type: 'FILE_TOO_LARGE',
          message: 'Fayl həcmi çox böyükdür (maksimum 20MB).',
          userMessage: 'Fayl çox böyükdür'
        };
      case 422:
        return {
          type: 'VALIDATION_ERROR',
          message: error.message || 'Məlumatlar düzgün formatda deyil.',
          userMessage: 'Format xətası',
          validationErrors: error.validationErrors
        };
      case 429:
        return {
          type: 'RATE_LIMITED',
          message: 'Çox tez-tez sorğu göndərirsiniz. Bir az gözləyin.',
          userMessage: 'Hədd aşımı'
        };
      case 500:
        return {
          type: 'SERVER_ERROR',
          message: 'Server xətası baş verdi. Daha sonra cəhd edin.',
          userMessage: 'Server xətası'
        };
      case 502:
        return {
          type: 'BAD_GATEWAY',
          message: 'Server müvəqqəti əlçatan deyil. Daha sonra cəhd edin.',
          userMessage: 'Server əlçatan deyil'
        };
      case 503:
        return {
          type: 'SERVICE_UNAVAILABLE',
          message: 'Xidmət müvəqqəti dayandırılıb. Daha sonra cəhd edin.',
          userMessage: 'Xidmət əlçatan deyil'
        };
      case 504:
        return {
          type: 'TIMEOUT',
          message: 'Server cavab vermək üçün çox vaxt aldı. Yenidən cəhd edin.',
          userMessage: 'Vaxt aşımı'
        };
      default:
        return {
          type: 'UNKNOWN_ERROR',
          message: error.message || 'Gözlənilməz xəta baş verdi.',
          userMessage: 'Naməlum xəta'
        };
    }
  }

  // Handle specific error messages
  if (error.message) {
    // Database constraint errors
    if (error.message.includes('national_id_num already exists')) {
      return {
        type: 'DUPLICATE_ID',
        message: 'Bu şəxsiyyət vəsiqəsi nömrəsi ilə artıq qeydiyyat mövcuddur.',
        userMessage: 'Dublikat FİN'
      };
    }

    if (error.message.includes('email already exists')) {
      return {
        type: 'DUPLICATE_EMAIL',
        message: 'Bu email ünvanı ilə artıq qeydiyyat mövcuddur.',
        userMessage: 'Dublikat email'
      };
    }

    if (error.message.includes('phone already exists')) {
      return {
        type: 'DUPLICATE_PHONE',
        message: 'Bu telefon nömrəsi ilə artıq qeydiyyat mövcuddur.',
        userMessage: 'Dublikat telefon'
      };
    }

    // File errors
    if (error.message.includes('File too large')) {
      return {
        type: 'FILE_TOO_LARGE',
        message: 'Yüklədiyiniz fayllardan biri çox böyükdür (maksimum 20MB).',
        userMessage: 'Fayl çox böyükdür'
      };
    }

    if (error.message.includes('Invalid file type')) {
      return {
        type: 'INVALID_FILE_TYPE',
        message: 'Yalnız PDF və MP4 faylları qəbul edilir.',
        userMessage: 'Yanlış fayl növü'
      };
    }

    if (error.message.includes('No files uploaded')) {
      return {
        type: 'NO_FILES',
        message: 'Heç bir fayl yüklənməyib.',
        userMessage: 'Fayl yoxdur'
      };
    }

    // Validation errors
    if (error.message.includes('validation')) {
      return {
        type: 'VALIDATION_ERROR',
        message: 'Məlumatlarınızı yoxlayın və yenidən cəhd edin.',
        userMessage: 'Validasiya xətası',
        validationErrors: error.validationErrors
      };
    }

    // Network connectivity
    if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
      return {
        type: 'NETWORK_ERROR',
        message: 'İnternet bağlantısını yoxlayın və yenidən cəhd edin.',
        userMessage: 'Bağlantı xətası'
      };
    }

    // Timeout errors
    if (error.message.includes('timeout') || error.message.includes('aborted')) {
      return {
        type: 'TIMEOUT',
        message: 'Əməliyyat çox vaxt aldı. Yenidən cəhd edin.',
        userMessage: 'Vaxt aşımı'
      };
    }
  }

  // Generic error handling
  return {
    type: 'UNKNOWN_ERROR',
    message: error.message || 'Gözlənilməz xəta baş verdi.',
    userMessage: 'Xəta'
  };
};

export const isNetworkError = (error) => {
  return error.name === 'TypeError' && 
         (error.message.includes('fetch') || 
          error.message.includes('Network') ||
          error.message.includes('Failed to fetch'));
};

export const isValidationError = (error) => {
  return error.status === 400 || 
         error.status === 422 || 
         error.validationErrors ||
         (error.message && error.message.includes('validation'));
};

export const isServerError = (error) => {
  return error.status >= 500 && error.status < 600;
};

export const isClientError = (error) => {
  return error.status >= 400 && error.status < 500;
};

export const shouldRetry = (error) => {
  // Retry for network errors, timeouts, and some server errors
  return isNetworkError(error) || 
         error.status === 408 || // Request Timeout
         error.status === 429 || // Too Many Requests
         error.status === 502 || // Bad Gateway
         error.status === 503 || // Service Unavailable
         error.status === 504;   // Gateway Timeout
};

/**
 * Creates a user-friendly error message for display in UI
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyMessage = (error, context = '') => {
  const errorInfo = handleApiError(error, context);
  return errorInfo.message;
};

/**
 * Logs error with proper formatting and context
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalData - Additional data to log
 */
export const logError = (error, context = '', additionalData = {}) => {
  const errorInfo = handleApiError(error, context);
  
  console.group(`🚨 ${errorInfo.userMessage} - ${context}`);
  console.error('Error Type:', errorInfo.type);
  console.error('Message:', errorInfo.message);
  console.error('Original Error:', error);
  
  if (error.status) {
    console.error('Status Code:', error.status);
  }
  
  if (errorInfo.validationErrors) {
    console.error('Validation Errors:', errorInfo.validationErrors);
  }
  
  if (Object.keys(additionalData).length > 0) {
    console.error('Additional Data:', additionalData);
  }
  
  console.error('Stack Trace:', error.stack);
  console.groupEnd();
};

/**
 * Retry mechanism for failed requests
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} Result of the function or throws final error
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's not a retryable error
      if (!shouldRetry(error)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Exponential backoff: delay * 2^attempt
      const backoffDelay = delay * Math.pow(2, attempt);
      console.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${backoffDelay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw lastError;
};

export default {
  ApiError,
  handleApiError,
  isNetworkError,
  isValidationError,
  isServerError,
  isClientError,
  shouldRetry,
  getUserFriendlyMessage,
  logError,
  retryWithBackoff
};