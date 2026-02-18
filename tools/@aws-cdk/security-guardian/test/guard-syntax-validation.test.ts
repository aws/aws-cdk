import * as fs from 'fs';
import * as path from 'path';
import * as exec from '@actions/exec';

describe('Guard Rule Syntax Validation', () => {
  const rulesDir = path.join(__dirname, '..', 'rules');
  const dummyTemplateFilePath = path.join(__dirname, 'templates/dummy-template.json');

  // Recursively find all .guard files
  function findGuardFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findGuardFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.guard')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  test('all guard files have valid syntax', async () => {
    const guardFiles = findGuardFiles(rulesDir);
    
    for (const filePath of guardFiles) {
      
      try {
        // Test syntax by running cfn-guard validate with --rules-only flag
        await exec.exec('cfn-guard', [
          'validate',
          '--rules', filePath,
          '--show-summary', 'none',
          '--data', dummyTemplateFilePath
        ], {
          listeners: {
            stdout: () => {},
            stderr: () => {}
          }
        });
      } catch (error) {
        throw new Error(`Guard file ${filePath} has syntax errors: ${error}`);
      }
    }
  }, 60000);
});