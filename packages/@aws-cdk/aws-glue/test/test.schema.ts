import { Test } from 'nodeunit';

import { Schema } from '../lib';

export = {
  'boolean type'(test: Test) {
    test.equals(Schema.boolean.inputString, 'boolean');
    test.equals(Schema.boolean.isPrimitive, true);
    test.done();
  },

  'binary type'(test: Test) {
    test.equals(Schema.binary.inputString, 'binary');
    test.equals(Schema.binary.isPrimitive, true);
    test.done();
  },

  'bigint type'(test: Test) {
    test.equals(Schema.bigint.inputString, 'bigint');
    test.equals(Schema.bigint.isPrimitive, true);
    test.done();
  },

  'double type'(test: Test) {
    test.equals(Schema.double.inputString, 'double');
    test.equals(Schema.double.isPrimitive, true);
    test.done();
  },

  'float type'(test: Test) {
    test.equals(Schema.float.inputString, 'float');
    test.equals(Schema.float.isPrimitive, true);
    test.done();
  },

  'integer type'(test: Test) {
    test.equals(Schema.integer.inputString, 'int');
    test.equals(Schema.integer.isPrimitive, true);
    test.done();
  },

  'smallint type'(test: Test) {
    test.equals(Schema.smallint.inputString, 'smallint');
    test.equals(Schema.smallint.isPrimitive, true);
    test.done();
  },

  'tinyint type'(test: Test) {
    test.equals(Schema.tinyint.inputString, 'tinyint');
    test.equals(Schema.tinyint.isPrimitive, true);
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
    test.equals(Schema.date.inputString, 'date');
    test.equals(Schema.date.isPrimitive, true);
    test.done();
  },

  'timestamp type'(test: Test) {
    test.equals(Schema.timestamp.inputString, 'timestamp');
    test.equals(Schema.timestamp.isPrimitive, true);
    test.done();
  },

  'string type'(test: Test) {
    test.equals(Schema.string.inputString, 'string');
    test.equals(Schema.string.isPrimitive, true);
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
    const type = Schema.array(Schema.string);
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
      Schema.array(Schema.string));
    test.equals(type.inputString, 'array<array<string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<map>'(test: Test) {
    const type = Schema.array(
      Schema.map(Schema.string, Schema.string));
    test.equals(type.inputString, 'array<map<string,string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<struct>'(test: Test) {
    const type = Schema.array(
      Schema.struct([{
        name: 'key',
        type: Schema.string
      }]));
    test.equals(type.inputString, 'array<struct<key:string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,string>'(test: Test) {
    const type = Schema.map(
      Schema.string,
      Schema.string
    );
    test.equals(type.inputString, 'map<string,string>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<int,string>'(test: Test) {
    const type = Schema.map(
      Schema.integer,
      Schema.string
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
      Schema.array(Schema.string)
    );
    test.equals(type.inputString, 'map<char(1),array<string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,map>'(test: Test) {
    const type = Schema.map(
      Schema.char(1),
      Schema.map(
        Schema.string,
        Schema.string)
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
        type: Schema.string
      }])
    );
    test.equals(type.inputString, 'map<char(1),struct<key:string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map throws if keyType is non-primitive'(test: Test) {
    test.throws(() => Schema.map(
      Schema.array(Schema.string),
      Schema.string
    ));
    test.throws(() => Schema.map(
      Schema.map(Schema.string, Schema.string),
      Schema.string
    ));
    test.throws(() => Schema.map(
      Schema.struct([{
        name: 'key',
        type: Schema.string
      }]),
      Schema.string
    ));
    test.done();
  },

  'struct type'(test: Test) {
    const type = Schema.struct([{
      name: 'primitive',
      type: Schema.string
    }, {
      name: 'with_comment',
      type: Schema.string,
      comment: 'this has a comment'
    }, {
      name: 'array',
      type: Schema.array(Schema.string)
    }, {
      name: 'map',
      type: Schema.map(Schema.string, Schema.string)
    }, {
      name: 'nested_struct',
      type: Schema.struct([{
        name: 'nested',
        type: Schema.string,
        comment: 'nested comment'
      }])
    }]);

    test.equals(type.isPrimitive, false);
    test.equals(
      type.inputString,
      // tslint:disable-next-line:max-line-length
      `struct<primitive:string,with_comment:string COMMENT 'this has a comment',array:array<string>,map:map<string,string>,nested_struct:struct<nested:string COMMENT 'nested comment'>>`);
    test.done();
  }
};