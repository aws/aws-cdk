export type Messages = {
  Messages: { [logicalId: string]: Message }
}

export type Message = {
  level: 'info' | 'warning' | 'error';
  id: string;
  entry: MetadataEntry;
  [key: string]: any;
};

export type MetadataEntry = {
  type: string,
  data?: any,
  trace?: string[],
}
