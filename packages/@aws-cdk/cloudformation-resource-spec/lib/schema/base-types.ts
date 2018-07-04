export interface Documented {
    /** A link to the AWS CloudFormation User Guide that provides informations about the entity. */
    Documentation: string;
}

export type PrimitiveType = 'String' | 'Long' | 'Integer' | 'Double' | 'Boolean' | 'Timestamp' | 'Json';

export function isPrimitiveType(str: string): str is PrimitiveType {
    switch (str) {
    case 'String':
    case 'Long':
    case 'Integer':
    case 'Double':
    case 'Boolean':
    case 'Timestamp':
    case 'Json':
        return true;
    default:
        return false;
    }
}
