import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { moduleMapPath } from '../lib/module-topology';
import { namespaceToModuleDefinition } from '../lib/util/jsii';
import { deriveRubyModule, loadRubyTargetConfig, writeJsiiRc } from '../lib/util/submodule-files';
import type { RubyTargetConfig } from '../lib/util/submodule-files';

const awsCdkLibPath = path.dirname(path.dirname(moduleMapPath));

/**
 * Submodules whose committed ruby module name is a hand-chosen override.
 *
 * These names contradict any mechanical rule derivable from the CloudFormation
 * namespace and the acronym config: `AWS::CodeCommit` -> `Codecommit` while
 * `AWS::CodeBuild` -> `CodeBuild`, and `BCM`/`GUI`/`SMS` are cased as acronyms
 * without appearing in the `aws-cdk-lib` acronym list.
 *
 * `writeJsiiRc` always preserves an existing ruby module name, so the committed
 * `.jsiirc.json` files remain authoritative for these. They are listed here so
 * that the conformance test below flags any new deviation from the rules.
 */
const IRREGULAR_RUBY_MODULES: Record<string, string> = {
  'alexa-ask': 'AWSCDK::AlexaAsk',
  'aws-apptest': 'AWSCDK::Apptest',
  'aws-autoscaling': 'AWSCDK::Autoscaling',
  'aws-bcmpricingcalculator': 'AWSCDK::BCMPricingCalculator',
  'aws-codecommit': 'AWSCDK::Codecommit',
  'aws-codepipeline': 'AWSCDK::Codepipeline',
  'aws-datasync': 'AWSCDK::Datasync',
  'aws-directconnect': 'AWSCDK::Directconnect',
  'aws-elasticache': 'AWSCDK::Elasticache',
  'aws-sagemaker': 'AWSCDK::Sagemaker',
  'aws-smsvoice': 'AWSCDK::SMSVoice',
  'aws-ssmguiconnect': 'AWSCDK::SSMGUIConnect',
  'aws-verifiedpermissions': 'AWSCDK::Verifiedpermissions',
  'aws-workspaces': 'AWSCDK::Workspaces',
  'aws-workspacesthinclient': 'AWSCDK::WorkspacesThinClient',
  'aws-workspacesweb': 'AWSCDK::WorkspacesWeb',
};

test('ruby module derivation matches all committed .jsiirc.json files', async () => {
  const config = await loadRubyTargetConfig();
  const scopeMap: Record<string, { scopes: Array<{ namespace: string }> }> = JSON.parse(
    fs.readFileSync(moduleMapPath, 'utf-8'),
  );

  let regular = 0;
  const mismatches: Record<string, string> = {};

  for (const [name, entry] of Object.entries(scopeMap)) {
    const namespace = entry.scopes[0]?.namespace;
    const committed = committedRubyModule(path.join(awsCdkLibPath, name, '.jsiirc.json'));
    if (!namespace || !committed) {
      continue;
    }

    const derived = deriveRubyModule(namespaceToModuleDefinition(namespace), config);
    if (derived === committed) {
      regular += 1;
    } else {
      mismatches[name] = committed;
    }

    // Nested mixins submodules append `::Mixins` to the parent module. The
    // committed parent name is authoritative here: a freshly generated mixins
    // rc under an irregular parent will be flagged by this assertion and needs
    // a one-time hand correction (preserved by `writeJsiiRc` afterwards).
    const mixinsCommitted = committedRubyModule(path.join(awsCdkLibPath, name, 'lib', 'mixins', '.jsiirc.json'));
    if (mixinsCommitted) {
      expect(mixinsCommitted).toEqual(`${committed}::Mixins`);
    }
  }

  // Sanity check that we are actually looking at the submodule tree
  expect(regular).toBeGreaterThan(250);

  // Any mismatch that is not a known irregular means the derivation rules
  // no longer produce the names the existing submodules follow.
  expect(mismatches).toEqual(IRREGULAR_RUBY_MODULES);
});

test('every committed .jsiirc.json in aws-cdk-lib declares a ruby module', () => {
  const missing = findJsiiRcFiles(awsCdkLibPath).filter((f) => !committedRubyModule(f));
  expect(missing).toEqual([]);
});

describe('writeJsiiRc', () => {
  let tmpDir: string;
  let definition: ReturnType<typeof namespaceToModuleDefinition>;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'submodule-files-test'));
    definition = namespaceToModuleDefinition('AWS::ApiGateway');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('derives a ruby module name for a new submodule', async () => {
    const filePath = path.join(tmpDir, '.jsiirc.json');

    await writeJsiiRc(filePath, definition);

    expect(committedRubyModule(filePath)).toEqual('AWSCDK::APIGateway');
  });

  test('derives a ruby module name for a new mixins submodule', async () => {
    const filePath = path.join(tmpDir, '.jsiirc.json');

    await writeJsiiRc(filePath, definition, { namespaceSuffix: 'mixins', goPrefix: '' });

    expect(committedRubyModule(filePath)).toEqual('AWSCDK::APIGateway::Mixins');
  });

  test('preserves an existing ruby module name', async () => {
    const filePath = path.join(tmpDir, '.jsiirc.json');
    fs.writeFileSync(filePath, JSON.stringify({ targets: { ruby: { module: 'AWSCDK::CustomName' } } }));

    await writeJsiiRc(filePath, definition);

    expect(committedRubyModule(filePath)).toEqual('AWSCDK::CustomName');
  });

  test('fails on an unparseable existing file', async () => {
    const filePath = path.join(tmpDir, '.jsiirc.json');
    fs.writeFileSync(filePath, '{ this is not JSON');

    await expect(writeJsiiRc(filePath, definition)).rejects.toThrow(
      `Cannot read existing jsiirc file ${filePath}`,
    );
  });
});

describe('deriveRubyModule', () => {
  const config: RubyTargetConfig = {
    module: 'AWSCDK',
    acronyms: ['AWS', 'S3', 'API', 'EC2', 'FSX'],
  };

  test.each([
    ['AWS::S3', 'AWSCDK::S3'],
    ['AWS::ApiGateway', 'AWSCDK::APIGateway'],
    ['AWS::ApiGatewayV2', 'AWSCDK::APIGatewayv2'],
    ['AWS::EC2', 'AWSCDK::EC2'],
    ['AWS::FSx', 'AWSCDK::FSX'],
    ['AWS::S3Express', 'AWSCDK::S3Express'],
    ['AWS::Route53Resolver', 'AWSCDK::Route53Resolver'],
    ['AWS::IoTFleetHub', 'AWSCDK::IoTFleetHub'],
    ['AWS::AWSExternalAnthropic', 'AWSCDK::ExternalAnthropic'],
    ['Alexa::Something', 'AWSCDK::AlexaSomething'],
  ])('%s derives to %s', (namespace, expected) => {
    expect(deriveRubyModule(namespaceToModuleDefinition(namespace), config)).toEqual(expected);
  });
});

/**
 * The ruby module name a committed `.jsiirc.json` declares, if any
 */
function committedRubyModule(filePath: string): string | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')).targets?.ruby?.module;
}

/**
 * All committed `.jsiirc.json` files below a directory
 *
 * Skips `*.generated.jsiirc.json` files, which are created at build time
 * and intentionally have no ruby target.
 */
function findJsiiRcFiles(dir: string): string[] {
  const result = new Array<string>();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      result.push(...findJsiiRcFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.jsiirc.json') && !entry.name.endsWith('.generated.jsiirc.json')) {
      result.push(fullPath);
    }
  }
  return result;
}
