import * as fs from 'fs';
import * as path from 'path';
import * as exec from '@actions/exec';

describe('Guard Rule Syntax Validation', () => {
  const rulesDir = path.join(__dirname, '..', 'rules');
  const dummyTemplateFilePath = path.join(__dirname, 'templates/dummy-template.json');

  test('all guard files have valid syntax', async () => {
    const guardFiles = fs.readdirSync(rulesDir).filter(file => file.endsWith('.guard'));
    
    for (const file of guardFiles) {
      const filePath = path.join(rulesDir, file);
      
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
        throw new Error(`Guard file ${file} has syntax errors: ${error}`);
      }
    }
  }, 60000);
});