"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const reflect = require("jsii-reflect");
const path = require("path");
const jsii2schema_1 = require("../lib/jsii2schema");
const fixturedir = path.join(__dirname, 'fixture');
/* eslint-disable no-console */
// building the decdk schema often does not complete in the default 5 second Jest timeout
jest.setTimeout(60000);
let typesys;
beforeAll(async () => {
    typesys = new reflect.TypeSystem();
    // jsii-compile the fixtures module
    await spawn(require.resolve('jsii/bin/jsii'), { cwd: fixturedir, });
    // load the resulting file system
    await typesys.loadFile(path.join(fixturedir, '.jsii'));
    await typesys.load(path.dirname(require.resolve('@aws-cdk/core/.jsii')));
});
test('schemaForInterface: interface with primitives', async () => {
    // GIVEN
    const defs = {};
    const ctx = jsii2schema_1.SchemaContext.root(defs);
    // WHEN
    const ref = jsii2schema_1.schemaForInterface(typesys.findFqn('fixture.InterfaceWithPrimitives'), ctx);
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
                    description: 'Optional boolean.'
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
/**
 * Version of spawn() that returns a promise
 *
 * Need spawn() so that we can set stdio to inherit so that any jsii errors
 * are propagated outwards.
 */
function spawn(command, options) {
    return new Promise((resolve, reject) => {
        const cp = child_process_1.spawn(command, [], { stdio: 'inherit', ...options });
        cp.on('error', reject);
        cp.on('exit', (code, signal) => {
            if (code === 0) {
                resolve();
            }
            reject(new Error(`Subprocess exited with ${code || signal}`));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY2hlbWEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFrRTtBQUNsRSx3Q0FBd0M7QUFDeEMsNkJBQTZCO0FBQzdCLG9EQUF1RTtBQUV2RSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUVuRCwrQkFBK0I7QUFFL0IseUZBQXlGO0FBQ3pGLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBTSxDQUFDLENBQUM7QUFFeEIsSUFBSSxPQUEyQixDQUFDO0FBRWhDLFNBQVMsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNuQixPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFbkMsbUNBQW1DO0lBQ25DLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsVUFBVSxHQUFJLENBQUMsQ0FBQztJQUVyRSxpQ0FBaUM7SUFDakMsTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdkQsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRSxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxLQUFLLElBQUksRUFBRTtJQUMvRCxRQUFRO0lBQ1IsTUFBTSxJQUFJLEdBQUcsRUFBRyxDQUFDO0lBQ2pCLE1BQU0sR0FBRyxHQUFHLDJCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXJDLE9BQU87SUFDUCxNQUFNLEdBQUcsR0FBRyxnQ0FBa0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFeEYsT0FBTztJQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsK0NBQStDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JGLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQ3BDLGlDQUFpQyxFQUFFO1lBQ2pDLElBQUksRUFBRSxRQUFRO1lBQ2QsS0FBSyxFQUFFLHlCQUF5QjtZQUNoQyxvQkFBb0IsRUFBRSxLQUFLO1lBQzNCLFVBQVUsRUFBRTtnQkFDVixjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLE9BQU87b0JBQ2IsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtvQkFDekIsV0FBVyxFQUFFLG1CQUFtQjtpQkFDakM7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLElBQUksRUFBRSxRQUFRO29CQUNkLG9CQUFvQixFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtpQkFDekM7Z0JBQ0QsY0FBYyxFQUFFO29CQUNkLElBQUksRUFBRSxRQUFRO29CQUNkLFdBQVcsRUFBRSw0QkFBNEI7aUJBQzFDO2dCQUNELGNBQWMsRUFBRTtvQkFDZCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxXQUFXLEVBQUUsNEJBQTRCO2lCQUMxQztnQkFDRCxlQUFlLEVBQUU7b0JBQ2YsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsV0FBVyxFQUFFLG1CQUFtQjtpQkFDakM7YUFDRjtZQUNELFFBQVEsRUFBRTtnQkFDUixnQkFBZ0I7Z0JBQ2hCLGNBQWM7Z0JBQ2QsZ0JBQWdCO2dCQUNoQixnQkFBZ0I7YUFDakI7WUFDRCxPQUFPLEVBQUUsaUNBQWlDO1NBQzNDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSDs7Ozs7R0FLRztBQUNILFNBQVMsS0FBSyxDQUFDLE9BQWUsRUFBRSxPQUFpQztJQUMvRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLE1BQU0sRUFBRSxHQUFHLHFCQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXJFLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQzdCLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtnQkFBRSxPQUFPLEVBQUUsQ0FBQzthQUFFO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQywwQkFBMEIsSUFBSSxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNwYXduIGFzIHNwYXduQXN5bmMsIFNwYXduT3B0aW9ucyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgcmVmbGVjdCBmcm9tICdqc2lpLXJlZmxlY3QnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFNjaGVtYUNvbnRleHQsIHNjaGVtYUZvckludGVyZmFjZSB9IGZyb20gJy4uL2xpYi9qc2lpMnNjaGVtYSc7XG5cbmNvbnN0IGZpeHR1cmVkaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZScpO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbi8vIGJ1aWxkaW5nIHRoZSBkZWNkayBzY2hlbWEgb2Z0ZW4gZG9lcyBub3QgY29tcGxldGUgaW4gdGhlIGRlZmF1bHQgNSBzZWNvbmQgSmVzdCB0aW1lb3V0XG5qZXN0LnNldFRpbWVvdXQoNjBfMDAwKTtcblxubGV0IHR5cGVzeXM6IHJlZmxlY3QuVHlwZVN5c3RlbTtcblxuYmVmb3JlQWxsKGFzeW5jICgpID0+IHtcbiAgdHlwZXN5cyA9IG5ldyByZWZsZWN0LlR5cGVTeXN0ZW0oKTtcblxuICAvLyBqc2lpLWNvbXBpbGUgdGhlIGZpeHR1cmVzIG1vZHVsZVxuICBhd2FpdCBzcGF3bihyZXF1aXJlLnJlc29sdmUoJ2pzaWkvYmluL2pzaWknKSwgeyBjd2Q6IGZpeHR1cmVkaXIsICB9KTtcblxuICAvLyBsb2FkIHRoZSByZXN1bHRpbmcgZmlsZSBzeXN0ZW1cbiAgYXdhaXQgdHlwZXN5cy5sb2FkRmlsZShwYXRoLmpvaW4oZml4dHVyZWRpciwgJy5qc2lpJykpO1xuICBhd2FpdCB0eXBlc3lzLmxvYWQocGF0aC5kaXJuYW1lKHJlcXVpcmUucmVzb2x2ZSgnQGF3cy1jZGsvY29yZS8uanNpaScpKSk7XG59KTtcblxudGVzdCgnc2NoZW1hRm9ySW50ZXJmYWNlOiBpbnRlcmZhY2Ugd2l0aCBwcmltaXRpdmVzJywgYXN5bmMgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBkZWZzID0geyB9O1xuICBjb25zdCBjdHggPSBTY2hlbWFDb250ZXh0LnJvb3QoZGVmcyk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCByZWYgPSBzY2hlbWFGb3JJbnRlcmZhY2UodHlwZXN5cy5maW5kRnFuKCdmaXh0dXJlLkludGVyZmFjZVdpdGhQcmltaXRpdmVzJyksIGN0eCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QocmVmKS50b1N0cmljdEVxdWFsKHsgJHJlZjogJyMvZGVmaW5pdGlvbnMvZml4dHVyZS5JbnRlcmZhY2VXaXRoUHJpbWl0aXZlcycgfSk7XG4gIGV4cGVjdChjdHguZGVmaW5pdGlvbnMpLnRvU3RyaWN0RXF1YWwoe1xuICAgICdmaXh0dXJlLkludGVyZmFjZVdpdGhQcmltaXRpdmVzJzoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICB0aXRsZTogJ0ludGVyZmFjZVdpdGhQcmltaXRpdmVzJyxcbiAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYXJyYXlPZlN0cmluZ3M6IHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBcnJheSBvZiBzdHJpbmdzLidcbiAgICAgICAgfSxcbiAgICAgICAgbWFwT2ZOdW1iZXJzOiB7XG4gICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IHsgdHlwZTogJ251bWJlcicgfVxuICAgICAgICB9LFxuICAgICAgICBudW1iZXJQcm9wZXJ0eToge1xuICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBwcm9wZXJ0eSBvZiB0eXBlIG51bWJlci4nXG4gICAgICAgIH0sXG4gICAgICAgIHN0cmluZ1Byb3BlcnR5OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHByb3BlcnR5IG9mIHR5cGUgc3RyaW5nLidcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uYWxCb29sZWFuOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnT3B0aW9uYWwgYm9vbGVhbi4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZXF1aXJlZDogW1xuICAgICAgICAnYXJyYXlPZlN0cmluZ3MnLFxuICAgICAgICAnbWFwT2ZOdW1iZXJzJyxcbiAgICAgICAgJ251bWJlclByb3BlcnR5JyxcbiAgICAgICAgJ3N0cmluZ1Byb3BlcnR5J1xuICAgICAgXSxcbiAgICAgIGNvbW1lbnQ6ICdmaXh0dXJlLkludGVyZmFjZVdpdGhQcmltaXRpdmVzJ1xuICAgIH1cbiAgfSk7XG59KTtcblxuLyoqXG4gKiBWZXJzaW9uIG9mIHNwYXduKCkgdGhhdCByZXR1cm5zIGEgcHJvbWlzZVxuICpcbiAqIE5lZWQgc3Bhd24oKSBzbyB0aGF0IHdlIGNhbiBzZXQgc3RkaW8gdG8gaW5oZXJpdCBzbyB0aGF0IGFueSBqc2lpIGVycm9yc1xuICogYXJlIHByb3BhZ2F0ZWQgb3V0d2FyZHMuXG4gKi9cbmZ1bmN0aW9uIHNwYXduKGNvbW1hbmQ6IHN0cmluZywgb3B0aW9uczogU3Bhd25PcHRpb25zIHwgdW5kZWZpbmVkKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgY3AgPSBzcGF3bkFzeW5jKGNvbW1hbmQsIFtdLCB7IHN0ZGlvOiAnaW5oZXJpdCcsIC4uLm9wdGlvbnMgfSk7XG5cbiAgICBjcC5vbignZXJyb3InLCByZWplY3QpO1xuICAgIGNwLm9uKCdleGl0JywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgaWYgKGNvZGUgPT09IDApIHsgcmVzb2x2ZSgpOyB9XG4gICAgICByZWplY3QobmV3IEVycm9yKGBTdWJwcm9jZXNzIGV4aXRlZCB3aXRoICR7Y29kZSB8fCBzaWduYWx9YCkpO1xuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==