import { Test } from 'nodeunit';

import { Schema } from '../lib';

export = {
  'boolean type'(test: Test) {
    test.equals(Schema.BOOLEAN.inputString, 'boolean');
    test.equals(Schema.BOOLEAN.isPrimitive, true);
    test.done();
  },

  'binary type'(test: Test) {
    test.equals(Schema.BINARY.inputString, 'binary');
    test.equals(Schema.BINARY.isPrimitive, true);
    test.done();
  },

  'bigint type'(test: Test) {
    test.equals(Schema.BIG_INT.inputString, 'bigint');
    test.equals(Schema.BIG_INT.isPrimitive, true);
    test.done();
  },

  'double type'(test: Test) {
    test.equals(Schema.DOUBLE.inputString, 'double');
    test.equals(Schema.DOUBLE.isPrimitive, true);
    test.done();
  },

  'float type'(test: Test) {
    test.equals(Schema.FLOAT.inputString, 'float');
    test.equals(Schema.FLOAT.isPrimitive, true);
    test.done();
  },

  'integer type'(test: Test) {
    test.equals(Schema.INTEGER.inputString, 'int');
    test.equals(Schema.INTEGER.isPrimitive, true);
    test.done();
  },

  'smallint type'(test: Test) {
    test.equals(Schema.SMALL_INT.inputString, 'smallint');
    test.equals(Schema.SMALL_INT.isPrimitive, true);
    test.done();
  },

  'tinyint type'(test: Test) {
    test.equals(Schema.TINY_INT.inputString, 'tinyint');
    test.equals(Schema.TINY_INT.isPrimitive, true);
    test.done();
  },

  'decimal type'(test: Test) {
    test.equals(Schema.decimal(16).inputString, 'decimal(16)');
    test.equals(Schema.decimal(16, 1).inputString, 'decimal(16,1)');
    test.equals(Schema.decimal(16).isPrimitive, true);
    test.equals(Schema.decimal(16, 1).isPrimitive, true);
    test.done();
  },
  // TODO: decimal bounds

  'date type'(test: Test) {
    test.equals(Schema.DATE.inputString, 'date');
    test.equals(Schema.DATE.isPrimitive, true);
    test.done();
  },

  'timestamp type'(test: Test) {
    test.equals(Schema.TIMESTAMP.inputString, 'timestamp');
    test.equals(Schema.TIMESTAMP.isPrimitive, true);
    test.done();
  },

  'string type'(test: Test) {
    test.equals(Schema.STRING.inputString, 'string');
    test.equals(Schema.STRING.isPrimitive, true);
    test.done();
  },

  'char type'(test: Test) {
    test.equals(Schema.char(1).inputString, 'char(1)');
    test.equals(Schema.char(1).isPrimitive, true);
    test.done();
  },

  'char length must be at least 1'(test: Test) {
    test.doesNotThrow(() => Schema.char(1));
    test.throws(() => Schema.char(0));
    test.throws(() => Schema.char(-1));
    test.done();
  },

  'char length must be <= 255'(test: Test) {
    test.doesNotThrow(() => Schema.char(255));
    test.throws(() => Schema.char(256));
    test.done();
  },

  'varchar type'(test: Test) {
    test.equals(Schema.varchar(1).inputString, 'varchar(1)');
    test.equals(Schema.varchar(1).isPrimitive, true);
    test.done();
  },

  'varchar length must be at least 1'(test: Test) {
    test.doesNotThrow(() => Schema.varchar(1));
    test.throws(() => Schema.varchar(0));
    test.throws(() => Schema.varchar(-1));
    test.done();
  },

  'varchar length must be <= 65535'(test: Test) {
    test.doesNotThrow(() => Schema.varchar(65535));
    test.throws(() => Schema.varchar(65536));
    test.done();
  },

  'array<string>'(test: Test) {
    const type = Schema.array(Schema.STRING);
    test.equals(type.inputString, 'array<string>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<char(1)>'(test: Test) {
    const type = Schema.array(Schema.char(1));
    test.equals(type.inputString, 'array<char(1)>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<array>'(test: Test) {
    const type = Schema.array(
      Schema.array(Schema.STRING));
    test.equals(type.inputString, 'array<array<string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<map>'(test: Test) {
    const type = Schema.array(
      Schema.map(Schema.STRING, Schema.STRING));
    test.equals(type.inputString, 'array<map<string,string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<struct>'(test: Test) {
    const type = Schema.array(
      Schema.struct([{
        name: 'key',
        type: Schema.STRING
      }]));
    test.equals(type.inputString, 'array<struct<key:string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,string>'(test: Test) {
    const type = Schema.map(
      Schema.STRING,
      Schema.STRING
    );
    test.equals(type.inputString, 'map<string,string>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<int,string>'(test: Test) {
    const type = Schema.map(
      Schema.INTEGER,
      Schema.STRING
    );
    test.equals(type.inputString, 'map<int,string>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<char(1),char(1)>'(test: Test) {
    const type = Schema.map(
      Schema.char(1),
      Schema.char(1)
    );
    test.equals(type.inputString, 'map<char(1),char(1)>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,array>'(test: Test) {
    const type = Schema.map(
      Schema.char(1),
      Schema.array(Schema.STRING)
    );
    test.equals(type.inputString, 'map<char(1),array<string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,map>'(test: Test) {
    const type = Schema.map(
      Schema.char(1),
      Schema.map(
        Schema.STRING,
        Schema.STRING)
    );
    test.equals(type.inputString, 'map<char(1),map<string,string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,struct>'(test: Test) {
    const type = Schema.map(
      Schema.char(1),
      Schema.struct([{
        name: 'key',
        type: Schema.STRING
      }])
    );
    test.equals(type.inputString, 'map<char(1),struct<key:string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map throws if keyType is non-primitive'(test: Test) {
    test.throws(() => Schema.map(
      Schema.array(Schema.STRING),
      Schema.STRING
    ));
    test.throws(() => Schema.map(
      Schema.map(Schema.STRING, Schema.STRING),
      Schema.STRING
    ));
    test.throws(() => Schema.map(
      Schema.struct([{
        name: 'key',
        type: Schema.STRING
      }]),
      Schema.STRING
    ));
    test.done();
  },

  'struct type'(test: Test) {
    const type = Schema.struct([{
      name: 'primitive',
      type: Schema.STRING
    }, {
      name: 'with_comment',
      type: Schema.STRING,
      comment: 'this has a comment'
    }, {
      name: 'array',
      type: Schema.array(Schema.STRING)
    }, {
      name: 'map',
      type: Schema.map(Schema.STRING, Schema.STRING)
    }, {
      name: 'nested_struct',
      type: Schema.struct([{
        name: 'nested',
        type: Schema.STRING,
        comment: 'nested comment'
      }])
    }]);

    test.equals(type.isPrimitive, false);
    test.equals(
      type.inputString,
      // eslint-disable-next-line max-len
      `struct<primitive:string,with_comment:string COMMENT 'this has a comment',array:array<string>,map:map<string,string>,nested_struct:struct<nested:string COMMENT 'nested comment'>>`);
    test.done();
  }
};