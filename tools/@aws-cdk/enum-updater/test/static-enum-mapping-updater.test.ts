import * as fs from 'fs';
import axios from 'axios';
import { normalizeValue, normalizeEnumValues, downloadGithubRawFile, extractModuleName, parseAwsSdkEnums } from '../lib/static-enum-mapping-updater';

// Mock external modules
jest.mock('fs');
jest.mock('path');
jest.mock('axios');
jest.mock('extract-zip');
jest.mock('tmp');

const mockFileSync = {
  name: '/mock/temp/file.txt',
  removeCallback: jest.fn()
};

const mockDirSync = {
  name: '/mock/temp/dir',
  removeCallback: jest.fn()
};

jest.mock('tmp', () => ({
  fileSync: jest.fn(() => mockFileSync),
  dirSync: jest.fn(() => mockDirSync),
  setGracefulCleanup: jest.fn()
}));

describe('Enum Processing Functions', () => {
  describe('normalizeValue', () => {
    it('should return numeric strings unchanged', () => {
      expect(normalizeValue('123')).toBe('123');
      expect(normalizeValue(123)).toBe('123');
    });

    it('should normalize string values', () => {
      expect(normalizeValue('Hello-World')).toBe('HELLOWORLD');
      expect(normalizeValue('test_case')).toBe('TESTCASE');
      expect(normalizeValue('Special@Characters!')).toBe('SPECIALCHARACTERS');
    });

    it('should handle empty strings', () => {
      expect(normalizeValue('')).toBe('');
    });
  });

  describe('normalizeEnumValues', () => {
    it('should normalize an array of values', () => {
      const input = ['Hello-World', 123, 'test_case'];
      const result = normalizeEnumValues(input);
      expect(result).toEqual(new Set(['HELLOWORLD', '123', 'TESTCASE']));
    });

    it('should handle empty arrays', () => {
      expect(normalizeEnumValues([])).toEqual(new Set());
    });

    it('should remove duplicates after normalization', () => {
      const input = ['Hello-World', 'HELLO_WORLD', 'hello_world'];
      const result = normalizeEnumValues(input);
      expect(result.size).toBe(1);
      expect(result).toEqual(new Set(['HELLOWORLD']));
    });
  });
});

describe('File Download Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fs.existsSync for the aws-models directory check
    (fs.existsSync as jest.Mock).mockImplementation((path) => {
      return path.includes('aws-models');
    });
    // Mock fs.cpSync
    (fs.cpSync as jest.Mock).mockImplementation(() => {});
  });

  describe('downloadGithubRawFile', () => {
    it('should successfully download and process a file', async () => {
      const mockData = { test: 'data' };
      (axios.get as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: mockData
      });
      
      const result = await downloadGithubRawFile('test-url');
      expect(axios.get).toHaveBeenCalledWith('test-url');
      expect(result).toEqual({
        path: mockFileSync.name,
        cleanup: expect.any(Function)
      });
    });
  });
});

describe('Parsing Functions', () => {
  describe('parseAwsSdkEnums', () => {
    beforeEach(() => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['test.json']);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      (fs.readFileSync as jest.Mock).mockImplementation((path) => {
        if (path.includes('test.json')) {
          return JSON.stringify({
            shapes: {
              'aws.service1#TestEnum': {
                type: 'enum',
                members: {
                  VALUE1: { traits: { 'smithy.api#enumValue': 'value1' } }
                }
              }
            }
          });
        }
        return '';
      });
    });

    it('should successfully parse SDK enum files', async () => {
      await parseAwsSdkEnums('/mock/path');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('sdk-enums.json'),
        expect.any(String)
      );
    });

    it('should handle invalid JSON files', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValueOnce('invalid json');
      await parseAwsSdkEnums('/mock/path');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });
});

describe('Module Name Extraction', () => {
  describe('extractModuleName', () => {
    it('should extract module name from valid paths', () => {
      expect(extractModuleName('/aws-cdk/packages/aws-lambda/test')).toBe('lambda');
      expect(extractModuleName('/aws-cdk/packages/aws-s3-alpha/test')).toBe('s3');
    });

    it('should handle invalid paths', () => {
      expect(extractModuleName('')).toBeNull();
      expect(extractModuleName('invalid/path')).toBeNull();
    });
  });
});
