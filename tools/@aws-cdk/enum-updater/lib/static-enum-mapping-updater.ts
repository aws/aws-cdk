import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as tmp from 'tmp';
import * as extract from 'extract-zip';

const ENUMS_URL = "https://raw.githubusercontent.com/aws/aws-cdk/main/packages/aws-cdk-lib/core/lib/analytics-data-source/enums/module-enums.json";
const ENUM_LIKE_CLASSES_URL = "https://raw.githubusercontent.com/aws/aws-cdk/main/packages/aws-cdk-lib/core/lib/analytics-data-source/enums/module-enumlikes.json";
const CFN_LINT_URL = "https://github.com/aws-cloudformation/cfn-lint/archive/refs/heads/main.zip"
const MODULE_MAPPING = path.join(__dirname, "module-mapping.json");
const STATIC_MAPPING_FILE_NAME = "static-enum-mapping.json";
const PARSED_CDK_ENUMS_FILE_NAME = "cdk-enums.json";
export const PARSED_SDK_ENUMS_FILE_NAME = "sdk-enums.json";
export const STATIC_MAPPING = path.join(__dirname, STATIC_MAPPING_FILE_NAME);
export const CDK_ENUMS = path.join(__dirname, PARSED_CDK_ENUMS_FILE_NAME);
export const SDK_ENUMS = path.join(__dirname, PARSED_SDK_ENUMS_FILE_NAME);

// Set up cleanup handlers for process termination
tmp.setGracefulCleanup();

interface DownloadResult {
  path: string | null;
  cleanup: () => Promise<void>;
}

export interface SdkEnums {
  [service: string]: {
    [enumName: string]: (string | number)[];
  };
}


function extractEnums(schema: Record<string, any>, enums: { [enumName: string]: (string | number)[] }) {
  // Helper function to process a property and its potential enum values
  function processProperty(propertyName: string, property: any) {
      if (property.enum) {
          enums[propertyName] = property.enum;
      } else if (property.items?.enum) {
          enums[propertyName] = property.items.enum;
      }

      // Process nested properties
      if (property.properties) {
          for (const [nestedName, nestedProp] of Object.entries(property.properties)) {
              processProperty(nestedName, nestedProp);
          }
      }
  }

  // Process main properties
  for (const [propertyName, property] of Object.entries(schema.properties)) {
      processProperty(propertyName, property);
  }

  // Process definitions
  if (schema.definitions) {
    for (const [definitionName, definition] of Object.entries(schema.definitions)) {
      processProperty(definitionName, definition);
    }
  }
}

interface EnumValue {
  path: string;
  enumLike: boolean;
  values: (string | number)[];
}

export interface CdkEnums {
  [module: string]: {
    [enumName: string]: EnumValue;
  };
}

interface MatchResult {
  service: string | null;
  enumName: string | null;
  matchPercentage: number;
}

export interface StaticMappingEntry {
  cdk_path: string;
  sdk_service: string;
  sdk_enum_name: string;
  match_percentage: number;
}

export interface StaticMapping {
  [module: string]: {
    [enumName: string]: StaticMappingEntry;
  };
}

interface UnmatchedEnum {
  cdk_path: string;
}

interface UnmatchedEnums {
  [module: string]: {
    [enumName: string]: UnmatchedEnum;
  };
}

/**
 * Downloads a file from a given GitHub raw URL and saves it to a temporary location.
 *
 * @param url - The GitHub raw file URL to download.
 * @returns A `DownloadResult` containing the path and cleanup function.
 */
export async function downloadGithubRawFile(url: string): Promise<DownloadResult> {
  try {
    console.log(`Downloading file from: ${url}`);

    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error(`Failed to download file. Status code: ${response.status}`);
    }

    // Create temporary file and write content
    const tmpFile = tmp.fileSync();
    fs.writeFileSync(tmpFile.name, JSON.stringify(response.data, null, 2), 'utf8');

    console.log(`File successfully downloaded to: ${tmpFile.name}`);

    return {
      path: tmpFile.name,
      cleanup: async () => tmpFile.removeCallback(),
    };
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error);
    return { path: null, cleanup: async () => {} };
  }
}

/**
 * Downloads the CFN Lint Schema ZIP file, extracts the schema directory in us-east-1,
 * and stores it in a temporary location.
 *
 * @param url - The URL to the CFN Lint Schema ZIP archive.
 * @returns A `DownloadResult` containing:
 *   - `path`: The temporary directory where schema is extracted.
 *   - `cleanup`: A function to remove temporary files after use.
 */
export async function downloadAwsSdkModels(url: string): Promise<DownloadResult> {
  console.log(`Downloading CFN Lint schemas from: ${url}`);

  // Temporary storage setup
  const tmpDir = tmp.dirSync({ unsafeCleanup: true });
  const zipFile = tmp.fileSync({ postfix: '.zip' });
  const modelsDir = tmp.dirSync({ unsafeCleanup: true });

  try {
    // Download ZIP file
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    if (response.status !== 200) {
      throw new Error(`Failed to download ZIP. Status code: ${response.status}`);
    }

    console.log(`Download successful. Writing to temporary file: ${zipFile.name}`);
    fs.writeFileSync(zipFile.name, response.data);

    // Extract ZIP contents
    console.log("Extracting ZIP file...");
    await extract(zipFile.name, { dir: tmpDir.name });

    // Locate and copy `aws-models` directory
    const sourceDir = path.join(tmpDir.name, 'cfn-lint-main/src/cfnlint/data/schemas/providers/us_east_1');
    if (!fs.existsSync(sourceDir)) {
      throw new Error("aws-models directory not found in extracted contents.");
    }

    fs.cpSync(sourceDir, modelsDir.name, { recursive: true });
    console.log(`Extracted aws-models to: ${modelsDir.name}`);

    return {
      path: modelsDir.name,
      cleanup: async () => cleanupTempFiles(zipFile, tmpDir, modelsDir),
    };

  } catch (error) {
    console.error("Error downloading or extracting repository:", error);
    return { path: null, cleanup: async () => cleanupTempFiles(zipFile, tmpDir, modelsDir) };
  }
}

/**
 * Cleans up temporary files and directories.
 *
 * @param zipFile - Temporary ZIP file reference.
 * @param tmpDir - Temporary extraction directory.
 * @param modelsDir - Extracted `aws-models` directory.
 */
async function cleanupTempFiles(zipFile: tmp.FileResult, tmpDir: tmp.DirResult, modelsDir: tmp.DirResult) {
  try {
    zipFile.removeCallback();
    tmpDir.removeCallback();
    modelsDir.removeCallback();
    console.log("Temporary files cleaned up successfully.");
  } catch (error) {
    console.warn("Failed to clean up temporary files:", error);
  }
}

/**
 * Parses AWS SDK model JSON files to extract and store enum definitions.
 *
 * @param sdkModelsPath - The path to the directory containing AWS SDK model JSON files.
 * @returns A promise that resolves once the enums are parsed and saved.
 */
export async function parseAwsSdkEnums(sdkModelsPath: string): Promise<void> {
  const sdkEnums: SdkEnums = {};

  try {
    const jsonFiles = getJsonFiles(sdkModelsPath);

    for (const file of jsonFiles) {
      try {
        if (file == 'module.json') {
          continue;
        }
        const jsonData = readJsonFile(path.join(sdkModelsPath, file));

        const service = file.split('-')[1];

        const enumMap = sdkEnums[service] ?? {};

        // Extract enums
        extractEnums(jsonData, enumMap);

        sdkEnums[service] = enumMap;
      } catch (error) {
        console.warn(`Error processing file ${file}:`, error);
      }
    }

    saveParsedEnums(sdkEnums);
  } catch (error) {
    console.error('Error parsing AWS SDK enums:', error);
    throw error;
  }
}

/**
 * Retrieves all JSON files from a directory.
 */
function getJsonFiles(directory: string): string[] {
  return fs.readdirSync(directory).filter(file => file.endsWith('.json'));
}

/**
 * Reads and parses a JSON file.
 */
function readJsonFile(filePath: string): Record<string, any> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Saves the parsed enums to a JSON file.
 */
function saveParsedEnums(sdkEnums: SdkEnums): void {
  const outputPath = `lib/${PARSED_SDK_ENUMS_FILE_NAME}`;
  fs.writeFileSync(outputPath, JSON.stringify(sdkEnums, null, 2));
  console.log(`Wrote SDK enums to ${outputPath}`);
}

/**
 * Extracts the AWS module name from a given file path.
 *
 * @param {string} path - The file path from which to extract the module name.
 * @returns {string | null} The extracted module name, or `null` if extraction fails.
 */
export function extractModuleName(path: string): string | null {
  try {
    const moduleName = path.split("/")[3];
    if (!moduleName) return null;

    let processedName = moduleName;
    if (processedName.startsWith("aws-")) {
      processedName = processedName.substring(4);
    }

    if (processedName.endsWith("-alpha")) {
      processedName = processedName.slice(0, -6);
    }

    return processedName;
  } catch (error) {
    return null;
  }
}

/**
 * Processes the CDK enum files and extracts enum definitions.
 *
 * @param {string} enumsFilePath - The file path for standard CDK enums.
 * @param {string} enumsLikeFilePath - The file path for "enum-like" values.
 * @returns {Promise<void>}
 */
async function processCdkEnums(enumsFilePath: string, enumsLikeFilePath: string): Promise<void> {
  const processedData: CdkEnums = {};
  let totalEnums = 0;

  try {
    // Process the first file (enums)
    await processFile(enumsFilePath, false);

    // Process the second file (enum-like)
    await processFile(enumsLikeFilePath, true);

    fs.writeFileSync(`lib/${PARSED_CDK_ENUMS_FILE_NAME}`, JSON.stringify(processedData, null, 2));
    console.log(`Wrote CDK enums to ${PARSED_CDK_ENUMS_FILE_NAME}`);
    console.log(`Total CDK enums parsed: ${totalEnums}`);

  } catch (error) {
    console.error('Error processing CDK enums:', error);
    throw error;
  }

  async function processFile(filePath: string, isEnumLike: boolean) {
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const [path, enums] of Object.entries(rawData)) {
      const moduleName = extractModuleName(path);
      if (!moduleName) continue;

      if (!processedData[moduleName]) {
        processedData[moduleName] = {};
      }

      for (const [enumName, values] of Object.entries(enums as Record<string, (string | number)[]>)) {
        processedData[moduleName][enumName] = {
          path,
          enumLike: isEnumLike,
          values: values
        };
        totalEnums++;
      }
    }
  }
}

/**
 * Normalizes an enum value by converting it to uppercase and removing non-alphanumeric characters.
 *
 * @param {string | number} value - The enum value to normalize.
 * @returns {string} The normalized string representation of the value.
 */
export function normalizeValue(value: string | number): string {
  const strValue = String(value);
  if (strValue.match(/^\d+$/)) {
    return strValue;
  }
  return strValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * Normalizes a list of enum values and converts them into a unique set.
 *
 * @param {(string | number)[]} values - The list of enum values.
 * @returns {Set<string>} A set of normalized enum values.
 */
export function normalizeEnumValues(values: (string | number)[]): Set<string> {
  return new Set(values.map(normalizeValue));
}

/**
 * Calculates the percentage of CDK enum values that match SDK enum values.
 *
 * @param {Set<string>} cdkValues - The set of CDK enum values.
 * @param {Set<string>} sdkValues - The set of SDK enum values.
 * @returns {number} A percentage representing the proportion of matching values.
 */
function calculateValueMatchPercentage(cdkValues: Set<string>, sdkValues: Set<string>): number {
  if (cdkValues.size === 0) return 0;
  const matchingValues = new Set([...cdkValues].filter(x => sdkValues.has(x)));
  return matchingValues.size / cdkValues.size;
}

/**
 * Finds the best-matching AWS SDK enum for a given CDK enum.
 *
 * @param {string} cdkEnumName - The name of the CDK enum.
 * @param {(string | number)[]} cdkValues - The values of the CDK enum.
 * @param {string[]} sdkServices - The list of AWS SDK services to search in.
 * @param {SdkEnums} sdkEnums - The AWS SDK enums database.
 * @returns {MatchResult} An object containing the best match details:
 *   - `service`: The AWS SDK service containing the best-matching enum.
 *   - `enumName`: The name of the best-matching SDK enum.
 *   - `matchPercentage`: The percentage of matching values.
 */
export function findMatchingEnum(
  cdkEnumName: string,
  cdkValues: (string | number)[],
  sdkServices: string[],
  sdkEnums: SdkEnums
): MatchResult {
  let bestMatch: MatchResult = {
    service: null,
    enumName: null,
    matchPercentage: 0
  };

  const normalizedCdkValues = normalizeEnumValues(cdkValues);

  for (const service of sdkServices) {
    if (!sdkEnums[service]) continue;

    for (const [sdkEnumName, sdkValues] of Object.entries(sdkEnums[service])) {
      // Try exact name match first
      if (cdkEnumName.toLowerCase() === sdkEnumName.toLowerCase()) {
        const normalizedSdkValues = normalizeEnumValues(sdkValues);
        if (isValidMatch(normalizedCdkValues, normalizedSdkValues)) {
          return {
            service,
            enumName: sdkEnumName,
            matchPercentage: calculateValueMatchPercentage(normalizedCdkValues, normalizedSdkValues)
          };
        }
      }

      const normalizedSdkValues = normalizeEnumValues(sdkValues);
      if (isValidMatch(normalizedCdkValues, normalizedSdkValues)) {
        const matchPercentage = calculateValueMatchPercentage(normalizedCdkValues, normalizedSdkValues);
        if (matchPercentage > bestMatch.matchPercentage) {
          bestMatch = {
            service,
            enumName: sdkEnumName,
            matchPercentage
          };
        }
      }
    }
  }

  return bestMatch;
}

function isValidMatch(cdkValues: Set<string>, sdkValues: Set<string>): boolean {
  // Check if all CDK values are present in SDK values
  const isSubset = [...cdkValues].every(value => sdkValues.has(value));
  const matchPercentage = calculateValueMatchPercentage(cdkValues, sdkValues);
  return isSubset && matchPercentage >= 0.5;
}

/**
 * Generates a static mapping between CDK enums and AWS SDK enums.
 *
 * @param {CdkEnums} cdkEnums - The extracted CDK enums.
 * @param {SdkEnums} sdkEnums - The extracted AWS SDK enums.
 * @param {Record<string, string[]>} manualMappings - The manually defined service mappings.
 * @returns {Promise<void>}
 */
export async function generateAndSaveStaticMapping(
  cdkEnums: CdkEnums,
  sdkEnums: SdkEnums,
  manualMappings: Record<string, string[]>
): Promise<void> {
  const staticMapping: StaticMapping = {};
  const unmatchedEnums: UnmatchedEnums = {};

  for (const [module, enums] of Object.entries(cdkEnums)) {
    if (!manualMappings[module]) {
      // Add to unmatched if no SDK mapping exists
      unmatchedEnums[module] = Object.fromEntries(
        Object.entries(enums).map(([enumName, enumData]) => [
          enumName,
          { cdk_path: enumData.path }
        ])
      );
      continue;
    }

    const sdkServices = manualMappings[module];

    for (const [enumName, enumData] of Object.entries(enums)) {
      const match = findMatchingEnum(
        enumName,
        enumData.values,
        sdkServices,
        sdkEnums
      );

      if (match.service && match.enumName) {
        if (!staticMapping[module]) {
          staticMapping[module] = {};
        }

        staticMapping[module][enumName] = {
          cdk_path: enumData.path,
          sdk_service: match.service,
          sdk_enum_name: match.enumName,
          match_percentage: match.matchPercentage
        };
      } else {
        if (!unmatchedEnums[module]) {
          unmatchedEnums[module] = {};
        }
        unmatchedEnums[module][enumName] = {
          cdk_path: enumData.path
        };
      }
    }
  }

  // Create temporary files
  const staticMappingTmp = tmp.fileSync({ postfix: '.json' });
  const unmatchedEnumsTmp = tmp.fileSync({ postfix: '.json' });

  // Write to temporary files
  fs.writeFileSync(staticMappingTmp.name, JSON.stringify(staticMapping, null, 2));
  fs.writeFileSync(unmatchedEnumsTmp.name, JSON.stringify(unmatchedEnums, null, 2));

  fs.writeFileSync(`lib/${STATIC_MAPPING_FILE_NAME}`, JSON.stringify(staticMapping, null, 2));
  fs.writeFileSync('lib/unmatched-enums.json', JSON.stringify(unmatchedEnums, null, 2));

  console.log(`Total matched enums: ${Object.values(staticMapping).reduce((sum, moduleEnums) => 
    sum + Object.keys(moduleEnums).length, 0)}`);
}

/**
 * Entry point method for executing the enum update process.
 */
export async function entryMethod(): Promise<void> {
  try {
    const cfnLintDownload = await downloadAwsSdkModels(CFN_LINT_URL);
    const downloadedCdkEnumsPath = await downloadGithubRawFile(ENUMS_URL);
    const downloadedCdkEnumsLikePath = await downloadGithubRawFile(ENUM_LIKE_CLASSES_URL);

    if (!cfnLintDownload.path || !downloadedCdkEnumsPath.path || !downloadedCdkEnumsLikePath.path) {
      console.error("Error: Missing required files.");
      return;
    }

    console.log("CDK enums downloaded successfully.");
    await processCdkEnums(downloadedCdkEnumsPath.path, downloadedCdkEnumsLikePath.path);
    
    console.log("CFN Lint Schema downloaded successfully.");
    await parseAwsSdkEnums(cfnLintDownload.path);

    // Read the files
    const cdkEnums: CdkEnums = JSON.parse(fs.readFileSync(CDK_ENUMS, 'utf8'));
    const sdkEnums: SdkEnums = JSON.parse(fs.readFileSync(SDK_ENUMS, 'utf8'));
    const manualMappings: Record<string, string[]> = JSON.parse(fs.readFileSync(MODULE_MAPPING, 'utf8'));

    // Generate and save static mapping
    await generateAndSaveStaticMapping(cdkEnums, sdkEnums, manualMappings);

    console.log("Static mapping and missing values analysis completed.");

  } catch (error) {
    console.error('Error in enum update process:', error);
    throw error;
  }
}
