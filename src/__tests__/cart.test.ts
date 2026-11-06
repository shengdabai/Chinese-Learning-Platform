import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import { Cart } from '@/pages/Cart';
import { CourseDetail } from '@/pages/CourseDetail';
import { mockCourses, useStore } from '@/store/useStore';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  useStore.setState({ cart: [] });
  vi.clearAllMocks();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  useStore.setState({ cart: [] });
});

describe('one copy per digital course', () => {
  it('reports an already-added course without claiming another successful addition', () => {
    const course = mockCourses[0];
    useStore.getState().addToCart(course);
    const cart = useStore.getState().cart;
    act(() => root.render(React.createElement(MemoryRouter, { initialEntries: [`/courses/${course.id}`] },
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/courses/:id', element: React.createElement(CourseDetail) })))));
    act(() => Array.from(container.querySelectorAll('button')).find(el => el.textContent!.includes('加入购物车'))!.click());
    expect(toast.info).toHaveBeenCalledExactlyOnceWith(`「${course.title}」已在购物车中`);
    expect(toast.success).not.toHaveBeenCalled();
    expect(useStore.getState().cart).toBe(cart);
  });

  it('reports success only for the first addition, even on rapid repeated clicks', () => {
    const course = mockCourses[0];
    useStore.getState().addToCart(mockCourses[1]);
    act(() => root.render(React.createElement(MemoryRouter, { initialEntries: [`/courses/${course.id}`] },
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/courses/:id', element: React.createElement(CourseDetail) })))));
    const add = Array.from(container.querySelectorAll('button')).find(el => el.textContent!.includes('加入购物车'))!;
    act(() => { add.click(); add.click(); });
    expect(toast.success).toHaveBeenCalledExactlyOnceWith(`已添加「${course.title}」到购物车`);
    expect(toast.info).toHaveBeenCalledExactlyOnceWith(`「${course.title}」已在购物车中`);
    expect(useStore.getState().cart.map(item => [item.courseId, item.quantity])).toEqual([
      [mockCourses[1].id, 1], [course.id, 1],
    ]);
  });

  it('keeps repeated additions idempotent and totals equal to visible course prices', () => {
    const { addToCart } = useStore.getState();
    addToCart(mockCourses[0]);
    addToCart(mockCourses[0]);
    addToCart(mockCourses[1]);
    expect(useStore.getState().cart.map(item => item.quantity)).toEqual([1, 1]);
    act(() => root.render(React.createElement(MemoryRouter, null, React.createElement(Cart))));
    expect(container.querySelector('h1')!.textContent).toContain('(2)');
    const total = Array.from(container.querySelectorAll('span')).find(el => el.textContent === '合计')!;
    expect(total.parentElement!.textContent).toBe('合计¥898.00');
    act(() => Array.from(container.querySelectorAll('button')).find(el => el.textContent!.includes('去结算'))!.click());
    expect(toast.error).toHaveBeenCalledOnce();
    expect(useStore.getState().cart).toHaveLength(2);
  });

  it.each([2, 1.5, Infinity, NaN])('does not allow invalid quantity %s to multiply the course price', quantity => {
    useStore.getState().addToCart(mockCourses[0]);
    useStore.getState().updateCartQuantity('1', quantity);
    expect(useStore.getState().cart[0].quantity).toBe(1);
  });

  it('allows removal and re-adding without creating duplicates', () => {
    useStore.getState().addToCart(mockCourses[0]);
    useStore.getState().updateCartQuantity('1', 0);
    expect(useStore.getState().cart).toEqual([]);
    useStore.getState().addToCart(mockCourses[0]);
    expect(useStore.getState().cart).toHaveLength(1);
    useStore.getState().removeFromCart('1');
    expect(useStore.getState().cart).toEqual([]);
  });

  it.each(['draft', 'coming_soon'] as const)('rejects an unavailable %s course at the store boundary', status => {
    useStore.getState().addToCart({ ...mockCourses[0], status });
    expect(useStore.getState().cart).toEqual([]);
  });

  it('does not offer cart or preview actions for an upcoming course deep link', () => {
    act(() => root.render(React.createElement(MemoryRouter, { initialEntries: ['/courses/6'] },
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/courses/:id', element: React.createElement(CourseDetail) })))));
    const add = Array.from(container.querySelectorAll('button')).find(el => el.textContent === '即将上线')!;
    expect(add).toBeDefined();
    expect(add.disabled).toBe(true);
    const preview = Array.from(container.querySelectorAll('button')).find(el => el.textContent!.includes('免费试听'))!;
    expect(preview.disabled).toBe(true);
    act(() => add.click());
    expect(useStore.getState().cart).toEqual([]);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
