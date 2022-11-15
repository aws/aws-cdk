import * as path from 'path';
import * as fs from 'fs-extra';

const CDK_OUTDIR_PREFIX = 'cdk-integ.out';

/**
 * Represents a single integration test
 *
 * This type is a data-only structure, so it can trivially be passed to workers.
 * Derived attributes are calculated using the `IntegTest` class.
 */
export interface IntegTestInfo {
  /**
   * Path to the file to run
   *
   * Path is relative to the current working directory.
   */
  readonly fileName: string;

  /**
   * The root directory we discovered this test from
   *
   * Path is relative to the current working directory.
   */
  readonly discoveryRoot: string;

  /**
   * The CLI command used to run this test.
   * If it contains {filePath}, the test file names will be substituted at that place in the command for each run.
   *
   * @default - test run command will be `node {filePath}`
   */
  readonly appCommand?: string;
}

/**
 * Derived information for IntegTests
 */
export class IntegTest {
  private static readonly defaultSuffixes = new Map<string, RegExp>([
    ['javascript', new RegExp(/\.js$/)],
    // Allow files ending in .ts but not in .d.ts
    ['typescript', new RegExp(/(?<!\.d)\.ts$/)],
  ]);

  private static readonly defaultAppCommands = new Map<string, string>([
    ['javascript', 'node {filePath}'],
    ['typescript', 'node -r ts-node/register {filePath}'],
  ]);

  private static getLanguage(fileName: string): string | undefined {
    const [language] = Array.from(IntegTest.defaultSuffixes.entries()).find(([, regex]) => regex.test(fileName)) ?? [undefined, undefined];
    return language;
  }

  /**
   * The name of the file to run
   *
   * Path is relative to the current working directory.
   */
  public readonly fileName: string;

  /**
   * Relative path to the file to run
   *
   * Relative from the "discovery root".
   */
  public readonly discoveryRelativeFileName: string;

  /**
   * The absolute path to the file
   */
  public readonly absoluteFileName: string;

  /**
   * The normalized name of the test. This name
   * will be the same regardless of what directory the tool
   * is run from.
   */
  public readonly normalizedTestName: string;

  /**
   * Directory the test is in
   */
  public readonly directory: string;

  /**
   * Display name for the test
   *
   * Depends on the discovery directory.
   *
   * Looks like `integ.mytest` or `package/test/integ.mytest`.
   */
  public readonly testName: string;

  /**
   * Path of the snapshot directory for this test
   */
  public readonly snapshotDir: string;

  /**
   * Path to the temporary output directory for this test
   */
  public readonly temporaryOutputDir: string;

  /**
   * The CLI command used to run this test.
   * If it contains {filePath}, the test file names will be substituted at that place in the command for each run.
   *
   * @default - test run command will be `node {filePath}`
   */
  readonly appCommand: string;

  /**
   * Language the test is written in
   */
  public readonly language?: string;

  constructor(public readonly info: IntegTestInfo) {
    this.absoluteFileName = path.resolve(info.fileName);
    this.fileName = path.relative(process.cwd(), info.fileName);

    const parsed = path.parse(this.fileName);
    this.discoveryRelativeFileName = path.relative(info.discoveryRoot, info.fileName);
    this.directory = parsed.dir;

    this.language = IntegTest.getLanguage(parsed.base);
    this.appCommand = info.appCommand ?? this.getDefaultAppCommand();

    // if we are running in a package directory then just use the fileName
    // as the testname, but if we are running in a parent directory with
    // multiple packages then use the directory/filename as the testname
    //
    // Looks either like `integ.mytest` or `package/test/integ.mytest`.
    const relDiscoveryRoot = path.relative(process.cwd(), info.discoveryRoot);
    this.testName = this.directory === path.join(relDiscoveryRoot, 'test') || this.directory === path.join(relDiscoveryRoot)
      ? parsed.name
      : path.join(path.relative(this.info.discoveryRoot, parsed.dir), parsed.name);

    this.normalizedTestName = parsed.name;
    this.snapshotDir = path.join(this.directory, `${parsed.base}.snapshot`);
    this.temporaryOutputDir = path.join(this.directory, `${CDK_OUTDIR_PREFIX}.${parsed.base}.snapshot`);
  }

  private getDefaultAppCommand(): string {
    if (!this.language) {
      throw new Error(`Integration test '${this.fileName}' does not match any of the supported languages.`);
    }

    const defaultAppCommand = IntegTest.defaultAppCommands.get(this.language);
    if (!defaultAppCommand) {
      throw new Error(`No default app run command defined for language ${this.language}`);
    }

    return defaultAppCommand;
  }

  /**
   * Whether this test matches the user-given name
   *
   * We are very lenient here. A name matches if it matches:
   *
   * - The CWD-relative filename
   * - The discovery root-relative filename
   * - The suite name
   * - The absolute filename
   */
  public matches(name: string) {
    return [
      this.fileName,
      this.discoveryRelativeFileName,
      this.testName,
      this.absoluteFileName,
    ].includes(name);
  }
}

/**
 * Configuration options how integration test files are discovered
 */
export interface IntegrationTestsDiscoveryOptions {
  /**
   * If this is set to true then the list of tests
   * provided will be excluded
   *
   * @default false
   */
  readonly exclude?: boolean;

  /**
    * List of tests to include (or exclude if `exclude=true`)
    *
    * @default - all matched files
    */
  readonly tests?: string[];

  /**
    * Detect integration test files matching any of these JavaScript regex patterns.
    *
    * @default
    */
  readonly testRegex?: string[];

  /**
   * The CLI command used to run this test.
   * If it contains {filePath}, the test file names will be substituted at that place in the command for each run.
   *
   * @default - test run command will be `node {filePath}`
   */
  readonly app?: string;

  /**
   * List of language presets to discover tests for.
   *
   * @default - all supported languages
   */
  readonly language?: string[];
}


/**
 * The list of tests to run can be provided in a file
 * instead of as command line arguments.
 */
export interface IntegrationTestFileConfig extends IntegrationTestsDiscoveryOptions {
  /**
   * List of tests to include (or exclude if `exclude=true`)
   */
  readonly tests: string[];
}

/**
 * Discover integration tests
 */
export class IntegrationTests {
  private static readonly defaultDiscoveryRegexes = new Map<string, RegExp>([
    ['javascript', new RegExp(/^integ\..*\.js$/)],
    // Allow files ending in .ts but not in .d.ts
    ['typescript', new RegExp(/^integ\..*(?<!\.d)\.ts$/)],
  ]);
  constructor(private readonly directory: string) {
  }

  /**
   * Takes a file name of a file that contains a list of test
   * to either run or exclude and returns a list of Integration Tests to run
   */
  public async fromFile(fileName: string): Promise<IntegTest[]> {
    const file: IntegrationTestFileConfig = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf-8' }));

    return this.discover(file);
  }

  /**
   * If the user provides a list of tests, these can either be a list of tests to include or a list of tests to exclude.
   *
   * - If it is a list of tests to include then we discover all available tests and check whether they have provided valid tests.
   *   If they have provided a test name that we don't find, then we write out that error message.
   * - If it is a list of tests to exclude, then we discover all available tests and filter out the tests that were provided by the user.
   */
  private filterTests(discoveredTests: IntegTest[], requestedTests?: string[], exclude?: boolean): IntegTest[] {
    if (!requestedTests) {
      return discoveredTests;
    }


    const allTests = discoveredTests.filter(t => {
      const matches = requestedTests.some(pattern => t.matches(pattern));
      return matches !== !!exclude; // Looks weird but is equal to (matches && !exclude) || (!matches && exclude)
    });

    // If not excluding, all patterns must have matched at least one test
    if (!exclude) {
      const unmatchedPatterns = requestedTests.filter(pattern => !discoveredTests.some(t => t.matches(pattern)));
      for (const unmatched of unmatchedPatterns) {
        process.stderr.write(`No such integ test: ${unmatched}\n`);
      }
      if (unmatchedPatterns.length > 0) {
        process.stderr.write(`Available tests: ${discoveredTests.map(t => t.discoveryRelativeFileName).join(' ')}\n`);
        return [];
      }
    }

    return allTests;
  }

  /**
   * Takes an optional list of tests to look for, otherwise
   * it will look for all tests from the directory
   *
   * @param tests Tests to include or exclude, undefined means include all tests.
   * @param exclude Whether the 'tests' list is inclusive or exclusive (inclusive by default).
   */
  public async fromCliArgs(options: IntegrationTestsDiscoveryOptions = {}): Promise<IntegTest[]> {
    return this.discover(options);
  }

  private async discover(options: IntegrationTestsDiscoveryOptions): Promise<IntegTest[]> {
    const languagePresets = options.language ?? Array.from(IntegrationTests.defaultDiscoveryRegexes.keys());
    const patterns = options.testRegex?.map((pattern) => new RegExp(pattern))
        ?? Array.from(IntegrationTests.defaultDiscoveryRegexes.entries()).filter(
          ([language]) => languagePresets.includes(language),
        ).map(([_, regex]) => regex);

    const files = await this.readTree();
    const integs = files.filter(fileName => patterns.some((regex) => {
      return regex.test(fileName) || regex.test(path.basename(fileName));
    }));

    const discoveredTestNames = new Set<string>();
    const integsWithoutDuplicates = new Array<string>();

    // Remove tests with duplicate names.
    // To make sure the precendence of files is deterministic, iterate the files in lexicographic order.
    // Additionally, to give precedence to compiled .js files over their .ts source,
    // use ascending lexicographic ordering, so the .ts files are picked up first.
    for (const integFileName of integs.sort()) {
      const testName = path.parse(integFileName).name;
      if (!discoveredTestNames.has(testName)) {
        integsWithoutDuplicates.push(integFileName);
      }
      discoveredTestNames.add(testName);
    }

    return this.request(integsWithoutDuplicates, options);
  }

  private request(files: string[], options: IntegrationTestsDiscoveryOptions): IntegTest[] {
    const discoveredTests = files.map(fileName => new IntegTest({
      discoveryRoot: this.directory,
      fileName,
      appCommand: options.app,
    }));


    return this.filterTests(discoveredTests, options.tests, options.exclude);
  }

  private async readTree(): Promise<string[]> {
    const ret = new Array<string>();

    async function recurse(dir: string) {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const statf = await fs.stat(fullPath);
        if (statf.isFile()) { ret.push(fullPath); }
        if (statf.isDirectory()) { await recurse(fullPath); }
      }
    }

    await recurse(this.directory);
    return ret;
  }
}
