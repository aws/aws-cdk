export const MANIFEST_FILE_NAME = 'manifest.json';

export interface Manifest {
  schema: 'cloud-assembly/1.0';
  drops: { [logicalId: string]: Drop };
  missing?: { [key: string]: Missing };
}

export interface Drop {
  dependsOn?: string[];
  /**
   * @pattern ^[^:]+://.+$
   */
  type: string;
  /**
   * @pattern ^[^:]+://.+$
   */
  environment: string;
  metadata?: { [key: string]: Metadata };
  properties?: { [name: string]: any }
}

export interface Missing {
  /**
   * @pattern ^[^:]+://.+$
   */
  provider: string;
  props: { [key: string]: any };
}

export interface Metadata {
  kind: string;
  value: any;
}
