import { Test } from 'nodeunit';
import { JsonSchema, JsonSchemaMapper, JsonSchemaSchema } from '../lib';

export = {
    'toCfnJsonSchema adds missing $ character into schema property'(test: Test) {
        // GIVEN
        const schema: JsonSchema = {
            schema: JsonSchemaSchema.draft4,
            title: 'This model references Scooby Doo',
            type: 'object',
            properties: {
                name: { type: 'string' }
            },
        };

        // THEN
        test.deepEqual(JsonSchemaMapper.toCfnJsonSchema(schema), {
            $schema: 'http://json-schema.org/draft-04/schema#',
            title: 'This model references Scooby Doo',
            type: 'object',
            properties: {
                name: { type: 'string' },
            },
        });
        test.done();
    },
    'toCfnJsonSchema adds missing $ character into ref property'(test: Test) {
        // GIVEN
        const schema: JsonSchema = {
            title: 'This model references Happy Days',
            type: 'object',
            properties: {
                season: { type: 'object', ref: 'https://apigateway.amazonaws.com/restapis/oiwjeoifwej/models/HappyDaysSeason' },
            },
        };

        // THEN
        test.deepEqual(JsonSchemaMapper.toCfnJsonSchema(schema), {
            title: 'This model references Happy Days',
            type: 'object',
            properties: {
                season: { type: 'object', $ref: 'https://apigateway.amazonaws.com/restapis/oiwjeoifwej/models/HappyDaysSeason' },
            },
        });
        test.done();
    },

    'toCfnJsonSchema does not accidentally replace ref or schema in schema values'(test: Test) {
        // GIVEN
        const schema: JsonSchema = {
            schema: JsonSchemaSchema.draft4,
            title: 'This is a schema full of "ref": fun and also some "schema":',
        };

        // THEN
        test.deepEqual(JsonSchemaMapper.toCfnJsonSchema(schema), {
            $schema: 'http://json-schema.org/draft-04/schema#',
            title: 'This is a schema full of "ref": fun and also some "schema":',
        });

        test.done();
    }
};