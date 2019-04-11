import { exec as execAsync } from 'child_process';
import reflect = require('jsii-reflect');
import path = require('path');
import { promisify } from 'util';
import { SchemaContext, schemaForInterface } from '../lib/jsii2schema';

const exec = promisify(execAsync);
const fixturedir = path.join(__dirname, 'fixture');

// tslint:disable:no-console

// JSII often does not complete in the default 5 second Jest timeout
jest.setTimeout(10_000);

let typesys: reflect.TypeSystem;

beforeAll(async () => {
  // jsii-compile the fixtures module
  await exec(require.resolve('jsii/bin/jsii'), { cwd: fixturedir });

  // load the resulting file system
  typesys = new reflect.TypeSystem();
  await typesys.loadFile(path.join(fixturedir, '.jsii'));
  await typesys.load(path.dirname(require.resolve('@aws-cdk/cdk/.jsii')));
});

test('schemaForInterface: interface with primitives', async () => {
  // GIVEN
  const defs = { };
  const ctx = SchemaContext.root(defs);

  // WHEN
  const ref = schemaForInterface(typesys.findFqn('fixture.InterfaceWithPrimitives'), ctx);

  // THEN
  expect(ref).toStrictEqual({ $ref: '#/definitions/fixture.InterfaceWithPrimitives' });
  expect(ctx.definitions).toStrictEqual({
    'fixture.InterfaceWithPrimitives': {
      type: 'object',
      title: 'InterfaceWithPrimitives',
      additionalProperties: false,
      properties: {
        arrayOfStrings: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of strings.'
        },
        mapOfNumbers: {
          type: 'object',
          additionalProperties: { type: 'number' }
        },
        numberProperty: {
          type: 'number',
          description: 'A property of type number.'
        },
        stringProperty: {
          type: 'string',
          description: 'A property of type string.'
        },
        optionalBoolean: {
          type: 'boolean',
          description: 'Optional boolean'
        }
      },
      required: [
        'arrayOfStrings',
        'mapOfNumbers',
        'numberProperty',
        'stringProperty'
      ],
      comment: 'fixture.InterfaceWithPrimitives'
    }
  });
});
