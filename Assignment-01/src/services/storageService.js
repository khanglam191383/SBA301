import { INITIAL_CATEGORIES, INITIAL_NEWS, INITIAL_USERS } from './mockData';

const STORAGE_KEYS = {
  CATEGORIES: 'funews_categories',
  NEWS: 'funews_news',
  USERS: 'funews_users',
  AUTH: 'funews_current_user'
};

/**
 * Safely parse JSON from localStorage, fallback to defaultValue on error
 */
function safeGet(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safely stringify and write to localStorage
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export const storageService = {
  // Categories
  getCategories: () => {
    const data = safeGet(STORAGE_KEYS.CATEGORIES, null);
    if (!data) {
      safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return data;
  },

  saveCategories: (categories) => {
    safeSet(STORAGE_KEYS.CATEGORIES, categories);
  },

  // News
  getNews: () => {
    const data = safeGet(STORAGE_KEYS.NEWS, null);
    if (!data) {
      safeSet(STORAGE_KEYS.NEWS, INITIAL_NEWS);
      return INITIAL_NEWS;
    }
    return data;
  },

  saveNews: (news) => {
    safeSet(STORAGE_KEYS.NEWS, news);
  },

  // Users
  getUsers: () => {
    const data = safeGet(STORAGE_KEYS.USERS, null);
    if (!data) {
      safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
      return INITIAL_USERS;
    }
    return data;
  },

  saveUsers: (users) => {
    safeSet(STORAGE_KEYS.USERS, users);
  },

  // Auth Session
  getCurrentUser: () => {
    return safeGet(STORAGE_KEYS.AUTH, null);
  },

  saveCurrentUser: (user) => {
    if (user) {
      safeSet(STORAGE_KEYS.AUTH, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  },

  clearCurrentUser: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  // Reset all to mock initial data
  resetAll: () => {
    safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    safeSet(STORAGE_KEYS.NEWS, INITIAL_NEWS);
    safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
    return {
      categories: INITIAL_CATEGORIES,
      news: INITIAL_NEWS,
      users: INITIAL_USERS
    };
  }
};
