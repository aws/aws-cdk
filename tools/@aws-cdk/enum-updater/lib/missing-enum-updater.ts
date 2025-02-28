import { IndentationText, Project, PropertyDeclaration, QuoteKind, Scope, SyntaxKind } from "ts-morph";
import * as path from "path";
import * as fs from "fs";

const DIRECTORIES_TO_SKIP = [
    "node_modules",
    "dist",
    "build",
    "decdk",
    "awslint",
    "test",
  ];

/**
 * Class to parse and update the metadata of enum-like classes.
 * These are classes which are similar to enums, but map to classes rather than
 * primitive types.
 */
export class MissingEnumsUpdater {
    
    private CUSTOM_PARAM_MAPPINGS: { [cdkModule: string]: {[cdkEnumLike: string]: any}} = {
      "module": {
        "EnumLike": (param1: string) => {
          return `${param1}, ${param1.toUpperCase()}`
        }
      }
    }
  
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
      const fileContent = fs.readFileSync(path.resolve(__dirname, "../parsed_cdk_enums.json"), 'utf8');
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
        const fileContent = fs.readFileSync(path.resolve(__dirname, "../missing-values.json"), 'utf8');
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
     * Update a single enum value
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
  
      const newEnumValues = missingValue['missing_values'];
  
      // First get the full text
      let enumText = enumDeclaration.getFullText();
  
      // If the text starts with empty lines before the docstring (which starts with /**),
      // remove only those empty lines
      if (enumText.startsWith('\n') && enumText.includes('/**')) {
          const docstringStart = enumText.indexOf('/**');
          const leadingText = enumText.substring(0, docstringStart);
          const restOfText = enumText.substring(docstringStart);
          enumText = leadingText.replace(/^\n+/, '') + restOfText;
      }
      
      // Get just the enum body (everything between the curly braces)
      const enumBodyStart = enumText.indexOf('{') + 1;
      const enumBodyEnd = enumText.lastIndexOf('}');
      const enumBody = enumText.substring(enumBodyStart, enumBodyEnd);
  
      // Check for double line breaks only in the enum body
      const hasDoubleLineBreaks = enumBody.includes('\n\n');
  
      // Find the position to insert new members (just before the closing brace)
      const insertPosition = enumText.lastIndexOf('}');
  
      // Prepare the text to insert - only add initial newline if enum uses double line breaks
      let textToInsert = hasDoubleLineBreaks ? '\n' : '';
  
      newEnumValues.forEach((enumVal: string, index: number) => {
          const enumConstantName = enumVal.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/_+$/, '');
          
          textToInsert += `  /**\n   * [PLACEHOLDER FOR: TO BE FILLED OUT]\n   */\n`;
          textToInsert += `  ${enumConstantName} = '${enumVal}'`;
          
          // Add a comma and appropriate newlines after each member
          textToInsert += ',';
          
          // Add newlines after each member except the last one
          if (index < newEnumValues.length - 1) {
              textToInsert += hasDoubleLineBreaks ? '\n\n' : '\n';
          }
      });
  
      // Add final newline before the closing brace
      textToInsert += '\n';
  
      // Insert the new text
      enumText = enumText.slice(0, insertPosition) + textToInsert + enumText.slice(insertPosition);
  
      // Set the full text of the enum
      enumDeclaration.replaceWithText(enumText);
  
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
      const fileContent = fs.readFileSync(path.resolve(__dirname, "../parsed_cdk_enums.json"), 'utf8');
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
      const fileContent = fs.readFileSync(path.resolve(__dirname, "../missing-values.json"), 'utf8');
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
  
    public execute() {
      console.log(this.updateEnumLikeValues());
      console.log(this.updateEnumValues());
    }
  }
  