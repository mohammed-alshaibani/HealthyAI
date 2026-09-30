import { EMERGENCY_PATTERNS, SAFETY_RESPONSE_EN, SAFETY_RESPONSE_AR } from '../shared/safety.constants';

export interface SafetyResult {
  isEmergency: boolean;
  response?: string;
}

export function checkSafety(message: string): SafetyResult {
  const lower = message.toLowerCase();

  const isEmergency = EMERGENCY_PATTERNS.some((pattern) =>
    lower.includes(pattern.toLowerCase()),
  );

  if (!isEmergency) {
    return { isEmergency: false };
  }

  // Detect Arabic by checking for Arabic Unicode characters
  const isArabic = /[\u0600-\u06FF]/.test(message);

  return {
    isEmergency: true,
    response: isArabic ? SAFETY_RESPONSE_AR : SAFETY_RESPONSE_EN,
  };
}
