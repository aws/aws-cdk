import { Notice, Attribution } from './notice';

const DEFAULT_ACCEPTED_LICENSES = [
  'Apache-2.0',
  'MIT',
  'BSD-3-Clause',
  'ISC',
  'BSD-2-Clause',
  '0BSD',
];

export interface AttributionsProps {
  readonly acceptedLicenses?: string[];
  readonly excludePackages?: string[];
}

export interface Dependency {
  readonly path: string;
  readonly name: string;
  readonly version: string;
}

export class Attributions {

  private readonly acceptedLicenses;
  private readonly excludedPackages;
  private readonly dependencies;

  constructor(dependencies: Dependency[], props: AttributionsProps = {}) {
    this.acceptedLicenses = (props.acceptedLicenses ?? DEFAULT_ACCEPTED_LICENSES).map(l => l.toLowerCase());
    this.excludedPackages = props.excludePackages ?? [];
    this.dependencies = dependencies.filter(d => !this.excludedPackages.includes(d.name));
  }

  public async validate() {

    const expected = await Notice.generate(this.dependencies);
    const invalid: Attribution[] = [];

    // validate all expected attributions have a valid license
    for (const [_, attr] of expected.attributions.entries()) {
      if (!this.acceptedLicenses.includes(attr.license)) {
        invalid.push(attr);
      }
    }

    if (invalid.length > 0) {
      console.log(`✖ Found ${invalid.length} invalid license attributions (either remove their usage or update the acceptable license list):`);
      console.log(invalid.map(a => `  - ${a.package} (${a.license})`).join('\n'));
      process.exit(1);
    }

    // validate the actual attributions match the expected ones
    const actual = Notice.parse();

    const missing = expected.findMissing(actual);
    const unnecessary = actual.findMissing(expected);

    if (missing.length > 0) {
      console.log(`✖ Found ${missing.length} missing attributions (generate with 'node-bundle fix'):`);
      console.log(missing.map(a => `  - ${a.package}`).join('\n'));
      process.exit(1);
    }

    if (unnecessary.length > 0) {
      console.log(`✖ Found ${unnecessary.length} unnecessary attributions (remove with 'node-bundle fix'):`);
      console.log(unnecessary.map(a => `  - ${a.package}`).join('\n'));
      process.exit(1);
    }

  }

  public async create() {
    (await Notice.generate(this.dependencies)).flush();
  }

}
