import { ClassDeclaration, Project, QuoteKind, SourceFile, Symbol, SyntaxKind } from "ts-morph";
import * as path from "path";
import * as fs from "fs";
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

    // Check if the import already exists
    if (sourceFile.getImportDeclarations().some((stmt: any) => stmt.getModuleSpecifier().getText().includes('/metadata-resource'))) {
      return;
    }

    // Find the correct insertion point (after the last import before the new one)
    const importDeclarations = sourceFile.getImportDeclarations();
    let insertIndex = importDeclarations.length;
    for (let i = 0; i < importDeclarations.length; i++) {
      const existingImport = importDeclarations[i].getModuleSpecifier().getText();
      if (existingImport.localeCompare(relativePath) > 0) {
        insertIndex = i;
        break;
      }
    }

    // Insert the new import at the appropriate position
    sourceFile.insertImportDeclaration(insertIndex, {
      moduleSpecifier: relativePath,
      namedImports: [{ name: "addConstructMetadata" }],
    });
    console.log(`Added import for MetadataType in file: ${filePath} with relative path: ${relativePath}`);

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
      }
    });

    this.generateFileContent();
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
    if (type.isUnion()) {
      // Get all types in the union and find the first non-undefined type
      // CDK doesn't support complex union type so we can safely get the first
      // non-undefined type
      const unionTypes = type.getUnionTypes();
      type = unionTypes.find((t: any) => t.getText() !== 'undefined') || type;

      if (type.isLiteral() && (type.getText() === 'true' || type.getText() === 'false')) {
        return '*';
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

    this.project.getSourceFiles().forEach((sourceFile) => {
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
        }
      });
    });

    // Generate the file content
    const content = this.generateFileContent(enumBlueprint);
    const outputPath = path.resolve(
      __dirname,
      "../../../../packages/aws-cdk-lib/core/lib/analytics-data-source/enums.ts"
    );

    // Write the generated file
    fs.writeFileSync(outputPath, content);
    console.log(`Metadata file written to: ${outputPath}`);
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

    const jsonContent = JSON.stringify(enums, null, 2).replace(/"/g, "'");

    // Replace the placeholder with the JSON object
    return template.replace("$ENUMS", jsonContent);
  }
}