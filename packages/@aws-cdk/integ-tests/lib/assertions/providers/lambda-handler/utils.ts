
export function decode(object: Record<string, unknown>): any {
  return JSON.parse(JSON.stringify(object), (_k, v) => {
    switch (v) {
      case 'TRUE:BOOLEAN':
        return true;
      case 'FALSE:BOOLEAN':
        return false;
      default:
        return v;
    }
  });
}
