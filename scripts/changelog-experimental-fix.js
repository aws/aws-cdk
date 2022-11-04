/**
 * For the developer preview release of CDKv2, we are stripping experimental modules from the packaged release.
 * However, the entries from the CHANGELOG are still included, as `standard-release` has no knowledge of this process.
 * This script -- run as part of the 'bump' process -- attempts to identify and remove CHANGELOG lines that are
 * associated with experimental modules.
 */

const fs = require('fs-extra');
const path = require('path');
const { Project } = require("@lerna/project");

function rewriteChangelog(changelogPath) {
  const changelog = fs.readFileSync(changelogPath, { encoding: 'utf-8' }).split('\n');

  // Find the new section of the CHANGELOG, represented by everything up to the 2nd version header.
  // (The first version header is the new one.)
  // This is the section we will operate on, and leave the rest untouched.
  let searchIndex = -1;
  const findNextVersionHeader = (str, index) => str.startsWith('## ') && index > searchIndex;
  searchIndex = changelog.findIndex(findNextVersionHeader);
  const secondVersionHeaderIndex = changelog.findIndex(findNextVersionHeader);
  let newChangelogSection = changelog.splice(0, secondVersionHeaderIndex);

  // Rewrite the newly-generated section of the changelog.
  newChangelogSection = stripExperimentalPackageChangelogs(newChangelogSection);
  newChangelogSection = stripEmptySectionHeaders(newChangelogSection);
  newChangelogSection = stripDuplicateEmptyLines(newChangelogSection);
  newChangelogSection = replaceBreakingChangesLine(newChangelogSection);
  const rewrittenChangelog = [...newChangelogSection, ...changelog].join('\n');

  fs.writeFileSync(changelogPath, rewrittenChangelog, { encoding: 'utf-8' });
}

function stripExperimentalPackageChangelogs(changelog) {
  const packageNames = experimentalPackageNames();
  const packageNamesWithDupes = [...packageNames, ...packageNames.map(pkg => pkg.replace('aws-', ''))];
  const isExperimentalChangelogLine = (str) => packageNamesWithDupes.some(pkg => str.startsWith(`* **${pkg}:** `));

  return changelog.filter(line => !isExperimentalChangelogLine(line));
}

// Approximates the behavior of ubergen's stripExperimental detection logic... roughly.
// Returns the short package names (e.g., 'aws-s3') for any experimental service packages.
function experimentalPackageNames() {
  const packages = new Project(repoRoot()).getPackagesSync();
  return packages.filter(isExperimentalServicePackage).map(p => p.name.substr('@aws-cdk/'.length));

  function isExperimentalServicePackage(package) {
    const pkgJson = fs.readJsonSync(package.manifestLocation);
    return pkgJson.name.startsWith('@aws-cdk/')
      && pkgJson.stability === 'experimental';
  }
}

function stripEmptySectionHeaders(changelog) {
  const isSectionHeader = (str) => str.startsWith('### ');
  function sectionIsEmpty(index) {
    const nextNonEmptyLine = changelog.slice(index + 1).find(line => line.length > 0);
    return !nextNonEmptyLine || nextNonEmptyLine.startsWith('#'); // No lines, or found another section header first
  }

  return changelog.filter((line, index) => !isSectionHeader(line) || !sectionIsEmpty(index));
}

function stripDuplicateEmptyLines(changelog) {
  return changelog.filter((line, index) => index == 0 || line.length || changelog[index - 1].length);
}

function replaceBreakingChangesLine(changelog) {
  return changelog.map(line => line.replace(/BREAKING CHANGES$/, 'BREAKING CHANGES TO EXPERIMENTAL FEATURES'));
}

function repoRoot() {
  return path.join(__dirname, '..');
}

const defaultChangelogPath = path.join(repoRoot(), 'CHANGELOG.v2.md');
rewriteChangelog(process.argv[2] || defaultChangelogPath);
