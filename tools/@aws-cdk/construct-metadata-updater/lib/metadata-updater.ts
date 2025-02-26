import { ClassDeclaration, IndentationText, Project, PropertyDeclaration, QuoteKind, Scope, SourceFile, Symbol, SyntaxKind } from "ts-morph";
import * as path from "path";
import * as fs from "fs";
// import { exec } from "child_process";
// import SyntaxKind = ts.SyntaxKind;

const DIRECTORIES_TO_SKIP = [
  "node_modules",
  "dist",
  "build",
  "decdk",
  "awslint",
  "test",
];

interface ResourceClass {
  sourceFile: SourceFile;
  filePath: string;
  node: ClassDeclaration;
  className: string;
  fqnClassName: string;
}

export abstract class MetadataUpdater {
  protected project: Project;

  constructor(dir: string) {
    const projectDir = path.resolve(__dirname, dir);

    // Initialize a ts-morph Project
    this.project = new Project({
      tsConfigFilePath: path.resolve(__dirname, "../tsconfig.json"),
      manipulationSettings: {
        quoteKind: QuoteKind.Single,
        indentationText: IndentationText.TwoSpaces
      },
    });
    this.project.addSourceFilesAtPaths(this.readTypescriptFiles(projectDir));

    console.log("Transformation complete.");
  }

  public abstract execute(): void;

  /**
   * Recursively collect all .ts files from a given directory.
   */
  private readTypescriptFiles(dir: string, filesList: string[] = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        // Check if this directory is in the list of directories to skip
        if (!DIRECTORIES_TO_SKIP.includes(file)) {
          this.readTypescriptFiles(filePath, filesList);
        }
      } else if (
        filePath.endsWith(".ts") &&
        !filePath.endsWith(".generated.ts") &&
        !filePath.endsWith(".d.ts") &&
        !file.includes("test")
      ) {
        filesList.push(filePath);
      }
    });

    return filesList;
  }

  /**
   * Recursively checks if a given type is a descendant of 'Resource'.
   */
  private isDescendantOfResource(type: any): boolean {
    // Check if the current type is 'Resource'
    if (type.getSymbol().getName() === 'Resource') {
      return true;
    }

    // Get the base types (parent types)
    const baseTypes = type.getBaseTypes();
    for (const baseType of baseTypes) {
      if (this.isDescendantOfResource(baseType)) {
        return true;
      }
    }

    // If no base type is 'Resource', return false
    return false;
  }

  /**
   * Parse and transform a file using ts-morph.
   */
  protected getCdkResourceClasses(filePath: string): ResourceClass[] {
    const sourceFile = this.project.getSourceFile(filePath);
    if (!sourceFile) return [];
  
    const resourceClasses: ResourceClass[] = [];
  
    sourceFile.forEachChild((node) => {
      if (node instanceof ClassDeclaration) {
        const symbol = node.getSymbol();
        if (symbol) {
          const className = symbol.getName(); // Correct way to get the name
          const fqnClassName = symbol.getFullyQualifiedName();
  
          // Check if the class is abstract by inspecting modifiers
          const isAbstract = node.getModifiers()?.some((mod) => mod.getText() === "abstract");
          if (isAbstract) {
            return;
          }
  
          // Check if the class or its subclasses extends Resource
          const type = node.getType();
          if (this.isDescendantOfResource(type)) {            
            resourceClasses.push({ sourceFile, filePath, node, className, fqnClassName });
          }
        }
      }
    });

    return resourceClasses;
  }

  /**
   * Write the file content for the enum metadats.
   * @param outputPath The file to write to
   * @param values The values, as a nested dictionary, to write. 
   */
  protected writeFileContent(outputPath: string, values: Record<string, Record<string, (string | number)[]>> = {}) {
    // Sort the keys of the enumlikes object
    const sortedValues = Object.keys(values).sort().reduce<Record<string, Record<string, (string | number)[]>>>((acc, key) => {
      acc[key] = values[key];
      return acc;
    }, {});
    const content = JSON.stringify(sortedValues, null, 2);

    // Write the generated file
    fs.writeFileSync(outputPath, content);
  }
}

export class ConstructsUpdater extends MetadataUpdater {
  constructor(dir: string) {
    super(dir);
  }

  public execute() {
    // Process each file in the project
    this.project.getSourceFiles().forEach((sourceFile) => {
      const classes = this.getCdkResourceClasses(sourceFile.getFilePath());
      for (const resource of classes) {
        this.addImportAndMetadataStatement(resource.sourceFile, resource.filePath, resource.node);
      }
    });
  }


  /**
   * Add the import statement for MetadataType to the file.
   */
  private addImportAndMetadataStatement(sourceFile: any, filePath: string, node: any) {
    const ret = this.addLineInConstructor(sourceFile, node);
    if (!ret) {
      return;
    }

    const absoluteFilePath = path.resolve(filePath);
    const absoluteTargetPath = path.resolve(__dirname, '../../../../packages/aws-cdk-lib/core/lib/metadata-resource.ts');

    let relativePath = path.relative(path.dirname(absoluteFilePath), absoluteTargetPath).replace(/\\/g, "/").replace(/.ts/, "");
    if (absoluteFilePath.includes('@aws-cdk')) {
      relativePath = 'aws-cdk-lib/core/lib/metadata-resource'
    }

    // Check if an import from 'metadata-resource' already exists
    const existingImport = sourceFile.getImportDeclarations().find((stmt: any) => {
      return stmt.getModuleSpecifier().getText().includes('/metadata-resource');
    });

    if (existingImport) {
      // Check if 'MethodMetadata' is already imported
      const namedImports = existingImport.getNamedImports().map((imp: any) => imp.getName());
      if (!namedImports.includes("addConstructMetadata")) {
        existingImport.addNamedImport({ name: "addConstructMetadata" });
        console.log(`Merged import for addConstructMetadata in file: ${filePath}`);
      }
    } else {
      // Find the correct insertion point (after the last import before the new one)
      const importDeclarations = sourceFile.getImportDeclarations();
      let insertIndex = importDeclarations.length; // Default to appending
      
      for (let i = importDeclarations.length - 1; i >= 0; i--) {
        const existingImport = importDeclarations[i].getModuleSpecifier().getLiteralText();

        // Insert the new import before the first one that is lexicographically greater
        if (existingImport.localeCompare(relativePath) > 0) {
          insertIndex = i;
        } else {
          break;
        }
      }
    
      // Insert the new import at the correct index
      sourceFile.insertImportDeclaration(insertIndex, {
        moduleSpecifier: relativePath,
        namedImports: [{ name: "addConstructMetadata" }],
      });
      console.log(`Added import for addConstructMetadata in file: ${filePath} with relative path: ${relativePath}`);
    }

    // Write the updated file back to disk
    sourceFile.saveSync();
  }

  /**
   * Add the line of code 'this.node.addMetadata(...)' inside the class constructor.
   */
  private addLineInConstructor(sourceFile: any, classDeclaration: ClassDeclaration): boolean {
    const constructor = classDeclaration.getConstructors()[0]; // Assuming there's only one constructor

    if (constructor) {
      const parameters = constructor.getParameters();
      const parameterCount = parameters.length;

      // Only continue if there's at least 3 parameters.
      if (parameterCount <= 2) {
        return false;
      }

      // Check if the statement already exists
      const statements = constructor.getStatements();
      const hasMetadataCall = statements.some(statement => 
        statement.getText().includes('addConstructMetadata(')
      );

      if (hasMetadataCall) {
        return true;
      }

      // Find the super() call, if it exists
      const superCall = constructor.getStatements().find(statement => 
        statement.getText().includes('super(')
      );
  
      const propName = parameters[2].getName();
      // If a super() call exists, find its index and insert after it
      if (superCall) {
        const superCallIndex = constructor.getStatements().indexOf(superCall);
        constructor.insertStatements(superCallIndex + 1, writer => {
          writer.setIndentationLevel(0);
          writer.write('    // Enhanced CDK Analytics Telemetry\n');
          writer.write(`    addConstructMetadata(this, ${propName});`);
        });
        console.log(`Added 'addConstructMetadata();' after the 'super()' in the constructor of class: ${classDeclaration.getName()}`);
      } else {
        // If no super() call exists, just add the line at the top
        constructor.insertStatements(0, writer => {
          writer.setIndentationLevel(0);
          writer.write('    // Enhanced CDK Analytics Telemetry\n');
          writer.write(`    addConstructMetadata(this, ${propName});`);
        });
        console.log(`No 'super()' found. Added 'this.node.addMetadata();' at the top of the constructor for class: ${classDeclaration.getName()}`);
      }
    } else {
      console.log(`No constructor found for class: ${classDeclaration.getName()}`);
      return false;
    }

    sourceFile.saveSync();
    return true;
  }
}

export class PropertyUpdater extends MetadataUpdater {
  private classProps: Record<string, Record<string, any>>;
  constructor(dir: string) {
    super(dir);

    this.classProps = {};
  }

  public execute(): void {
    // Process each file in the project
    this.project.getSourceFiles().forEach((sourceFile) => {
      const classes = this.getCdkResourceClasses(sourceFile.getFilePath());

      for (const resource of classes) {
        this.extractConstructorProps(resource.filePath, resource.node, resource.className)
        this.extractMethodProps(resource.filePath, resource.node, resource.className)
      }
    });

    this.generateFileContent();
  }

  private extractMethodProps(filePath: string, classDeclaration: ClassDeclaration, className: string) {
    // Get module name from file path
    const moduleName = this.getModuleName(filePath);
    const methods: Record<string, any> = {};

    classDeclaration.getMethods().forEach((method) => {
      if (method.hasModifier(SyntaxKind.PublicKeyword) && !method.hasModifier(SyntaxKind.StaticKeyword)) {
        const methodName = method.getName();

        // Extract parameters with their types
        const parameters = method.getParameters().map(param => this.getPropertyType(param.getType()));

        methods[methodName] = parameters;
        console.log(`Module: ${moduleName}, Method: ${methodName}, Params:`, parameters);
      }
    });

    if (!methods) {
      return;
    }

    this.classProps[moduleName] = this.classProps[moduleName] || {};
    // Ensure class exists within the module
    this.classProps[moduleName][className] = {
      ...this.classProps[moduleName][className],
      ...methods, // Merge with new methods
    };
  }

  private extractConstructorProps(filePath: string, node: ClassDeclaration, className: string) {
    // Get module name from file path
    const moduleName = this.getModuleName(filePath);

    // Parse Constructor parameters
    const props = this.parseConstructorProps(node, className);
    
    if (!props) {
      return;
    }

    const content = this.classProps[moduleName] || {};
    this.classProps[moduleName] = {
      ...content,
      ...props,
    };
  }

  private generateFileContent() {
    const template = `/* eslint-disable quote-props */
/* eslint-disable @stylistic/comma-dangle */
/*
 * Do not edit this file manually. To prevent misconfiguration, this file
 * should only be modified by an automated GitHub workflow, that ensures
 * that the regions present in this list correspond to all the regions
 * where we have the AWS::CDK::Metadata handler deployed.
 *
 * See: https://github.com/aws/aws-cdk/issues/27189
 */

export const AWS_CDK_CONSTRUCTOR_PROPS: { [key: string]: any } = $PROPS;
`;
    
      // Convert the enums object to a JSON string
    const jsonContent = JSON.stringify(this.classProps, null, 2).replace(/"/g, "'");

    // Replace the placeholder with the JSON object
    const content = template.replace("$PROPS", jsonContent);

    const outputPath = path.resolve(
      __dirname,
      "../../../../packages/aws-cdk-lib/core/lib/analytics-data-source/classes.ts"
    );
  
    // Write the generated file
    fs.writeFileSync(outputPath, content);
    console.log(`Metadata file written to: ${outputPath}`);
  }

  // Helper method to extract module name from file path
  private getModuleName(filePath: string): string {
    const pathParts = filePath.split('/');
    // Assuming file paths are like '/packages/aws-cdk-lib/aws-lambda/Function.ts'
    const moduleName = pathParts.slice(pathParts.length - 4, pathParts.length - 2).join('.');
    return moduleName;
  }

  private getPropertyType(type: any, processedTypes: Set<string> = new Set()): any {
    if (type.isBoolean()) {
      return type.getText();
    }

    if (type.isUnion()) {
      // Get all types in the union and find the first non-undefined type
      // CDK doesn't support complex union type so we can safely get the first
      // non-undefined type
      const unionTypes = type.getUnionTypes();
      type = unionTypes.find((t: any) => t.getText() !== 'undefined') || type;

      if (type.isLiteral() && (type.getText() === 'true' || type.getText() === 'false')) {
        return 'boolean';
      }
    }

    const symbol = type.getSymbol();
    if (symbol) {
      const declarations = symbol.getDeclarations();
      if (declarations.length > 0) {
        const decl = declarations[0];
        // Check if the type is an Enum Member
        if (decl.getKindName() === 'EnumMember') {
          const parent = decl.getParent(); // Get the parent of the Enum Member
          if (parent && parent.getKindName() === 'EnumDeclaration') {
            const enumDecl = parent.asKindOrThrow(SyntaxKind.EnumDeclaration);
            const enumName = enumDecl.getName();
            return enumName; // Return the name of the parent enum
          }
        }
      }
    }

    if (type.isArray()) {
      // If it's an array, get the type of the array elements
      const elementType = type.getArrayElementType();
      if (elementType) {
        return this.getPropertyType(elementType, processedTypes); // Recursively resolve the element type
      }
      return '*';
    }
  
    if (type.isClass() || type.isInterface()) {
      // Generate a unique identifier for the type to track its processed state
      const typeId = type?.getSymbol()?.getFullyQualifiedName();
      
      // If the type has already been processed, avoid recursion (cycle detection)
      if (typeId && processedTypes.has(typeId)) {
        // TODO: maybe use the cache instead
        return undefined;
      }

      // Add this type to the processed set
      if (typeId) {
        processedTypes.add(typeId);
      }

      if (type.isClass()) {
        // Redact class object
        return '*'
      } else {
        // Handle the case where the type is a class or interface
        return this.resolveInterfaceType(type, processedTypes);
      }
    }
    
    return '*';
  }

  private resolveInterfaceType(type: any, processedTypes: Set<string>): any {
    // If it's a reference to another interface type, resolve its properties recursively
    const symbol = type.getSymbol();

    if (symbol) {
      const declarations = symbol.getDeclarations();
      if (declarations.length > 0) {
        const firstDeclaration = declarations[0];
        const members = firstDeclaration.getType().getProperties();
        const resolvedObject: Record<string, any> = {};
  
        members.forEach((member: Symbol) => {
          const memberType = member.getValueDeclaration()?.getType() || member.getDeclaredType();
          if (memberType.getCallSignatures().length > 0) {
            return;
          }
          const propName = member.getName();
          const nestedType = this.getPropertyType(memberType, processedTypes);
          if (nestedType) {
            resolvedObject[propName] = nestedType;
          }
        });
  
        return Object.keys(resolvedObject).length === 0 ? '*' : resolvedObject;
      }
    }
    return undefined; // If unable to resolve, return undefined
  }
  
  private parseConstructorProps(node: ClassDeclaration, className: string) {
    const constructor = node.getConstructors()?.[0];
  
    if (constructor) {
      const parameters = constructor.getParameters();
      const props = parameters[2];
  
      if (props) {
        const type = props.getType();
  
        if (type?.isObject()) {
          const properties = type.getProperties();
          const propertyTypes: Record<string, any> = {};
  
          properties.forEach((property: Symbol) => {
            const propName = property.getName();
            const nestedType = this.getPropertyType(property.getValueDeclaration()?.getType());
            if (nestedType) {
              propertyTypes[propName] = nestedType;
            }
          });
  
          return { [className]: propertyTypes };
        }
      }
    }
    return undefined;
  }
}

export class EnumsUpdater extends MetadataUpdater {
  constructor(dir: string) {
    super(dir);
  }

  /**
   * Parse the repository for any enum type values and generate a JSON blueprint.
   */
  public execute() {
    const enumBlueprint: Record<string, (string | number)[]> = {};
    const moduleEnumBlueprint: Record<string, Record<string, (string | number)[]>> = {};

    this.project.getSourceFiles().forEach((sourceFile) => {
      const sourceFileName: string = sourceFile.getFilePath().split("/aws-cdk/")[1]
      let fileBlueprint: Record<string, (string | number)[]> = {};
      sourceFile.forEachChild((node) => {
        if (node.getKindName() === "EnumDeclaration") {
          const enumDeclaration = node.asKindOrThrow(SyntaxKind.EnumDeclaration);
          const enumName = enumDeclaration.getName();
          // Directly access the values of the enum members
          const enumValues = enumDeclaration.getMembers()
            .map((member) => member.getValue()) // Access the enum value directly
            .filter((value) => value !== undefined); // Filter out undefined values

          // Add to the blueprint
          enumBlueprint[enumName] = enumValues;
          fileBlueprint[enumName] = enumValues;
        }
      });
      if (Object.values(fileBlueprint).length > 0) {
        moduleEnumBlueprint[sourceFileName] = fileBlueprint;
      }
    });

    // Generate the file content
    const content = this.generateFileContent(enumBlueprint);
    const outputPath = path.resolve(
      __dirname,
      "../../../../packages/aws-cdk-lib/core/lib/analytics-data-source/enums.ts"
    );
    const moduleOutputPath = path.resolve(
      __dirname,
      "../../../../packages/aws-cdk-lib/core/lib/analytics-data-source/enums/module-enums.json"
    );
    
    // Write the generated file
    fs.writeFileSync(outputPath, content);
    console.log(`Metadata file written to: ${outputPath}`);
    this.writeFileContent(moduleOutputPath, moduleEnumBlueprint);
    console.log(`Metadata file written to: ${moduleOutputPath}`);
  }

  /**
   * Generate the file content for the enum metadats.
   */
  private generateFileContent(enums: Record<string, (string | number)[]> = {}): string {
    const template = `/* eslint-disable quote-props */
/* eslint-disable @stylistic/comma-dangle */
/* eslint-disable @cdklabs/no-literal-partition */
/*
 * Do not edit this file manually. To prevent misconfiguration, this file
 * should only be modified by an automated GitHub workflow, that ensures
 * that the ENUMs present in this list
 *
 */

export const AWS_CDK_ENUMS: { [key: string]: any } = $ENUMS;
`;

    // Sort the keys of the enums object
    const sortedEnums = Object.keys(enums).sort().reduce<Record<string, (string | number)[]>>((acc, key) => {
      acc[key] = enums[key];
      return acc;
    }, {});
    const jsonContent = JSON.stringify(sortedEnums, null, 2).replace(/"/g, "'");

    // Replace the placeholder with the JSON object
    return template.replace("$ENUMS", jsonContent);
  }
}

export class MethodsUpdater extends MetadataUpdater {
  constructor(dir: string) {
    super(dir);
  }

  public execute() {
    // Process each file in the project
    this.project.getSourceFiles().forEach((sourceFile) => {
      const classes = this.getCdkResourceClasses(sourceFile.getFilePath());
      for (const resource of classes) {
        this.addImportsAndDecorators(resource.sourceFile, resource.filePath, resource.node);
      }
    });
  }


  /**
   * Add the import statement for MetadataType to the file.
   * Add decorators @MetadataMethod() to public non-static methods
   */
  private addImportsAndDecorators(sourceFile: any, filePath: string, node: any) {
    const ret = this.addDecorators(sourceFile, node);
    if (!ret) {
      return;
    }

    const absoluteFilePath = path.resolve(filePath);
    const absoluteTargetPath = path.resolve(__dirname, '../../../../packages/aws-cdk-lib/core/lib/metadata-resource.ts');

    let relativePath = path.relative(path.dirname(absoluteFilePath), absoluteTargetPath).replace(/\\/g, "/").replace(/.ts/, "");
    if (absoluteFilePath.includes('@aws-cdk')) {
      relativePath = 'aws-cdk-lib/core/lib/metadata-resource'
    }

    // Check if an import from 'metadata-resource' already exists
    const existingImport = sourceFile.getImportDeclarations().find((stmt: any) => {
      return stmt.getModuleSpecifier().getText().includes('/metadata-resource');
    });

    if (existingImport) {
      // Check if 'MethodMetadata' is already imported
      const namedImports = existingImport.getNamedImports().map((imp: any) => imp.getName());
      if (!namedImports.includes("MethodMetadata")) {
        existingImport.addNamedImport({ name: "MethodMetadata" });
        console.log(`Merged import for MethodMetadata in file: ${filePath}`);
      }
    } else {
      // Find the correct insertion point (after the last import before the new one)
      const importDeclarations = sourceFile.getImportDeclarations();
      let insertIndex = importDeclarations.length; // Default to appending
      
      for (let i = importDeclarations.length - 1; i >= 0; i--) {
        const existingImport = importDeclarations[i].getModuleSpecifier().getLiteralText();

        // Insert the new import before the first one that is lexicographically greater
        if (existingImport.localeCompare(relativePath) > 0) {
          insertIndex = i;
        } else {
          break;
        }
      }
    
      // Insert the new import at the correct index
      sourceFile.insertImportDeclaration(insertIndex, {
        moduleSpecifier: relativePath,
        namedImports: [{ name: "MethodMetadata" }],
      });
      console.log(`Added import for MetadataType in file: ${filePath} with relative path: ${relativePath}`);
    }

    // Write the updated file back to disk
    sourceFile.saveSync();
  }

  /**
   * Add decorators @MetadataMethod() to public non-static methods
   */
  private addDecorators(sourceFile: any, classDeclaration: ClassDeclaration): boolean {
    let updated = false;

    classDeclaration.getMethods().forEach((method) => {
      if (method.hasModifier(SyntaxKind.PublicKeyword) && !method.hasModifier(SyntaxKind.StaticKeyword)) {
        // Check if the decorator already exists
        const hasDecorator = method.getDecorators().some(decorator => decorator.getName() === "MethodMetadata");

        // If method doesn't have decorator and the method doesn't start with '_' (assuming it's internal method)
        if (!hasDecorator && !method.getName().startsWith('_')) {
          method.addDecorator({
            name: "MethodMetadata",
            arguments: [],
          });

          method.formatText();
          updated = true;
        }
      }
    });

    sourceFile.saveSync();
    return updated;
  }
}

/**
 * Class to parse and update the metadata of enum-like classes.
 * These are classes which are similar to enums, but map to classes rather than
 * primitive types.
 */
export class EnumLikeUpdater extends MetadataUpdater {

  private CUSTOM_PARAM_MAPPINGS: { [cdkModule: string]: {[cdkEnumLike: string]: any}} = {
    "module": {
      "EnumLike": (param1: string) => {
        return `${param1}, ${param1.toUpperCase()}`
      }
    }
  }

  constructor(dir: string) {
    super(dir);
  }

   /**
   * Parse the repository for any enum-like classes and generate a JSON blueprint.
   */
  public execute(): void {
    const enumlikeBlueprint: Record<string, Record<string, string[]>> = {};

    // Retrieve enum-like classes
    this.project.getSourceFiles().forEach((sourceFile) => {
      const sourceFileName: string = sourceFile.getFilePath().split("/aws-cdk/")[1]
      let fileBlueprint: Record<string, string[]> = {};
      sourceFile.forEachChild((node) => {
        if (node instanceof ClassDeclaration) {
          const className = node.getName();
          if (className) {
            node.forEachChild((classField) => {
              if (classField instanceof PropertyDeclaration) {
                // enum-likes have `public static readonly` attributes that map to either new or call expressions
                const initializerKind = classField.getInitializer()?.getKind();
                if (initializerKind && classField.getText().startsWith("public static readonly") && 
                  (initializerKind === SyntaxKind.NewExpression || initializerKind === SyntaxKind.CallExpression || initializerKind === SyntaxKind.PropertyAccessExpression)
                ) {
                  // This is an enum-like; add to blueprint
                  const enumlikeName = classField.getName();
                  if (!fileBlueprint[className]) {
                    fileBlueprint[className] = [];
                  }
                  fileBlueprint[className].push(enumlikeName);
                }
              }
            });
            if (Object.values(fileBlueprint).length > 0) {
              enumlikeBlueprint[sourceFileName] = fileBlueprint;
            }
          }
        }
      });
    });

    // Generate the file content
    const outputPath = path.resolve(
      __dirname,
      "../../../../packages/aws-cdk-lib/core/lib/analytics-data-source/enums/module-enumlikes.json"
    );
    
    // Write the generated file
    this.writeFileContent(outputPath, enumlikeBlueprint);
    console.log(`Metadata file written to: ${outputPath}`);
  }

  /**
   * Retrieve the generated list of enum-like classes and the missing values,
   * and update the source files with any missing values.
   */
    public updateEnumValues(): void {
      // Get list of enum-likes and missing enum-likes
      const parsedEnumLikes = this.getParsedEnumValues();
      const missingEnumLikes = this.getMissingEnumValues();
  
      // Update the parsed_cdk_enums.json file
      Object.keys(missingEnumLikes).forEach((cdkModule) => {
        Object.keys(missingEnumLikes[cdkModule]).forEach((enumKey) => {
          if (parsedEnumLikes[cdkModule]?.[enumKey]) {
            this.updateEnum(enumKey, missingEnumLikes[cdkModule][enumKey])
          }
        });
      });
    }

  /**
   * Retrieve the parsed enum values from the generated list
   * @returns A dictionary containing the parsed_cdk_enums.json file with only regular enums
   */
  private getParsedEnumValues(): any {
    // Get file contents
    const fileContent = fs.readFileSync(path.resolve(__dirname, "../../enum-updater/parsed_cdk_enums.json"), 'utf8');
    var jsonData = JSON.parse(fileContent);

    // Remove anything that is enum-like
    Object.keys(jsonData).forEach((cdkModule) => {
      Object.keys(jsonData[cdkModule]).forEach((enumKey) => {
        if (jsonData[cdkModule][enumKey].enumLike) {
          delete jsonData[cdkModule][enumKey];
        }
      });
    });

    // Clean up empty modules
    Object.keys(jsonData).forEach((cdkModule) => {
      if (Object.keys(jsonData[cdkModule]).length === 0) {
        delete jsonData[cdkModule];
      }
    });

    return jsonData;
  }
  
  /**
   * Retrieve the list of missing values for regular enum values
   * @returns A dictionary containing the missing-values.json file with only regular enums with missing values
   */
    private getMissingEnumValues(): any {
      // Get file contents
      const fileContent = fs.readFileSync(path.resolve(__dirname, "../../enum-updater/missing-values.json"), 'utf8');
      var jsonData = JSON.parse(fileContent);
  
      const parsedEnums = this.getParsedEnumValues();
  
      // Remove anything that isn't in the parsed enum-likes (regular enums)
      Object.keys(jsonData).forEach((cdkModule) => {
        Object.keys(jsonData[cdkModule]).forEach((enumKey) => {
          if (!parsedEnums[cdkModule]?.[enumKey]) {
            delete jsonData[cdkModule][enumKey];
          }
        });
      });
  
      // Clean up empty modules
      Object.keys(jsonData).forEach((cdkModule) => {
        if (Object.keys(jsonData[cdkModule]).length === 0) {
          delete jsonData[cdkModule];
        }
      });
  
      return jsonData
    }

  /**
   * Update a single enum-like value
   * @param enumName The enum name
   * @param missingValue The dictionary from the `missing-values.json` file
   * containing the cdk_path and missing_values for the enum
   */
  private updateEnum(enumName: string, missingValue: any): void {
    // Get the right source file to modify
    let sourceFile = this.project.getSourceFile(path.resolve(__dirname, '../../../..', missingValue['cdk_path']));
    if (!sourceFile) {
      throw new Error(`Source file not found: ${missingValue['cdk_path']}`);
    }

    // Get the class declaration
    const enumDeclaration = sourceFile.getEnum(enumName)
    if (!enumDeclaration) {
      throw new Error(`Enum declaration not found: ${enumName}`);
    }
    
    console.log(`=====\nUpdating enum ${enumName} in ${missingValue['cdk_path']} \n=====`);

    // Get the new enum values to add (no need to worry about sorting or checking existing values)
    const newEnumValues = missingValue['missing_values'];

    // Add each new enum value at the end of the enum
    for (const enumVal of newEnumValues) {
        // Format the enum constant name (uppercase and replace hyphens or periods with underscores)
        const enumConstantName = enumVal.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/_+$/, '');

        // Add the missing enum value with a placeholder doc comment
        const newEnumMember = enumDeclaration.addMember({
            name: enumConstantName,
            initializer: `'${enumVal}'`, // Ensure the value is a string literal
        });

        newEnumMember.addJsDoc("\n[PLACEHOLDER FOR: TO BE FILLED OUT]");  // Add temp docstring comment

        console.log(`=====\nAdded missing enum-like value ${enumVal} to ${enumName}\n=====`);
    }

    // Write the updated file back to disk
    sourceFile.saveSync();
    console.log(sourceFile.getEnum(enumName)?.getFullText());
  }

  /**
   * Retrieve the generated list of enum-like classes and the missing values,
   * and update the source files with any missing values.
   */
  public updateEnumLikeValues(): void {
    // Get list of enum-likes and missing enum-likes
    const parsedEnumLikes = this.getParsedEnumLikeValues();
    const missingEnumLikes = this.getMissingEnumLikeValues();

    // Update the parsed_cdk_enums.json file
    Object.keys(missingEnumLikes).forEach((cdkModule) => {
      Object.keys(missingEnumLikes[cdkModule]).forEach((enumKey) => {
        if (parsedEnumLikes[cdkModule]?.[enumKey]) {
          this.updateEnumLike(cdkModule, enumKey, missingEnumLikes[cdkModule][enumKey])
        }
      });
    });

    // Lint and clean up the repo
    // console.log("Running yarn lint...");
    // exec('yarn lint --fix', { cwd: path.resolve(__dirname, '../../../../packages/aws-cdk-lib') }, (err, stdout, stderr) => {
    //   if (err) {
    //     console.log(`An error occurred in lib: ${stderr}`);
    //     console.log(`lib stdout: ${stdout}`);
    //     console.log(`lib stderr: ${stderr}`);
    //     return;
    //   }

    //   console.log(`lib stdout: ${stdout}`);
    //   console.log(`lib stderr: ${stderr}`);
    // });
    // console.log("Ran yarn lint");
  }

  /**
   * Retrieve the parsed enum-like values from the generated list
   * @returns A dictionary containing the parsed_cdk_enums.json file with only enum-likes
   */
  private getParsedEnumLikeValues(): any {
    // Get file contents
    const fileContent = fs.readFileSync(path.resolve(__dirname, "../../enum-updater/parsed_cdk_enums.json"), 'utf8');
    var jsonData = JSON.parse(fileContent);

    // Remove anything that isn't enum-like
    Object.keys(jsonData).forEach((cdkModule) => {
      Object.keys(jsonData[cdkModule]).forEach((enumKey) => {
        if (!jsonData[cdkModule][enumKey].enumLike) {
          delete jsonData[cdkModule][enumKey];
        }
      });
    });

    // Clean up empty modules
    Object.keys(jsonData).forEach((cdkModule) => {
      if (Object.keys(jsonData[cdkModule]).length === 0) {
        delete jsonData[cdkModule];
      }
    });

    return jsonData;
  }

  /**
   * Retrieve the list of missing values for enum-like values
   * @returns A dictionary containing the missing-values.json file with only enum-likes with missing values
   */
  private getMissingEnumLikeValues(): any {
    // Get file contents
    const fileContent = fs.readFileSync(path.resolve(__dirname, "../../enum-updater/missing-values.json"), 'utf8');
    var jsonData = JSON.parse(fileContent);

    const parsedEnumLikes = this.getParsedEnumLikeValues();

    // Remove anything that isn't in the parsed enum-likes (regular enums)
    Object.keys(jsonData).forEach((cdkModule) => {
      Object.keys(jsonData[cdkModule]).forEach((enumKey) => {
        if (!parsedEnumLikes[cdkModule]?.[enumKey]) {
          delete jsonData[cdkModule][enumKey];
        }
      });
    });

    // Clean up empty modules
    Object.keys(jsonData).forEach((cdkModule) => {
      if (Object.keys(jsonData[cdkModule]).length === 0) {
        delete jsonData[cdkModule];
      }
    });

    return jsonData
  }

  /**
   * Update a single enum-like value
   * @param moduleName The module name that the enum-like class is in
   * @param enumLikeName The enum-like class name
   * @param missingValue The dictionary from the `missing-values.json` file
   * containing the cdk_path and missing_values for the enum-like class
   */
  private updateEnumLike(moduleName: string, enumLikeName: string, missingValue: any): void {
    // Get the right source file to modify
    let sourceFile = this.project.getSourceFile(path.resolve(__dirname, '../../../..', missingValue['cdk_path']));
    if (!sourceFile) {
      throw new Error(`Source file not found: ${missingValue['cdk_path']}`);
    }

    // Get the class declaration
    const classDeclaration = sourceFile.getClass(enumLikeName);
    if (!classDeclaration) {
      throw new Error(`Class declaration not found: ${enumLikeName}`);
    }

    // Determine the type of enum-like
    let initializerStatement = "";
    let lastEnumLikeOrderPos = 0;
    classDeclaration.forEachChild((classField) => {
      if (classField instanceof PropertyDeclaration) {
        const initializerKind = classField.getInitializer()?.getKind();
        if (initializerKind && classField.getText().startsWith("public static readonly") &&
          classField.getName() === classField.getName().toUpperCase()
        ) {
          lastEnumLikeOrderPos++;
          if (initializerKind === SyntaxKind.NewExpression) {          // X = new Class(...)
            initializerStatement = `new ${enumLikeName}(`;
          } else if (initializerKind === SyntaxKind.CallExpression) {  // X = Class.method(...)
            initializerStatement = `${enumLikeName}.${classField.getInitializerIfKind(SyntaxKind.CallExpression)?.getExpressionIfKind(SyntaxKind.PropertyAccessExpression)?.getName()}(`;
          } else {
            console.log(`Skipping ${enumLikeName} as it does not fit currently-defined declaration patterns...`)
            return;
          }
          // If we have custom logic, use that
          if (this.CUSTOM_PARAM_MAPPINGS[moduleName] && this.CUSTOM_PARAM_MAPPINGS[moduleName][enumLikeName]) {
            initializerStatement += `${this.CUSTOM_PARAM_MAPPINGS[moduleName][enumLikeName](classField.getName())})`;
          } else {
            // Otherwise, assume it's a single string
            const args = initializerKind === SyntaxKind.NewExpression ? classField.getInitializerIfKind(SyntaxKind.NewExpression)?.getArguments() : classField.getInitializerIfKind(SyntaxKind.CallExpression)?.getArguments();
            if (!args || args.length !== 1) {
              console.log(`Skipping ${enumLikeName} as it does not fit currently-defined parameter patterns...`);
              return;
            }
            initializerStatement += "'${VAL}')"
          }
        }
      }
    });

    // Add the missing enum-like values
    for (const enumLikeVal of missingValue['missing_values']) {
      const newProperty = classDeclaration.addProperty({
        name: enumLikeVal.toUpperCase().replaceAll('-', '_').replaceAll('.', '_'),
        scope: Scope.Public,
        isStatic: true,
        isReadonly: true,
        initializer: initializerStatement.replace("${VAL}", enumLikeVal),
      })
      newProperty.setOrder(lastEnumLikeOrderPos);  // Place at the end of the enum-likes
      newProperty.addJsDoc("\n[PLACEHOLDER COMMENT: TO BE FILLED OUT]");  // Add temp docstring comment
      console.log(`=====\nAdded missing enum-like value ${enumLikeVal} to ${enumLikeName}\n=====`);
    }

    // Write the updated file back to disk
    sourceFile.saveSync();
    console.log(sourceFile.getClass(enumLikeName)?.getFullText());
  }

  public TEST() {
    console.log(this.updateEnumLikeValues());
    console.log(this.updateEnumValues());
  }
}
