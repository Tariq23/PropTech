// Currency formatting
export const formatCurrency = (amount, currency = 'GBP') => {
  if (!amount && amount !== 0) return 'N/A';
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return 'N/A';
  
  return `${parseFloat(value).toFixed(decimals)}%`;
};

// Date formatting
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString('en-GB', {
    ...defaultOptions,
    ...options,
  });
};

// Date and time formatting
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  return new Date(date).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Relative time formatting
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
};

// Number formatting with abbreviations
export const formatNumber = (num) => {
  if (!num && num !== 0) return 'N/A';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Phone number formatting
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format UK phone numbers
  if (cleaned.length === 11 && cleaned.startsWith('44')) {
    return `+44 ${cleaned.slice(2, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Address formatting
export const formatAddress = (address) => {
  if (!address) return 'N/A';
  
  if (typeof address === 'string') {
    return address;
  }
  
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.postcode) parts.push(address.postcode);
  if (address.country) parts.push(address.country);
  
  return parts.join(', ');
};

// Status formatting with colors
export const getStatusConfig = (status) => {
  const configs = {
    active: {
      label: 'Active',
      color: 'success',
      bgColor: 'bg-success-100',
      textColor: 'text-success-800',
    },
    pending: {
      label: 'Pending',
      color: 'warning',
      bgColor: 'bg-warning-100',
      textColor: 'text-warning-800',
    },
    inactive: {
      label: 'Inactive',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
    },
    verified: {
      label: 'Verified',
      color: 'success',
      bgColor: 'bg-success-100',
      textColor: 'text-success-800',
    },
    rejected: {
      label: 'Rejected',
      color: 'error',
      bgColor: 'bg-error-100',
      textColor: 'text-error-800',
    },
    draft: {
      label: 'Draft',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
    },
    published: {
      label: 'Published',
      color: 'success',
      bgColor: 'bg-success-100',
      textColor: 'text-success-800',
    },
    archived: {
      label: 'Archived',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
    },
  };
  
  return configs[status] || {
    label: status,
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  };
}; 