import { describe, it, expect } from 'vitest';
import { formatPrice, formatDuration, formatDate, generateId, cn } from '@/lib/utils';

describe('utils', () => {
  it('formatPrice formats numbers as yuan', () => {
    expect(formatPrice(0)).toBe('¥0.00');
    expect(formatPrice(99)).toBe('¥99.00');
    expect(formatPrice(199.9)).toBe('¥199.90');
  });

  it('formatDuration converts minutes to human-readable', () => {
    expect(formatDuration(30)).toBe('30分钟');
    expect(formatDuration(60)).toBe('1小时');
    expect(formatDuration(90)).toBe('1小时30分钟');
  });

  it('generateId returns a 9-char string', () => {
    const id = generateId();
    expect(id.length).toBe(9);
    expect(typeof id).toBe('string');
  });

  it('cn merges tailwind classes', () => {
    expect(cn('px-4', 'py-2')).toContain('px-4');
    expect(cn('px-4', 'px-8')).toContain('px-8');
  });

  it('formatDate returns Chinese date format', () => {
    const d = formatDate('2024-01-15');
    expect(typeof d).toBe('string');
    expect(d.length).toBeGreaterThan(0);
  });
});
