import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique identifier (UUID).
 * Centralizes the ID generation strategy for the entire application.
 * If we need to change the ID format in the future, we only change it here.
 */
export const generateId = (): string => {
  return uuidv4();
};