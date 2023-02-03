

export function mapToCamelCase(map: { [key: string]: any }, doNotChange: string[][] = []): Object {

  let newMap: { [key: string]: Object } = {};

  for (const k in map) {
    let oldKey = k;
    let newKey = k.charAt(0).toLowerCase() + k.slice(1);
    let value = map[oldKey];

    if (doesNotChange(doNotChange)) {
      newKey = oldKey;
    }

    if (!(typeof value === 'string' ||
      value instanceof String ||
      value instanceof Number ||
      value instanceof Boolean ||
      value instanceof Array)) {
      value = mapToCamelCase(value, getDoNotChange(doNotChange, oldKey));
    }

    if (value instanceof Array) {
      value = arrayToCamelCase(value, getDoNotChange(doNotChange, oldKey));
    }

    newMap[newKey] = value;
  }

  return newMap;
}

export function arrayToCamelCase(array: Array<any>, doNotChange: string[][] = []): Object {

  let newArray: Array<Object> = [];

  array.forEach(function(value) {
    if (!(typeof value === 'string' ||
      value instanceof String ||
      value instanceof Number ||
      value instanceof Boolean ||
      value instanceof Array)) {
      value = mapToCamelCase(value, getDoNotChange(doNotChange, 0));
    }

    if (value instanceof Array) {
      value = arrayToCamelCase(value, getDoNotChange(doNotChange, 0));
    }

    newArray.push(value);
  });

  return newArray;
}

function getDoNotChange(doNotChange: string [][], key: string | number): string[][] {
  let newDoNotChange: string[][] = [];

  doNotChange.forEach(function(list) {
    if (list[0] == key) {
      newDoNotChange.push(list.slice(1));
    }
  });

  return newDoNotChange;
}

function doesNotChange(doNotChange: string[][]): boolean {
  let noChange: boolean = false;

  doNotChange.forEach(function(list) {
    if (list.length == 0) {
      noChange = true;
    }
  });

  return noChange;
}