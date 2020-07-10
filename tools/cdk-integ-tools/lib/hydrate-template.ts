import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';

/**
 * Hydrate a template into a StackArtifact
 *
 * Detects asset references in the template and add them to metadata. This is
 * necessary to normalize the assets out again afterwards in the comparison
 * (because canonicalization function goes from StackArtifact -> StackArtifact).
 */
export function hydrateTemplateToStackArtifact(template: any): cxapi.CloudFormationStackArtifact {
  const fileParamRe = /^AssetParameters([a-zA-Z0-9]{64})(S3Bucket|S3VersionKey|ArtifactHash)([a-zA-Z0-9]{8})$/;

  const fileAssets: Record<string, Writeable<cxschema.FileAssetMetadataEntry>> = {};

  for (const paramName of Object.keys(template?.Parameters || {})) {
    const m = fileParamRe.exec(paramName);
    if (!m) { continue; }

    const key = m[1];
    if (!fileAssets[key]) {
      fileAssets[key] = {
        packaging: 'file',
        sourceHash: m[1],
        artifactHashParameter: '',
        s3KeyParameter: '',
        s3BucketParameter: '',
      };
    }
    const fileMeta = fileAssets[key];

    switch (m[2]) {
      case 'S3Bucket':
        fileMeta.s3BucketParameter = paramName;
        break;
      case 'S3VersionKey':
        fileMeta.s3KeyParameter = paramName;
        break;
      case 'ArtifactHash':
        fileMeta.artifactHashParameter = paramName;
        break;
    }
  }

  const metadata: Record<string, cxapi.MetadataEntry[]> = {};
  for (const [hash, data] of Object.entries(fileAssets)) {
    metadata[`/asset${hash}`] = [
      {
        type: cxschema.ArtifactMetadataEntryType.ASSET,
        data: data as any, // Trust me I know what I'm doing
      },
    ];
  }

  // Return as a StackArtifact (need to write a temporary assembly here)
  const builder = new cxapi.CloudAssemblyBuilder();
  builder.writeStack('Expectation', {
    template,
    metadata,
  });
  return builder.buildAssembly().getStackByName('Expectation');
}

/**
 * Unfortunately there is no way to preserve optionality in this mapped type, so mark everything optional otherwise code becomes annoying
 */
type Writeable<T> = { -readonly [P in keyof T]?: T[P] };
