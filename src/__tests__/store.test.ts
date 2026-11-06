import { describe, it, expect } from 'vitest';
import { formatDuration } from '@/lib/utils';

describe('formatDuration', () => {
  it('returns minutes for under 60', () => {
    expect(formatDuration(30)).toBe('30分钟');
  });

  it('returns hours for exactly 60', () => {
    expect(formatDuration(60)).toBe('1小时');
  });

  it('returns hours and minutes', () => {
    expect(formatDuration(90)).toBe('1小时30分钟');
    expect(formatDuration(150)).toBe('2小时30分钟');
  });

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0分钟');
  });
});
