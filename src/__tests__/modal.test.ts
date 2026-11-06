import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Modal } from '@/components/ui/Modal';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let container: HTMLDivElement;
let root: Root;
let opener: HTMLButtonElement;

function render(isOpen: boolean, onClose = vi.fn()) {
  act(() => root.render(React.createElement(Modal, {
    isOpen, title: 'Welcome', onClose,
    children: React.createElement('button', { id: 'last-action' }, 'Continue'),
  })));
  return onClose;
}

function key(key: string, shiftKey = false) {
  act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true })));
}

beforeEach(() => {
  container = document.createElement('div');
  opener = document.createElement('button');
  document.body.append(opener, container);
  opener.focus();
  root = createRoot(container);
  document.body.style.overflow = 'scroll';
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  opener.remove();
  document.body.style.overflow = '';
});

describe('modal accessibility and lifecycle', () => {
  it('exposes a named dialog and moves focus inside it', () => {
    render(true);
    const dialog = container.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const title = document.getElementById(dialog.getAttribute('aria-labelledby')!);
    expect(title!.textContent).toBe('Welcome');
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(container.querySelector('button[aria-label="关闭对话框"]')).not.toBeNull();
  });

  it('wraps Tab and Shift+Tab within the dialog', () => {
    render(true);
    const first = container.querySelector('button')!;
    const last = container.querySelector('#last-action') as HTMLButtonElement;
    act(() => last.focus());
    key('Tab');
    expect(document.activeElement).toBe(first);
    key('Tab', true);
    expect(document.activeElement).toBe(last);
  });

  it('uses the latest close callback and restores focus and the exact overflow style on closing', () => {
    const previous = render(true);
    const latest = render(true);
    key('Escape');
    expect(previous).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledOnce();
    expect(document.body.style.overflow).toBe('hidden');
    render(false);
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('does not change the body style when mounted and unmounted closed', () => {
    render(false);
    act(() => root.unmount());
    expect(document.body.style.overflow).toBe('scroll');
    root = createRoot(container);
  });

  it('focuses the dialog itself when no controls are present', () => {
    act(() => root.render(React.createElement(Modal, {
      isOpen: true, onClose: vi.fn(), showCloseButton: false,
      children: React.createElement('p', null, 'Content'),
    })));
    expect(document.activeElement).toBe(container.querySelector('[role="dialog"]'));
    key('Tab');
    expect(document.activeElement).toBe(container.querySelector('[role="dialog"]'));
  });
});
