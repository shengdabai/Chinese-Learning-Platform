import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App';
import { Home } from '@/pages/Home';
import { useStore } from '@/store/useStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  useStore.setState({ user: null, isLoggedIn: false, courses: [] });
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('demo disclosure and restricted browser storage', () => {
  it.each(['getItem', 'setItem'] as const)('still renders courses and the welcome dialog when localStorage.%s throws', method => {
    vi.spyOn(Storage.prototype, method).mockImplementation(() => { throw new DOMException('Storage blocked', 'SecurityError'); });
    expect(() => act(() => root.render(React.createElement(MemoryRouter, null, React.createElement(Home))))).not.toThrow();
    expect(container.querySelector('h3 button')).not.toBeNull();
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it.each(['/', '/pricing', '/courses/1', '/login'])('discloses sample data and unavailable services on direct entry to %s', path => {
    localStorage.setItem('hasVisited', 'true');
    window.history.replaceState({}, '', path);
    act(() => root.render(React.createElement(App)));
    const notice = container.querySelector('[role="note"]');
    expect(notice?.textContent).toContain('课程、价格和学员数据为示例');
    expect(notice?.textContent).toContain('请勿输入真实账号或密码');
    expect(notice?.textContent).toContain('登录、支付与学习服务尚未接入');
  });
});
