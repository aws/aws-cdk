export type Messages = {
  Messages: { [logicalId: string]: Message }
}

export type Message = {
  level: string;
  id: string;
  entry: MetadataEntry;
  [key: string]: any;
};

type MetadataEntry = {
  type: string,
  data?: any,
  trace?: string[],
  [key: string]: any;
}