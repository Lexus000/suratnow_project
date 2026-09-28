/**
 * Demo mode is deliberately opt-in. Production builds default to live API data
 * even when old demo keys still exist in a user's browser storage.
 */
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
