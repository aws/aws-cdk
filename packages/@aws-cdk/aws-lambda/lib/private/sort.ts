export function sortedStringify(value: any, space?: string | number): string {
  return JSON.stringify(value, (_, v) => sortKeys(v), space);
}

function sortKeys(obj: any) {
  if (typeof(obj) !== 'object' || Array.isArray(obj)) {
    return obj;
  }
  let newObject = {};
  Object.keys(obj).sort().forEach(k => {
    newObject = {
      ...newObject,
      [k]: obj[k],
    };
  });
  return newObject;
}