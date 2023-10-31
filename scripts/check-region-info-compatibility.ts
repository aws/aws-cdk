import * as fs from 'fs';
import * as path from 'path';

/**
 * Given two copies of the @aws-cdk/region-info database, check that no facts have disappeared between them
 */

type AwsCdkLib = typeof import('aws-cdk-lib');
type RegionInfoPackage = AwsCdkLib['region_info'];

function main(oldPackage: string, newPackage: string) {
  const breaksFile = path.join(__dirname, '..', 'allowed-breaking-changes.txt');
  const allowedBreaks = new Set(fs.readFileSync(breaksFile, { encoding: 'utf-8' }).split('\n'));

  const oldPkg: RegionInfoPackage = (require(oldPackage) as AwsCdkLib).region_info;
  const newPkg: RegionInfoPackage = (require(newPackage) as AwsCdkLib).region_info;

  const oldFacts = definedFacts(oldPkg.Fact);
  const newFacts = definedFacts(newPkg.Fact);

  const disappearedFacts = oldFacts
    .filter((oldFact) => !newFacts.some((newFact) => factEq(oldFact, newFact)))
    .map((fact) => ({ fact, key: `${fact[0]}:${fact[1]}` }))
    .filter(({ key }) => !allowedBreaks.has(key));

  if (disappearedFacts.length > 0) {
    console.log('Facts have disappeared from region fact database (add to allowed-breaking-changes.txt to ignore):');
    for (const { key } of disappearedFacts) {
      console.log(`- ${key}`);
      process.exitCode = 1;
    }
  }
}

/**
 * Call Fact.definedFacts() on the given object, emulating it with hacks for versions of `region-info` that don't support it.
 */
function definedFacts(fact: RegionInfoPackage['Fact']): Array<[string, string]> {
  if ((fact as any).definedFacts) {
    return (fact as any).definedFacts();
  }

  // Access private member through trickery
  const db: Record<string, Record<string, string>> = (fact as any).database;
  return Object.entries(db)
    .flatMap(([regionName, regionFacts]) =>
      Object.keys(regionFacts).map((factName) =>
        [regionName, factName] satisfies [string, string]));
}

function factEq(a: [string, string], b: [string, string]) {
  return a[0] === b[0] && a[1] === b[1];
}


if (process.argv.length < 4) {
  throw new Error('Usage: check-region-info-compatibility <OLD_REGION_INFO> <NEW_REGION_INFO>');
}
main(process.argv[2], process.argv[3]);