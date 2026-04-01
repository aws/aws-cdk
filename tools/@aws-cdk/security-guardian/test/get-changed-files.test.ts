import { detectChangedTemplates } from '../src/get-changed-files';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

// Mock exec module
jest.mock('@actions/exec');
const mockExec = exec as jest.Mocked<typeof exec>;

describe('Changed Files Detection', () => {
  const testDir = path.join(__dirname, 'changed-files-test');
  const mockRepoRoot = path.join(__dirname, 'mock-repo');

  beforeAll(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
    if (!fs.existsSync(mockRepoRoot)) fs.mkdirSync(mockRepoRoot, { recursive: true });
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
    if (fs.existsSync(mockRepoRoot)) fs.rmSync(mockRepoRoot, { recursive: true });
  });

  const mockGitCommands = (diffOutput: string, showOutput: string = '{}', repoRoot: string = mockRepoRoot) => {
    mockExec.exec.mockImplementation(async (command, args, options) => {
      if (command === 'git' && args?.[0] === 'diff' && options?.listeners?.stdout) {
        options.listeners.stdout(Buffer.from(diffOutput));
      }
      return 0;
    });
    
    mockExec.getExecOutput.mockImplementation(async (command, args) => {
      if (command === 'git' && args?.[0] === 'rev-parse') {
        return { exitCode: 0, stdout: repoRoot, stderr: '' };
      }
      if (command === 'git' && args?.[0] === 'show') {
        return { exitCode: 0, stdout: showOutput, stderr: '' };
      }
      return { exitCode: 0, stdout: '', stderr: '' };
    });
  };

  const verifyGitCommands = () => {
    expect(mockExec.exec).toHaveBeenCalledWith(
      'git',
      ['diff', '--name-status', 'main...HEAD'],
      expect.any(Object)
    );
    expect(mockExec.getExecOutput).toHaveBeenCalledWith(
      'git',
      ['rev-parse', '--show-toplevel']
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('detectChangedTemplates', () => {
    test('should detect and copy changed template files', async () => {
      // Mock git diff output
      const gitDiffOutput = 'M\tpackages/test1.template.json\nA\tpackages/test2.template.json\nM\tother-file.txt';
      mockGitCommands(gitDiffOutput);

      // Create actual template files in repo
      const packagesDir = path.join(mockRepoRoot, 'packages');
      if (!fs.existsSync(packagesDir)) fs.mkdirSync(packagesDir, { recursive: true });
      
      const mockFile1 = path.join(packagesDir, 'test1.template.json');
      const mockFile2 = path.join(packagesDir, 'test2.template.json');
      
      fs.writeFileSync(mockFile1, '{}');
      fs.writeFileSync(mockFile2, '{}');

      const fileMapping = await detectChangedTemplates('main', 'HEAD', testDir);

      verifyGitCommands();

      // Verify file mapping structure
      expect(fileMapping.size).toBe(2);
      
      // Check safe filename conversion
      const expectedSafeName1 = path.join(testDir, 'packages_test1.template.json');
      const expectedSafeName2 = path.join(testDir, 'packages_test2.template.json');
      
      expect(fileMapping.get(path.resolve(expectedSafeName1))).toBe('packages/test1.template.json');
      expect(fileMapping.get(path.resolve(expectedSafeName2))).toBe('packages/test2.template.json');
      
      // Verify files were actually copied
      expect(fs.existsSync(expectedSafeName1)).toBe(true);
      expect(fs.existsSync(expectedSafeName2)).toBe(true);

    });

    test('should handle missing files gracefully', async () => {
      const gitDiffOutput = 'M\tmissing-file.template.json';
      mockGitCommands(gitDiffOutput, 'file content');

      const fileMapping = await detectChangedTemplates('main', 'HEAD', testDir);

      verifyGitCommands();
      expect(fileMapping.size).toBe(1);
    });

    test('should filter only template.json files', async () => {
      const gitDiffOutput = 'M\tfile1.template.json\nA\tfile2.txt\nM\tfile3.js\nA\tfile4.template.json';
      mockGitCommands(gitDiffOutput);

      // Create actual template files
      fs.writeFileSync(path.join(mockRepoRoot, 'file1.template.json'), '{}');
      fs.writeFileSync(path.join(mockRepoRoot, 'file4.template.json'), '{}');

      const fileMapping = await detectChangedTemplates('main', 'HEAD', testDir);

      verifyGitCommands();
      expect(fileMapping.size).toBe(2);
      
      const mappedFiles = Array.from(fileMapping.values());
      expect(mappedFiles).toContain('file1.template.json');
      expect(mappedFiles).toContain('file4.template.json');
      expect(mappedFiles).not.toContain('file2.txt');
      expect(mappedFiles).not.toContain('file3.js');
    });
  });
});
