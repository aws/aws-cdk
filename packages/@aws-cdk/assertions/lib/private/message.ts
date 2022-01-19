export type Messages = {
  Messages: { [id: string]: Message }
}

export type Message = {
  [key: string]: any;
}

// export type Message = {
//   level: 'info' | 'warning' | 'error';
//   id: string;
//   entry: MetadataEntry;
// };

// type MetadataEntry = {
//   type: string,
//   data?: any,
//   trace?: string[],
// }