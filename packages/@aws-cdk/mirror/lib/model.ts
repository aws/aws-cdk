export type NodeMetadata = { [name: string]: any };
export type NodeLinks = Link[];

export interface Link {
  sourcePath: string;
  targetPath: string;
  attribute?: string;
}

export interface Node {
  id: string;
  path: string;
  children?: Node[];
  metadata?: NodeMetadata;
  links?: NodeLinks;
}
