export interface Documented {
  /** A link to the AWS CloudFormation User Guide that provides informations about the entity. */
  Documentation: string;
}

export enum PrimitiveType {
  String = 'String',
  Long = 'Long',
  Integer = 'Integer',
  Double = 'Double',
  Boolean = 'Boolean',
  Timestamp = 'Timestamp',
  Json = 'Json'
}

export function isPrimitiveType(str: string): str is PrimitiveType {
  switch (str) {
  case PrimitiveType.String:
  case PrimitiveType.Long:
  case PrimitiveType.Integer:
  case PrimitiveType.Double:
  case PrimitiveType.Boolean:
  case PrimitiveType.Timestamp:
  case PrimitiveType.Json:
    return true;
  default:
    return false;
  }
}
