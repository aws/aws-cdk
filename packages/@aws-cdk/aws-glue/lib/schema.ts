/**
 * A column of a table.
 */
export interface Column {
  /**
   * Name of the column.
   */
  name: string;

  /**
   * Type of the column.
   */
  type: Type;

  /**
   * Coment describing the column.
   *
   * @default none
   */
  comment?: string;
}

export interface Type {
  /**
   * Indicates whether this type is a primitive data type.
   */
  isPrimitive: boolean;

  /**
   * Glue InputString for this type.
   */
  inputString: string;
}

/**
 * @see https://docs.aws.amazon.com/athena/latest/ug/data-types.html
 */
export class Schema {
  public static readonly boolean: Type = {
    isPrimitive: true,
    inputString: 'boolean'
  };

  public static readonly binary: Type = {
    isPrimitive: true,
    inputString: 'binary'
  };

  /**
   * A 64-bit signed INTEGER in two’s complement format, with a minimum value of -2^63 and a maximum value of 2^63-1.
   */
  public static readonly bigint: Type = {
    isPrimitive: true,
    inputString: 'bigint'
  };

  public static readonly double: Type = {
    isPrimitive: true,
    inputString: 'double'
  };

  public static readonly float: Type = {
    isPrimitive: true,
    inputString: 'float'
  };

  /**
   * A 32-bit signed INTEGER in two’s complement format, with a minimum value of -2^31 and a maximum value of 2^31-1.
   */
  public static readonly integer: Type = {
    isPrimitive: true,
    inputString: 'integer'
  };

  /**
   * A 16-bit signed INTEGER in two’s complement format, with a minimum value of -2^15 and a maximum value of 2^15-1.
   */
  public static readonly smallint: Type = {
    isPrimitive: true,
    inputString: 'smallint'
  };

  /**
   * A 8-bit signed INTEGER in two’s complement format, with a minimum value of -2^7 and a maximum value of 2^7-1
   */
  public static readonly tinyint: Type = {
    isPrimitive: true,
    inputString: 'tinyint'
  };

  /**
   * Date type.
   */
  public static readonly date: Type = {
    isPrimitive: true,
    inputString: 'date'
  };

  /**
   * Timestamp type (date and time).
   */
  public static readonly timestamp: Type = {
    isPrimitive: true,
    inputString: 'timestamp'
  };

  /**
   * Arbitrary-length string type.
   */
  public static readonly string: Type = {
    isPrimitive: true,
    inputString: 'string'
  };

  /**
   * Creates a decimal type.
   *
   * TODO: Bounds
   *
   * @param precision the total number of digits
   * @param scale the number of digits in fractional part, the default is 0
   */
  public static decimal(precision: number, scale?: number): Type {
    return {
      isPrimitive: true,
      inputString: scale !== undefined ? `decimal(${precision},${scale})` : `decimal(${precision})`
    };
  }

  /**
   * Fixed length character data, with a specified length between 1 and 255.
   *
   * @param length length between 1 and 255
   */
  public static char(length: number): Type {
    if (length <= 0 || length > 255) {
      throw new Error(`char length must be (inclusively) between 1 and 255, but was ${length}`);
    }
    if (length % 1 !== 0) {
      throw new Error(`char length must be a positive integer, was ${length}`);
    }
    return {
      isPrimitive: true,
      inputString: `char(${length})`
    };
  }

  /**
   * Variable length character data, with a specified length between 1 and 65535.
   *
   * @param length length between 1 and 65535.
   */
  public static varchar(length: number): Type {
    if (length <= 0 || length > 65535) {
      throw new Error(`varchar length must be (inclusively) between 1 and 65535, but was ${length}`);
    }
    if (length % 1 !== 0) {
      throw new Error(`varchar length must be a positive integer, was ${length}`);
    }
    return {
      isPrimitive: true,
      inputString: `varchar(${length})`
    };
  }

  /**
   * Creates an array of some other type.
   *
   * @param itemType type contained by the array.
   */
  public static array(itemType: Type): Type {
    return {
      isPrimitive: false,
      inputString: `array<${itemType.inputString}>`
    };
  }

  /**
   * Creates a map of some primitive key type to some value type.
   *
   * @param keyType type of key, must be a primitive.
   * @param valueType type fo the value indexed by the key.
   */
  public static map(keyType: Type, valueType: Type): Type {
    if (!keyType.isPrimitive) {
      throw new Error(`the key type of a 'map' must be a primitive, but was ${keyType.inputString}`);
    }
    return {
      isPrimitive: false,
      inputString: `map<${keyType.inputString},${valueType.inputString}>`
    };
  }

  /**
   * Creates a nested structure containing individuall named and typed columns.
   *
   * @param columns the columns of the structure.
   */
  public static struct(columns: Column[]): Type {
    return {
      isPrimitive: false,
      inputString: `struct<${columns.map(column => {
        if (column.comment === undefined) {
          return `${column.name}:${column.type.inputString}`;
        } else {
          return `${column.name}:${column.type.inputString} COMMENT '${column.comment}'`;
        }
      }).join(',')}>`
    };
  }
}
