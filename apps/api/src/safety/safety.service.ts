const EMERGENCY_PATTERNS = [
  'chest pain',
  'difficulty breathing',
  "can't breathe",
  'cannot breathe',
  'heart attack',
  'stroke',
  'loss of consciousness',
  'lost consciousness',
  'fainted',
  'fainting',
  'severe bleeding',
  'bleeding heavily',
  'unconscious',
  // Arabic patterns
  'ألم في الصدر',
  'ألم بالصدر',
  'صعوبة في التنفس',
  'صعوبة التنفس',
  'نزيف حاد',
  'فقدان الوعي',
  'سكتة دماغية',
  'نوبة قلبية',
];

const SAFETY_RESPONSE_EN = `⚠️ Based on the symptoms you described, this may require urgent medical attention.

Please take the following steps immediately:
• Call emergency services (997 in Saudi Arabia)
• Go to the nearest emergency room
• Do not delay seeking professional medical help

This assistant cannot provide emergency medical care or diagnosis.`;

const SAFETY_RESPONSE_AR = `⚠️ بناءً على الأعراض التي وصفتها، قد تحتاج إلى رعاية طبية عاجلة.

يرجى اتخاذ الخطوات التالية فوراً:
• اتصل بخدمات الطوارئ (997 في المملكة العربية السعودية)
• توجه إلى أقرب غرفة طوارئ
• لا تتأخر في طلب المساعدة الطبية المتخصصة

هذا المساعد لا يمكنه تقديم رعاية طبية طارئة أو تشخيص.`;

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
