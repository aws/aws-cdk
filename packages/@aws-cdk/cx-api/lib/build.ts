export interface BuildStep {
  readonly type: string;
  readonly depends?: string[];
  readonly parameters: {
    [key: string]: any
  };
}

export interface BuildManifest {
  readonly steps: { [id: string]: BuildStep };
}

export enum BuildStepType {
  CopyFile = 'copy-file',
  ZipDirectory = 'zip-directory'
}
