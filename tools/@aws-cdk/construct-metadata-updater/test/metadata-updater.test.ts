import { ResourceMetadataUpdater } from '../lib/metadata-updater';
import { Project, ClassDeclaration, SourceFile, QuoteKind } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

// Mock ts-morph
jest.mock('ts-morph');
// Mock fs
jest.mock('fs');
// Mock path
jest.mock('path');

describe('ResourceMetadataUpdater', () => {
  let updater: ResourceMetadataUpdater;
  let mockSourceFile: jest.Mocked<SourceFile>;
  let mockClassDeclaration: jest.Mocked<ClassDeclaration>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock implementations
    (Project as jest.Mock).mockImplementation(() => ({
      addSourceFilesAtPaths: jest.fn(),
      getSourceFiles: jest.fn().mockReturnValue([]),
    }));

    // Mock fs.readdirSync and fs.statSync
    (fs.readdirSync as jest.Mock).mockReturnValue([]);
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });

    // Mock path.resolve
    (path.resolve as jest.Mock).mockImplementation((...args) => args.join('/'));

    // Create instance of updater
    updater = new ResourceMetadataUpdater('./test-dir');
  });

  describe('constructor', () => {
    it('should initialize with correct project settings', () => {
      expect(Project).toHaveBeenCalledWith({
        tsConfigFilePath: expect.stringMatching(/tsconfig\.json$/),
        manipulationSettings: {
          quoteKind: QuoteKind.Single
        }
      });
    });
  });

  describe('readTypescriptFiles', () => {
    it('should skip specified directories', () => {
      const mockFiles = ['node_modules', 'dist', 'test', 'valid.ts'];
      (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
      (fs.statSync as jest.Mock).mockImplementation((path) => ({
        isDirectory: () => !path.endsWith('.ts')
      }));

      const result = (updater as any).readTypescriptFiles('./test-dir');
      expect(result).toEqual(['./test-dir/valid.ts']);
    });

    it('should only include valid typescript files', () => {
      const mockFiles = ['file.ts', 'file.generated.ts', 'file.d.ts', 'file.test.ts'];
      (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });

      const result = (updater as any).readTypescriptFiles('./test-dir');
      expect(result).toEqual(['./test-dir/file.ts']);
    });
  });

  describe('isDescendantOfResource', () => {
    it('should return true for direct Resource type', () => {
      const mockType = {
        getSymbol: () => ({ getName: () => 'Resource' })
      };

      const result = (updater as any).isDescendantOfResource(mockType);
      expect(result).toBe(true);
    });

    it('should return true for descendant of Resource', () => {
      const mockType = {
        getSymbol: () => ({ getName: () => 'NotResource' }),
        getBaseTypes: () => [{
          getSymbol: () => ({ getName: () => 'Resource' })
        }]
      };

      const result = (updater as any).isDescendantOfResource(mockType);
      expect(result).toBe(true);
    });

    it('should return false for non-Resource type', () => {
      const mockType = {
        getSymbol: () => ({ getName: () => 'NotResource' }),
        getBaseTypes: () => []
      };

      const result = (updater as any).isDescendantOfResource(mockType);
      expect(result).toBe(false);
    });
  });

  describe('transformFile', () => {
    beforeEach(() => {
      mockClassDeclaration = {
        getSymbol: jest.fn().mockReturnValue({ getName: () => 'TestClass' }),
        getModifiers: jest.fn().mockReturnValue([]),
        getType: jest.fn(),
        getName: jest.fn().mockReturnValue('TestClass'),
        getConstructors: jest.fn().mockReturnValue([])
      } as any;

      Object.setPrototypeOf(mockClassDeclaration, ClassDeclaration.prototype);

      mockSourceFile = {
        forEachChild: jest.fn((callback) => callback(mockClassDeclaration)),
        getImportDeclarations: jest.fn().mockReturnValue([]),
        addImportDeclaration: jest.fn(),
        saveSync: jest.fn()
      } as any;

      (Project as jest.Mock).mockImplementation(() => ({
        addSourceFilesAtPaths: jest.fn(),
        getSourceFile: jest.fn().mockReturnValue(mockSourceFile)
      }));

      updater = new ResourceMetadataUpdater('./test-dir');
      (updater as any).addImportAndMetadataStatement = jest.fn();
    });

    it('should skip abstract classes', () => {
      mockClassDeclaration.getModifiers.mockReturnValue([{ getText: () => 'abstract' } as any]);
      (updater as any).transformFile('test.ts');
      expect(mockClassDeclaration.getType).not.toHaveBeenCalled();
    });

    it('should process non-abstract Resource classes', () => {
      mockClassDeclaration.getType.mockReturnValue({
        getSymbol: () => ({ getName: () => 'Resource' }),
        getBaseTypes: () => []
      } as any);

      (updater as any).transformFile('test.ts');
      expect((updater as any).addImportAndMetadataStatement).toHaveBeenCalled();
    });
  });

  describe('addLineInConstructor', () => {
    it('should not add metadata if constructor has less than 3 parameters', () => {
      const mockConstructor = {
        getParameters: jest.fn().mockReturnValue([1, 2]),
        getStatements: jest.fn().mockReturnValue([])
      };

      mockClassDeclaration = {
        getName: jest.fn().mockReturnValue('TestClass'),
        getConstructors: jest.fn().mockReturnValue([mockConstructor])
      } as any;

      const result = (updater as any).addLineInConstructor(mockSourceFile, mockClassDeclaration);
      expect(result).toBe(false);
    });

    it('should add metadata statement after super() call', () => {
      const mockStatements = [{ getText: () => 'super(scope, id);' }];
      const mockConstructor = {
        getParameters: jest.fn().mockReturnValue([1, 2, 3]),
        getStatements: jest.fn().mockReturnValue(mockStatements),
        insertStatements: jest.fn()
      };

      mockClassDeclaration = {
        getName: jest.fn().mockReturnValue('TestClass'),
        getConstructors: jest.fn().mockReturnValue([mockConstructor])
      } as any;

      const result = (updater as any).addLineInConstructor(mockSourceFile, mockClassDeclaration);
      expect(result).toBe(true);
      expect(mockConstructor.insertStatements).toHaveBeenCalled();
    });
  });
});
