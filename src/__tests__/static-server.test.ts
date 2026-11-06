// @vitest-environment node
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createStaticHandler } from '../../scripts/serve.mjs';

let fixture: string;
let dist: string;
let handle: ReturnType<typeof createStaticHandler>;
async function request(url: string, method = 'GET', accept = 'text/html') {
  let status = 0;
  let headers: Record<string, string | number> = {};
  let body = '';
  await handle({ url, method, headers: { accept } }, {
    writeHead(code: number, values: typeof headers) { status = code; headers = values; },
    end(data?: Buffer | string) { body = data?.toString() || ''; },
  });
  return { status, headers, body };
}

beforeEach(() => {
  fixture = mkdtempSync(join(tmpdir(), 'u58-static-'));
  dist = join(fixture, 'dist');
  mkdirSync(join(dist, 'assets'), { recursive: true });
  writeFileSync(join(dist, 'index.html'), '<!doctype html><title>中文课程</title>');
  writeFileSync(join(dist, 'assets', 'app.js'), 'console.log("fixture")');
  writeFileSync(join(dist, 'robots.txt'), 'User-agent: *');
  handle = createStaticHandler(dist);
});
afterEach(() => rmSync(fixture, { recursive: true, force: true }));

describe('container static serving', () => {
  it.each(['/', '/courses/1?from=home', '/categories/hsk', '/cart', '/unknown-page'])('serves the SPA for HTML navigation to %s', async url => {
    const response = await request(url);
    expect(response.status).toBe(200);
    expect(response.body).toContain('<!doctype html>');
    expect(response.headers['Content-Type']).toBe('text/html; charset=utf-8');
    expect(response.headers['Cache-Control']).toBe('no-cache');
    expect(response.headers).not.toHaveProperty('Access-Control-Allow-Origin');
  });

  it('serves static files with the correct type and HEAD byte length', async () => {
    const script = await request('/assets/app.js?v=1', 'GET', '*/*');
    expect(script.status).toBe(200);
    expect(script.body).toBe('console.log("fixture")');
    expect(script.headers['Content-Type']).toBe('text/javascript; charset=utf-8');
    expect(script.headers['X-Content-Type-Options']).toBe('nosniff');
    const head = await request('/', 'HEAD');
    const get = await request('/');
    expect(head.status).toBe(200);
    expect(head.body).toBe('');
    expect(head.headers['Content-Length']).toBe(Buffer.byteLength(get.body));
    expect((await request('/robots.txt')).headers['Content-Type']).toBe('text/plain; charset=utf-8');
  });

  it.each(['/assets/missing.js', '/assets/missing', '/api', '/api/orders', '/missing.json'])('does not turn missing assets or API %s into HTML success', async url => {
    const response = await request(url);
    expect(response.status).toBe(404);
    expect(response.body).toBe('Not found');
  });

  it('does not fall back to HTML for non-navigation requests', async () => {
    expect((await request('/missing', 'GET', 'application/json')).status).toBe(404);
  });

  it.each(['/../outside', '/%2e%2e/outside', '/assets/%2e%2e/index.html', '/%252e%252e/outside', '/.hidden', '/%00', '/assets%5capp.js', '//outside'])('rejects unsafe pathname %s', async url => {
    expect((await request(url)).status).toBe(404);
  });

  it('does not follow symlinks outside the static root', async () => {
    writeFileSync(join(fixture, 'outside.txt'), 'fixture outside public root');
    symlinkSync(join(fixture, 'outside.txt'), join(dist, 'leak.txt'));
    expect((await request('/leak.txt')).status).toBe(404);
  });

  it('reports malformed encoding and unsupported HTTP methods', async () => {
    expect((await request('/%E0%A4%A')).status).toBe(400);
    const post = await request('/', 'POST');
    expect(post.status).toBe(405);
    expect(post.headers.Allow).toBe('GET, HEAD');
  });

  it('fails the health check when the build entry is unavailable', async () => {
    expect(await request('/healthz')).toMatchObject({ status: 200, body: 'ok' });
    rmSync(join(dist, 'index.html'));
    expect(await request('/healthz')).toMatchObject({ status: 503, body: 'Build unavailable' });
    expect((await request('/courses/1')).status).toBe(404);
  });
});
