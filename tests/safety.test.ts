import { describe, it, expect } from 'vitest';
import { checkSafety } from '../apps/api/src/safety/safety.service';

describe('Safety Service', () => {
  it('should detect emergency symptoms in English', () => {
    const result = checkSafety('I have severe chest pain');
    expect(result.isEmergency).toBe(true);
    expect(result.response).toContain('emergency services');
  });

  it('should detect emergency symptoms in Arabic', () => {
    const result = checkSafety('لدي ألم في الصدر');
    expect(result.isEmergency).toBe(true);
    expect(result.response).toContain('خدمات الطوارئ');
  });

  it('should pass non-emergency queries', () => {
    const result = checkSafety('I need a dermatologist for my acne');
    expect(result.isEmergency).toBe(false);
    expect(result.response).toBeUndefined();
  });
});
