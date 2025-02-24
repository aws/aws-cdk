import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as tmp from 'tmp';
import * as extract from 'extract-zip';

const LOCAL_DIR = process.cwd();
const ENUMS_URL = "https://raw.githubusercontent.com/aws/aws-cdk/main/packages/aws-cdk-lib/core/lib/analytics-data-source/enums/module-enums.json";
const ENUM_LIKE_CLASSES_URL = "https://raw.githubusercontent.com/aws/aws-cdk/main/packages/aws-cdk-lib/core/lib/analytics-data-source/enums/module-enumlikes.json";
const AWS_SDK_MODELS_URL = "https://github.com/awslabs/aws-sdk-rust/archive/refs/heads/main.zip";
const MODULE_MAPPING = path.join(LOCAL_DIR, "./lib/module_mapping.json");
const STATIC_MAPPING = path.join(LOCAL_DIR, "static-enum-mapping.json");
// const SDK_ENUMS = path.join(LOCAL_DIR, "sdk_enums.json");

// Set up cleanup handlers for process termination
tmp.setGracefulCleanup();

interface DownloadResult {
  path: string | null;
  cleanup: () => Promise<void>;
}

interface SdkEnums {
  [service: string]: {
    [enumName: string]: (string | number)[];
  };
}

  interface Shape {
    type: string;
    members?: {
      [key: string]: {
        traits?: {
          'smithy.api#enumValue'?: string | number;
          [key: string]: any;
        };
        [key: string]: any;
      };
    };
  }

  interface ParseResult {
    path: string;
    cleanup: () => Promise<void>;
  }

interface EnumValue {
  path: string;
  values: (string | number)[];
}

interface CdkEnums {
  [module: string]: {
    [enumName: string]: EnumValue;
  };
}

interface ProcessResult {
  path: string;
  cleanup: () => Promise<void>;
}

interface MatchResult {
  service: string | null;
  enumName: string | null;
  matchPercentage: number;
}

interface StaticMappingEntry {
  cdk_path: string;
  sdk_service: string;
  sdk_path: string;
  sdk_enum_name: string;
  match_percentage: number;
}

interface StaticMapping {
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

interface MissingValuesEntry {
  cdk_path: string;
  missing_values: (string | number)[];
}

interface MissingValues {
  [module: string]: {
    [enumName: string]: MissingValuesEntry;
  };
}

interface FormatPattern {
  separator: '-' | '.' | '_' | '';
  prefix?: string;
  casing: 'UPPER' | 'LOWER' | 'PASCAL' | 'CAMEL' | 'MIXED';
  wordSeparator: boolean;
  mlInstanceFormat?: boolean;
}

async function downloadGithubRawFile(url: string): Promise<DownloadResult> {
  const makeRequest = async (retryCount: number = 0): Promise<DownloadResult> => {
    try {
      const response = await axios.get(url);
      
      if (response.status === 200) {
        const tmpFile = tmp.fileSync({ keep: false });
        fs.writeFileSync(tmpFile.name, JSON.stringify(response.data));
        console.log(`File downloaded to temporary location: ${tmpFile.name}`);
        
        return {
          path: tmpFile.name,
          cleanup: async () => tmpFile.removeCallback()
        };
      }
      
      console.log(`Failed to download the file. Status code: ${response.status}`);
      
      if (retryCount < 1) {
        console.log('Retrying download...');
        return makeRequest(retryCount + 1);
      }
      
      return {
        path: null,
        cleanup: async () => {}
      };
      
    } catch (error) {
      console.error('Error downloading file:', error);
      
      if (retryCount < 1) {
        console.log('Retrying download...');
        return makeRequest(retryCount + 1);
      }
      
      return {
        path: null,
        cleanup: async () => {}
      };
    }
  };

  // Set up cleanup handler for process termination
  tmp.setGracefulCleanup();
  
  return makeRequest();
}

  async function downloadAwsSdkModels(url: string): Promise<DownloadResult> {
    console.log("Downloading repository ZIP file...");
  
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });

      if (response.status === 200) {
        console.log("Download successful.");

        // Create temporary directory for extraction
        const tmpDir = tmp.dirSync({ unsafeCleanup: true });
        const zipFile = tmp.fileSync({ postfix: '.zip' });

        // Write the zip content to temporary file
        fs.writeFileSync(zipFile.name, response.data);

        // Create temporary directory for aws-models
        const modelsDir = tmp.dirSync({ unsafeCleanup: true });

        console.log("Extracting the zip file...");
      
        // Extract zip to temporary directory
        await extract(zipFile.name, { dir: tmpDir.name });

        // Copy only aws-models directory to its final location
        const sourceDir = path.join(tmpDir.name, 'aws-sdk-rust-main', 'aws-models');
        fs.cpSync(sourceDir, modelsDir.name, { recursive: true });

        console.log(`aws-models folder extracted to temporary directory: ${modelsDir.name}`);

        // Create cleanup function
        const cleanup = async () => {
          zipFile.removeCallback();
          tmpDir.removeCallback();
          modelsDir.removeCallback();
        };

        return {
          path: modelsDir.name,
          cleanup
        };

      } else {
        console.log(`Failed to download the repository. Status code: ${response.status}`);
        return {
          path: null,
          cleanup: async () => {} // Empty cleanup for failed attempt
        };
      }

    } catch (error) {
      console.error('Error downloading or extracting repository:', error);
      return {
        path: null,
        cleanup: async () => {} // Empty cleanup for failed attempt
      };
    }
  }

  async function parseAwsSdkEnums(sdkModelsPath: string): Promise<ParseResult> {
    const sdk_enums: SdkEnums = {};
  
    try {
      const files = fs.readdirSync(sdkModelsPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      for (const file of jsonFiles) {
        try {
          const fileContent = fs.readFileSync(path.join(sdkModelsPath, file), 'utf8');
          const jsonData = JSON.parse(fileContent);

          if ("shapes" in jsonData) {
            for (const [shapeName, shape] of Object.entries(jsonData.shapes)) {
              if (!shape || typeof shape !== 'object') continue;

              const typedShape = shape as Shape;
              if (typedShape.type !== 'enum' || !typedShape.members) continue;

              try {
                const serviceName = shapeName.split('.')[2].split('#')[0];
                const enumName = shapeName.split('#')[1];

                if (!serviceName || !enumName) {
                  console.warn(`Warning: Invalid shape name format: ${shapeName}`);
                  continue;
                }

                const enumValues = Object.entries(typedShape.members)
                  .filter(([_, memberData]) => 
                    memberData.traits && 
                    'smithy.api#enumValue' in memberData.traits &&
                    memberData.traits['smithy.api#enumValue'] !== undefined)
                  .map(([_, memberData]) => memberData.traits!['smithy.api#enumValue']!);

                if (enumValues.length) {
                  if (!sdk_enums[serviceName]) {
                    sdk_enums[serviceName] = {};
                  }
                  if (!sdk_enums[serviceName][enumName]) {
                    sdk_enums[serviceName][enumName] = enumValues;
                  }
                }
              } catch (error) {
                console.warn(`Warning: Error processing shape ${shapeName}:`, error);
                continue;
              }
            }
          }
        } catch (error) {
          console.warn(`Warning: Error processing file ${file}:`, error);
          continue;
        }
      }

      const tmpFile = tmp.fileSync({ postfix: '.json' });
      fs.writeFileSync(tmpFile.name, JSON.stringify(sdk_enums, null, 2));

      // ===== BEGIN LOCAL FILE WRITING =====
      // TODO: Remove this section after testing
      fs.writeFileSync('sdk_enums.json', JSON.stringify(sdk_enums, null, 2));
      console.log('Wrote SDK enums to sdk_enums.json');
      // ===== END LOCAL FILE WRITING =====

      return {
        path: tmpFile.name,
        cleanup: async () => {
          tmpFile.removeCallback();
        }
      };

    } catch (error) {
      console.error('Error parsing SDK enums:', error);
      throw error;
    }
  }


function extractModuleName(path: string): string | null {
  try {
    const moduleName = path.split("/")[2];
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

async function processCdkEnums(inputFilePaths: string[]): Promise<ProcessResult> {
  const processedData: CdkEnums = {};
  let totalEnums = 0;

  try {
    for (const filePath of inputFilePaths) {
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
            values: values
          };
          totalEnums++;
        }
      }
    }

    // Create temporary file
    const tmpFile = tmp.fileSync({ postfix: '.json' });
    fs.writeFileSync(tmpFile.name, JSON.stringify(processedData, null, 2));

    // TODO: Remove this local file writing when no longer needed
    fs.writeFileSync('parsed_cdk_enums.json', JSON.stringify(processedData, null, 2));
    console.log('Wrote CDK enums to parsed_cdk_enums.json');
    console.log(`Total CDK enums parsed: ${totalEnums}`);

    return {
      path: tmpFile.name,
      cleanup: async () => {
        tmpFile.removeCallback();
      }
    };

  } catch (error) {
    console.error('Error processing CDK enums:', error);
    throw error;
  }
}

function normalizeValue(value: string | number): string {
  const strValue = String(value);
  if (strValue.match(/^\d+$/)) {
    return strValue;
  }
  return strValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function normalizeEnumValues(values: (string | number)[]): Set<string> {
  return new Set(values.map(normalizeValue));
}

function normalizeForSubstringMatch(value: string): string {
  return value.replace(/^aws-?/i, '')
              .replace(/-?type$/i, '')
              .toLowerCase();
}

function calculateValueMatchPercentage(cdkValues: Set<string>, sdkValues: Set<string>): number {
  if (cdkValues.size === 0) return 0;
  const matchingValues = new Set([...cdkValues].filter(x => sdkValues.has(x)));
  return matchingValues.size / cdkValues.size;
}

function areStringsRelated(str1: string, str2: string): boolean {
  const norm1 = normalizeForSubstringMatch(str1);
  const norm2 = normalizeForSubstringMatch(str2);
  return norm1.includes(norm2) || norm2.includes(norm1);
}

function findMatchingEnum(
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

      // Try substring/related name match
      if (areStringsRelated(cdkEnumName, sdkEnumName)) {
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
  }

  return bestMatch;
}

function isValidMatch(cdkValues: Set<string>, sdkValues: Set<string>): boolean {
  // Check if all CDK values are present in SDK values
  const isSubset = [...cdkValues].every(value => sdkValues.has(value));
  const matchPercentage = calculateValueMatchPercentage(cdkValues, sdkValues);
  return isSubset && matchPercentage >= 0.5;
}

async function generateAndSaveStaticMapping(
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
          sdk_path: `clients/client-${match.service}/models/index.ts`,
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

  // TODO: Remove these local file writes after testing
  fs.writeFileSync('static-enum-mapping.json', JSON.stringify(staticMapping, null, 2));
  fs.writeFileSync('unmatched-enums.json', JSON.stringify(unmatchedEnums, null, 2));

  console.log(`Total matched enums: ${Object.values(staticMapping).reduce((sum, moduleEnums) => 
    sum + Object.keys(moduleEnums).length, 0)}`);
}

export async function saveStaticMapping(
  cdkEnums: CdkEnums,
  sdkEnums: SdkEnums,
  manualMappings: Record<string, string[]>
): Promise<void> {
  try {
    await generateAndSaveStaticMapping(cdkEnums, sdkEnums, manualMappings);
  } catch (error) {
    console.error('Error generating static mapping:', error);
    throw error;
  }
}

function detectFormatPattern(enumValues: (string | number)[]): FormatPattern {
  const stringValues = enumValues.map(v => String(v));
  
  const mlInstanceFormat = stringValues.some(v => 
    v.startsWith('ml.') || v.match(/^[A-Z]+_(?:LARGE|MEDIUM|SMALL|XLARGE)/)
  );
  
  const separatorCounts = {
    '-': stringValues.filter(v => v.includes('-')).length,
    '.': stringValues.filter(v => !v.startsWith('ml.') && v.includes('.')).length,
    '_': stringValues.filter(v => v.includes('_')).length
  };
  
  const separator = (Object.entries(separatorCounts)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0] || '') as '-' | '.' | '_' | '';

  const prefix = mlInstanceFormat ? 'ml.' : stringValues[0]?.match(/^[^a-zA-Z0-9]+/)?.[0] || '';
  const casing = detectCasing(stringValues);
  const wordSeparator = stringValues.some(v => 
    v.match(/[A-Z][a-z]/) || v.includes('-') || v.includes('_') || v.includes('.')
  );

  return { separator, prefix, casing, wordSeparator, mlInstanceFormat };
}

function detectCasing(values: string[]): 'UPPER' | 'LOWER' | 'PASCAL' | 'CAMEL' | 'MIXED' {
  const patterns = values.map(v => {
    if (v === v.toUpperCase()) return 'UPPER';
    if (v === v.toLowerCase()) return 'LOWER';
    if (v.match(/^[A-Z][a-z0-9]+([A-Z][a-z0-9]+)*$/)) return 'PASCAL';
    if (v.match(/^[a-z0-9]+([A-Z][a-z0-9]+)*$/)) return 'CAMEL';
    return 'MIXED';
  });
  
  const mostCommon = patterns.reduce((a, b) => 
    patterns.filter(v => v === a).length >= patterns.filter(v => v === b).length ? a : b
  );
  return mostCommon as 'UPPER' | 'LOWER' | 'PASCAL' | 'CAMEL' | 'MIXED';
}

function formatToMatchPattern(value: string, pattern: FormatPattern): string {
  let formatted = value;

  if (pattern.mlInstanceFormat) {
    if (formatted.startsWith('ml.')) {
      formatted = formatted
        .substring(3)
        .split('.')
        .map(part => part.toUpperCase())
        .join('_');
    } else {
      formatted = 'ml.' + formatted
        .split('_')
        .map(part => part.toLowerCase())
        .join('.');
    }
    return formatted;
  }

  // Handle prefix
  if (pattern.prefix && !formatted.startsWith(pattern.prefix)) {
    formatted = pattern.prefix + formatted;
  }

  const normalized = formatted
    .replace(/[:_.-]/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  switch (pattern.casing) {
    case 'UPPER':
      formatted = normalized.join(pattern.separator).toUpperCase();
      break;
    case 'LOWER':
      formatted = normalized.join(pattern.separator).toLowerCase();
      break;
    case 'PASCAL':
      formatted = normalized
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(pattern.separator);
      break;
    case 'CAMEL':
      formatted = normalized
        .map((word, i) => i === 0 ? 
          word.toLowerCase() : 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(pattern.separator);
      break;
    default:
      formatted = normalized.join(pattern.separator);
  }

  return formatted;
}

function isValueMatch(cdkValue: string | number, sdkValue: string | number): boolean {
  const normalizedCdk = normalizeValue(cdkValue);
  const normalizedSdk = normalizeValue(sdkValue);
  
  // Direct match after normalization
  if (normalizedCdk === normalizedSdk) return true;
  
  // Substring match
  const substringCdk = normalizeForSubstringMatch(String(cdkValue));
  const substringSdk = normalizeForSubstringMatch(String(sdkValue));
  
  return substringCdk.includes(substringSdk) || substringSdk.includes(substringCdk);
}

async function findMissingValues(
  staticMapping: StaticMapping,
  cdkEnums: CdkEnums,
  sdkEnums: SdkEnums
): Promise<MissingValues> {
  const missingValues: MissingValues = {};

  for (const [module, enums] of Object.entries(staticMapping)) {
    for (const [enumName, mapping] of Object.entries(enums)) {
      const cdkValues = cdkEnums[module][enumName].values;
      const sdkValues = sdkEnums[mapping.sdk_service][mapping.sdk_enum_name];
      
      // Detect format pattern from CDK values for consistent output formatting
      const formatPattern = detectFormatPattern(cdkValues);
      
      // Find missing values using normalized comparison
      const missingFromCdk = sdkValues.filter(sdkValue => 
        !cdkValues.some(cdkValue => isValueMatch(cdkValue, sdkValue))
      );
      
      if (missingFromCdk.length > 0) {
        if (!missingValues[module]) {
          missingValues[module] = {};
        }

        // Format missing values to match CDK enum style
        const formattedMissingValues = missingFromCdk
          .map(value => formatToMatchPattern(String(value), formatPattern));

        missingValues[module][enumName] = {
          cdk_path: cdkEnums[module][enumName].path,
          missing_values: formattedMissingValues
        };
      }
    }
  }

  return missingValues;
}

async function saveMissingValues(
  staticMapping: StaticMapping,
  cdkEnums: CdkEnums,
  sdkEnums: SdkEnums
): Promise<string> {
  try {
    const missingValues = await findMissingValues(staticMapping, cdkEnums, sdkEnums);
    
    const tmpFile = tmp.fileSync({ postfix: '.json' });
    fs.writeFileSync(tmpFile.name, JSON.stringify(missingValues, null, 2));

    // TODO: Remove this local file writing when no longer needed
    fs.writeFileSync('missing-values.json', JSON.stringify(missingValues, null, 2));
    console.log('Wrote missing values to missing-values.json');

    return tmpFile.name;
  } catch (error) {
    console.error('Error saving missing values:', error);
    throw error;
  }
}

export async function analyzeMissingEnumValues(
  staticMappingPath: string,
  cdkEnumsPath: string,
  sdkEnumsPath: string
): Promise<void> {
  try {
    const staticMapping: StaticMapping = JSON.parse(fs.readFileSync(staticMappingPath, 'utf8'));
    const cdkEnums: CdkEnums = JSON.parse(fs.readFileSync(cdkEnumsPath, 'utf8'));
    const sdkEnums: SdkEnums = JSON.parse(fs.readFileSync(sdkEnumsPath, 'utf8'));

    await saveMissingValues(staticMapping, cdkEnums, sdkEnums);
    
    const totalMappings = Object.values(staticMapping)
      .reduce((sum, moduleEnums) => sum + Object.keys(moduleEnums).length, 0);
    
    console.log("\nAnalysis Statistics:");
    console.log(`Total mappings analyzed: ${totalMappings}`);
    console.log("Missing values analysis completed.");
    
  } catch (error) {
    console.error('Error analyzing missing enum values:', error);
    throw error;
  }
}


export async function entryMethod(): Promise<void> {
  try {
      const sdkDownload = await downloadAwsSdkModels(AWS_SDK_MODELS_URL);
      const downloadedCdkEnumsPath = await downloadGithubRawFile(ENUMS_URL);
      const downloadedCdkEnumsLikePath = await downloadGithubRawFile(ENUM_LIKE_CLASSES_URL);

      if (downloadedCdkEnumsPath.path && downloadedCdkEnumsLikePath.path && sdkDownload.path) {
    //   if (downloadedCdkEnumsPath.path && downloadedCdkEnumsLikePath.path) {
          console.log("CDK enums downloaded successfully.");

          const cleanedCdkEnumsFilePath = await processCdkEnums([downloadedCdkEnumsPath.path, downloadedCdkEnumsLikePath.path]);

          console.log("SDK models downloaded successfully.");

          const sdkEnumsParsedPath = await parseAwsSdkEnums(sdkDownload.path);

          if (cleanedCdkEnumsFilePath.path && sdkEnumsParsedPath.path) {
        //   if (cleanedCdkEnumsFilePath.path) {
              // Read the files
              const cdkEnums: CdkEnums = JSON.parse(
                fs.readFileSync(cleanedCdkEnumsFilePath.path, 'utf8')
              );
              
              const sdkEnums: SdkEnums = JSON.parse(
                fs.readFileSync(sdkEnumsParsedPath.path, 'utf8')
                // fs.readFileSync(SDK_ENUMS, 'utf8')
              );
              
              const manualMappings: Record<string, string[]> = JSON.parse(
                fs.readFileSync(MODULE_MAPPING, 'utf8')
              );
              
              // Generate and save static mapping
              await saveStaticMapping(cdkEnums, sdkEnums, manualMappings);

              // Analyze missing values
              await analyzeMissingEnumValues(STATIC_MAPPING, cleanedCdkEnumsFilePath.path, sdkEnumsParsedPath.path);
            //   await analyzeMissingEnumValues(STATIC_MAPPING, cleanedCdkEnumsFilePath.path, SDK_ENUMS);

              // TODO TODO TODO TODO TODO FUCK FUCK FUCK
              // try removing the format pattern matching cuz it sucks and there are like 0 missing values....
          }
      }


        

    console.log("Static mapping and missing values analysis completed.");
    
  } catch (error) {
    console.error('Error in enum update process:', error);
    throw error;
  }
}
