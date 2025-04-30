import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as tmp from 'tmp';
import { 
  parseAwsSdkEnums,
  normalizeValue,
  normalizeEnumValues,
  extractModuleName,
  entryMethod,
  generateAndSaveStaticMapping,
  findMatchingEnum
} from '../lib/static-enum-mapping-updater';

jest.mock('axios');
jest.mock('fs');
jest.mock('path');
jest.mock('path');
jest.mock('tmp');
jest.mock('extract-zip');

describe('Enum Processing Functions', () => {
  describe('normalizeValue', () => {
    it('should handle numeric values', () => {
      expect(normalizeValue('123')).toBe('123');
      expect(normalizeValue(456)).toBe('456');
    });

    it('should normalize string values', () => {
      expect(normalizeValue('Hello-World')).toBe('HELLOWORLD');
      expect(normalizeValue('test_case')).toBe('TESTCASE');
      expect(normalizeValue('Special@Characters!')).toBe('SPECIALCHARACTERS');
    });
  });

  describe('normalizeEnumValues', () => {
    it('should normalize and deduplicate values', () => {
      const input = ['Hello-World', 'HELLO_WORLD', '123'];
      expect(normalizeEnumValues(input)).toEqual(new Set(['HELLOWORLD', '123']));
    });
  });

  describe('extractModuleName', () => {
    it('should extract module name from AWS CDK paths', () => {
      expect(extractModuleName('aws-cdk/packages/@aws-cdk/aws-amplify-alpha/lib/app.ts'))
        .toBe('amplify');
    });

    it('should handle paths with alpha suffix', () => {
      expect(extractModuleName('aws-cdk/packages/@aws-cdk/aws-service-alpha/lib/app.ts'))
        .toBe('service');
    });

    it('should return null for invalid paths', () => {
      expect(extractModuleName('invalid/path')).toBeNull();
    });
  });
});

describe('File Operations', () => {
  const mockTmpFile = {
    name: '/tmp/mock-file',
    removeCallback: jest.fn()
  };

  const mockDir = {
    name: '/tmp/mock-dir',
    removeCallback: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (tmp.fileSync as jest.Mock).mockReturnValue(mockTmpFile);
    (tmp.dirSync as jest.Mock).mockReturnValue(mockDir);
  });

describe('parseAwsSdkEnums', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  });

  it('should correctly parse and extract enum values from JSON files', async () => {
    // Mock file system operations
    const mockFiles = ['service-apigateway.json', 'service-ec2.json'];
    (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
    
    // Mock path.join to return predictable paths
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    
    // Mock file content for apigateway service
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath === '/mock/path/service-apigateway.json') {
        return JSON.stringify({
          properties: {
            AccessAssociationSourceType: {
              enum: ['VPCE', 'VPC_ENDPOINT']
            },
            ApiKeySourceType: {
              enum: ['HEADER', 'AUTHORIZER']
            }
          }
        });
      } else if (filePath === '/mock/path/service-ec2.json') {
        return JSON.stringify({
          properties: {
            InstanceType: {
              enum: ['t2.micro', 't2.small', 't2.medium']
            }
          }
        });
      }
      return '{}';
    });
    
    // Create a custom mock for String.prototype.split
    const originalSplit = String.prototype.split;
    const mockSplit = function(this: string, separator: any): string[] {
      if (this === 'service-apigateway.json' && separator === '-') {
        return ['service', 'apigateway'];
      } else if (this === 'service-ec2.json' && separator === '-') {
        return ['service', 'ec2'];
      }
      return originalSplit.call(this, separator);
    };
    
    // Apply the mock
    String.prototype.split = mockSplit;
    
    // Execute the function
    await parseAwsSdkEnums('/mock/path');
    
    // Restore original function
    String.prototype.split = originalSplit;
    
    // Verify the results
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
    const outputPath = writeCall[0];
    const writtenContent = JSON.parse(writeCall[1]);
    
    // Check that the output path is correct
    expect(outputPath).toBe('lib/sdk-enums.json');
    
    // Check that the enum values were correctly extracted
    expect(writtenContent).toHaveProperty('apigateway');
    expect(writtenContent.apigateway).toHaveProperty('AccessAssociationSourceType');
    expect(writtenContent.apigateway.AccessAssociationSourceType).toEqual(['VPCE', 'VPC_ENDPOINT']);
    expect(writtenContent.apigateway.ApiKeySourceType).toEqual(['HEADER', 'AUTHORIZER']);
    
    expect(writtenContent).toHaveProperty('ec2');
    expect(writtenContent.ec2.InstanceType).toEqual(['t2.micro', 't2.small', 't2.medium']);
  });

  it('should handle nested properties correctly', async () => {
    // Mock file system operations
    (fs.readdirSync as jest.Mock).mockReturnValue(['service-s3.json']);
    
    // Mock path.join to return predictable paths
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    
    // Mock file with nested properties
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath === '/mock/path/service-s3.json') {
        return JSON.stringify({
          properties: {
            BucketConfiguration: {
              properties: {
                AccessControl: {
                  enum: ['Private', 'PublicRead', 'PublicReadWrite']
                },
                StorageClass: {
                  enum: ['STANDARD', 'REDUCED_REDUNDANCY']
                }
              }
            }
          }
        });
      }
      return '{}';
    });
    
    // Create a custom mock for String.prototype.split
    const originalSplit = String.prototype.split;
    const mockSplit = function(this: string, separator: any): string[] {
      if (this === 'service-s3.json' && separator === '-') {
        return ['service', 's3'];
      }
      return originalSplit.call(this, separator);
    };
    
    // Apply the mock
    String.prototype.split = mockSplit;
    
    // Execute the function
    await parseAwsSdkEnums('/mock/path');
    
    // Restore original function
    String.prototype.split = originalSplit;
    
    // Verify the results
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
    const writtenContent = JSON.parse(writeCall[1]);
    
    // Check that nested enum values were correctly extracted
    expect(writtenContent).toHaveProperty('s3');
    expect(writtenContent.s3).toHaveProperty('AccessControl');
    expect(writtenContent.s3.AccessControl).toEqual(['Private', 'PublicRead', 'PublicReadWrite']);
    expect(writtenContent.s3.StorageClass).toEqual(['STANDARD', 'REDUCED_REDUNDANCY']);
  });

  it('should handle array enum values correctly', async () => {
    // Mock file system operations
    (fs.readdirSync as jest.Mock).mockReturnValue(['service-lambda.json']);
    
    // Mock path.join to return predictable paths
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    
    // Mock file with array enum values
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath === '/mock/path/service-lambda.json') {
        return JSON.stringify({
          properties: {
            Runtime: {
              items: {
                enum: ['nodejs14.x', 'nodejs16.x', 'python3.9']
              }
            }
          }
        });
      }
      return '{}';
    });
    
    // Create a custom mock for String.prototype.split
    const originalSplit = String.prototype.split;
    const mockSplit = function(this: string, separator: any): string[] {
      if (this === 'service-lambda.json' && separator === '-') {
        return ['service', 'lambda'];
      }
      return originalSplit.call(this, separator);
    };
    
    // Apply the mock
    String.prototype.split = mockSplit;
    
    // Execute the function
    await parseAwsSdkEnums('/mock/path');
    
    // Restore original function
    String.prototype.split = originalSplit;
    
    // Verify the results
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
    const writtenContent = JSON.parse(writeCall[1]);
    
    // Check that array enum values were correctly extracted
    expect(writtenContent).toHaveProperty('lambda');
    expect(writtenContent.lambda).toHaveProperty('Runtime');
    expect(writtenContent.lambda.Runtime).toEqual(['nodejs14.x', 'nodejs16.x', 'python3.9']);
  });

  it('should handle errors in JSON parsing gracefully', async () => {
    // Mock file system operations
    (fs.readdirSync as jest.Mock).mockReturnValue(['service-invalid.json']);
    
    // Mock path.join to return predictable paths
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    
    // Mock invalid JSON file
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      return 'invalid json content';
    });
    
    // Create a custom mock for String.prototype.split
    const originalSplit = String.prototype.split;
    const mockSplit = function(this: string, separator: any): string[] {
      if (this === 'service-invalid.json' && separator === '-') {
        return ['service', 'invalid'];
      }
      return originalSplit.call(this, separator);
    };
    
    // Apply the mock
    String.prototype.split = mockSplit;
    
    // Execute the function - should not throw
    await parseAwsSdkEnums('/mock/path');
    
    // Restore original function
    String.prototype.split = originalSplit;
    
    // Verify the results - should still write an empty object
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
    const writtenContent = JSON.parse(writeCall[1]);
    
    // Should be an empty object
    expect(Object.keys(writtenContent).length).toBe(0);
  });

  it('should skip module.json files', async () => {
    // Mock file system operations
    (fs.readdirSync as jest.Mock).mockReturnValue(['module.json', 'service-valid.json']);
    
    // Mock path.join to return predictable paths
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    
    // Mock valid JSON file
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath === '/mock/path/module.json') {
        return JSON.stringify({ shouldBeSkipped: true });
      } else if (filePath === '/mock/path/service-valid.json') {
        return JSON.stringify({
          properties: {
            TestEnum: {
              enum: ['Value1', 'Value2']
            }
          }
        });
      }
      return '{}';
    });
    
    // Create a custom mock for String.prototype.split
    const originalSplit = String.prototype.split;
    const mockSplit = function(this: string, separator: any): string[] {
      if (this === 'service-valid.json' && separator === '-') {
        return ['service', 'valid'];
      }
      return originalSplit.call(this, separator);
    };
    
    // Apply the mock
    String.prototype.split = mockSplit;
    
    // Execute the function
    await parseAwsSdkEnums('/mock/path');
    
    // Restore original function
    String.prototype.split = originalSplit;
    
    // Verify the results
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
    const writtenContent = JSON.parse(writeCall[1]);
    
    // Should only contain the valid service
    expect(writtenContent).toHaveProperty('valid');
    expect(writtenContent.valid).toHaveProperty('TestEnum');
    expect(writtenContent.valid.TestEnum).toEqual(['Value1', 'Value2']);
  });
});

describe('Enum Matching Functions', () => {
  describe('findMatchingEnum', () => {
    const mockSdkEnums = {
      'service1': {
        'TestEnum': ['VALUE1', 'VALUE2', 'VALUE3'],
        'PartialEnum': ['VALUE1', 'VALUE2']
      }
    };

    it('should find exact name matches', () => {
      const result = findMatchingEnum(
        'TestEnum',
        ['VALUE1', 'VALUE2'],
        ['service1'],
        mockSdkEnums
      );
      expect(result.service).toBe('service1');
      expect(result.enumName).toBe('TestEnum');
      expect(result.matchPercentage).toBe(1);
    });

    it('should find partial matches above threshold', () => {
      const result = findMatchingEnum(
        'DifferentName',
        ['VALUE1'],
        ['service1'],
        mockSdkEnums
      );
      expect(result.service).toBe('service1');
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0.5);
    });

    it('should return null match for below threshold matches', () => {
      const result = findMatchingEnum(
        'TestEnum',
        ['DIFFERENT'],
        ['service1'],
        mockSdkEnums
      );
      expect(result.service).toBeNull();
      expect(result.enumName).toBeNull();
    });
  });
});

describe('Static Mapping Generation', () => {
    const mockCdkEnums = {
      'service1': {
        'TestEnum': {
          path: 'path/to/enum',
          enumLike: false,
          values: ['VALUE1', 'VALUE2']
        }
      }
    };
  
    const mockSdkEnums = {
      'service1': {
        'TestEnum': ['VALUE1', 'VALUE2', 'VALUE3']
      }
    };
  
    const mockManualMappings = {
      'service1': ['service1']
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should generate correct static mapping', async () => {
      await generateAndSaveStaticMapping(
        mockCdkEnums,
        mockSdkEnums,
        mockManualMappings,
      );
  
      // Verify the file write operation
      expect(fs.writeFileSync).toHaveBeenCalled();
      const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
      const writtenContent = JSON.parse(writeCall[1]);
      
      expect(writtenContent.service1.TestEnum).toBeDefined();
      expect(writtenContent.service1.TestEnum.match_percentage).toBeGreaterThan(0);
    });
  
    it('should handle unmapped services correctly', async () => {
      await generateAndSaveStaticMapping(
        mockCdkEnums,
        mockSdkEnums,
        {},
      );
  
      // Verify the file write operation
      expect(fs.writeFileSync).toHaveBeenCalled();
      const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
      const writtenContent = JSON.parse(writeCall[1]);
      
      expect(writtenContent.service1).toBeUndefined();
    });
  });
  

  describe('Entry Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should handle missing downloaded files', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ status: 404 });
      
      await expect(entryMethod()).resolves.toBeUndefined();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  
    it('should handle file reading errors', async () => {
      // Mock successful downloads
      (axios.get as jest.Mock).mockResolvedValue({ 
        status: 200, 
        data: {} 
      });
      
      // Mock successful tmp file creation
      const mockTmpFile = {
        name: '/tmp/mock-file',
        removeCallback: jest.fn()
      };
      (tmp.fileSync as jest.Mock).mockReturnValue(mockTmpFile);
      
      // Mock file read error
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File read error');
      });
  
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error');
  
      await entryMethod();
  
      // Verify the sequence of error messages
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        1,
        'Error downloading or extracting repository:',
        expect.any(Error)
      );
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        2,
        'Error: Missing required files.'
      );
    });
  
    it('should handle empty manual mappings', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ status: 200, data: {} });
      (fs.readFileSync as jest.Mock).mockReturnValue('{}');
  
      await expect(entryMethod()).resolves.toBeUndefined();
    });
  });
});
