import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Carousel, type CarouselItem } from '@/components/Carousel';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const items: CarouselItem[] = [
  { id: 'a', title: 'First', image: '/first.svg', buttonText: 'Open first' },
  { id: 'b', title: 'Second', image: '/second.svg', buttonText: 'Open second' },
  { id: 'c', title: 'Third', image: '/third.svg', buttonText: 'Open third' },
];
let container: HTMLDivElement;
let root: Root;

function render(slides = items) {
  act(() => root.render(React.createElement(Carousel, { items: slides, autoPlayInterval: 1000 })));
}

function activeSlide() {
  return container.querySelector('[aria-roledescription="幻灯片"][aria-hidden="false"]');
}

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

describe('carousel navigation', () => {
  it('names its controls and keeps offscreen actions out of the keyboard tab order', () => {
    render();
    expect(activeSlide()!.textContent).toContain('First');
    expect(activeSlide()!.querySelector('button')!.tabIndex).toBe(0);
    const hidden = container.querySelectorAll('[aria-hidden="true"] button');
    expect(hidden).toHaveLength(2);
    hidden.forEach(button => expect((button as HTMLButtonElement).tabIndex).toBe(-1));
    act(() => (container.querySelector('button[aria-label="上一张"]') as HTMLButtonElement).click());
    expect(activeSlide()!.textContent).toContain('Third');
    act(() => (container.querySelector('button[aria-label="下一张"]') as HTMLButtonElement).click());
    expect(activeSlide()!.textContent).toContain('First');
  });

  it('pauses autoplay while keyboard focus is within the carousel and resumes on exit', () => {
    render();
    act(() => activeSlide()!.querySelector('button')!.focus());
    act(() => vi.advanceTimersByTime(3000));
    expect(activeSlide()!.textContent).toContain('First');
    act(() => activeSlide()!.querySelector('button')!.blur());
    act(() => vi.advanceTimersByTime(1000));
    expect(activeSlide()!.textContent).toContain('Second');
  });

  it('keeps a visible slide when a previously selected last item is removed', () => {
    render();
    act(() => vi.advanceTimersByTime(2000));
    expect(activeSlide()!.textContent).toContain('Third');
    render(items.slice(0, 2));
    expect(activeSlide()).not.toBeNull();
    expect(activeSlide()!.textContent).toContain('First');
  });

  it('renders an empty state without leaving autoplay timers running', () => {
    render();
    render([]);
    expect(container.textContent).toContain('暂无轮播内容');
    expect(vi.getTimerCount()).toBe(0);
  });
});
