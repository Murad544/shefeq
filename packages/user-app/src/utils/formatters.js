export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatDate = (dateString, format = "DD/MM/YYYY") => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Month names in Azerbaijani
    const monthNamesAz = [
      "Yanvar",
      "Fevral",
      "Mart",
      "Aprel",
      "May",
      "İyun",
      "İyul",
      "Avqust",
      "Sentyabr",
      "Oktyabr",
      "Noyabr",
      "Dekabr",
    ];

    switch (format) {
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`;
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "HH:mm":
        return `${hours}:${minutes}`;
      case "HH:mm:ss":
        return `${hours}:${minutes}:${seconds}`;
      case "DD/MM/YYYY HH:mm":
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      case "DD-MM-YYYY HH:mm":
        return `${day}-${month}-${year} ${hours}:${minutes}`;
      case "DD MMMM, YYYY":
        return `${day} ${monthNamesAz[date.getMonth()]}, ${year}`;
      case "DD MMMM YYYY":
        return `${day} ${monthNamesAz[date.getMonth()]} ${year}`;
      case "MMMM DD, YYYY":
        return `${monthNamesAz[date.getMonth()]} ${day}, ${year}`;
      default:
        return dateString;
    }
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

/**
 * Formats phone number to Azerbaijan standard (+994XXXXXXXXX) for backend submission
 * @param {string} phoneNumber - Input phone number in any format
 * @returns {string} Formatted phone number with +994 country code
 */
export const formatPhoneNumberForSubmission = (phoneNumber) => {
  if (!phoneNumber) return "";

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // If already starts with 994, add + prefix
  if (cleaned.startsWith("994")) {
    const formatted = `+${cleaned}`;
    return formatted;
  }

  // If starts with 0 (local format), replace 0 with +994
  if (cleaned.startsWith("0")) {
    const formatted = `+994${cleaned.substring(1)}`;
    return formatted;
  }

  // If it's a 9-digit number (standard Azerbaijan mobile without country code or leading 0)
  if (cleaned.length === 9) {
    const formatted = `+994${cleaned}`;
    return formatted;
  }

  // If it's 12 digits starting with 994 but missing +
  if (cleaned.length === 12 && cleaned.startsWith("994")) {
    const formatted = `+${cleaned}`;
    return formatted;
  }

  // If it's 10 digits starting with 0
  if (cleaned.length === 10 && cleaned.startsWith("0")) {
    const formatted = `+994${cleaned.substring(1)}`;
    return formatted;
  }

  // For any other case, assume it's an Azerbaijan number and add +994
  const formatted = `+994${cleaned}`;
  return formatted;
};

/**
 * Validates if phone number is a valid Azerbaijan mobile number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid Azerbaijan phone number
 */
export const isValidAzerbaijanPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;

  const cleaned = phoneNumber.replace(/\D/g, "");

  // Azerbaijan mobile prefixes: 50, 51, 55, 70, 77, 99
  const validPrefixes = ["50", "51", "55", "70", "77", "99"];

  // Check different input formats
  if (cleaned.startsWith("994")) {
    // +994XXXXXXXXX format
    const number = cleaned.substring(3);
    if (number.length === 9) {
      const prefix = number.substring(0, 2);
      return validPrefixes.includes(prefix);
    }
  } else if (cleaned.startsWith("0")) {
    // 0XXXXXXXXX format
    if (cleaned.length === 10) {
      const prefix = cleaned.substring(1, 3);
      return validPrefixes.includes(prefix);
    }
  } else if (cleaned.length === 9) {
    // XXXXXXXXX format (without 0 or 994)
    const prefix = cleaned.substring(0, 2);
    return validPrefixes.includes(prefix);
  }

  return false;
};

/**
 * Formats phone number for display (user-friendly format)
 * @param {string} phoneNumber - Input phone number
 * @returns {string} Formatted display phone number
 */
export const formatPhoneNumberForDisplay = (phoneNumber) => {
  if (!phoneNumber) return "";

  const cleaned = phoneNumber.replace(/\D/g, "");

  // Format for display with spaces
  if (cleaned.startsWith("994")) {
    const number = cleaned.substring(3);
    if (number.length >= 9) {
      return `+994 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 7)} ${number.substring(7, 9)}`;
    }
    return `+994 ${number}`;
  } else if (cleaned.startsWith("0")) {
    if (cleaned.length >= 10) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}`;
    }
    return cleaned;
  }

  return phoneNumber;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatCurrency = (amount, currency = "AZN") => {
  if (typeof amount !== "number") return "0";

  return new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
