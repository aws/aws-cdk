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
  describe('execute', () => {
    it('should execute the update process', async () => {
      const mockMissingValuesPath = '/tmp/missing-values.json';
      
      // Mock the methods
      const analyzeMissingEnumValuesSpy = jest.spyOn(updater as any, 'analyzeMissingEnumValues')
        .mockResolvedValue(mockMissingValuesPath);
      const updateEnumLikeValuesSpy = jest.spyOn(updater as any, 'updateEnumLikeValues')
        .mockImplementation(() => {});
      const updateEnumValuesSpy = jest.spyOn(updater as any, 'updateEnumValues')
        .mockImplementation(() => {});

      await updater.execute();

      expect(analyzeMissingEnumValuesSpy).toHaveBeenCalled();
      expect(updateEnumLikeValuesSpy).toHaveBeenCalledWith(mockMissingValuesPath);
      expect(updateEnumValuesSpy).toHaveBeenCalledWith(mockMissingValuesPath);
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
