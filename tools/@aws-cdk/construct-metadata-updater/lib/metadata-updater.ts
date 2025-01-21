import { ClassDeclaration, Project, QuoteKind } from "ts-morph";
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

export class ResourceMetadataUpdater {
  private project: Project;

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

  public execute() {
    // Process each file in the project
    this.project.getSourceFiles().forEach((sourceFile) => {
      console.log(`Processing file: ${sourceFile.getFilePath()}`);
      this.transformFile(sourceFile.getFilePath());
    });
  }

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
  private transformFile(filePath: string): void {
    const sourceFile = this.project.getSourceFile(filePath);
    if (!sourceFile) return;
  
    let importAdded = false;
  
    sourceFile.forEachChild((node) => {
      if (node instanceof ClassDeclaration) {
        const symbol = node.getSymbol();
        if (symbol) {
          const className = symbol.getName(); // Correct way to get the name
  
          // Check if the class is abstract by inspecting modifiers
          const isAbstract = node.getModifiers()?.some((mod) => mod.getText() === "abstract");
          if (isAbstract) {
            console.log(`Skipping abstract class: ${className}`);
            return;
          }
  
          // Check if the class or its subclasses extends Resource
          const type = node.getType();
          if (this.isDescendantOfResource(type)) {
            console.log(`Relevant class found: ${className} extends Resource`);

            if (!importAdded) {
              this.addImportAndMetadataStatement(sourceFile, filePath, node);
              importAdded = true;
            }
          }
        }
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
      console.log("Import already exists, skipping addition.");
      return;
    }

    // Create the new import statement
    sourceFile.addImportDeclaration({
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
        console.log(`Metadata statement already exists in class: ${classDeclaration.getName()}`);
        return true;
      }

      // Find the super() call, if it exists
      const superCall = constructor.getStatements().find(statement => 
        statement.getText().includes('super(')
      );
  
      // If a super() call exists, find its index and insert after it
      if (superCall) {
        const superCallIndex = constructor.getStatements().indexOf(superCall);
        constructor.insertStatements(superCallIndex + 1, writer => {
          writer.setIndentationLevel(0);
          writer.write('    // Enhanced CDK Analytics Telemetry\n');
          writer.write('    addConstructMetadata(this, props);');
        });
        console.log(`Added 'addConstructMetadata();' after the 'super()' in the constructor of class: ${classDeclaration.getName()}`);
      } else {
        // If no super() call exists, just add the line at the top
        constructor.insertStatements(0, writer => {
          writer.setIndentationLevel(0);
          writer.write('    // Enhanced CDK Analytics Telemetry\n');
          writer.write('    addConstructMetadata(this, props);');
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
