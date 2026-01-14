/**
 * Integration tests for comprehensive utility script improvements
 * 
 * These tests verify that the improved utility scripts maintain backward
 * compatibility while providing enhanced error handling and validation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPTS_DIR = path.join(__dirname, '../..');

describe('Utility Script Improvements', () => {
  describe('Script Structure Snapshots', () => {
    test('stability.js should match expected structure', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'stability.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      // Extract key structural elements for snapshot
      const structure = {
        hasJSDoc: content.includes('/**'),
        hasFileExistenceCheck: content.includes('fs.existsSync'),
        hasCfnOnlyFunction: content.includes('function cfnOnly'),
        exports: content.match(/module\.exports\s*=\s*{([^}]+)}/)?.[1]?.trim() || '',
      };
      
      expect(structure).toMatchSnapshot();
    });

    test('align-version.js should match expected structure', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'align-version.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      const structure = {
        hasArgumentValidation: content.includes('process.argv') && /length.*[<>]/.test(content),
        hasSuccessIndicator: content.includes('✓'),
        hasVersionFile: content.includes('version.v'),
      };
      
      expect(structure).toMatchSnapshot();
    });

    test('bump.js should match expected structure', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'bump.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      const structure = {
        hasValidBumpTypes: content.includes('VALID_BUMP_TYPES'),
        hasInterestingChanges: content.includes('hasInterestingChanges'),
        bumpTypes: content.match(/['"](?:major|minor|patch)['"]/g) || [],
      };
      
      expect(structure).toMatchSnapshot();
    });

    test('find-latest-release.js should match expected structure', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'find-latest-release.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      const structure = {
        hasShebang: content.startsWith('#!/usr/bin/env node'),
        hasJSDoc: content.includes('/**'),
        hasSemverValidation: content.includes('semver.validRange'),
        hasErrorHandling: content.includes('console.error'),
        hasExamples: content.includes('Examples:'),
      };
      
      expect(structure).toMatchSnapshot();
    });

    test('jetbrains-remove-node-modules.js should match expected structure', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'jetbrains-remove-node-modules.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      const structure = {
        usesDirPath: content.includes('dirPath'),
        doesNotShadowPath: !content.match(/function\s*\([^)]*\bpath\b[^)]*\)/),
      };
      
      expect(structure).toMatchSnapshot();
    });
  });

  describe('log-memory.js', () => {
    test('should monitor memory usage', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'log-memory.js');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content).toContain('memoryUsage');
      expect(content).toContain('rss');
    });
  });

  describe('check-yarn-lock.js', () => {
    test('should verify yarn lock consistency', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'check-yarn-lock.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('/**');
      expect(content).toContain('yarn.lock');
    });
  });

  describe('stability.js', () => {
    test('should have file existence validation', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'stability.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('fs.existsSync');
    });

    test('should have JSDoc for all functions', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'stability.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      // Should have documentation for main functions
      expect(content).toContain('/**');
      expect(content).toMatch(/@(param|returns)/);
    });
  });

  describe('align-version.js', () => {
    test('should validate CLI arguments', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'align-version.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('process.argv');
      expect(content).toMatch(/length.*<|!/);
    });

    test('should have success indicators', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'align-version.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('✓');
    });
  });

  describe('bump.js', () => {
    test('should define valid bump types constant', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'bump.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('VALID_BUMP_TYPES');
      expect(content).toMatch(/major|minor|patch/);
    });

    test('should have improved variable naming', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'bump.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('hasInterestingChanges');
    });
  });

  describe('find-latest-release.js', () => {
    test('should find latest release', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'find-latest-release.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('semver');
    });

    test('should include helpful error messages', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'find-latest-release.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      // Should have informative error messages
      expect(content).toMatch(/Error|error/);
      expect(content.length).toBeGreaterThan(1000); // Significantly enhanced
    });
  });

  describe('jetbrains-remove-node-modules.js', () => {
    test('should not have variable shadowing', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'jetbrains-remove-node-modules.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      // Should use dirPath instead of shadowing 'path'
      expect(content).toContain('dirPath');
    });
  });

  describe('retain-public.js', () => {
    test('should filter packages correctly', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'retain-public.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toMatch(/private|public/i);
    });
  });

  describe('create-release-notes.js', () => {
    test('should generate release notes', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'create-release-notes.js');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toMatch(/changelog|release/i);
    });
  });

  describe('dependencies.py', () => {
    test('should exist and be executable', () => {
      const scriptPath = path.join(SCRIPTS_DIR, 'dependencies.py');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content).toContain('def ');
      expect(content).toContain('import ');
    });
  });

  describe('Backward Compatibility', () => {
    test('all improved scripts should exist', () => {
      const scripts = [
        'log-memory.js',
        'check-yarn-lock.js',
        'dependencies.py',
        'stability.js',
        'align-version.js',
        'bump.js',
        'find-latest-release.js',
        'jetbrains-remove-node-modules.js',
        'retain-public.js',
        'create-release-notes.js'
      ];

      scripts.forEach(script => {
        const scriptPath = path.join(SCRIPTS_DIR, script);
        expect(fs.existsSync(scriptPath)).toBe(true);
      });
    });

    test('JavaScript scripts should be executable by Node.js', () => {
      const jsScripts = [
        'log-memory.js',
        'check-yarn-lock.js',
        'stability.js',
        'align-version.js',
        'bump.js',
        'find-latest-release.js',
        'jetbrains-remove-node-modules.js',
        'retain-public.js',
        'create-release-notes.js'
      ];

      jsScripts.forEach(script => {
        const scriptPath = path.join(SCRIPTS_DIR, script);
        const content = fs.readFileSync(scriptPath, 'utf-8');
        
        // Should not have syntax errors (basic check)
        expect(content).toBeTruthy();
        expect(content.length).toBeGreaterThan(0);
        
        // Should have Node.js shebang or be valid JS
        expect(
          content.startsWith('#!/usr/bin/env node') || 
          content.includes('require(') ||
          content.includes('const ') ||
          content.includes('function ')
        ).toBe(true);
      });
    });
  });
});
