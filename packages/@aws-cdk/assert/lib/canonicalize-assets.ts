import * as cxapi from '@aws-cdk/cx-api';
import * as path from 'path';

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
export function canonicalizeStackArtifact(artifact: cxapi.CloudFormationStackArtifact): any {
  // Find assets via parameters
  const stringSubstitutions = new Array<[RegExp, string]>();

  const assets = findAssets(artifact);

  assets.forEach((asset, i) => {
    const ix = i + 1;
    switch (asset.type) {
      case 'legacy-file':
        // Full parameter reference
        stringSubstitutions.push([new RegExp(asset.s3BucketParameter), `Asset${ix}S3Bucket`]);
        stringSubstitutions.push([new RegExp(asset.s3KeyParameter), `Asset${ix}S3VersionKey`]);
        stringSubstitutions.push([new RegExp(asset.artifactHashParameter), `Asset${ix}ArtifactHash`]);

        // Substring asset hash reference
        stringSubstitutions.push([ new RegExp(asset.sourceHash), `Asset${ix}Hash`]);
    }
  });

  const substitutedTemplate = substitute(artifact.template);

  // We have the template, now turn it into a CloudFormationStackArtifact to return
  // Write it into a new Cloud Assembly in a subdirectory of the existing assembly so everything gets
  // cleaned up together.
  const builder = new cxapi.CloudAssemblyBuilder(path.join(artifact.assembly.directory, `${artifact.templateFile}.canonicalized`));
  builder.writeStack(artifact.id, {
    template: substitutedTemplate,
  });
  return builder.buildAssembly().getStackByName(artifact.id);

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

type AssetInfo = (
  { type: 'legacy-file'; sourceHash: string; s3BucketParameter: string; s3KeyParameter: string; artifactHashParameter: string; }
);

function findAssets(artifact: cxapi.CloudFormationStackArtifact) {
  const ret: AssetInfo[] = [];
  for (const asset of artifact.assets) {
    switch (asset.packaging) {
      case 'zip':
      case 'file':
        ret.push({
          type: 'legacy-file',
          sourceHash: asset.sourceHash,
          s3KeyParameter: asset.s3KeyParameter,
          s3BucketParameter: asset.s3BucketParameter,
          artifactHashParameter: asset.artifactHashParameter,
        });
        continue;
    }

    throw new Error(`Cannot canonicalize legacy asset of type ${asset.packaging} yet`);
  }
  return ret;
}
