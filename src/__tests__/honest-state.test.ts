import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { useStore } from '../store/useStore';

describe('no fake success while no backend is connected', () => {
  beforeEach(() => {
    useStore.setState({ user: null, isLoggedIn: false, isLoading: false });
  });

  it('login does not authenticate arbitrary credentials as a fixed fake user', async () => {
    const ok = await useStore.getState().login('person@example.com', 'wrong-password');
    expect(ok).toBe(false);
    expect(useStore.getState().isLoggedIn).toBe(false);
    expect(useStore.getState().user).toBeNull();
    expect(useStore.getState().isLoading).toBe(false);
  });

  it('checkout button has a handler and the cart does not claim payment support', () => {
    const cart = readFileSync(resolve(__dirname, '../pages/Cart.tsx'), 'utf8');
    expect(cart).not.toContain('安全支付 · 支持微信/支付宝/信用卡');
    expect(cart).toMatch(/onClick=\{handleCheckout\}/);
  });
});
