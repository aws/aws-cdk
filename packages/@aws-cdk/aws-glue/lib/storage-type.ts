export enum InputFormat {
  TextInputFormat = 'org.apache.hadoop.mapred.TextInputFormat'
}

export enum OutputFormat {
  HiveIgnoreKeyTextOutputFormat = 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
}

export enum SerializationLibrary {
  OpenXJson = 'org.openx.data.jsonserde.JsonSerDe'
}

export interface StorageType {
  inputFormat: string;
  outputFormat: string;
  serializationLibrary: string;
}

export namespace StorageType {
  export const Json: StorageType = {
    inputFormat: InputFormat.TextInputFormat,
    outputFormat: OutputFormat.HiveIgnoreKeyTextOutputFormat,
    serializationLibrary: SerializationLibrary.OpenXJson
  };
}