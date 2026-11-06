import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Navbar } from '@/components/Navbar';
import { CourseCard } from '@/components/CourseCard';
import { CourseList } from '@/pages/CourseList';
import { Home } from '@/pages/Home';
import { mockCourses, useStore } from '@/store/useStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let container: HTMLDivElement;
let root: Root;

function LocationProbe() {
  const location = useLocation();
  const navigate = useNavigate();
  return React.createElement(React.Fragment, null,
    React.createElement('output', { id: 'location' }, location.pathname + location.search),
    React.createElement('button', { onClick: () => navigate(-1) }, 'Back'));
}

function render(component: React.ReactElement, path = '/') {
  act(() => root.render(React.createElement(MemoryRouter, { initialEntries: [path] },
    component, React.createElement(LocationProbe))));
}

function inputValue(input: HTMLInputElement, value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function click(element: Element | null) {
  expect(element).not.toBeNull();
  act(() => (element as HTMLElement).click());
}

function button(text: string) {
  return Array.from(container.querySelectorAll('button')).find(b => b.textContent === text) ?? null;
}

function titles() {
  return Array.from(container.querySelectorAll('h3')).map(h => h.textContent);
}

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
});

describe('course discovery and actions', () => {
  it('shows the demo course catalogue on the home page without store initialization', () => {
    render(React.createElement(Home));
    expect(titles()).toContain(mockCourses[0].title);
    click(button('立即学习'));
    expect(container.querySelector('#location')!.textContent).toBe('/courses/1');
  });

  it.each([
    ['了解详情', '/courses/3'],
    ['查看课程', '/courses/2'],
  ])('opens the matching course from the %s banner', (label, path) => {
    render(React.createElement(Home));
    click(button(label));
    expect(container.querySelector('#location')!.textContent).toBe(path);
  });

  it('opens a course from its keyboard-accessible title', () => {
    render(React.createElement(CourseCard, { course: mockCourses[0] }));
    click(button(mockCourses[0].title));
    expect(container.querySelector('#location')!.textContent).toBe('/courses/1');
  });

  it('adds a course to the local cart without navigating', () => {
    render(React.createElement(CourseCard, { course: mockCourses[0] }));
    click(button('加入购物车'));
    expect(useStore.getState().cart).toMatchObject([{ courseId: '1', quantity: 1 }]);
    expect(container.querySelector('#location')!.textContent).toBe('/');
  });

  it('honors supplied card actions instead of also running the defaults', () => {
    const onAddToCart = vi.fn();
    const onViewDetails = vi.fn();
    render(React.createElement(CourseCard, { course: mockCourses[0], onAddToCart, onViewDetails }));
    click(button('加入购物车'));
    click(button(mockCourses[0].title));
    expect(onAddToCart).toHaveBeenCalledExactlyOnceWith(mockCourses[0]);
    expect(onViewDetails).toHaveBeenCalledExactlyOnceWith('1');
    expect(useStore.getState().cart).toEqual([]);
    expect(container.querySelector('#location')!.textContent).toBe('/');
  });

  it('submits a trimmed desktop search to the course list', () => {
    render(React.createElement(Navbar));
    inputValue(container.querySelector('input')!, '  HSK  ');
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    act(() => form!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(container.querySelector('#location')!.textContent).toBe('/courses?q=HSK');
  });

  it('uses the same query for mobile search and closes it after submitting', () => {
    render(React.createElement(Navbar));
    inputValue(container.querySelector('input')!, '中文');
    click(container.querySelector('button[aria-label="搜索课程"]'));
    const mobile = container.querySelector('#mobile-course-search');
    expect(mobile).not.toBeNull();
    expect((mobile!.querySelector('input') as HTMLInputElement).value).toBe('中文');
    act(() => mobile!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(container.querySelector('#location')!.textContent).toBe('/courses?q=%E4%B8%AD%E6%96%87');
    expect(container.querySelector('#mobile-course-search')).toBeNull();
  });

  it('filters search query from the URL case-insensitively and ignores surrounding spaces', () => {
    render(React.createElement(CourseList), '/courses?q=%20%20hSk%20%20');
    expect(titles().filter(title => title !== '筛选条件')).toEqual([mockCourses[2].title, mockCourses[0].title]);
    expect(container.querySelector('input')!.value).toBe('  hSk  ');
  });

  it('keeps URL, combined filters, sorting and back navigation in sync', () => {
    render(React.createElement(CourseList), '/courses?q=%E4%B8%AD%E6%96%87');
    click(button('零基础'));
    expect(container.querySelector('#location')!.textContent).toContain('level=beginner');
    expect(titles()).toContain(mockCourses[0].title);
    expect(titles()).not.toContain(mockCourses[1].title);
    act(() => {
      const select = container.querySelector('select')!;
      select.value = 'price';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(titles().filter(t => t !== '筛选条件')).toEqual([mockCourses[4].title, mockCourses[0].title]);
    click(button('Back'));
    expect(container.querySelector('select')!.value).toBe('popular');
  });

  it('clears all filters from the empty state and restores published courses', () => {
    render(React.createElement(CourseList), '/courses?q=missing&level=advanced&category=商务中文');
    expect(container.textContent).toContain('没有找到匹配的课程');
    click(button('清除筛选条件'));
    expect(container.querySelector('#location')!.textContent).toBe('/courses');
    expect(container.querySelector('input')!.value).toBe('');
    expect(titles().filter(t => t !== '筛选条件')).toHaveLength(5);
    expect(titles()).not.toContain(mockCourses[5].title);
  });
});
