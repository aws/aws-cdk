import { IndentationText, Project, PropertyDeclaration, QuoteKind, Scope, SyntaxKind } from "ts-morph";
import * as path from "path";
import * as fs from "fs";
import * as tmp from 'tmp';
import { CDK_ENUMS, CdkEnums, normalizeEnumValues, normalizeValue, SDK_ENUMS, SdkEnums, STATIC_MAPPING, StaticMapping } from "./static-enum-mapping-updater";

const DIRECTORIES_TO_SKIP = [
  "node_modules",
  "dist",
  "build",
  "decdk",
  "awslint",
  "test",
];

interface MissingValuesEntry {
  cdk_path: string;
  missing_values: (string | number)[];
}
  
interface MissingValues {
  [module: string]: {
    [enumName: string]: MissingValuesEntry;
  };
}

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
   * Identifies missing enum values by comparing CDK enums with AWS SDK enums based on a static mapping.
   */
  private async findMissingValues(
    staticMapping: StaticMapping,
    cdkEnums: CdkEnums,
    sdkEnums: SdkEnums
  ): Promise<MissingValues> {
    const missingValues: MissingValues = {};
  
    for (const [module, enums] of Object.entries(staticMapping)) {
      for (const [enumName, mapping] of Object.entries(enums)) {
        const cdkValues = cdkEnums[module][enumName].values;
        const sdkValues = sdkEnums[mapping.sdk_service][mapping.sdk_enum_name];
        
        // Get normalized sets of values
        const normalizedCdkValues = normalizeEnumValues(cdkValues);
        const normalizedSdkValues = normalizeEnumValues(sdkValues);
        
        // Find missing values using normalized comparison
        const missingNormalized = [...normalizedSdkValues].filter(sdkValue => 
          !normalizedCdkValues.has(sdkValue)
        );
        
        if (missingNormalized.length > 0) {
          if (!missingValues[module]) {
            missingValues[module] = {};
          }
  
          // Get original SDK values that correspond to missing normalized values
          const missingOriginal = sdkValues.filter(value => 
            missingNormalized.includes(normalizeValue(value))
          );
  
          missingValues[module][enumName] = {
            cdk_path: cdkEnums[module][enumName].path,
            missing_values: missingOriginal
          };
        }
      }
    }
  
  
    const totalEnumsWithMissing = Object.values(missingValues).reduce((sum, moduleEnums) => 
      sum + Object.keys(moduleEnums).length, 0);
    
    const totalMissingValues = Object.values(missingValues).reduce((sum, moduleEnums) => 
      sum + Object.values(moduleEnums).reduce((moduleSum, enumData) => 
        moduleSum + enumData.missing_values.length, 0), 0);
  
    console.log(`Enums with missing values: ${totalEnumsWithMissing}`);
    console.log(`Total missing values found: ${totalMissingValues}`);
  
    return missingValues;
  }
  
  /**
   * Saves missing enum values to a temporary JSON file.
   */
  private async saveMissingValues(
    staticMapping: StaticMapping,
    cdkEnums: CdkEnums,
    sdkEnums: SdkEnums
  ): Promise<string> {
    try {
      const missingValues = await this.findMissingValues(staticMapping, cdkEnums, sdkEnums);
      
      const tmpFile = tmp.fileSync({ postfix: '.json' });
      fs.writeFileSync(tmpFile.name, JSON.stringify(missingValues, null, 2));
  
      return tmpFile.name;
    } catch (error) {
      console.error('Error saving missing values:', error);
      throw error;
    }
  }
  
  /**
   * Analyzes missing enum values between CDK and SDK by loading mappings and processing them.
   */
  private async analyzeMissingEnumValues(): Promise<string> {
    try {
      const staticMapping: StaticMapping = JSON.parse(fs.readFileSync(STATIC_MAPPING, 'utf8'));
      const cdkEnums: CdkEnums = JSON.parse(fs.readFileSync(CDK_ENUMS, 'utf8'));
      const sdkEnums: SdkEnums = JSON.parse(fs.readFileSync(SDK_ENUMS, 'utf8'));
  
      const missingValuesPath = await this.saveMissingValues(staticMapping, cdkEnums, sdkEnums);
      
      const totalMappings = Object.values(staticMapping)
        .reduce((sum, moduleEnums) => sum + Object.keys(moduleEnums).length, 0);
      
      console.log("\nAnalysis Statistics:");
      console.log(`Total mappings analyzed: ${totalMappings}`);
      console.log("Missing values analysis completed.");

      return missingValuesPath;
    } catch (error) {
      console.error('Error analyzing missing enum values:', error);
      throw error;
    }
  }
  
  
  /**
   * Retrieve the generated list of enum-like classes and the missing values,
   * and update the source files with any missing values.
   */
  public updateEnumValues(missingValuesPath: string): void {
    // Get list of enum-likes and missing enum-likes
    const parsedEnums = this.getParsedEnumValues();
    const missingEnums = this.getMissingEnumValues(missingValuesPath);

    // Update the parsed_cdk_enums.json file
    Object.keys(missingEnums).forEach((cdkModule) => {
      Object.keys(missingEnums[cdkModule]).forEach((enumKey) => {
        if (parsedEnums[cdkModule]?.[enumKey]) {
          this.updateEnum(enumKey, missingEnums[cdkModule][enumKey])
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
    const fileContent = fs.readFileSync(CDK_ENUMS, 'utf8');
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
  private getMissingEnumValues(missingValuesPath: string): any {
    // Get file contents
    const fileContent = fs.readFileSync(missingValuesPath, 'utf8');
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
    let sourceFile = this.project.getSourceFile(path.resolve(__dirname, '../../../..', this.removeAwsCdkPrefix(missingValue['cdk_path'])));
    if (!sourceFile) {
      throw new Error(`Source file not found: ${missingValue['cdk_path']}`);
    }

    // Get the class declaration
    const enumDeclaration = sourceFile.getEnum(enumName)
    if (!enumDeclaration) {
      throw new Error(`Enum declaration not found: ${enumName}`);
    }
    
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
      
      textToInsert += `  /**\n   * PLACEHOLDER_COMMENT_TO_BE_FILLED_OUT\n   */\n`;
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
  }
  
  /**
   * Retrieve the generated list of enum-like classes and the missing values,
   * and update the source files with any missing values.
   */
  public updateEnumLikeValues(missingValuesPath: string): void {
    // Get list of enum-likes and missing enum-likes
    const parsedEnumLikes = this.getParsedEnumLikeValues();
    const missingEnumLikes = this.getMissingEnumLikeValues(missingValuesPath);

    // Update the parsed_cdk_enums.json file
    Object.keys(missingEnumLikes).forEach((cdkModule) => {
      Object.keys(missingEnumLikes[cdkModule]).forEach((enumKey) => {
        if (parsedEnumLikes[cdkModule]?.[enumKey]) {
          this.updateEnumLike(cdkModule, enumKey, missingEnumLikes[cdkModule][enumKey])
        }
      });
    });
  }

  /**
   * Retrieve the parsed enum-like values from the generated list
   * @returns A dictionary containing the parsed_cdk_enums.json file with only enum-likes
   */
  private getParsedEnumLikeValues(): any {
    // Get file contents
    const fileContent = fs.readFileSync(CDK_ENUMS, 'utf8');
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
  private getMissingEnumLikeValues(missingValuesPath: string): any {
    // Get file contents
    const fileContent = fs.readFileSync(missingValuesPath, 'utf8');
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
    let sourceFile = this.project.getSourceFile(path.resolve(__dirname, '../../../..', this.removeAwsCdkPrefix(missingValue['cdk_path'])));
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
      newProperty.addJsDoc("\nPLACEHOLDER_COMMENT_TO_BE_FILLED_OUT");  // Add temp docstring comment
    }

    // Write the updated file back to disk
    sourceFile.saveSync();
  }
  
  /**
   * Removes the "aws-cdk/" prefix from the given string if it exists.
   * @param input The string to process.
   * @returns The string without the "aws-cdk/" prefix.
   */
  private removeAwsCdkPrefix(input: string): string {
    return input.startsWith("aws-cdk/") ? input.slice(8) : input;
  }

  public async execute() {
    const missingValuesPath = await this.analyzeMissingEnumValues()
    this.updateEnumLikeValues(missingValuesPath);
    this.updateEnumValues(missingValuesPath);
  }
}
  