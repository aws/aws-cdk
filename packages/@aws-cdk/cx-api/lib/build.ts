export interface BuildStep {
  type: string;
  depends?: string[];
  parameters: {
    [key: string]: any
  };
}

export interface BuildManifest {
  steps: { [id: string]: BuildStep };
}

export enum BuildStepType {
  CopyFile = 'copy-file',
  ZipDirectory = 'zip-directory'
}
