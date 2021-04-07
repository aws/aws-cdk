import '@aws-cdk/assert-internal/jest';
import { doesNotThrow, equal, throws } from 'assert';
import { Schema } from '../lib';

test('boolean type', () => {
  equal(Schema.BOOLEAN.inputString, 'boolean');
  equal(Schema.BOOLEAN.isPrimitive, true);
});

test('binary type', () => {
  equal(Schema.BINARY.inputString, 'binary');
  equal(Schema.BINARY.isPrimitive, true);
});

test('bigint type', () => {
  equal(Schema.BIG_INT.inputString, 'bigint');
  equal(Schema.BIG_INT.isPrimitive, true);
});

test('double type', () => {
  equal(Schema.DOUBLE.inputString, 'double');
  equal(Schema.DOUBLE.isPrimitive, true);
});

test('float type', () => {
  equal(Schema.FLOAT.inputString, 'float');
  equal(Schema.FLOAT.isPrimitive, true);
});

test('integer type', () => {
  equal(Schema.INTEGER.inputString, 'int');
  equal(Schema.INTEGER.isPrimitive, true);
});

test('smallint type', () => {
  equal(Schema.SMALL_INT.inputString, 'smallint');
  equal(Schema.SMALL_INT.isPrimitive, true);
});

test('tinyint type', () => {
  equal(Schema.TINY_INT.inputString, 'tinyint');
  equal(Schema.TINY_INT.isPrimitive, true);
});

test('decimal type', () => {
  equal(Schema.decimal(16).inputString, 'decimal(16)');
  equal(Schema.decimal(16, 1).inputString, 'decimal(16,1)');
  equal(Schema.decimal(16).isPrimitive, true);
  equal(Schema.decimal(16, 1).isPrimitive, true);
});
// TODO: decimal bounds

test('date type', () => {
  equal(Schema.DATE.inputString, 'date');
  equal(Schema.DATE.isPrimitive, true);
});

test('timestamp type', () => {
  equal(Schema.TIMESTAMP.inputString, 'timestamp');
  equal(Schema.TIMESTAMP.isPrimitive, true);
});

test('string type', () => {
  equal(Schema.STRING.inputString, 'string');
  equal(Schema.STRING.isPrimitive, true);
});

test('char type', () => {
  equal(Schema.char(1).inputString, 'char(1)');
  equal(Schema.char(1).isPrimitive, true);
});

test('char length must be test(at least 1', () => {
  doesNotThrow(() => Schema.char(1));
  throws(() => Schema.char(0));
  throws(() => Schema.char(-1));
});

test('char length must test(be <= 255', () => {
  doesNotThrow(() => Schema.char(255));
  throws(() => Schema.char(256));
});

test('varchar type', () => {
  equal(Schema.varchar(1).inputString, 'varchar(1)');
  equal(Schema.varchar(1).isPrimitive, true);
});

test('varchar length must be test(at least 1', () => {
  doesNotThrow(() => Schema.varchar(1));
  throws(() => Schema.varchar(0));
  throws(() => Schema.varchar(-1));
});

test('varchar length must test(be <= 65535', () => {
  doesNotThrow(() => Schema.varchar(65535));
  throws(() => Schema.varchar(65536));
});

test('test(array<string>', () => {
  const type = Schema.array(Schema.STRING);
  equal(type.inputString, 'array<string>');
  equal(type.isPrimitive, false);
});

test('array<test(char(1)>', () => {
  const type = Schema.array(Schema.char(1));
  equal(type.inputString, 'array<char(1)>');
  equal(type.isPrimitive, false);
});

test('test(array<array>', () => {
  const type = Schema.array(
    Schema.array(Schema.STRING));
  equal(type.inputString, 'array<array<string>>');
  equal(type.isPrimitive, false);
});

test('test(array<map>', () => {
  const type = Schema.array(
    Schema.map(Schema.STRING, Schema.STRING));
  equal(type.inputString, 'array<map<string,string>>');
  equal(type.isPrimitive, false);
});

test('test(array<struct>', () => {
  const type = Schema.array(
    Schema.struct([{
      name: 'key',
      type: Schema.STRING,
    }]));
  equal(type.inputString, 'array<struct<key:string>>');
  equal(type.isPrimitive, false);
});

test('map<test(string,string>', () => {
  const type = Schema.map(
    Schema.STRING,
    Schema.STRING,
  );
  equal(type.inputString, 'map<string,string>');
  equal(type.isPrimitive, false);
});

test('map<test(int,string>', () => {
  const type = Schema.map(
    Schema.INTEGER,
    Schema.STRING,
  );
  equal(type.inputString, 'map<int,string>');
  equal(type.isPrimitive, false);
});

test('map<char(1),test(char(1)>', () => {
  const type = Schema.map(
    Schema.char(1),
    Schema.char(1),
  );
  equal(type.inputString, 'map<char(1),char(1)>');
  equal(type.isPrimitive, false);
});

test('map<test(string,array>', () => {
  const type = Schema.map(
    Schema.char(1),
    Schema.array(Schema.STRING),
  );
  equal(type.inputString, 'map<char(1),array<string>>');
  equal(type.isPrimitive, false);
});

test('map<test(string,map>', () => {
  const type = Schema.map(
    Schema.char(1),
    Schema.map(
      Schema.STRING,
      Schema.STRING),
  );
  equal(type.inputString, 'map<char(1),map<string,string>>');
  equal(type.isPrimitive, false);
});

test('map<test(string,struct>', () => {
  const type = Schema.map(
    Schema.char(1),
    Schema.struct([{
      name: 'key',
      type: Schema.STRING,
    }]),
  );
  equal(type.inputString, 'map<char(1),struct<key:string>>');
  equal(type.isPrimitive, false);
});

test('map throws if keyType is test(non-primitive', () => {
  throws(() => Schema.map(
    Schema.array(Schema.STRING),
    Schema.STRING,
  ));
  throws(() => Schema.map(
    Schema.map(Schema.STRING, Schema.STRING),
    Schema.STRING,
  ));
  throws(() => Schema.map(
    Schema.struct([{
      name: 'key',
      type: Schema.STRING,
    }]),
    Schema.STRING,
  ));
});

test('struct type', () => {
  const type = Schema.struct([{
    name: 'primitive',
    type: Schema.STRING,
  }, {
    name: 'with_comment',
    type: Schema.STRING,
    comment: 'this has a comment',
  }, {
    name: 'array',
    type: Schema.array(Schema.STRING),
  }, {
    name: 'map',
    type: Schema.map(Schema.STRING, Schema.STRING),
  }, {
    name: 'nested_struct',
    type: Schema.struct([{
      name: 'nested',
      type: Schema.STRING,
      comment: 'nested comment',
    }]),
  }]);

  equal(type.isPrimitive, false);
  equal(
    type.inputString,
    // eslint-disable-next-line max-len
    'struct<primitive:string,with_comment:string COMMENT \'this has a comment\',array:array<string>,map:map<string,string>,nested_struct:struct<nested:string COMMENT \'nested comment\'>>');
});