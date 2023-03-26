/**
 * Serializes the given data structure into valid YAML.
 *
 * @param obj the data structure to serialize
 * @returns a string containing the YAML representation of {@param obj}
 */
export declare function serialize(obj: any): string;
/**
 * Deserialize the YAML into the appropriate data structure.
 *
 * @param str the string containing YAML
 * @returns the data structure the YAML represents
 *   (most often in case of CloudFormation, an object)
 */
export declare function deserialize(str: string): any;
