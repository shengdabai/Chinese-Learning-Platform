import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import { mockCourses, useStore } from '@/store/useStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  localStorage.setItem('hasVisited', 'true');
  useStore.setState({ cart: [], courses: [], user: null, isLoggedIn: false });
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

function render(path: string) {
  window.history.replaceState({}, '', path);
  act(() => root.render(React.createElement(App)));
}

describe('existing navigation destinations', () => {
  it('completes the search, detail and local cart path without a backend', () => {
    render('/');
    const input = container.querySelector('input')!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, '商务');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(window.location.pathname).toBe('/courses');
    act(() => (container.querySelector('h3 button') as HTMLButtonElement).click());
    expect(container.querySelector('h1')!.textContent).toBe(mockCourses[1].title);
    const addButton = Array.from(container.querySelectorAll('button')).find(b => b.textContent === '加入购物车')!;
    act(() => addButton.click());
    act(() => (container.querySelector('button[aria-label="购物车"]') as HTMLButtonElement).click());
    expect(window.location.pathname).toBe('/cart');
    expect(container.textContent).toContain(mockCourses[1].title);
    expect(container.textContent).toContain('静态演示 · 支付尚未接入');
    const removeButton = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('移除'))!;
    act(() => removeButton.click());
    expect(container.textContent).toContain('购物车是空的');
  });

  it.each([
    ['beginner', '初学入门', mockCourses[0].title],
    ['hsk', '考试备考', mockCourses[2].title],
    ['business', '商务中文', mockCourses[1].title],
    ['conversation', '日常对话', mockCourses[4].title],
    ['culture', '文化课程', mockCourses[3].title],
  ])('opens the %s category as a filtered catalogue', (slug, category, title) => {
    render(`/categories/${slug}`);
    expect(window.location.pathname).toBe('/courses');
    expect(new URLSearchParams(window.location.search).get('category')).toBe(category);
    expect(container.querySelector('h1')!.textContent).toBe('全部课程');
    expect(container.querySelector('h3 button')!.textContent).toBe(title);
    expect(container.textContent).toContain('共 1 门课程');
  });

  it('opens the full catalogue from the category navigation item', () => {
    render('/categories');
    expect(window.location.pathname).toBe('/courses');
    expect(container.textContent).toContain('共 5 门课程');
    expect(container.querySelector('a[aria-current="page"]')!.getAttribute('href')).toBe('/courses');
  });

  it.each(['/missing-page', '/categories/unknown', '/help'])('shows a useful fallback for %s', (path) => {
    render(path);
    expect(container.querySelector('h1')!.textContent).toBe('页面未找到');
    expect(container.querySelector('main a')!.getAttribute('href')).toBe('/courses');
  });
});
