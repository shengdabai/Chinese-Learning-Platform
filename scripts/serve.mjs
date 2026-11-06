import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
};

// Export the request handler so tests need no listening socket or external service.
export function createStaticHandler(directory) {
  const root = resolve(directory);
  async function asset(pathname) {
    const base = await realpath(root);
    const file = await realpath(join(base, pathname));
    const location = relative(base, file);
    if (location === '..' || location.startsWith(`..${sep}`) || !(await stat(file)).isFile()) {
      throw Object.assign(new Error('Not found'), { code: 'ENOENT' });
    }
    return readFile(file);
  }

  return async (req, res) => {
    const send = (status, body, type = 'text/plain; charset=utf-8', extra = {}) => {
      res.writeHead(status, {
        'Content-Type': type, 'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin', ...extra,
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    if (!['GET', 'HEAD'].includes(req.method)) return send(405, 'Method not allowed', undefined, { Allow: 'GET, HEAD' });
    let pathname;
    try {
      pathname = decodeURIComponent((req.url || '/').split('?')[0]);
    } catch {
      return send(400, 'Bad request');
    }
    if (!pathname.startsWith('/') || pathname.startsWith('//') || /[\\%]/.test(pathname) ||
        pathname.includes('\0') || pathname.split('/').some(part => part.startsWith('.'))) {
      return send(404, 'Not found');
    }
    const health = pathname === '/healthz';
    let file = health || pathname === '/' ? '/index.html' : pathname;
    try {
      let body;
      try {
        body = await asset(file);
      } catch (error) {
        const navigation = !extname(pathname) && !/^\/(assets|api)(\/|$)/.test(pathname) &&
          (req.headers.accept || '').split(',').some(type => type.trim().split(';')[0] === 'text/html');
        if (health || !navigation || !['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
        file = '/index.html';
        body = await asset(file);
      }
      return health ? send(200, 'ok') : send(200, body, types[extname(file)] || 'application/octet-stream');
    } catch (error) {
      if (health) return send(503, 'Build unavailable');
      return ['ENOENT', 'ENOTDIR'].includes(error.code) ? send(404, 'Not found') : send(500, 'Internal server error');
    }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535');
  const server = createServer(createStaticHandler(resolve('dist')));
  server.on('error', () => { console.error('Static server could not start'); process.exitCode = 1; });
  server.listen(port, '0.0.0.0');
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
}
