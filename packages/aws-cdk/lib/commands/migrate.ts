/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';
import * as path from 'path';
import type { ForReading } from '@aws-cdk/cli-plugin-contract';
import { Environment, UNKNOWN_ACCOUNT, UNKNOWN_REGION } from '@aws-cdk/cx-api';
import type {
  DescribeGeneratedTemplateCommandOutput,
  DescribeResourceScanCommandOutput,
  GetGeneratedTemplateCommandOutput,
  ListResourceScanResourcesCommandInput,
  ResourceDefinition,
  ResourceDetail,
  ResourceIdentifierSummary,
  ResourceScanSummary,
  ScannedResource,
  ScannedResourceIdentifier,
} from '@aws-sdk/client-cloudformation';
import * as cdk_from_cfn from 'cdk-from-cfn';
import * as chalk from 'chalk';
import { cliInit } from '../../lib/init';
import { print } from '../../lib/logging';
import type { ICloudFormationClient, SdkProvider } from '../api/aws-auth';
import { CloudFormationStack } from '../api/util/cloudformation';
import { zipDirectory } from '../util/archive';
const camelCase = require('camelcase');
const decamelize = require('decamelize');
/** The list of languages supported by the built-in noctilucent binary. */
export const MIGRATE_SUPPORTED_LANGUAGES: readonly string[] = cdk_from_cfn.supported_languages();

/**
 * Generates a CDK app from a yaml or json template.
 *
 * @param stackName The name to assign to the stack in the generated app
 * @param stack The yaml or json template for the stack
 * @param language The language to generate the CDK app in
 * @param outputPath The path at which to generate the CDK app
 */
export async function generateCdkApp(
  stackName: string,
  stack: string,
  language: string,
  outputPath?: string,
  compress?: boolean,
): Promise<void> {
  const resolvedOutputPath = path.join(outputPath ?? process.cwd(), stackName);
  const formattedStackName = decamelize(stackName);

  try {
    fs.rmSync(resolvedOutputPath, { recursive: true, force: true });
    fs.mkdirSync(resolvedOutputPath, { recursive: true });
    const generateOnly = compress;
    await cliInit({
      type: 'app',
      language,
      canUseNetwork: true,
      generateOnly,
      workDir: resolvedOutputPath,
      stackName,
      migrate: true,
    });

    let stackFileName: string;
    switch (language) {
      case 'typescript':
        stackFileName = `${resolvedOutputPath}/lib/${formattedStackName}-stack.ts`;
        break;
      case 'java':
        stackFileName = `${resolvedOutputPath}/src/main/java/com/myorg/${camelCase(formattedStackName, { pascalCase: true })}Stack.java`;
        break;
      case 'python':
        stackFileName = `${resolvedOutputPath}/${formattedStackName.replace(/-/g, '_')}/${formattedStackName.replace(/-/g, '_')}_stack.py`;
        break;
      case 'csharp':
        stackFileName = `${resolvedOutputPath}/src/${camelCase(formattedStackName, { pascalCase: true })}/${camelCase(formattedStackName, { pascalCase: true })}Stack.cs`;
        break;
      case 'go':
        stackFileName = `${resolvedOutputPath}/${formattedStackName}.go`;
        break;
      default:
        throw new Error(
          `${language} is not supported by CDK Migrate. Please choose from: ${MIGRATE_SUPPORTED_LANGUAGES.join(', ')}`,
        );
    }
    fs.writeFileSync(stackFileName, stack);
    if (compress) {
      await zipDirectory(resolvedOutputPath, `${resolvedOutputPath}.zip`);
      fs.rmSync(resolvedOutputPath, { recursive: true, force: true });
    }
  } catch (error) {
    fs.rmSync(resolvedOutputPath, { recursive: true, force: true });
    throw error;
  }
}

/**
 * Generates a CDK stack file.
 * @param template The template to translate into a CDK stack
 * @param stackName The name to assign to the stack
 * @param language The language to generate the stack in
 * @returns A string representation of a CDK stack file
 */
export function generateStack(template: string, stackName: string, language: string) {
  const formattedStackName = `${camelCase(decamelize(stackName), { pascalCase: true })}Stack`;
  try {
    return cdk_from_cfn.transmute(template, language, formattedStackName);
  } catch (e) {
    throw new Error(`${formattedStackName} could not be generated because ${(e as Error).message}`);
  }
}

/**
 * Reads and returns a stack template from a local path.
 *
 * @param inputPath The location of the template
 * @returns A string representation of the template if present, otherwise undefined
 */
export function readFromPath(inputPath: string): string {
  let readFile: string;
  try {
    readFile = fs.readFileSync(inputPath, 'utf8');
  } catch (e) {
    throw new Error(`'${inputPath}' is not a valid path.`);
  }
  if (readFile == '') {
    throw new Error(`Cloudformation template filepath: '${inputPath}' is an empty file.`);
  }
  return readFile;
}

/**
 * Reads and returns a stack template from a deployed CloudFormation stack.
 *
 * @param stackName The name of the stack
 * @param sdkProvider The sdk provider for making CloudFormation calls
 * @param environment The account and region where the stack is deployed
 * @returns A string representation of the template if present, otherwise undefined
 */
export async function readFromStack(
  stackName: string,
  sdkProvider: SdkProvider,
  environment: Environment,
): Promise<string | undefined> {
  const cloudFormation = (await sdkProvider.forEnvironment(environment, 0 satisfies ForReading)).sdk.cloudFormation();

  const stack = await CloudFormationStack.lookup(cloudFormation, stackName, true);
  if (stack.stackStatus.isDeploySuccess || stack.stackStatus.isRollbackSuccess) {
    return JSON.stringify(await stack.template());
  } else {
    throw new Error(
      `Stack '${stackName}' in account ${environment.account} and region ${environment.region} has a status of '${stack.stackStatus.name}' due to '${stack.stackStatus.reason}'. The stack cannot be migrated until it is in a healthy state.`,
    );
  }
}

/**
 * Takes in a stack name and account and region and returns a generated cloudformation template using the cloudformation
 * template generator.
 *
 * @param GenerateTemplateOptions An object containing the stack name, filters, sdkProvider, environment, and newScan flag
 * @returns a generated cloudformation template
 */
export async function generateTemplate(options: GenerateTemplateOptions): Promise<GenerateTemplateOutput> {
  const cfn = new CfnTemplateGeneratorProvider(await buildCfnClient(options.sdkProvider, options.environment));

  const scanId = await findLastSuccessfulScan(cfn, options);

  // if a customer accidentally ctrl-c's out of the command and runs it again, this will continue the progress bar where it left off
  const curScan = await cfn.describeResourceScan(scanId);
  if (curScan.Status == ScanStatus.IN_PROGRESS) {
    print('Resource scan in progress. Please wait, this can take 10 minutes or longer.');
    await scanProgressBar(scanId, cfn);
  }

  displayTimeDiff(new Date(), new Date(curScan.StartTime!));

  let resources: ScannedResource[] = await cfn.listResourceScanResources(scanId!, options.filters);

  print('finding related resources.');
  let relatedResources = await cfn.getResourceScanRelatedResources(scanId!, resources);

  print(`Found ${relatedResources.length} resources.`);

  print('Generating CFN template from scanned resources.');
  const templateArn = (await cfn.createGeneratedTemplate(options.stackName, relatedResources)).GeneratedTemplateId!;

  let generatedTemplate = await cfn.describeGeneratedTemplate(templateArn);

  print('Please wait, template creation in progress. This may take a couple minutes.');
  while (generatedTemplate.Status !== ScanStatus.COMPLETE && generatedTemplate.Status !== ScanStatus.FAILED) {
    await printDots(`[${generatedTemplate.Status}] Template Creation in Progress`, 400);
    generatedTemplate = await cfn.describeGeneratedTemplate(templateArn);
  }
  print('');
  print('Template successfully generated!');
  return buildGenertedTemplateOutput(
    generatedTemplate,
    (await cfn.getGeneratedTemplate(templateArn)).TemplateBody!,
    templateArn,
  );
}

async function findLastSuccessfulScan(
  cfn: CfnTemplateGeneratorProvider,
  options: GenerateTemplateOptions,
): Promise<string> {
  let resourceScanSummaries: ResourceScanSummary[] | undefined = [];
  const clientRequestToken = `cdk-migrate-${options.environment.account}-${options.environment.region}`;
  if (options.fromScan === FromScan.NEW) {
    print(`Starting new scan for account ${options.environment.account} in region ${options.environment.region}`);
    try {
      await cfn.startResourceScan(clientRequestToken);
      resourceScanSummaries = (await cfn.listResourceScans()).ResourceScanSummaries;
    } catch (e) {
      // continuing here because if the scan fails on a new-scan it is very likely because there is either already a scan in progress
      // or the customer hit a rate limit. In either case we want to continue with the most recent scan.
      // If this happens to fail for a credential error then that will be caught immediately after anyway.
      print(`Scan failed to start due to error '${(e as Error).message}', defaulting to latest scan.`);
    }
  } else {
    resourceScanSummaries = (await cfn.listResourceScans()).ResourceScanSummaries;
    await cfn.checkForResourceScan(resourceScanSummaries, options, clientRequestToken);
  }
  // get the latest scan, which we know will exist
  resourceScanSummaries = (await cfn.listResourceScans()).ResourceScanSummaries;
  let scanId: string | undefined = resourceScanSummaries![0].ResourceScanId;

  // find the most recent scan that isn't in a failed state in case we didn't start a new one
  for (const summary of resourceScanSummaries!) {
    if (summary.Status !== ScanStatus.FAILED) {
      scanId = summary.ResourceScanId!;
      break;
    }
  }

  return scanId!;
}

/**
 * Takes a string of filters in the format of key1=value1,key2=value2 and returns a map of the filters.
 *
 * @param filters a string of filters in the format of key1=value1,key2=value2
 * @returns a map of the filters
 */
function parseFilters(filters: string): {
  [key in FilterType]: string | undefined;
} {
  if (!filters) {
    return {
      'resource-identifier': undefined,
      'resource-type-prefix': undefined,
      'tag-key': undefined,
      'tag-value': undefined,
    };
  }

  const filterShorthands: { [key: string]: FilterType } = {
    'identifier': FilterType.RESOURCE_IDENTIFIER,
    'id': FilterType.RESOURCE_IDENTIFIER,
    'type': FilterType.RESOURCE_TYPE_PREFIX,
    'type-prefix': FilterType.RESOURCE_TYPE_PREFIX,
  };

  const filterList = filters.split(',');

  let filterMap: { [key in FilterType]: string | undefined } = {
    [FilterType.RESOURCE_IDENTIFIER]: undefined,
    [FilterType.RESOURCE_TYPE_PREFIX]: undefined,
    [FilterType.TAG_KEY]: undefined,
    [FilterType.TAG_VALUE]: undefined,
  };

  for (const fil of filterList) {
    const filter = fil.split('=');
    let filterKey = filter[0];
    const filterValue = filter[1];
    // if the key is a shorthand, replace it with the full name
    if (filterKey in filterShorthands) {
      filterKey = filterShorthands[filterKey];
    }
    if (Object.values(FilterType).includes(filterKey as any)) {
      filterMap[filterKey as keyof typeof filterMap] = filterValue;
    } else {
      throw new Error(`Invalid filter: ${filterKey}`);
    }
  }
  return filterMap;
}

/**
 * Takes a list of any type and breaks it up into chunks of a specified size.
 *
 * @param list The list to break up
 * @param chunkSize The size of each chunk
 * @returns A list of lists of the specified size
 */
export function chunks(list: any[], chunkSize: number): any[][] {
  const chunkedList: any[][] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    chunkedList.push(list.slice(i, i + chunkSize));
  }
  return chunkedList;
}

/**
 * Sets the account and region for making CloudFormation calls.
 * @param account The account to use
 * @param region The region to use
 * @returns The environment object
 */
export function setEnvironment(account?: string, region?: string): Environment {
  return {
    account: account ?? UNKNOWN_ACCOUNT,
    region: region ?? UNKNOWN_REGION,
    name: 'cdk-migrate-env',
  };
}

/**
 * Enum for the source options for the template
 */
export enum TemplateSourceOptions {
  PATH = 'path',
  STACK = 'stack',
  SCAN = 'scan',
}

/**
 * An object representing the source of a template.
 */
type TemplateSource =
  | { source: TemplateSourceOptions.SCAN }
  | { source: TemplateSourceOptions.PATH; templatePath: string }
  | { source: TemplateSourceOptions.STACK; stackName: string };

/**
 * Enum for the status of a resource scan
 */
export enum ScanStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
}

export enum FilterType {
  RESOURCE_IDENTIFIER = 'resource-identifier',
  RESOURCE_TYPE_PREFIX = 'resource-type-prefix',
  TAG_KEY = 'tag-key',
  TAG_VALUE = 'tag-value',
}

/**
 * Validates that exactly one source option has been provided.
 * @param fromPath The content of the flag `--from-path`
 * @param fromStack the content of the flag `--from-stack`
 */
export function parseSourceOptions(fromPath?: string, fromStack?: boolean, stackName?: string): TemplateSource {
  if (fromPath && fromStack) {
    throw new Error('Only one of `--from-path` or `--from-stack` may be provided.');
  }
  if (!stackName) {
    throw new Error('`--stack-name` is a required field.');
  }
  if (!fromPath && !fromStack) {
    return { source: TemplateSourceOptions.SCAN };
  }
  if (fromPath) {
    return { source: TemplateSourceOptions.PATH, templatePath: fromPath };
  }
  return { source: TemplateSourceOptions.STACK, stackName: stackName! };
}

/**
 * Takes a set of resources and removes any with the managedbystack flag set to true.
 *
 * @param resourceList the list of resources provided by the list scanned resources calls
 * @returns a list of resources not managed by cfn stacks
 */
function excludeManaged(resourceList: ScannedResource[]): ScannedResourceIdentifier[] {
  return resourceList
    .filter((r) => !r.ManagedByStack)
    .map((r) => ({
      ResourceType: r.ResourceType!,
      ResourceIdentifier: r.ResourceIdentifier!,
    }));
}

/**
 * Transforms a list of resources into a list of resource identifiers by removing the ManagedByStack flag.
 * Setting the value of the field to undefined effectively removes it from the object.
 *
 * @param resourceList the list of resources provided by the list scanned resources calls
 * @returns a list of ScannedResourceIdentifier[]
 */
function resourceIdentifiers(resourceList: ScannedResource[]): ScannedResourceIdentifier[] {
  const identifiers: ScannedResourceIdentifier[] = [];
  resourceList.forEach((r) => {
    const identifier: ScannedResourceIdentifier = {
      ResourceType: r.ResourceType!,
      ResourceIdentifier: r.ResourceIdentifier!,
    };
    identifiers.push(identifier);
  });
  return identifiers;
}

/**
 * Takes a scan id and maintains a progress bar to display the progress of a scan to the user.
 *
 * @param scanId A string representing the scan id
 * @param cloudFormation The CloudFormation sdk client to use
 */
export async function scanProgressBar(scanId: string, cfn: CfnTemplateGeneratorProvider) {
  let curProgress = 0.5;
  // we know it's in progress initially since we wouldn't have gotten here if it wasn't
  let curScan: DescribeResourceScanCommandOutput = {
    Status: ScanStatus.IN_PROGRESS,
    $metadata: {},
  };
  while (curScan.Status == ScanStatus.IN_PROGRESS) {
    curScan = await cfn.describeResourceScan(scanId);
    curProgress = curScan.PercentageCompleted ?? curProgress;
    printBar(30, curProgress);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  print('');
  print('✅ Scan Complete!');
}

/**
 * Prints a progress bar to the console. To be used in a while loop to show progress of a long running task.
 * The progress bar deletes the current line on the console and rewrites it with the progress amount.
 *
 * @param width The width of the progress bar
 * @param progress The current progress to display as a percentage of 100
 */
export function printBar(width: number, progress: number) {
  if (!process.env.MIGRATE_INTEG_TEST) {
    const FULL_BLOCK = '█';
    const PARTIAL_BLOCK = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉'];
    const fraction = Math.min(progress / 100, 1);
    const innerWidth = Math.max(1, width - 2);
    const chars = innerWidth * fraction;
    const remainder = chars - Math.floor(chars);

    const fullChars = FULL_BLOCK.repeat(Math.floor(chars));
    const partialChar = PARTIAL_BLOCK[Math.floor(remainder * PARTIAL_BLOCK.length)];
    const filler = '·'.repeat(innerWidth - Math.floor(chars) - (partialChar ? 1 : 0));

    const color = chalk.green;

    rewriteLine('[' + color(fullChars + partialChar) + filler + `] (${progress}%)`);
  }
}

/**
 * Prints a message to the console with a series periods appended to it. To be used in a while loop to show progress of a long running task.
 * The message deletes the current line and rewrites it several times to display 1-3 periods to show the user that the task is still running.
 *
 * @param message The message to display
 * @param timeoutx4 The amount of time to wait before printing the next period
 */
export async function printDots(message: string, timeoutx4: number) {
  if (!process.env.MIGRATE_INTEG_TEST) {
    rewriteLine(message + ' .');
    await new Promise((resolve) => setTimeout(resolve, timeoutx4));

    rewriteLine(message + ' ..');
    await new Promise((resolve) => setTimeout(resolve, timeoutx4));

    rewriteLine(message + ' ...');
    await new Promise((resolve) => setTimeout(resolve, timeoutx4));

    rewriteLine(message);
    await new Promise((resolve) => setTimeout(resolve, timeoutx4));
  }
}

/**
 * Rewrites the current line on the console and writes a new message to it.
 * This is a helper funciton for printDots and printBar.
 *
 * @param message The message to display
 */
export function rewriteLine(message: string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(message);
}

/**
 * Prints the time difference between two dates in days, hours, and minutes.
 *
 * @param time1 The first date to compare
 * @param time2 The second date to compare
 */
export function displayTimeDiff(time1: Date, time2: Date): void {
  const diff = Math.abs(time1.getTime() - time2.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  print(`Using the latest successful scan which is ${days} days, ${hours} hours, and ${minutes} minutes old.`);
}

/**
 * Writes a migrate.json file to the output directory.
 *
 * @param outputPath The path to write the migrate.json file to
 * @param stackName The name of the stack
 * @param generatedOutput The output of the template generator
 */
export function writeMigrateJsonFile(
  outputPath: string | undefined,
  stackName: string,
  migrateJson: MigrateJsonFormat,
) {
  const outputToJson = {
    '//': 'This file is generated by cdk migrate. It will be automatically deleted after the first successful deployment of this app to the environment of the original resources.',
    'Source': migrateJson.source,
    'Resources': migrateJson.resources,
  };
  fs.writeFileSync(
    `${path.join(outputPath ?? process.cwd(), stackName)}/migrate.json`,
    JSON.stringify(outputToJson, null, 2),
  );
}

/**
 * Takes a string representing the from-scan flag and returns a FromScan enum value.
 *
 * @param scanType A string representing the from-scan flag
 * @returns A FromScan enum value
 */
export function getMigrateScanType(scanType: string) {
  switch (scanType) {
    case 'new':
      return FromScan.NEW;
    case 'most-recent':
      return FromScan.MOST_RECENT;
    case '':
      return FromScan.DEFAULT;
    case undefined:
      return FromScan.DEFAULT;
    default:
      throw new Error(`Unknown scan type: ${scanType}`);
  }
}

/**
 * Takes a generatedTemplateOutput objct and returns a boolean representing whether there are any warnings on any rescources.
 *
 * @param generatedTemplateOutput A GenerateTemplateOutput object
 * @returns A boolean representing whether there are any warnings on any rescources
 */
export function isThereAWarning(generatedTemplateOutput: GenerateTemplateOutput) {
  if (generatedTemplateOutput.resources) {
    for (const resource of generatedTemplateOutput.resources) {
      if (resource.Warnings && resource.Warnings.length > 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Builds the GenerateTemplateOutput object from the DescribeGeneratedTemplateOutput and the template body.
 *
 * @param generatedTemplateSummary The output of the describe generated template call
 * @param templateBody The body of the generated template
 * @returns A GenerateTemplateOutput object
 */
export function buildGenertedTemplateOutput(
  generatedTemplateSummary: DescribeGeneratedTemplateCommandOutput,
  templateBody: string,
  source: string,
): GenerateTemplateOutput {
  const resources: ResourceDetail[] | undefined = generatedTemplateSummary.Resources;
  const migrateJson: MigrateJsonFormat = {
    templateBody: templateBody,
    source: source,
    resources: generatedTemplateSummary.Resources!.map((r) => ({
      ResourceType: r.ResourceType!,
      LogicalResourceId: r.LogicalResourceId!,
      ResourceIdentifier: r.ResourceIdentifier!,
    })),
  };
  const templateId = generatedTemplateSummary.GeneratedTemplateId!;
  return {
    migrateJson: migrateJson,
    resources: resources,
    templateId: templateId,
  };
}

/**
 * Builds a CloudFormation sdk client for making requests with the CFN template generator.
 *
 * @param sdkProvider The sdk provider for making CloudFormation calls
 * @param environment The account and region where the stack is deployed
 * @returns A CloudFormation sdk client
 */
export async function buildCfnClient(sdkProvider: SdkProvider, environment: Environment) {
  const sdk = (await sdkProvider.forEnvironment(environment, 0 satisfies ForReading)).sdk;
  sdk.appendCustomUserAgent('cdk-migrate');
  return sdk.cloudFormation();
}

/**
 * Appends a list of warnings to a readme file.
 *
 * @param filepath The path to the readme file
 * @param resources A list of resources to append warnings for
 */
export function appendWarningsToReadme(filepath: string, resources: ResourceDetail[]) {
  const readme = fs.readFileSync(filepath, 'utf8');
  const lines = readme.split('\n');
  const index = lines.findIndex((line) => line.trim() === 'Enjoy!');
  let linesToAdd = ['\n## Warnings'];
  linesToAdd.push('### Write-only properties');
  linesToAdd.push(
    "Write-only properties are resource property values that can be written to but can't be read by AWS CloudFormation or CDK Migrate. For more information, see [IaC generator and write-only properties](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/generate-IaC-write-only-properties.html).",
  );
  linesToAdd.push('\n');
  linesToAdd.push(
    'Write-only properties discovered during migration are organized here by resource ID and categorized by write-only property type. Resolve write-only properties by providing property values in your CDK app. For guidance, see [Resolve write-only properties](https://docs.aws.amazon.com/cdk/v2/guide/migrate.html#migrate-resources-writeonly).',
  );
  for (const resource of resources) {
    if (resource.Warnings && resource.Warnings.length > 0) {
      linesToAdd.push(`### ${resource.LogicalResourceId}`);
      for (const warning of resource.Warnings) {
        linesToAdd.push(`- **${warning.Type}**: `);
        for (const property of warning.Properties!) {
          linesToAdd.push(`  - ${property.PropertyPath}: ${property.Description}`);
        }
      }
    }
  }
  lines.splice(index, 0, ...linesToAdd);
  fs.writeFileSync(filepath, lines.join('\n'));
}

/**
 * takes a list of resources and returns a list of unique resources based on the resource type and logical resource id.
 *
 * @param resources A list of resources to deduplicate
 * @returns A list of unique resources
 */
function deduplicateResources(resources: ResourceDetail[]) {
  let uniqueResources: { [key: string]: ResourceDetail } = {};

  for (const resource of resources) {
    const key = Object.keys(resource.ResourceIdentifier!)[0];

    // Creating our unique identifier using the resource type, the key, and the value of the resource identifier
    // The resource identifier is a combination of a key value pair defined by a resource's schema, and the resource type of the resource.
    const uniqueIdentifer = `${resource.ResourceType}:${key}:${resource.ResourceIdentifier![key]}`;
    uniqueResources[uniqueIdentifer] = resource;
  }

  return Object.values(uniqueResources);
}

/**
 * Class for making CloudFormation template generator calls
 */
export class CfnTemplateGeneratorProvider {
  private cfn: ICloudFormationClient;
  constructor(cfn: ICloudFormationClient) {
    this.cfn = cfn;
  }

  async checkForResourceScan(
    resourceScanSummaries: ResourceScanSummary[] | undefined,
    options: GenerateTemplateOptions,
    clientRequestToken: string,
  ) {
    if (!resourceScanSummaries || resourceScanSummaries.length === 0) {
      if (options.fromScan === FromScan.MOST_RECENT) {
        throw new Error(
          'No scans found. Please either start a new scan with the `--from-scan` new or do not specify a `--from-scan` option.',
        );
      } else {
        print('No scans found. Initiating a new resource scan.');
        await this.startResourceScan(clientRequestToken);
      }
    }
  }

  /**
   * Retrieves a tokenized list of resources and their associated scan. If a token is present the function
   * will loop through all pages and combine them into a single list of ScannedRelatedResources
   *
   * @param scanId scan id for the to list resources for
   * @param resources A list of resources to find related resources for
   */
  async getResourceScanRelatedResources(
    scanId: string,
    resources: ScannedResource[],
  ): Promise<ScannedResourceIdentifier[]> {
    let relatedResourceList = resources;

    // break the list of resources into chunks of 100 to avoid hitting the 100 resource limit
    for (const chunk of chunks(resources, 100)) {
      // get the first page of related resources
      const res = await this.cfn.listResourceScanRelatedResources({
        ResourceScanId: scanId,
        Resources: chunk,
      });

      // add the first page to the list
      relatedResourceList.push(...(res.RelatedResources ?? []));
      let nextToken = res.NextToken;

      // if there are more pages, cycle through them and add them to the list before moving on to the next chunk
      while (nextToken) {
        const nextRelatedResources = await this.cfn.listResourceScanRelatedResources({
          ResourceScanId: scanId,
          Resources: resourceIdentifiers(resources),
          NextToken: nextToken,
        });
        nextToken = nextRelatedResources.NextToken;
        relatedResourceList.push(...(nextRelatedResources.RelatedResources ?? []));
      }
    }

    relatedResourceList = deduplicateResources(relatedResourceList);

    // prune the managedbystack flag off of them again.
    return process.env.MIGRATE_INTEG_TEST
      ? resourceIdentifiers(relatedResourceList)
      : resourceIdentifiers(excludeManaged(relatedResourceList));
  }

  /**
   * Kicks off a scan of a customers account, returning the scan id. A scan can take
   * 10 minutes or longer to complete. However this will return a scan id as soon as
   * the scan has begun.
   *
   * @returns A string representing the scan id
   */
  async startResourceScan(requestToken: string) {
    return (
      await this.cfn.startResourceScan({
        ClientRequestToken: requestToken,
      })
    ).ResourceScanId;
  }

  /**
   * Gets the most recent scans a customer has completed
   *
   * @returns a list of resource scan summaries
   */
  async listResourceScans() {
    return this.cfn.listResourceScans();
  }

  /**
   * Retrieves a tokenized list of resources from a resource scan. If a token is present, this function
   * will loop through all pages and combine them into a single list of ScannedResource[].
   * Additionally will apply any filters provided by the customer.
   *
   * @param scanId scan id for the to list resources for
   * @param filters a string of filters in the format of key1=value1,key2=value2
   * @returns a combined list of all resources from the scan
   */
  async listResourceScanResources(scanId: string, filters: string[] = []): Promise<ScannedResourceIdentifier[]> {
    let resourceList: ScannedResource[] = [];
    let resourceScanInputs: ListResourceScanResourcesCommandInput;

    if (filters.length > 0) {
      print('Applying filters to resource scan.');
      for (const filter of filters) {
        const filterList = parseFilters(filter);
        resourceScanInputs = {
          ResourceScanId: scanId,
          ResourceIdentifier: filterList[FilterType.RESOURCE_IDENTIFIER],
          ResourceTypePrefix: filterList[FilterType.RESOURCE_TYPE_PREFIX],
          TagKey: filterList[FilterType.TAG_KEY],
          TagValue: filterList[FilterType.TAG_VALUE],
        };
        const resources = await this.cfn.listResourceScanResources(resourceScanInputs);
        resourceList = resourceList.concat(resources.Resources ?? []);
        let nextToken = resources.NextToken;

        // cycle through the pages adding all resources to the list until we run out of pages
        while (nextToken) {
          resourceScanInputs.NextToken = nextToken;
          const nextResources = await this.cfn.listResourceScanResources(resourceScanInputs);
          nextToken = nextResources.NextToken;
          resourceList = resourceList!.concat(nextResources.Resources ?? []);
        }
      }
    } else {
      print('No filters provided. Retrieving all resources from scan.');
      resourceScanInputs = {
        ResourceScanId: scanId,
      };
      const resources = await this.cfn.listResourceScanResources(resourceScanInputs);
      resourceList = resourceList!.concat(resources.Resources ?? []);
      let nextToken = resources.NextToken;

      // cycle through the pages adding all resources to the list until we run out of pages
      while (nextToken) {
        resourceScanInputs.NextToken = nextToken;
        const nextResources = await this.cfn.listResourceScanResources(resourceScanInputs);
        nextToken = nextResources.NextToken;
        resourceList = resourceList!.concat(nextResources.Resources ?? []);
      }
    }
    if (resourceList.length === 0) {
      throw new Error(`No resources found with filters ${filters.join(' ')}. Please try again with different filters.`);
    }
    resourceList = deduplicateResources(resourceList);

    return process.env.MIGRATE_INTEG_TEST
      ? resourceIdentifiers(resourceList)
      : resourceIdentifiers(excludeManaged(resourceList));
  }

  /**
   * Retrieves information about a resource scan.
   *
   * @param scanId scan id for the to list resources for
   * @returns information about the scan
   */
  async describeResourceScan(scanId: string): Promise<DescribeResourceScanCommandOutput> {
    return this.cfn.describeResourceScan({
      ResourceScanId: scanId,
    });
  }

  /**
   * Describes the current status of the template being generated.
   *
   * @param templateId A string representing the template id
   * @returns DescribeGeneratedTemplateOutput an object containing the template status and results
   */
  async describeGeneratedTemplate(templateId: string): Promise<DescribeGeneratedTemplateCommandOutput> {
    const generatedTemplate = await this.cfn.describeGeneratedTemplate({
      GeneratedTemplateName: templateId,
    });

    if (generatedTemplate.Status == ScanStatus.FAILED) {
      throw new Error(generatedTemplate.StatusReason);
    }

    return generatedTemplate;
  }

  /**
   * Retrieves a completed generated cloudformation template from the template generator.
   *
   * @param templateId A string representing the template id
   * @param cloudFormation The CloudFormation sdk client to use
   * @returns DescribeGeneratedTemplateOutput an object containing the template status and body
   */
  async getGeneratedTemplate(templateId: string): Promise<GetGeneratedTemplateCommandOutput> {
    return this.cfn.getGeneratedTemplate({
      GeneratedTemplateName: templateId,
    });
  }

  /**
   * Kicks off a template generation for a set of resources.
   *
   * @param stackName The name of the stack
   * @param resources A list of resources to generate the template from
   * @returns CreateGeneratedTemplateOutput an object containing the template arn to query on later
   */
  async createGeneratedTemplate(stackName: string, resources: ResourceDefinition[]) {
    const createTemplateOutput = await this.cfn.createGeneratedTemplate({
      Resources: resources,
      GeneratedTemplateName: stackName,
    });

    if (createTemplateOutput.GeneratedTemplateId === undefined) {
      throw new Error('CreateGeneratedTemplate failed to return an Arn.');
    }
    return createTemplateOutput;
  }

  /**
   * Deletes a generated template from the template generator.
   *
   * @param templateArn The arn of the template to delete
   * @returns A promise that resolves when the template has been deleted
   */
  async deleteGeneratedTemplate(templateArn: string): Promise<void> {
    await this.cfn.deleteGeneratedTemplate({
      GeneratedTemplateName: templateArn,
    });
  }
}

/**
 * The possible ways to choose a scan to generate a CDK application from
 */
export enum FromScan {
  /**
   * Initiate a new resource scan to build the CDK application from.
   */
  NEW,

  /**
   * Use the last successful scan to build the CDK application from. Will fail if no scan is found.
   */
  MOST_RECENT,

  /**
   * Starts a scan if none exists, otherwise uses the most recent successful scan to build the CDK application from.
   */
  DEFAULT,
}

/**
 * Interface for the options object passed to the generateTemplate function
 *
 * @param stackName The name of the stack
 * @param filters A list of filters to apply to the scan
 * @param fromScan An enum value specifying whether a new scan should be started or the most recent successful scan should be used
 * @param sdkProvider The sdk provider for making CloudFormation calls
 * @param environment The account and region where the stack is deployed
 */
export interface GenerateTemplateOptions {
  stackName: string;
  filters?: string[];
  fromScan?: FromScan;
  sdkProvider: SdkProvider;
  environment: Environment;
}

/**
 * Interface for the output of the generateTemplate function
 *
 * @param migrateJson The generated Migrate.json file
 * @param resources The generated template
 */
export interface GenerateTemplateOutput {
  migrateJson: MigrateJsonFormat;
  resources?: ResourceDetail[];
  templateId?: string;
}

/**
 * Interface defining the format of the generated Migrate.json file
 *
 * @param TemplateBody The generated template
 * @param Source The source of the template
 * @param Resources A list of resources that were used to generate the template
 */
export interface MigrateJsonFormat {
  templateBody: string;
  source: string;
  resources?: GeneratedResourceImportIdentifier[];
}

/**
 * Interface representing the format of a resource identifier required for resource import
 *
 * @param ResourceType The type of resource
 * @param LogicalResourceId The logical id of the resource
 * @param ResourceIdentifier The resource identifier of the resource
 */
export interface GeneratedResourceImportIdentifier {
  // cdk deploy expects the migrate.json resource identifiers to be PascalCase, not camelCase.
  ResourceType: string;
  LogicalResourceId: string;
  ResourceIdentifier: ResourceIdentifierSummary;
}
