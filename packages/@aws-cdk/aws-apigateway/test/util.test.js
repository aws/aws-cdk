"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const util_1 = require("../lib/util");
describe('util', () => {
    describe('parseMethodResourcePath', () => {
        test('fails if path does not start with a /', () => {
            expect(() => util_1.parseMethodOptionsPath('foo')).toThrow(/Method options path must start with \'\/\'/);
        });
        test('fails if there are less than two components', () => {
            expect(() => util_1.parseMethodOptionsPath('/')).toThrow(/Method options path must include at least two components/);
            expect(() => util_1.parseMethodOptionsPath('/foo')).toThrow(/Method options path must include at least two components/);
            expect(() => util_1.parseMethodOptionsPath('/foo/')).toThrow(/Invalid HTTP method ""/);
        });
        test('fails if a non-supported http method is used', () => {
            expect(() => util_1.parseMethodOptionsPath('/foo/bar')).toThrow(/Invalid HTTP method "BAR"/);
        });
        test('extracts resource path and method correctly', () => {
            expect(util_1.parseMethodOptionsPath('/foo/GET')).toEqual({ resourcePath: '/~1foo', httpMethod: 'GET' });
            expect(util_1.parseMethodOptionsPath('/foo/bar/GET')).toEqual({ resourcePath: '/~1foo~1bar', httpMethod: 'GET' });
            expect(util_1.parseMethodOptionsPath('/foo/*/GET')).toEqual({ resourcePath: '/~1foo~1*', httpMethod: 'GET' });
            expect(util_1.parseMethodOptionsPath('/*/GET')).toEqual({ resourcePath: '/*', httpMethod: 'GET' });
            expect(util_1.parseMethodOptionsPath('/*/*')).toEqual({ resourcePath: '/*', httpMethod: '*' });
            expect(util_1.parseMethodOptionsPath('//POST')).toEqual({ resourcePath: '/', httpMethod: 'POST' });
        });
    });
    describe('parseAwsApiCall', () => {
        test('fails if "actionParams" is set but "action" is undefined', () => {
            expect(() => util_1.parseAwsApiCall(undefined, undefined, { foo: '123' })).toThrow(/"actionParams" requires that "action" will be set/);
        });
        test('fails since "action" and "path" are mutually exclusive', () => {
            expect(() => util_1.parseAwsApiCall('foo', 'bar')).toThrow(/"path" and "action" are mutually exclusive \(path="foo", action="bar"\)/);
        });
        test('fails if "path" and "action" are both undefined', () => {
            expect(() => util_1.parseAwsApiCall()).toThrow(/Either "path" or "action" are required/);
        });
        test('"path" mode', () => {
            expect(util_1.parseAwsApiCall('my/path')).toEqual({ apiType: 'path', apiValue: 'my/path' });
        });
        test('"action" mode with no parameters', () => {
            expect(util_1.parseAwsApiCall(undefined, 'MyAction')).toEqual({ apiType: 'action', apiValue: 'MyAction' });
        });
        test('"action" mode with parameters (url-encoded)', () => {
            expect(util_1.parseAwsApiCall(undefined, 'GetObject', { Bucket: 'MyBucket', Key: 'MyKey' })).toEqual({
                apiType: 'action',
                apiValue: 'GetObject&Bucket=MyBucket&Key=MyKey',
            });
        });
    });
    describe('JsonSchemaMapper.toCfnJsonSchema', () => {
        test('maps "ref" found under properties', () => {
            const schema = {
                type: lib_1.JsonSchemaType.OBJECT,
                properties: {
                    collection: {
                        type: lib_1.JsonSchemaType.ARRAY,
                        items: {
                            ref: '#/some/reference',
                        },
                        uniqueItems: true,
                    },
                },
                required: ['collection'],
            };
            const actual = util_1.JsonSchemaMapper.toCfnJsonSchema(schema);
            expect(actual).toEqual({
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    collection: {
                        type: 'array',
                        items: {
                            $ref: '#/some/reference',
                        },
                        uniqueItems: true,
                    },
                },
                required: ['collection'],
            });
        });
        test('does not map a "ref" property name', () => {
            const schema = {
                type: lib_1.JsonSchemaType.OBJECT,
                properties: {
                    ref: {
                        type: lib_1.JsonSchemaType.ARRAY,
                        items: {
                            ref: '#/some/reference',
                        },
                        uniqueItems: true,
                    },
                },
                required: ['ref'],
            };
            const actual = util_1.JsonSchemaMapper.toCfnJsonSchema(schema);
            expect(actual).toEqual({
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    ref: {
                        type: 'array',
                        items: {
                            $ref: '#/some/reference',
                        },
                        uniqueItems: true,
                    },
                },
                required: ['ref'],
            });
        });
        test('"default" for enum', () => {
            const schema = {
                type: lib_1.JsonSchemaType.STRING,
                enum: ['green', 'blue', 'red'],
                default: 'blue',
            };
            const actual = util_1.JsonSchemaMapper.toCfnJsonSchema(schema);
            expect(actual).toEqual({
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'string',
                enum: ['green', 'blue', 'red'],
                default: 'blue',
            });
        });
        test('"id" maps to "id" when using DRAFT-04', () => {
            const schema = {
                schema: lib_1.JsonSchemaVersion.DRAFT4,
                id: 'http://json-schema.org/draft-04/schema#',
            };
            const actual = util_1.JsonSchemaMapper.toCfnJsonSchema(schema);
            expect(actual).toEqual({
                $schema: 'http://json-schema.org/draft-04/schema#',
                id: 'http://json-schema.org/draft-04/schema#',
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXRpbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQXVFO0FBQ3ZFLHNDQUF3RjtBQUV4RixRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUNwQixRQUFRLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7WUFDakQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLDZCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDcEcsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyw2QkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1lBQzlHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyw2QkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1lBQ2pILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyw2QkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ2xGLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN4RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsNkJBQXNCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUN4RixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7WUFDdkQsTUFBTSxDQUFDLDZCQUFzQixDQUFDLFVBQVUsQ0FB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LENBQUMsTUFBTTtnQkFDaEMsRUFBRSxFQUFFLHlDQUF5QzthQUM5QyxDQUFDO1lBRUYsTUFBTSxNQUFNLEdBQUcsdUJBQWdCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JCLE9BQU8sRUFBRSx5Q0FBeUM7Z0JBQ2xELEVBQUUsRUFBRSx5Q0FBeUM7YUFDOUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSnNvblNjaGVtYSwgSnNvblNjaGVtYVR5cGUsIEpzb25TY2hlbWFWZXJzaW9uIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEpzb25TY2hlbWFNYXBwZXIsIHBhcnNlQXdzQXBpQ2FsbCwgcGFyc2VNZXRob2RPcHRpb25zUGF0aCB9IGZyb20gJy4uL2xpYi91dGlsJztcblxuZGVzY3JpYmUoJ3V0aWwnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdwYXJzZU1ldGhvZFJlc291cmNlUGF0aCcsICgpID0+IHtcbiAgICB0ZXN0KCdmYWlscyBpZiBwYXRoIGRvZXMgbm90IHN0YXJ0IHdpdGggYSAvJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHBhcnNlTWV0aG9kT3B0aW9uc1BhdGgoJ2ZvbycpKS50b1Rocm93KC9NZXRob2Qgb3B0aW9ucyBwYXRoIG11c3Qgc3RhcnQgd2l0aCBcXCdcXC9cXCcvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIGlmIHRoZXJlIGFyZSBsZXNzIHRoYW4gdHdvIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4gcGFyc2VNZXRob2RPcHRpb25zUGF0aCgnLycpKS50b1Rocm93KC9NZXRob2Qgb3B0aW9ucyBwYXRoIG11c3QgaW5jbHVkZSBhdCBsZWFzdCB0d28gY29tcG9uZW50cy8pO1xuICAgICAgZXhwZWN0KCgpID0+IHBhcnNlTWV0aG9kT3B0aW9uc1BhdGgoJy9mb28nKSkudG9UaHJvdygvTWV0aG9kIG9wdGlvbnMgcGF0aCBtdXN0IGluY2x1ZGUgYXQgbGVhc3QgdHdvIGNvbXBvbmVudHMvKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBwYXJzZU1ldGhvZE9wdGlvbnNQYXRoKCcvZm9vLycpKS50b1Rocm93KC9JbnZhbGlkIEhUVFAgbWV0aG9kIFwiXCIvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIGlmIGEgbm9uLXN1cHBvcnRlZCBodHRwIG1ldGhvZCBpcyB1c2VkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHBhcnNlTWV0aG9kT3B0aW9uc1BhdGgoJy9mb28vYmFyJykpLnRvVGhyb3coL0ludmFsaWQgSFRUUCBtZXRob2QgXCJCQVJcIi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZXh0cmFjdHMgcmVzb3VyY2UgcGF0aCBhbmQgbWV0aG9kIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYXJzZU1ldGhvZE9wdGlvbnNQYXRoKCcvZm9vL0dFVCcpKS50b0VxdWFsKHsgcmVzb3VyY2VQYXRoOiAnL34xZm9vJywgaHR0cE1ldGhvZDogJ0dFVCcgfSk7XG4gICAgICBleHBlY3QocGFyc2VNZXRob2RPcHRpb25zUGF0aCgnL2Zvby9iYXIvR0VUJykpLnRvRXF1YWwoeyByZXNvdXJjZVBhdGg6ICcvfjFmb29+MWJhcicsIGh0dHBNZXRob2Q6ICdHRVQnIH0pO1xuICAgICAgZXhwZWN0KHBhcnNlTWV0aG9kT3B0aW9uc1BhdGgoJy9mb28vKi9HRVQnKSkudG9FcXVhbCh7IHJlc291cmNlUGF0aDogJy9+MWZvb34xKicsIGh0dHBNZXRob2Q6ICdHRVQnIH0pO1xuICAgICAgZXhwZWN0KHBhcnNlTWV0aG9kT3B0aW9uc1BhdGgoJy8qL0dFVCcpKS50b0VxdWFsKHsgcmVzb3VyY2VQYXRoOiAnLyonLCBodHRwTWV0aG9kOiAnR0VUJyB9KTtcbiAgICAgIGV4cGVjdChwYXJzZU1ldGhvZE9wdGlvbnNQYXRoKCcvKi8qJykpLnRvRXF1YWwoeyByZXNvdXJjZVBhdGg6ICcvKicsIGh0dHBNZXRob2Q6ICcqJyB9KTtcbiAgICAgIGV4cGVjdChwYXJzZU1ldGhvZE9wdGlvbnNQYXRoKCcvL1BPU1QnKSkudG9FcXVhbCh7IHJlc291cmNlUGF0aDogJy8nLCBodHRwTWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZUF3c0FwaUNhbGwnLCAoKSA9PiB7XG4gICAgdGVzdCgnZmFpbHMgaWYgXCJhY3Rpb25QYXJhbXNcIiBpcyBzZXQgYnV0IFwiYWN0aW9uXCIgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHBhcnNlQXdzQXBpQ2FsbCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgeyBmb286ICcxMjMnIH0pKS50b1Rocm93KC9cImFjdGlvblBhcmFtc1wiIHJlcXVpcmVzIHRoYXQgXCJhY3Rpb25cIiB3aWxsIGJlIHNldC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFpbHMgc2luY2UgXCJhY3Rpb25cIiBhbmQgXCJwYXRoXCIgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZScsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiBwYXJzZUF3c0FwaUNhbGwoJ2ZvbycsICdiYXInKSkudG9UaHJvdygvXCJwYXRoXCIgYW5kIFwiYWN0aW9uXCIgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZSBcXChwYXRoPVwiZm9vXCIsIGFjdGlvbj1cImJhclwiXFwpLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyBpZiBcInBhdGhcIiBhbmQgXCJhY3Rpb25cIiBhcmUgYm90aCB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4gcGFyc2VBd3NBcGlDYWxsKCkpLnRvVGhyb3coL0VpdGhlciBcInBhdGhcIiBvciBcImFjdGlvblwiIGFyZSByZXF1aXJlZC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnXCJwYXRoXCIgbW9kZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYXJzZUF3c0FwaUNhbGwoJ215L3BhdGgnKSkudG9FcXVhbCh7IGFwaVR5cGU6ICdwYXRoJywgYXBpVmFsdWU6ICdteS9wYXRoJyB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ1wiYWN0aW9uXCIgbW9kZSB3aXRoIG5vIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QocGFyc2VBd3NBcGlDYWxsKHVuZGVmaW5lZCwgJ015QWN0aW9uJykpLnRvRXF1YWwoeyBhcGlUeXBlOiAnYWN0aW9uJywgYXBpVmFsdWU6ICdNeUFjdGlvbicgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdcImFjdGlvblwiIG1vZGUgd2l0aCBwYXJhbWV0ZXJzICh1cmwtZW5jb2RlZCknLCAoKSA9PiB7XG4gICAgICBleHBlY3QocGFyc2VBd3NBcGlDYWxsKHVuZGVmaW5lZCwgJ0dldE9iamVjdCcsIHsgQnVja2V0OiAnTXlCdWNrZXQnLCBLZXk6ICdNeUtleScgfSkpLnRvRXF1YWwoe1xuICAgICAgICBhcGlUeXBlOiAnYWN0aW9uJyxcbiAgICAgICAgYXBpVmFsdWU6ICdHZXRPYmplY3QmQnVja2V0PU15QnVja2V0JktleT1NeUtleScsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0pzb25TY2hlbWFNYXBwZXIudG9DZm5Kc29uU2NoZW1hJywgKCkgPT4ge1xuICAgIHRlc3QoJ21hcHMgXCJyZWZcIiBmb3VuZCB1bmRlciBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2NoZW1hOiBKc29uU2NoZW1hID0ge1xuICAgICAgICB0eXBlOiBKc29uU2NoZW1hVHlwZS5PQkpFQ1QsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBjb2xsZWN0aW9uOiB7XG4gICAgICAgICAgICB0eXBlOiBKc29uU2NoZW1hVHlwZS5BUlJBWSxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHJlZjogJyMvc29tZS9yZWZlcmVuY2UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ2NvbGxlY3Rpb24nXSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFjdHVhbCA9IEpzb25TY2hlbWFNYXBwZXIudG9DZm5Kc29uU2NoZW1hKHNjaGVtYSk7XG4gICAgICBleHBlY3QoYWN0dWFsKS50b0VxdWFsKHtcbiAgICAgICAgJHNjaGVtYTogJ2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hIycsXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgY29sbGVjdGlvbjoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgICRyZWY6ICcjL3NvbWUvcmVmZXJlbmNlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1bmlxdWVJdGVtczogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlZDogWydjb2xsZWN0aW9uJ10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RvZXMgbm90IG1hcCBhIFwicmVmXCIgcHJvcGVydHkgbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNjaGVtYTogSnNvblNjaGVtYSA9IHtcbiAgICAgICAgdHlwZTogSnNvblNjaGVtYVR5cGUuT0JKRUNULFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgcmVmOiB7XG4gICAgICAgICAgICB0eXBlOiBKc29uU2NoZW1hVHlwZS5BUlJBWSxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHJlZjogJyMvc29tZS9yZWZlcmVuY2UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ3JlZiddLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWN0dWFsID0gSnNvblNjaGVtYU1hcHBlci50b0Nmbkpzb25TY2hlbWEoc2NoZW1hKTtcbiAgICAgIGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoe1xuICAgICAgICAkc2NoZW1hOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICByZWY6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICAkcmVmOiAnIy9zb21lL3JlZmVyZW5jZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5pcXVlSXRlbXM6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZWQ6IFsncmVmJ10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ1wiZGVmYXVsdFwiIGZvciBlbnVtJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2NoZW1hOiBKc29uU2NoZW1hID0ge1xuICAgICAgICB0eXBlOiBKc29uU2NoZW1hVHlwZS5TVFJJTkcsXG4gICAgICAgIGVudW06IFsnZ3JlZW4nLCAnYmx1ZScsICdyZWQnXSxcbiAgICAgICAgZGVmYXVsdDogJ2JsdWUnLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWN0dWFsID0gSnNvblNjaGVtYU1hcHBlci50b0Nmbkpzb25TY2hlbWEoc2NoZW1hKTtcbiAgICAgIGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoe1xuICAgICAgICAkc2NoZW1hOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IFsnZ3JlZW4nLCAnYmx1ZScsICdyZWQnXSxcbiAgICAgICAgZGVmYXVsdDogJ2JsdWUnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdcImlkXCIgbWFwcyB0byBcImlkXCIgd2hlbiB1c2luZyBEUkFGVC0wNCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNjaGVtYTogSnNvblNjaGVtYSA9IHtcbiAgICAgICAgc2NoZW1hOiBKc29uU2NoZW1hVmVyc2lvbi5EUkFGVDQsXG4gICAgICAgIGlkOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFjdHVhbCA9IEpzb25TY2hlbWFNYXBwZXIudG9DZm5Kc29uU2NoZW1hKHNjaGVtYSk7XG4gICAgICBleHBlY3QoYWN0dWFsKS50b0VxdWFsKHtcbiAgICAgICAgJHNjaGVtYTogJ2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hIycsXG4gICAgICAgIGlkOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19