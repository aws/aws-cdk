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

  constructor(public readonly info: IntegTestInfo) {
    this.appCommand = info.appCommand ?? 'node {filePath}';
    this.absoluteFileName = path.resolve(info.fileName);
    this.fileName = path.relative(process.cwd(), info.fileName);

    const parsed = path.parse(this.fileName);
    this.discoveryRelativeFileName = path.relative(info.discoveryRoot, info.fileName);
    this.directory = parsed.dir;

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
   * A map of of the app commands to run integration tests with,
   * and the regex patterns matching the integration test files each app command.
   *
   * If the app command contains {filePath}, the test file names will be substituted at that place in the command for each run.
   */
  readonly testCases: {
    [app: string]: string[]
  }
}

/**
 * Returns the name of the Python executable for the current OS
 */
function pythonExecutable() {
  let python = 'python3';
  if (process.platform === 'win32') {
    python = 'python';
  }
  return python;
}

/**
 * Discover integration tests
 */
export class IntegrationTests {
  constructor(private readonly directory: string) {}

  /**
   * Get integration tests discovery options from CLI options
   */
  public async fromCliOptions(options: {
    app?: string;
    exclude?: boolean,
    language?: string[],
    testRegex?: string[],
    tests?: string[],
  }): Promise<IntegTest[]> {
    const baseOptions = {
      tests: options.tests,
      exclude: options.exclude,
    };

    // Explicitly set both, app and test-regex
    if (options.app && options.testRegex) {
      return this.discover({
        testCases: {
          [options.app]: options.testRegex,
        },
        ...baseOptions,
      });
    }

    // Use the selected presets
    if (!options.app && !options.testRegex) {
      // Only case with multiple languages, i.e. the only time we need to check the special case
      const ignoreUncompiledTypeScript = options.language?.includes('javascript') && options.language?.includes('typescript');

      return this.discover({
        testCases: this.getLanguagePresets(options.language),
        ...baseOptions,
      }, ignoreUncompiledTypeScript);
    }

    // Only one of app or test-regex is set, with a single preset selected
    // => override either app or test-regex
    if (options.language?.length === 1) {
      const [presetApp, presetTestRegex] = this.getLanguagePreset(options.language[0]);
      return this.discover({
        testCases: {
          [options.app ?? presetApp]: options.testRegex ?? presetTestRegex,
        },
        ...baseOptions,
      });
    }

    // Only one of app or test-regex is set, with multiple presets
    // => impossible to resolve
    const option = options.app ? '--app' : '--test-regex';
    throw new Error(`Only a single "--language" can be used with "${option}". Alternatively provide both "--app" and "--test-regex" to fully customize the configuration.`);
  }

  /**
   * Get the default configuration for a language
   */
  private getLanguagePreset(language: string) {
    const languagePresets: {
      [language: string]: [string, string[]]
    } = {
      javascript: ['node {filePath}', ['^integ\\..*\\.js$']],
      typescript: ['node -r ts-node/register {filePath}', ['^integ\\.(?!.*\\.d\\.ts$).*\\.ts$']],
      python: [`${pythonExecutable()} {filePath}`, ['^integ_.*\\.py$']],
      go: ['go run {filePath}', ['^integ_.*\\.go$']],
    };

    return languagePresets[language];
  }

  /**
   * Get the config for all selected languages
   */
  private getLanguagePresets(languages: string[] = []) {
    return Object.fromEntries(
      languages
        .map(language => this.getLanguagePreset(language))
        .filter(Boolean),
    );
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
  private async discover(options: IntegrationTestsDiscoveryOptions, ignoreUncompiledTypeScript: boolean = false): Promise<IntegTest[]> {
    const files = await this.readTree();

    const testCases = Object.entries(options.testCases)
      .flatMap(([appCommand, patterns]) => files
        .filter(fileName => patterns.some((pattern) => {
          const regex = new RegExp(pattern);
          return regex.test(fileName) || regex.test(path.basename(fileName));
        }))
        .map(fileName => new IntegTest({
          discoveryRoot: this.directory,
          fileName,
          appCommand,
        })),
      );

    const discoveredTests = ignoreUncompiledTypeScript ? this.filterUncompiledTypeScript(testCases) : testCases;

    return this.filterTests(discoveredTests, options.tests, options.exclude);
  }

  private filterUncompiledTypeScript(testCases: IntegTest[]): IntegTest[] {
    const jsTestCases = testCases.filter(t => t.fileName.endsWith('.js'));

    return testCases
      // Remove all TypeScript test cases (ending in .ts)
      // for which a compiled version is present (same name, ending in .js)
      .filter((tsCandidate) => {
        if (!tsCandidate.fileName.endsWith('.ts')) {
          return true;
        }
        return jsTestCases.findIndex(jsTest => jsTest.testName === tsCandidate.testName) === -1;
      });
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
