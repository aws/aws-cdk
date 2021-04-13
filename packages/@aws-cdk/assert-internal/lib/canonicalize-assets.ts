/**
 * Reduce template to a normal form where asset references have been normalized
 *
 * This makes it possible to compare templates if all that's different between
 * them is the hashes of the asset values.
 *
 * Currently only handles parameterized assets, but can (and should)
 * be adapted to handle convention-mode assets as well when we start using
 * more of those.
 */
export function canonicalizeTemplate(template: any): any {
  // For the weird case where we have an array of templates...
  if (Array.isArray(template)) {
    return template.map(canonicalizeTemplate);
  }

  // Find assets via parameters
  const stringSubstitutions = new Array<[RegExp, string]>();
  const paramRe = /^AssetParameters([a-zA-Z0-9]{64})(S3Bucket|S3VersionKey|ArtifactHash)([a-zA-Z0-9]{8})$/;

  const assetsSeen = new Set<string>();
  for (const paramName of Object.keys(template?.Parameters || {})) {
    const m = paramRe.exec(paramName);
    if (!m) { continue; }
    if (assetsSeen.has(m[1])) { continue; }

    assetsSeen.add(m[1]);
    const ix = assetsSeen.size;

    // Full parameter reference
    stringSubstitutions.push([
      new RegExp(`AssetParameters${m[1]}(S3Bucket|S3VersionKey|ArtifactHash)([a-zA-Z0-9]{8})`),
      `Asset${ix}$1`,
    ]);
    // Substring asset hash reference
    stringSubstitutions.push([
      new RegExp(`${m[1]}`),
      `Asset${ix}Hash`,
    ]);
  }

  // Substitute them out
  return substitute(template);

  function substitute(what: any): any {
    if (Array.isArray(what)) {
      return what.map(substitute);
    }

    if (typeof what === 'object' && what !== null) {
      const ret: any = {};
      for (const [k, v] of Object.entries(what)) {
        ret[stringSub(k)] = substitute(v);
      }
      return ret;
    }

    if (typeof what === 'string') {
      return stringSub(what);
    }

    return what;
  }

  function stringSub(x: string) {
    for (const [re, replacement] of stringSubstitutions) {
      x = x.replace(re, replacement);
    }
    return x;
  }
}
