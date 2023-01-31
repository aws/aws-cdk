

export class QsFunctions {
  // TODO document, make sure this works, and maybe apply it to other objects in other files.

  public static mapToCamelCase(map: { [key: string]: any }, doNotChange: string[][] = []): Object {

    let newMap: { [key: string]: Object } = {};

    for (const k in map) {
      let oldKey = k;
      let newKey = k.charAt(0).toLowerCase() + k.slice(1);
      let value = map[oldKey];

      if (QsFunctions.doesNotChange(doNotChange)) {
        newKey = oldKey;
      }

      if (!(typeof value === 'string' ||
        value instanceof String ||
        value instanceof Number ||
        value instanceof Boolean ||
        value instanceof Array)) {
        value = QsFunctions.mapToCamelCase(value, QsFunctions.getDoNotChange(doNotChange, oldKey));
      }

      if (value instanceof Array) {
        value = QsFunctions.arrayToCamelCase(value, QsFunctions.getDoNotChange(doNotChange, oldKey));
      }

      newMap[newKey] = value;
    }

    return newMap;
  }

  public static arrayToCamelCase(array: Array<any>, doNotChange: string[][] = []): Object {

    let newArray: Array<Object> = [];

    array.forEach(function(value) {
      if (!(typeof value === 'string' ||
        value instanceof String ||
        value instanceof Number ||
        value instanceof Boolean ||
        value instanceof Array)) {
        value = QsFunctions.mapToCamelCase(value, QsFunctions.getDoNotChange(doNotChange, 0));
      }

      if (value instanceof Array) {
        value = QsFunctions.arrayToCamelCase(value, QsFunctions.getDoNotChange(doNotChange, 0));
      }

      newArray.push(value);
    });

    return newArray;
  }

  private static getDoNotChange(doNotChange: string [][], key: string | number): string[][] {
    let newDoNotChange: string[][] = [];

    doNotChange.forEach(function(list) {
      if (list[0] == key) {
        newDoNotChange.push(list.slice(1));
      }
    });

    return newDoNotChange;
  }

  private static doesNotChange(doNotChange: string[][]): boolean {
    let doesNotChange: boolean = false;

    doNotChange.forEach(function(list) {
      if (list.length == 0) {
        doesNotChange = true;
      }
    });

    return doesNotChange;
  }
}