import publicSuffixes = require('./public-suffixes');

/**
 * Returns the apex domain (domain.com) from a subdomain (www.sub.domain.com)
 */
export function apexDomain(domainName: string): string {
  const parts = domainName.split('.').reverse();

  let curr: any = publicSuffixes;

  const accumulated: string[] = [];
  for (const part of parts) {
    accumulated.push(part);
    if (!(part in curr)) { break; }
    curr = curr[part];
  }
  return accumulated.reverse().join('.');
}
