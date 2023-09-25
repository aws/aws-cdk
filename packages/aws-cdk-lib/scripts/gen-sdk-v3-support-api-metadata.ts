import * as fs from 'node:fs';
import * as path from 'node:path';
import { getV3ClientPackageName } from '@aws-cdk/sdk-v2-to-v3-adapter';
import * as sdkMetadata from 'aws-sdk/apis/metadata.json';

const outputPath = process.argv[2];
const awsSdkV3SupportMetadata = Object.entries(sdkMetadata).reduce((acc, [v2Name, metadata]) => {
  try {
    // if getV3ClientPackageName was provided unknown service then it throw error
    return {
      ...acc,
      [v2Name]: metadata,
      [getV3ClientPackageName(metadata.name)]: metadata,
    };
  } catch (error) {
    return {
      ...acc,
      [v2Name]: metadata,
    };
  };
}, {});
fs.writeFileSync(path.join(__dirname, '../', outputPath), JSON.stringify(awsSdkV3SupportMetadata, null, 2));