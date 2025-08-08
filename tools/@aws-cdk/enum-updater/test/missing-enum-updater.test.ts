import { MissingEnumsUpdater } from '../lib/missing-enum-updater';
import { Project, SourceFile, EnumDeclaration, ClassDeclaration, SyntaxKind } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

// Mock dependencies
jest.mock('ts-morph');
jest.mock('fs');
jest.mock('path');
jest.mock('tmp');

describe('MissingEnumsUpdater', () => {
  let updater: MissingEnumsUpdater;
  let mockSourceFile: jest.Mocked<SourceFile>;
  let mockEnumDeclaration: jest.Mocked<EnumDeclaration>;
  let mockClassDeclaration: jest.Mocked<ClassDeclaration>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Project mock
    (Project as jest.Mock).mockImplementation(() => ({
      addSourceFilesAtPaths: jest.fn(),
      getSourceFiles: jest.fn().mockReturnValue([]),
      getSourceFile: jest.fn().mockReturnValue(mockSourceFile)
    }));

    // Mock file system operations
    (fs.readdirSync as jest.Mock).mockReturnValue([]);
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });
    (fs.readFileSync as jest.Mock).mockReturnValue('{}');
    (path.resolve as jest.Mock).mockImplementation((...args) => args.join('/'));

    updater = new MissingEnumsUpdater('./test-dir');
  });

  describe('findMissingValues', () => {
    it('should identify missing values between CDK and SDK enums', async () => {
      // Setup test data
      const staticMapping = {
        'module1': {
          'Enum1': {
            sdk_service: 'service1',
            sdk_enum_name: 'SdkEnum1'
          }
        }
      };
      
      const cdkEnums = {
        'module1': {
          'Enum1': {
            path: 'path/to/enum1',
            values: ['value1', 'value2']
          }
        }
      };
      
      const sdkEnums = {
        'service1': {
          'SdkEnum1': ['value1', 'value2', 'value3', 'value4']
        }
      };
      
      const exclusions = {};
      
      // Call the method
      const result = await (updater as any).findMissingValues(
        staticMapping,
        cdkEnums,
        sdkEnums,
        exclusions
      );
      
      // Verify results
      expect(result).toEqual({
        'module1': {
          'Enum1': {
            cdk_path: 'path/to/enum1',
            missing_values: ['value3', 'value4']
          }
        }
      });
    });
    
    it('should handle exclusions correctly', async () => {
      // Setup test data
      const staticMapping = {
        'module1': {
          'Enum1': {
            sdk_service: 'service1',
            sdk_enum_name: 'SdkEnum1'
          }
        }
      };
      
      const cdkEnums = {
        'module1': {
          'Enum1': {
            path: 'path/to/enum1',
            values: ['value1', 'value2']
          }
        }
      };
      
      const sdkEnums = {
        'service1': {
          'SdkEnum1': ['value1', 'value2', 'value3', 'value4']
        }
      };
      
      const exclusions = {
        'module1': {
          'Enum1': {
            values: ['value3']
          }
        }
      };
      
      // Call the method
      const result = await (updater as any).findMissingValues(
        staticMapping,
        cdkEnums,
        sdkEnums,
        exclusions
      );
      
      // Verify results - value3 should be excluded
      expect(result).toEqual({
        'module1': {
          'Enum1': {
            cdk_path: 'path/to/enum1',
            missing_values: ['value4']
          }
        }
      });
    });
    
    it('should handle case normalization correctly', async () => {
      // Setup test data
      const staticMapping = {
        'module1': {
          'Enum1': {
            sdk_service: 'service1',
            sdk_enum_name: 'SdkEnum1'
          }
        }
      };
      
      const cdkEnums = {
        'module1': {
          'Enum1': {
            path: 'path/to/enum1',
            values: ['Value1', 'VALUE2']
          }
        }
      };
      
      const sdkEnums = {
        'service1': {
          'SdkEnum1': ['value1', 'value2', 'VALUE3']
        }
      };
      
      const exclusions = {};
      
      // Call the method
      const result = await (updater as any).findMissingValues(
        staticMapping,
        cdkEnums,
        sdkEnums,
        exclusions
      );
      
      // Verify results - value3 should be identified as missing despite case differences
      expect(result).toEqual({
        'module1': {
          'Enum1': {
            cdk_path: 'path/to/enum1',
            missing_values: ['VALUE3']
          }
        }
      });
    });
    
    it('should handle empty results correctly', async () => {
      // Setup test data with no missing values
      const staticMapping = {
        'module1': {
          'Enum1': {
            sdk_service: 'service1',
            sdk_enum_name: 'SdkEnum1'
          }
        }
      };
      
      const cdkEnums = {
        'module1': {
          'Enum1': {
            path: 'path/to/enum1',
            values: ['value1', 'value2', 'value3']
          }
        }
      };
      
      const sdkEnums = {
        'service1': {
          'SdkEnum1': ['value1', 'value2', 'value3']
        }
      };
      
      const exclusions = {};
      
      // Call the method
      const result = await (updater as any).findMissingValues(
        staticMapping,
        cdkEnums,
        sdkEnums,
        exclusions
      );
      
      // Verify results - should be an empty object since there are no missing values
      expect(result).toEqual({});
    });
    
    it('should handle multiple modules and enums correctly', async () => {
      // Setup test data with multiple modules and enums
      const staticMapping = {
        'module1': {
          'Enum1': {
            sdk_service: 'service1',
            sdk_enum_name: 'SdkEnum1'
          },
          'Enum2': {
            sdk_service: 'service1',
            sdk_enum_name: 'SdkEnum2'
          }
        },
        'module2': {
          'Enum3': {
            sdk_service: 'service2',
            sdk_enum_name: 'SdkEnum3'
          }
        }
      };
      
      const cdkEnums = {
        'module1': {
          'Enum1': {
            path: 'path/to/enum1',
            values: ['value1']
          },
          'Enum2': {
            path: 'path/to/enum2',
            values: ['valueA', 'valueB']
          }
        },
        'module2': {
          'Enum3': {
            path: 'path/to/enum3',
            values: ['valueX']
          }
        }
      };
      
      const sdkEnums = {
        'service1': {
          'SdkEnum1': ['value1', 'value2'],
          'SdkEnum2': ['valueA', 'valueB']
        },
        'service2': {
          'SdkEnum3': ['valueX', 'valueY', 'valueZ']
        }
      };
      
      const exclusions = {
        'module2': {
          'Enum3': {
            values: ['valueY']
          }
        }
      };
      
      // Call the method
      const result = await (updater as any).findMissingValues(
        staticMapping,
        cdkEnums,
        sdkEnums,
        exclusions
      );
      
      // Verify results
      expect(result).toEqual({
        'module1': {
          'Enum1': {
            cdk_path: 'path/to/enum1',
            missing_values: ['value2']
          }
        },
        'module2': {
          'Enum3': {
            cdk_path: 'path/to/enum3',
            missing_values: ['valueZ']
          }
        }
      });
      
      // Enum2 should not be in the results as it has no missing values
      expect(result.module1.Enum2).toBeUndefined();
    });
    
    it('should handle exclusions with no values property', async () => {
      // Setup test data
      const staticMapping = {
        'module1': {
          'Enum1': {
            sdk_service: 'service1',
            sdk_enum_name: 'SdkEnum1'
          }
        }
      };
      
      const cdkEnums = {
        'module1': {
          'Enum1': {
            path: 'path/to/enum1',
            values: ['value1']
          }
        }
      };
      
      const sdkEnums = {
        'service1': {
          'SdkEnum1': ['value1', 'value2']
        }
      };
      
      // Exclusion without values property
      const exclusions = {
        'module1': {
          'Enum1': {
            // No values property
            someOtherProperty: true
          }
        }
      };
      
      // Call the method
      const result = await (updater as any).findMissingValues(
        staticMapping,
        cdkEnums,
        sdkEnums,
        exclusions
      );
      
      // Should skip this enum due to missing values property in exclusions
      expect(result).toEqual({});
    });
  });

  describe('constructor', () => {
    it('should initialize with correct project settings', () => {
      expect(Project).toHaveBeenCalledWith({
        tsConfigFilePath: expect.stringMatching(/tsconfig\.json$/),
        manipulationSettings: expect.any(Object)
      });
    });
  });
  describe('readTypescriptFiles', () => {
    it('should skip specified directories', () => {
      const mockFiles = ['node_modules', 'dist', 'test', 'valid.ts'];
      (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
      (fs.statSync as jest.Mock).mockImplementation((filePath) => ({
        isDirectory: () => !filePath.includes('.ts')
      }));

      const result = (updater as any).readTypescriptFiles('./test-dir');
      expect(result).toEqual(['./test-dir/valid.ts']);
    });

    it('should filter out invalid typescript files', () => {
      const mockFiles = ['file.ts', 'file.generated.ts', 'file.d.ts', 'file.test.ts'];
      (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });

      const result = (updater as any).readTypescriptFiles('./test-dir');
      expect(result).toEqual(['./test-dir/file.ts']);
    });
  });

  describe('updateEnum', () => {
    beforeEach(() => {
      mockEnumDeclaration = {
        getFullText: jest.fn().mockReturnValue('enum Test {\n  VALUE1 = "value1"\n}'),
        replaceWithText: jest.fn(),
      } as any;

      mockSourceFile = {
        getEnum: jest.fn().mockReturnValue(mockEnumDeclaration),
        saveSync: jest.fn(),
      } as any;

      // Update Project mock implementation
      (Project as jest.Mock).mockImplementation(() => ({
        addSourceFilesAtPaths: jest.fn(),
        getSourceFiles: jest.fn().mockReturnValue([]),
        getSourceFile: jest.fn().mockReturnValue(mockSourceFile)
      }));

      updater = new MissingEnumsUpdater('./test-dir');
    });

    it('should update enum with missing values', () => {
      const missingValue = {
        cdk_path: 'path/to/enum',
        missing_values: ['value2']
      };

      (updater as any).updateEnum('TestEnum', missingValue);

      expect(mockEnumDeclaration.replaceWithText).toHaveBeenCalled();
      expect(mockSourceFile.saveSync).toHaveBeenCalled();
    });

    it('should throw error if source file not found', () => {
      // Update Project mock to return null for getSourceFile
      (Project as jest.Mock).mockImplementation(() => ({
        addSourceFilesAtPaths: jest.fn(),
        getSourceFiles: jest.fn().mockReturnValue([]),
        getSourceFile: jest.fn().mockReturnValue(null)
      }));

      updater = new MissingEnumsUpdater('./test-dir');

      expect(() => {
        (updater as any).updateEnum('TestEnum', {
          cdk_path: 'invalid/path',
          missing_values: ['value']
        });
      }).toThrow('Source file not found');
    });
  });

  describe('updateEnumLike', () => {
    beforeEach(() => {
      mockClassDeclaration = {
        forEachChild: jest.fn(),
        addProperty: jest.fn().mockReturnValue({
          setOrder: jest.fn(),
          addJsDoc: jest.fn()
        }),
      } as any;

      mockSourceFile = {
        getClass: jest.fn().mockReturnValue(mockClassDeclaration),
        saveSync: jest.fn(),
      } as any;

      // Update Project mock implementation
      (Project as jest.Mock).mockImplementation(() => ({
        addSourceFilesAtPaths: jest.fn(),
        getSourceFiles: jest.fn().mockReturnValue([]),
        getSourceFile: jest.fn().mockReturnValue(mockSourceFile)
      }));

      updater = new MissingEnumsUpdater('./test-dir');
    });

    it('should update enum-like class with missing values', () => {
      const missingValue = {
        cdk_path: 'path/to/class',
        missing_values: ['new-value']
      };

      // Mock PropertyDeclaration
      const mockProperty = {
        getText: jest.fn().mockReturnValue('public static readonly EXISTING = new TestClass("existing")'),
        getInitializer: jest.fn().mockReturnValue({ 
          getKind: () => SyntaxKind.NewExpression 
        }),
        getName: jest.fn().mockReturnValue('EXISTING'),
        getInitializerIfKind: jest.fn().mockReturnValue({
          getArguments: jest.fn().mockReturnValue(['existing'])
        })
      } as any;

      mockClassDeclaration.forEachChild.mockImplementation(callback => callback(mockProperty));

      (updater as any).updateEnumLike('testModule', 'TestClass', missingValue);

      expect(mockClassDeclaration.addProperty).toHaveBeenCalled();
      expect(mockSourceFile.saveSync).toHaveBeenCalled();
    });
  });

  describe('removeAwsCdkPrefix', () => {
    it('should remove aws-cdk prefix', () => {
      expect((updater as any).removeAwsCdkPrefix('aws-cdk/path/to/file')).toBe('path/to/file');
      expect((updater as any).removeAwsCdkPrefix('path/to/file')).toBe('path/to/file');
    });
  });

  describe('getParsedEnumValues and getParsedEnumLikeValues', () => {
    beforeEach(() => {
      const mockFileContent = JSON.stringify({
        module1: {
          enum1: { enumLike: false, values: ['value1'] },
          enum2: { enumLike: true, values: ['value2'] }
        }
      });
      (fs.readFileSync as jest.Mock).mockReturnValue(mockFileContent);
    });

    it('should return only regular enums', () => {
      const result = (updater as any).getParsedEnumValues();
      expect(result.module1.enum1).toBeDefined();
      expect(result.module1.enum2).toBeUndefined();
    });

    it('should return only enum-likes', () => {
      const result = (updater as any).getParsedEnumLikeValues();
      expect(result.module1.enum1).toBeUndefined();
      expect(result.module1.enum2).toBeDefined();
    });
  });
});
