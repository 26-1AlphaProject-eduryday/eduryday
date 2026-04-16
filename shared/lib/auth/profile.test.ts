import { describe, it, expect } from 'vitest';
import { isAdminEmail, normalizeRole, normalizeStatus, getDashboardPath } from './profile';

// ADMIN_EMAIL is resolved at module load time from process.env.ADMIN_EMAIL,
// defaulting to 'eduryday@gmail.com'. Tests use that default value.
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'eduryday@gmail.com').toLowerCase();

describe('auth/profile', () => {
  describe('isAdminEmail', () => {
    it('returns true for matching admin email (case insensitive)', () => {
      expect(isAdminEmail(ADMIN_EMAIL)).toBe(true);
      expect(isAdminEmail(ADMIN_EMAIL.toUpperCase())).toBe(true);
    });

    it('returns false for non-admin email', () => {
      expect(isAdminEmail('user@example.com')).toBe(false);
    });

    it('returns false for null/undefined', () => {
      expect(isAdminEmail(null)).toBe(false);
      expect(isAdminEmail(undefined)).toBe(false);
    });
  });

  describe('normalizeRole', () => {
    it('returns valid roles', () => {
      expect(normalizeRole('student')).toBe('student');
      expect(normalizeRole('professor')).toBe('professor');
      expect(normalizeRole('admin')).toBe('admin');
    });

    it('returns null for invalid roles', () => {
      expect(normalizeRole('unknown')).toBe(null);
      expect(normalizeRole(null)).toBe(null);
      expect(normalizeRole(undefined)).toBe(null);
    });
  });

  describe('normalizeStatus', () => {
    it('returns valid statuses', () => {
      expect(normalizeStatus('active')).toBe('active');
      expect(normalizeStatus('suspended')).toBe('suspended');
    });

    it('defaults to pending for unknown status', () => {
      expect(normalizeStatus('unknown')).toBe('pending');
      expect(normalizeStatus(null)).toBe('pending');
    });
  });

  describe('getDashboardPath', () => {
    it('returns correct dashboard path for each role', () => {
      expect(getDashboardPath('admin')).toBe('/admin/dashboard');
      expect(getDashboardPath('professor')).toBe('/professor/dashboard');
      expect(getDashboardPath('student')).toBe('/student/dashboard');
    });
  });
});
