import { describe, it, expect } from 'vitest';
import { searchDoctorsSchema } from '../apps/api/src/doctors/doctors.service';

describe('Tool Validation', () => {
  it('should validate correct doctor search args', () => {
    const result = searchDoctorsSchema.safeParse({ city: 'Riyadh', specialty: 'Cardiology' });
    expect(result.success).toBe(true);
  });

  it('should reject unexpected fields', () => {
    const result = searchDoctorsSchema.safeParse({ city: 'Riyadh', unknown_field: 'bad' });
    expect(result.success).toBe(false);
  });
});
