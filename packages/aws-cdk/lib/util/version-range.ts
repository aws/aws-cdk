import * as semver from 'semver';

// bracket - https://docs.oracle.com/middleware/1212/core/MAVEN/maven_version.htm#MAVEN401
// pep - https://www.python.org/dev/peps/pep-0440/#version-specifiers
export type RangeType = 'bracket' | 'pep'

export function rangeFromSemver(ver: string, targetType: RangeType) {
  const re = ver.match(/^([^\d]*)([\d.]*)$/);
  if (!re || !semver.valid(re[2])) {
    throw new Error('not a semver or unsupported range syntax');
  }
  const prefixPart = re[1];
  const verPart = re[2];

  switch (targetType) {
    case 'bracket':
      switch (prefixPart) {
        case '':
          // if there's no prefix and the remaining is a valid semver, there's no range specified
          return ver;
        case '^':
          return `[${verPart},${semver.major(verPart)+1}.0.0)`;
        default:
          throw new Error(`unsupported range syntax - ${prefixPart}`);
      }
    case 'pep':
      switch (prefixPart) {
        case '':
          // if there's no prefix and the remaining is a valid semver, there's no range specified
          return `==${ver}`;
        case '^':
          return `>=${verPart},<${semver.major(verPart)+1}.0.0`;
        default:
          throw new Error(`unsupported range syntax - ${prefixPart}`);
      }
  }

}