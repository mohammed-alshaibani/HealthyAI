import { describe, it, expect } from 'vitest';
import { normalizeSpecialty } from '../apps/api/src/shared/db-utils';

describe('normalizeSpecialty', () => {
  it('should normalize Arabic and English OB-GYN variations', () => {
    expect(normalizeSpecialty('نساء وولادة')).toBe('OB-GYN');
    expect(normalizeSpecialty('نساء وتوليد')).toBe('OB-GYN');
    expect(normalizeSpecialty('ob/gyn')).toBe('OB-GYN');
    expect(normalizeSpecialty('Obstetrics and Gynecology')).toBe('OB-GYN');
  });

  it('should normalize Cardiology variations', () => {
    expect(normalizeSpecialty('طب القلب')).toBe('Cardiology');
    expect(normalizeSpecialty('قلب')).toBe('Cardiology');
  });

  it('should trim and ignore case for known specialties', () => {
    expect(normalizeSpecialty('  عظام  ')).toBe('Orthopedics');
    expect(normalizeSpecialty('طب الأطفال')).toBe('Pediatrics');
    expect(normalizeSpecialty(' الجلدية ')).toBe('Dermatology');
  });

  it('should return the original string if no mapping exists', () => {
    expect(normalizeSpecialty('Unknown Specialty')).toBe('Unknown Specialty');
    expect(normalizeSpecialty('')).toBe('');
  });
});
