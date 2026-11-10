// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (name: string) => readFileSync(resolve(name), 'utf8');

describe('local build and container contracts', () => {
  it('pins third-party CI actions and limits the workflow token to read access', () => {
    const workflow = read('.github/workflows/ci.yml');
    const actions = [...workflow.matchAll(/uses:\s*([^\s#]+)/g)].map(match => match[1]);
    expect(actions.length).toBeGreaterThan(0);
    for (const action of actions) {
      expect(action).toMatch(/^[\w.-]+\/[\w./-]+@[a-f0-9]{40}$/);
    }
    expect(workflow).toMatch(/^permissions:\n {2}contents: read$/m);
    expect(workflow).not.toMatch(/pull_request_target/);
  });

  it('does not expose a deployment command whose script is missing', () => {
    const { scripts } = JSON.parse(read('package.json'));
    for (const command of Object.values(scripts) as string[]) {
      for (const match of command.matchAll(/\b(scripts\/[\w./-]+)/g)) {
        expect(existsSync(resolve(match[1])), `Missing entry: ${match[1]}`).toBe(true);
      }
    }
    expect(read('.github/workflows/ci.yml')).not.toContain('scripts/deploy.sh');
  });

  it('copies existing inputs without treating shell operators as COPY arguments', () => {
    for (const line of read('Dockerfile').split('\n').filter(line => /^COPY /.test(line))) {
      expect(line).not.toMatch(/[|><]/);
      if (!line.includes('--from=')) {
        for (const source of line.split(/\s+/).slice(1, -1)) {
          expect(existsSync(resolve(source)), `Missing COPY input: ${source}`).toBe(true);
        }
      }
    }
  });

  it('excludes local state and dependencies from the Docker context', () => {
    const rules = read('.dockerignore').split('\n');
    expect(rules[0]).toBe('**');
    for (const blocked of ['.vercel', '.omc', '.env', 'node_modules', 'node_modules.nosync']) {
      expect(rules).not.toContain(`!${blocked}`);
      expect(rules).not.toContain('!.');
    }
  });
});
