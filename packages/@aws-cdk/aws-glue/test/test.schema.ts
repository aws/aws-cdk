import { Test } from 'nodeunit';

import glue = require('../lib');

export = {
  'boolean type'(test: Test) {
    test.equals(glue.Schema.boolean.inputString, 'boolean');
    test.equals(glue.Schema.boolean.isPrimitive, true);
    test.done();
  },

  'binary type'(test: Test) {
    test.equals(glue.Schema.binary.inputString, 'binary');
    test.equals(glue.Schema.binary.isPrimitive, true);
    test.done();
  },

  'bigint type'(test: Test) {
    test.equals(glue.Schema.bigint.inputString, 'bigint');
    test.equals(glue.Schema.bigint.isPrimitive, true);
    test.done();
  },

  'double type'(test: Test) {
    test.equals(glue.Schema.double.inputString, 'double');
    test.equals(glue.Schema.double.isPrimitive, true);
    test.done();
  },

  'float type'(test: Test) {
    test.equals(glue.Schema.float.inputString, 'float');
    test.equals(glue.Schema.float.isPrimitive, true);
    test.done();
  },

  'integer type'(test: Test) {
    test.equals(glue.Schema.integer.inputString, 'integer');
    test.equals(glue.Schema.integer.isPrimitive, true);
    test.done();
  },

  'smallint type'(test: Test) {
    test.equals(glue.Schema.smallint.inputString, 'smallint');
    test.equals(glue.Schema.smallint.isPrimitive, true);
    test.done();
  },

  'tinyint type'(test: Test) {
    test.equals(glue.Schema.tinyint.inputString, 'tinyint');
    test.equals(glue.Schema.tinyint.isPrimitive, true);
    test.done();
  },

  'decimal type'(test: Test) {
    test.equals(glue.Schema.decimal(16).inputString, 'decimal(16)');
    test.equals(glue.Schema.decimal(16, 1).inputString, 'decimal(16,1)');
    test.equals(glue.Schema.decimal(16).isPrimitive, true);
    test.equals(glue.Schema.decimal(16, 1).isPrimitive, true);
    test.done();
  },
  // TODO: decimal bounds

  'date type'(test: Test) {
    test.equals(glue.Schema.date.inputString, 'date');
    test.equals(glue.Schema.date.isPrimitive, true);
    test.done();
  },

  'timestamp type'(test: Test) {
    test.equals(glue.Schema.timestamp.inputString, 'timestamp');
    test.equals(glue.Schema.timestamp.isPrimitive, true);
    test.done();
  },

  'string type'(test: Test) {
    test.equals(glue.Schema.string.inputString, 'string');
    test.equals(glue.Schema.string.isPrimitive, true);
    test.done();
  },

  'char type'(test: Test) {
    test.equals(glue.Schema.char(1).inputString, 'char(1)');
    test.equals(glue.Schema.char(1).isPrimitive, true);
    test.done();
  },

  'char length must be at least 1'(test: Test) {
    test.doesNotThrow(() => glue.Schema.char(1));
    test.throws(() => glue.Schema.char(0));
    test.throws(() => glue.Schema.char(-1));
    test.done();
  },

  'char length must be <= 255'(test: Test) {
    test.doesNotThrow(() => glue.Schema.char(255));
    test.throws(() => glue.Schema.char(256));
    test.done();
  },

  'varchar type'(test: Test) {
    test.equals(glue.Schema.varchar(1).inputString, 'varchar(1)');
    test.equals(glue.Schema.varchar(1).isPrimitive, true);
    test.done();
  },

  'varchar length must be at least 1'(test: Test) {
    test.doesNotThrow(() => glue.Schema.varchar(1));
    test.throws(() => glue.Schema.varchar(0));
    test.throws(() => glue.Schema.varchar(-1));
    test.done();
  },

  'varchar length must be <= 65535'(test: Test) {
    test.doesNotThrow(() => glue.Schema.varchar(65535));
    test.throws(() => glue.Schema.varchar(65536));
    test.done();
  },

  'array<string>'(test: Test) {
    const type = glue.Schema.array(glue.Schema.string);
    test.equals(type.inputString, 'array<string>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<char(1)>'(test: Test) {
    const type = glue.Schema.array(glue.Schema.char(1));
    test.equals(type.inputString, 'array<char(1)>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<array>'(test: Test) {
    const type = glue.Schema.array(
      glue.Schema.array(glue.Schema.string));
    test.equals(type.inputString, 'array<array<string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<map>'(test: Test) {
    const type = glue.Schema.array(
      glue.Schema.map(glue.Schema.string, glue.Schema.string));
    test.equals(type.inputString, 'array<map<string,string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'array<struct>'(test: Test) {
    const type = glue.Schema.array(
      glue.Schema.struct([{
        name: 'key',
        type: glue.Schema.string
      }]));
    test.equals(type.inputString, 'array<struct<key:string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,string>'(test: Test) {
    const type = glue.Schema.map(
      glue.Schema.string,
      glue.Schema.string
    );
    test.equals(type.inputString, 'map<string,string>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<integer,string>'(test: Test) {
    const type = glue.Schema.map(
      glue.Schema.integer,
      glue.Schema.string
    );
    test.equals(type.inputString, 'map<integer,string>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<char(1),char(1)>'(test: Test) {
    const type = glue.Schema.map(
      glue.Schema.char(1),
      glue.Schema.char(1)
    );
    test.equals(type.inputString, 'map<char(1),char(1)>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,array>'(test: Test) {
    const type = glue.Schema.map(
      glue.Schema.char(1),
      glue.Schema.array(glue.Schema.string)
    );
    test.equals(type.inputString, 'map<char(1),array<string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,map>'(test: Test) {
    const type = glue.Schema.map(
      glue.Schema.char(1),
      glue.Schema.map(
        glue.Schema.string,
        glue.Schema.string)
    );
    test.equals(type.inputString, 'map<char(1),map<string,string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map<string,struct>'(test: Test) {
    const type = glue.Schema.map(
      glue.Schema.char(1),
      glue.Schema.struct([{
        name: 'key',
        type: glue.Schema.string
      }])
    );
    test.equals(type.inputString, 'map<char(1),struct<key:string>>');
    test.equals(type.isPrimitive, false);
    test.done();
  },

  'map throws if keyType is non-primitive'(test: Test) {
    test.throws(() => glue.Schema.map(
      glue.Schema.array(glue.Schema.string),
      glue.Schema.string
    ));
    test.throws(() => glue.Schema.map(
      glue.Schema.map(glue.Schema.string, glue.Schema.string),
      glue.Schema.string
    ));
    test.throws(() => glue.Schema.map(
      glue.Schema.struct([{
        name: 'key',
        type: glue.Schema.string
      }]),
      glue.Schema.string
    ));
    test.done();
  },

  'struct type'(test: Test) {
    const type = glue.Schema.struct([{
      name: 'primitive',
      type: glue.Schema.string
    }, {
      name: 'with_comment',
      type: glue.Schema.string,
      comment: 'this has a comment'
    }, {
      name: 'array',
      type: glue.Schema.array(glue.Schema.string)
    }, {
      name: 'map',
      type: glue.Schema.map(glue.Schema.string, glue.Schema.string)
    }, {
      name: 'nested_struct',
      type: glue.Schema.struct([{
        name: 'nested',
        type: glue.Schema.string,
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