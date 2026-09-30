export const DEFAULT_SEARCH_LIMIT = 10;

export function buildNameSearchFilter(name: string) {
  return {
    OR: [
      { name: { contains: name, mode: 'insensitive' } },
      { nameAr: { contains: name, mode: 'insensitive' } },
    ],
  };
}

export function buildContainsFilter(value: string) {
  return { contains: value, mode: 'insensitive' };
}

export function normalizeArrayFilter(value: string) {
  const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  return { has: normalized };
}
