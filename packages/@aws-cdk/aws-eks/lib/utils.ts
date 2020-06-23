/**
 * Encodes values (specially boolean) as special strings
 *
 * Because CloudFormation converts every input as string for custom resources,
 * we will use these encoded values to cast them into proper types.
 */
export function encodeValues(object: object) {
  return JSON.parse(JSON.stringify(object), (_k, v) => {
    switch (v) {
      case true:
        return 'TRUE:BOOLEAN';
      case false:
        return 'FALSE:BOOLEAN';
      default:
        return v;
    }
  });
}
