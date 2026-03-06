const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const scriptPath = path.join(__dirname, '../../check-peer-dependencies.ts');

describe('check-peer-dependencies', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'peer-deps-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function runScript(packageDir) {
    try {
      execFileSync('npx', ['ts-node', scriptPath, packageDir], {
        cwd: path.join(__dirname, '../../..'),
        encoding: 'utf8',
        stdio: 'pipe',
      });
      return { success: true };
    } catch (error) {
      return { success: false, stderr: error.stderr };
    }
  }

  test('passes when no bundled dependencies', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      dependencies: {},
    };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));

    const result = runScript(tmpDir);
    expect(result.success).toBe(true);
  });

  test('passes when bundled dependency has no peer dependencies', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      bundleDependencies: ['foo'],
      dependencies: { foo: '^1.0.0' },
    };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));

    const fooDir = path.join(tmpDir, 'node_modules', 'foo');
    fs.mkdirSync(fooDir, { recursive: true });
    fs.writeFileSync(path.join(fooDir, 'package.json'), JSON.stringify({
      name: 'foo',
      version: '1.0.0',
    }));

    const result = runScript(tmpDir);
    expect(result.success).toBe(true);
  });

  test('passes when peer dependency is satisfied', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      bundleDependencies: ['foo'],
      dependencies: {
        foo: '^1.0.0',
        bar: '^2.0.0',
      },
    };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));

    const fooDir = path.join(tmpDir, 'node_modules', 'foo');
    fs.mkdirSync(fooDir, { recursive: true });
    fs.writeFileSync(path.join(fooDir, 'package.json'), JSON.stringify({
      name: 'foo',
      version: '1.0.0',
      peerDependencies: { bar: '>=2.0.0' },
    }));

    const result = runScript(tmpDir);
    expect(result.success).toBe(true);
  });

  test('fails when peer dependency is missing', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      bundleDependencies: ['foo'],
      dependencies: { foo: '^1.0.0' },
    };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));

    const fooDir = path.join(tmpDir, 'node_modules', 'foo');
    fs.mkdirSync(fooDir, { recursive: true });
    fs.writeFileSync(path.join(fooDir, 'package.json'), JSON.stringify({
      name: 'foo',
      version: '1.0.0',
      peerDependencies: { bar: '>=2.0.0' },
    }));

    const result = runScript(tmpDir);
    expect(result.success).toBe(false);
    expect(result.stderr).toContain('Peer dependency validation failed');
    expect(result.stderr).toContain('foo requires peer bar@>=2.0.0, but test-package does not include it');
  });

  test('fails when peer dependency version is incompatible', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      bundleDependencies: ['foo'],
      dependencies: {
        foo: '^1.0.0',
        bar: '^1.0.0',
      },
    };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));

    const fooDir = path.join(tmpDir, 'node_modules', 'foo');
    fs.mkdirSync(fooDir, { recursive: true });
    fs.writeFileSync(path.join(fooDir, 'package.json'), JSON.stringify({
      name: 'foo',
      version: '1.0.0',
      peerDependencies: { bar: '>=2.0.0' },
    }));

    const result = runScript(tmpDir);
    expect(result.success).toBe(false);
    expect(result.stderr).toContain('Peer dependency validation failed');
    expect(result.stderr).toContain('foo requires peer bar@>=2.0.0, but test-package has ^1.0.0 (min: 1.0.0)');
  });

  test('handles prerelease versions correctly', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      bundleDependencies: ['foo'],
      dependencies: {
        foo: '^1.0.0',
        bar: '^2.0.0-alpha.1',
      },
    };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));

    const fooDir = path.join(tmpDir, 'node_modules', 'foo');
    fs.mkdirSync(fooDir, { recursive: true });
    fs.writeFileSync(path.join(fooDir, 'package.json'), JSON.stringify({
      name: 'foo',
      version: '1.0.0',
      peerDependencies: { bar: '>=2.0.0-alpha.0' },
    }));

    const result = runScript(tmpDir);
    expect(result.success).toBe(true);
  });

  test('fails when package.json not found', () => {
    const result = runScript(tmpDir);
    expect(result.success).toBe(false);
    expect(result.stderr).toContain('package.json not found');
  });

  test('skips bundled dependency not in node_modules', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      bundleDependencies: ['missing-package'],
      dependencies: { 'missing-package': '^1.0.0' },
    };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));

    const result = runScript(tmpDir);
    expect(result.success).toBe(true);
  });

  test('fails when multiple peer dependencies have issues', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      bundleDependencies: ['foo'],
      dependencies: {
        foo: '^1.0.0',
        bar: '^1.0.0',
      },
    };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));

    const fooDir = path.join(tmpDir, 'node_modules', 'foo');
    fs.mkdirSync(fooDir, { recursive: true });
    fs.writeFileSync(path.join(fooDir, 'package.json'), JSON.stringify({
      name: 'foo',
      version: '1.0.0',
      peerDependencies: {
        bar: '>=2.0.0',
        baz: '>=1.0.0',
      },
    }));

    const result = runScript(tmpDir);
    expect(result.success).toBe(false);
    expect(result.stderr).toContain('Peer dependency validation failed');
    expect(result.stderr).toContain('foo requires peer bar@>=2.0.0, but test-package has ^1.0.0 (min: 1.0.0)');
    expect(result.stderr).toContain('foo requires peer baz@>=1.0.0, but test-package does not include it');
  });

  test('handles bundledDependencies spelling variant', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      bundledDependencies: ['foo'],
      dependencies: {
        foo: '^1.0.0',
        bar: '^2.0.0',
      },
    };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));

    const fooDir = path.join(tmpDir, 'node_modules', 'foo');
    fs.mkdirSync(fooDir, { recursive: true });
    fs.writeFileSync(path.join(fooDir, 'package.json'), JSON.stringify({
      name: 'foo',
      version: '1.0.0',
      peerDependencies: { bar: '>=2.0.0' },
    }));

    const result = runScript(tmpDir);
    expect(result.success).toBe(true);
  });
});
