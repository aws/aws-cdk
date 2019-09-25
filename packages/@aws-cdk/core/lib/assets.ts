export interface FileAssetSource {
  readonly sourceHash: string;
  readonly sourcePath: string;
  readonly packaging: FileAssetPackaging;
}

export enum FileAssetPackaging {
  ZIP_DIRECTORY = 'zip',
  FILE = 'file'
}

export interface FileAssetLocation {
  readonly bucketName: string;
  readonly objectKey: string;
  readonly s3Url: string;
}
