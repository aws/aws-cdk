"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const iam = require("../lib");
const lib_1 = require("../lib");
const PRINCIPAL_ARN1 = 'arn:aws:iam::111111111:user/user-name';
const principal1 = new iam.ArnPrincipal(PRINCIPAL_ARN1);
const PRINCIPAL_ARN2 = 'arn:aws:iam::111111111:role/role-name';
const principal2 = new iam.ArnPrincipal(PRINCIPAL_ARN2);
// Check that 'resource' statements are merged, and that 'notResource' statements are not,
// if the statements are otherwise the same.
test.each([
    ['resources', true],
    ['notResources', false],
])('merge %p statements: %p', (key, doMerge) => {
    assertMergedC(doMerge, [
        new iam.PolicyStatement({
            [key]: ['a'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            [key]: ['b'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: ['a', 'b'],
            Action: 'service:Action',
            Principal: { AWS: PRINCIPAL_ARN1 },
        },
    ]);
});
// Check that 'action' statements are merged, and that 'notAction' statements are not,
// if the statements are otherwise the same.
test.each([
    ['actions', true],
    ['notActions', false],
])('merge %p statements: %p', (key, doMerge) => {
    assertMergedC(doMerge, [
        new iam.PolicyStatement({
            resources: ['a'],
            [key]: ['service:Action1'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            resources: ['a'],
            [key]: ['service:Action2'],
            principals: [principal1],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: 'a',
            Action: ['service:Action1', 'service:Action2'],
            Principal: { AWS: PRINCIPAL_ARN1 },
        },
    ]);
});
// Check that 'principal' statements are merged, and that 'notPrincipal' statements are not,
// if the statements are otherwise the same.
test.each([
    ['principals', true],
    ['notPrincipals', false],
])('merge %p statements: %p', (key, doMerge) => {
    assertMergedC(doMerge, [
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            [key]: [principal1],
        }),
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            [key]: [principal2],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: 'a',
            Action: 'service:Action',
            Principal: { AWS: [PRINCIPAL_ARN1, PRINCIPAL_ARN2].sort() },
        },
    ]);
});
test('merge multiple types of principals', () => {
    assertMerged([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [new iam.ServicePrincipal('service.amazonaws.com')],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: 'a',
            Action: 'service:Action',
            Principal: {
                AWS: PRINCIPAL_ARN1,
                Service: 'service.amazonaws.com',
            },
        },
    ]);
});
test('multiple mergeable keys are not merged', () => {
    assertNoMerge([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action1'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            resources: ['b'],
            actions: ['service:Action2'],
            principals: [principal1],
        }),
    ]);
});
test('can merge statements without principals', () => {
    assertMerged([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
        }),
        new iam.PolicyStatement({
            resources: ['b'],
            actions: ['service:Action'],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: ['a', 'b'],
            Action: 'service:Action',
        },
    ]);
});
test('if conditions are different, statements are not merged', () => {
    assertNoMerge([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [principal1],
            conditions: {
                StringLike: {
                    something: 'value',
                },
            },
        }),
        new iam.PolicyStatement({
            resources: ['b'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
    ]);
});
test('if conditions are the same, statements are merged', () => {
    assertMerged([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [principal1],
            conditions: {
                StringLike: {
                    something: 'value',
                },
            },
        }),
        new iam.PolicyStatement({
            resources: ['b'],
            actions: ['service:Action'],
            principals: [principal1],
            conditions: {
                StringLike: {
                    something: 'value',
                },
            },
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: ['a', 'b'],
            Action: 'service:Action',
            Principal: { AWS: PRINCIPAL_ARN1 },
            Condition: {
                StringLike: {
                    something: 'value',
                },
            },
        },
    ]);
});
test('also merge Deny statements', () => {
    assertMerged([
        new iam.PolicyStatement({
            effect: iam.Effect.DENY,
            resources: ['a'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            effect: iam.Effect.DENY,
            resources: ['b'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
    ], [
        {
            Effect: 'Deny',
            Resource: ['a', 'b'],
            Action: 'service:Action',
            Principal: { AWS: PRINCIPAL_ARN1 },
        },
    ]);
});
test('merges 3 statements in multiple steps', () => {
    assertMerged([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            resources: ['b'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
        // This can combine with the previous two once they have been merged
        new iam.PolicyStatement({
            resources: ['a', 'b'],
            actions: ['service:Action2'],
            principals: [principal1],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: ['a', 'b'],
            Action: ['service:Action', 'service:Action2'],
            Principal: { AWS: PRINCIPAL_ARN1 },
        },
    ]);
});
test('winnow down literal duplicates', () => {
    assertMerged([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            resources: ['a', 'b'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: ['a', 'b'],
            Action: 'service:Action',
            Principal: { AWS: PRINCIPAL_ARN1 },
        },
    ]);
});
test('winnow down literal duplicates if they are Refs', () => {
    const stack = new core_1.Stack();
    const user1 = new iam.User(stack, 'User1');
    const user2 = new iam.User(stack, 'User2');
    assertMerged([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [user1],
        }),
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [user1, user2],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: 'a',
            Action: 'service:Action',
            Principal: {
                AWS: [
                    { 'Fn::GetAtt': ['User1E278A736', 'Arn'] },
                    { 'Fn::GetAtt': ['User21F1486D1', 'Arn'] },
                ],
            },
        },
    ]);
});
test('merges 2 pairs separately', () => {
    // Merges pairs (0,2) and (1,3)
    assertMerged([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            resources: ['c'],
            actions: ['service:Action1'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            resources: ['b'],
            actions: ['service:Action'],
            principals: [principal1],
        }),
        new iam.PolicyStatement({
            resources: ['c'],
            actions: ['service:Action2'],
            principals: [principal1],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: ['a', 'b'],
            Action: 'service:Action',
            Principal: { AWS: PRINCIPAL_ARN1 },
        },
        {
            Effect: 'Allow',
            Resource: 'c',
            Action: ['service:Action1', 'service:Action2'],
            Principal: { AWS: PRINCIPAL_ARN1 },
        },
    ]);
});
test('do not deep-merge info Refs and GetAtts', () => {
    const stack = new core_1.Stack();
    const user1 = new iam.User(stack, 'User1');
    const user2 = new iam.User(stack, 'User2');
    assertMerged([
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [user1],
        }),
        new iam.PolicyStatement({
            resources: ['a'],
            actions: ['service:Action'],
            principals: [user2],
        }),
    ], [
        {
            Effect: 'Allow',
            Resource: 'a',
            Action: 'service:Action',
            Principal: {
                AWS: [
                    { 'Fn::GetAtt': ['User1E278A736', 'Arn'] },
                    { 'Fn::GetAtt': ['User21F1486D1', 'Arn'] },
                ],
            },
        },
    ]);
});
test('properly merge untyped principals (star)', () => {
    const statements = [
        lib_1.PolicyStatement.fromJson({
            Action: ['service:Action1'],
            Effect: 'Allow',
            Resource: ['Resource'],
            Principal: '*',
        }),
        lib_1.PolicyStatement.fromJson({
            Action: ['service:Action2'],
            Effect: 'Allow',
            Resource: ['Resource'],
            Principal: '*',
        }),
    ];
    assertMerged(statements, [
        {
            Action: ['service:Action1', 'service:Action2'],
            Effect: 'Allow',
            Resource: 'Resource',
            Principal: '*',
        },
    ]);
});
test('fail merging typed and untyped principals', () => {
    const statements = [
        lib_1.PolicyStatement.fromJson({
            Action: ['service:Action'],
            Effect: 'Allow',
            Resource: ['Resource'],
            Principal: '*',
        }),
        lib_1.PolicyStatement.fromJson({
            Action: ['service:Action'],
            Effect: 'Allow',
            Resource: ['Resource'],
            Principal: { AWS: PRINCIPAL_ARN1 },
        }),
    ];
    assertMerged(statements, [
        {
            Action: 'service:Action',
            Effect: 'Allow',
            Resource: 'Resource',
            Principal: '*',
        },
        {
            Action: 'service:Action',
            Effect: 'Allow',
            Resource: 'Resource',
            Principal: { AWS: PRINCIPAL_ARN1 },
        },
    ]);
});
test('keep merging even if it requires multiple passes', () => {
    // [A, R1], [B, R1], [A, R2], [B, R2]
    // -> [{A, B}, R1], [{A, B], R2]
    // -> [{A, B}, {R1, R2}]
    assertMerged([
        new iam.PolicyStatement({
            actions: ['service:A'],
            resources: ['R1'],
        }),
        new iam.PolicyStatement({
            actions: ['service:B'],
            resources: ['R1'],
        }),
        new iam.PolicyStatement({
            actions: ['service:A'],
            resources: ['R2'],
        }),
        new iam.PolicyStatement({
            actions: ['service:B'],
            resources: ['R2'],
        }),
    ], [
        {
            Effect: 'Allow',
            Action: ['service:A', 'service:B'],
            Resource: ['R1', 'R2'],
        },
    ]);
});
test('lazily generated statements are merged correctly', () => {
    assertMerged([
        new LazyStatement((s) => {
            s.addActions('service:A');
            s.addResources('R1');
        }),
        new LazyStatement((s) => {
            s.addActions('service:B');
            s.addResources('R1');
        }),
    ], [
        {
            Effect: 'Allow',
            Action: ['service:A', 'service:B'],
            Resource: 'R1',
        },
    ]);
});
function assertNoMerge(statements) {
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'Stack');
    const regularResult = stack.resolve(new iam.PolicyDocument({ minimize: false, statements }));
    const minResult = stack.resolve(new iam.PolicyDocument({ minimize: true, statements }));
    expect(minResult).toEqual(regularResult);
}
function assertMerged(statements, expected) {
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'Stack');
    const minResult = stack.resolve(new iam.PolicyDocument({ minimize: true, statements }));
    expect(minResult.Statement).toEqual(expected);
}
/**
 * Assert Merged Conditional
 *
 * Based on a boolean, either call assertMerged or assertNoMerge. The 'expected'
 * argument only applies in the case where `doMerge` is true.
 */
function assertMergedC(doMerge, statements, expected) {
    return doMerge ? assertMerged(statements, expected) : assertNoMerge(statements);
}
/**
 * A statement that fills itself only when freeze() is called.
 */
class LazyStatement extends iam.PolicyStatement {
    constructor(modifyMe) {
        super();
        this.modifyMe = modifyMe;
    }
    freeze() {
        this.modifyMe(this);
        return super.freeze();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2Utc3RhdGVtZW50cy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWVyZ2Utc3RhdGVtZW50cy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQTJDO0FBQzNDLDhCQUE4QjtBQUM5QixnQ0FBeUM7QUFFekMsTUFBTSxjQUFjLEdBQUcsdUNBQXVDLENBQUM7QUFDL0QsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRXhELE1BQU0sY0FBYyxHQUFHLHVDQUF1QyxDQUFDO0FBQy9ELE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUV4RCwwRkFBMEY7QUFDMUYsNENBQTRDO0FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDUixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUM7SUFDbkIsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDO0NBQzBCLENBQUMsQ0FDbkQseUJBQXlCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDM0MsYUFBYSxDQUFDLE9BQU8sRUFBRTtRQUNyQixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdEIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNaLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDO1lBQzNCLFVBQVUsRUFBRSxDQUFDLFVBQVUsQ0FBQztTQUN6QixDQUFDO1FBQ0YsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDWixPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUMzQixVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUM7U0FDekIsQ0FBQztLQUNILEVBQUU7UUFDRDtZQUNFLE1BQU0sRUFBRSxPQUFPO1lBQ2YsUUFBUSxFQUFFLENBQUMsR0FB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RSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFeEYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsVUFBaUMsRUFBRSxRQUFlO0lBQ3RFLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7SUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXRDLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFeEYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxhQUFhLENBQUMsT0FBZ0IsRUFBRSxVQUFpQyxFQUFFLFFBQWU7SUFDekYsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsRixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLGFBQWMsU0FBUSxHQUFHLENBQUMsZUFBZTtJQUM3QyxZQUE2QixRQUEwQztRQUNyRSxLQUFLLEVBQUUsQ0FBQztRQURtQixhQUFRLEdBQVIsUUFBUSxDQUFrQztLQUV0RTtJQUVNLE1BQU07UUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3ZCO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IFBvbGljeVN0YXRlbWVudCB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IFBSSU5DSVBBTF9BUk4xID0gJ2Fybjphd3M6aWFtOjoxMTExMTExMTE6dXNlci91c2VyLW5hbWUnO1xuY29uc3QgcHJpbmNpcGFsMSA9IG5ldyBpYW0uQXJuUHJpbmNpcGFsKFBSSU5DSVBBTF9BUk4xKTtcblxuY29uc3QgUFJJTkNJUEFMX0FSTjIgPSAnYXJuOmF3czppYW06OjExMTExMTExMTpyb2xlL3JvbGUtbmFtZSc7XG5jb25zdCBwcmluY2lwYWwyID0gbmV3IGlhbS5Bcm5QcmluY2lwYWwoUFJJTkNJUEFMX0FSTjIpO1xuXG4vLyBDaGVjayB0aGF0ICdyZXNvdXJjZScgc3RhdGVtZW50cyBhcmUgbWVyZ2VkLCBhbmQgdGhhdCAnbm90UmVzb3VyY2UnIHN0YXRlbWVudHMgYXJlIG5vdCxcbi8vIGlmIHRoZSBzdGF0ZW1lbnRzIGFyZSBvdGhlcndpc2UgdGhlIHNhbWUuXG50ZXN0LmVhY2goW1xuICBbJ3Jlc291cmNlcycsIHRydWVdLFxuICBbJ25vdFJlc291cmNlcycsIGZhbHNlXSxcbl0gYXMgQXJyYXk8WydyZXNvdXJjZXMnIHwgJ25vdFJlc291cmNlcycsIGJvb2xlYW5dPilcbignbWVyZ2UgJXAgc3RhdGVtZW50czogJXAnLCAoa2V5LCBkb01lcmdlKSA9PiB7XG4gIGFzc2VydE1lcmdlZEMoZG9NZXJnZSwgW1xuICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIFtrZXldOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIHByaW5jaXBhbHM6IFtwcmluY2lwYWwxXSxcbiAgICB9KSxcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBba2V5XTogWydiJ10sXG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6QWN0aW9uJ10sXG4gICAgICBwcmluY2lwYWxzOiBbcHJpbmNpcGFsMV0sXG4gICAgfSksXG4gIF0sIFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBSZXNvdXJjZTogWydhJywgJ2InXSxcbiAgICAgIEFjdGlvbjogJ3NlcnZpY2U6QWN0aW9uJyxcbiAgICAgIFByaW5jaXBhbDogeyBBV1M6IFBSSU5DSVBBTF9BUk4xIH0sXG4gICAgfSxcbiAgXSk7XG59KTtcblxuLy8gQ2hlY2sgdGhhdCAnYWN0aW9uJyBzdGF0ZW1lbnRzIGFyZSBtZXJnZWQsIGFuZCB0aGF0ICdub3RBY3Rpb24nIHN0YXRlbWVudHMgYXJlIG5vdCxcbi8vIGlmIHRoZSBzdGF0ZW1lbnRzIGFyZSBvdGhlcndpc2UgdGhlIHNhbWUuXG50ZXN0LmVhY2goW1xuICBbJ2FjdGlvbnMnLCB0cnVlXSxcbiAgWydub3RBY3Rpb25zJywgZmFsc2VdLFxuXSBhcyBBcnJheTxbJ2FjdGlvbnMnIHwgJ25vdEFjdGlvbnMnLCBib29sZWFuXT4pXG4oJ21lcmdlICVwIHN0YXRlbWVudHM6ICVwJywgKGtleSwgZG9NZXJnZSkgPT4ge1xuICBhc3NlcnRNZXJnZWRDKGRvTWVyZ2UsIFtcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnYSddLFxuICAgICAgW2tleV06IFsnc2VydmljZTpBY3Rpb24xJ10sXG4gICAgICBwcmluY2lwYWxzOiBbcHJpbmNpcGFsMV0sXG4gICAgfSksXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIFtrZXldOiBbJ3NlcnZpY2U6QWN0aW9uMiddLFxuICAgICAgcHJpbmNpcGFsczogW3ByaW5jaXBhbDFdLFxuICAgIH0pLFxuICBdLCBbXG4gICAge1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUmVzb3VyY2U6ICdhJyxcbiAgICAgIEFjdGlvbjogWydzZXJ2aWNlOkFjdGlvbjEnLCAnc2VydmljZTpBY3Rpb24yJ10sXG4gICAgICBQcmluY2lwYWw6IHsgQVdTOiBQUklOQ0lQQUxfQVJOMSB9LFxuICAgIH0sXG4gIF0pO1xufSk7XG5cbi8vIENoZWNrIHRoYXQgJ3ByaW5jaXBhbCcgc3RhdGVtZW50cyBhcmUgbWVyZ2VkLCBhbmQgdGhhdCAnbm90UHJpbmNpcGFsJyBzdGF0ZW1lbnRzIGFyZSBub3QsXG4vLyBpZiB0aGUgc3RhdGVtZW50cyBhcmUgb3RoZXJ3aXNlIHRoZSBzYW1lLlxudGVzdC5lYWNoKFtcbiAgWydwcmluY2lwYWxzJywgdHJ1ZV0sXG4gIFsnbm90UHJpbmNpcGFscycsIGZhbHNlXSxcbl0gYXMgQXJyYXk8WydwcmluY2lwYWxzJyB8ICdub3RQcmluY2lwYWxzJywgYm9vbGVhbl0+KVxuKCdtZXJnZSAlcCBzdGF0ZW1lbnRzOiAlcCcsIChrZXksIGRvTWVyZ2UpID0+IHtcbiAgYXNzZXJ0TWVyZ2VkQyhkb01lcmdlLCBbXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIFtrZXldOiBbcHJpbmNpcGFsMV0sXG4gICAgfSksXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIFtrZXldOiBbcHJpbmNpcGFsMl0sXG4gICAgfSksXG4gIF0sIFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBSZXNvdXJjZTogJ2EnLFxuICAgICAgQWN0aW9uOiAnc2VydmljZTpBY3Rpb24nLFxuICAgICAgUHJpbmNpcGFsOiB7IEFXUzogW1BSSU5DSVBBTF9BUk4xLCBQUklOQ0lQQUxfQVJOMl0uc29ydCgpIH0sXG4gICAgfSxcbiAgXSk7XG59KTtcblxudGVzdCgnbWVyZ2UgbXVsdGlwbGUgdHlwZXMgb2YgcHJpbmNpcGFscycsICgpID0+IHtcbiAgYXNzZXJ0TWVyZ2VkKFtcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnYSddLFxuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkFjdGlvbiddLFxuICAgICAgcHJpbmNpcGFsczogW3ByaW5jaXBhbDFdLFxuICAgIH0pLFxuICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWydhJ10sXG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6QWN0aW9uJ10sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdzZXJ2aWNlLmFtYXpvbmF3cy5jb20nKV0sXG4gICAgfSksXG4gIF0sIFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBSZXNvdXJjZTogJ2EnLFxuICAgICAgQWN0aW9uOiAnc2VydmljZTpBY3Rpb24nLFxuICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgIEFXUzogUFJJTkNJUEFMX0FSTjEsXG4gICAgICAgIFNlcnZpY2U6ICdzZXJ2aWNlLmFtYXpvbmF3cy5jb20nLFxuICAgICAgfSxcbiAgICB9LFxuICBdKTtcbn0pO1xuXG50ZXN0KCdtdWx0aXBsZSBtZXJnZWFibGUga2V5cyBhcmUgbm90IG1lcmdlZCcsICgpID0+IHtcbiAgYXNzZXJ0Tm9NZXJnZShbXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24xJ10sXG4gICAgICBwcmluY2lwYWxzOiBbcHJpbmNpcGFsMV0sXG4gICAgfSksXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2InXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24yJ10sXG4gICAgICBwcmluY2lwYWxzOiBbcHJpbmNpcGFsMV0sXG4gICAgfSksXG4gIF0pO1xufSk7XG5cbnRlc3QoJ2NhbiBtZXJnZSBzdGF0ZW1lbnRzIHdpdGhvdXQgcHJpbmNpcGFscycsICgpID0+IHtcbiAgYXNzZXJ0TWVyZ2VkKFtcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnYSddLFxuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkFjdGlvbiddLFxuICAgIH0pLFxuICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWydiJ10sXG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6QWN0aW9uJ10sXG4gICAgfSksXG4gIF0sIFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBSZXNvdXJjZTogWydhJywgJ2InXSxcbiAgICAgIEFjdGlvbjogJ3NlcnZpY2U6QWN0aW9uJyxcbiAgICB9LFxuICBdKTtcbn0pO1xuXG50ZXN0KCdpZiBjb25kaXRpb25zIGFyZSBkaWZmZXJlbnQsIHN0YXRlbWVudHMgYXJlIG5vdCBtZXJnZWQnLCAoKSA9PiB7XG4gIGFzc2VydE5vTWVyZ2UoW1xuICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWydhJ10sXG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6QWN0aW9uJ10sXG4gICAgICBwcmluY2lwYWxzOiBbcHJpbmNpcGFsMV0sXG4gICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgIFN0cmluZ0xpa2U6IHtcbiAgICAgICAgICBzb21ldGhpbmc6ICd2YWx1ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWydiJ10sXG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6QWN0aW9uJ10sXG4gICAgICBwcmluY2lwYWxzOiBbcHJpbmNpcGFsMV0sXG4gICAgfSksXG4gIF0pO1xufSk7XG5cbnRlc3QoJ2lmIGNvbmRpdGlvbnMgYXJlIHRoZSBzYW1lLCBzdGF0ZW1lbnRzIGFyZSBtZXJnZWQnLCAoKSA9PiB7XG4gIGFzc2VydE1lcmdlZChbXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIHByaW5jaXBhbHM6IFtwcmluY2lwYWwxXSxcbiAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICAgIHNvbWV0aGluZzogJ3ZhbHVlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2InXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIHByaW5jaXBhbHM6IFtwcmluY2lwYWwxXSxcbiAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICAgIHNvbWV0aGluZzogJ3ZhbHVlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sIFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBSZXNvdXJjZTogWydhJywgJ2InXSxcbiAgICAgIEFjdGlvbjogJ3NlcnZpY2U6QWN0aW9uJyxcbiAgICAgIFByaW5jaXBhbDogeyBBV1M6IFBSSU5DSVBBTF9BUk4xIH0sXG4gICAgICBDb25kaXRpb246IHtcbiAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICAgIHNvbWV0aGluZzogJ3ZhbHVlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgXSk7XG59KTtcblxudGVzdCgnYWxzbyBtZXJnZSBEZW55IHN0YXRlbWVudHMnLCAoKSA9PiB7XG4gIGFzc2VydE1lcmdlZChbXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkRFTlksXG4gICAgICByZXNvdXJjZXM6IFsnYSddLFxuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkFjdGlvbiddLFxuICAgICAgcHJpbmNpcGFsczogW3ByaW5jaXBhbDFdLFxuICAgIH0pLFxuICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5ERU5ZLFxuICAgICAgcmVzb3VyY2VzOiBbJ2InXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIHByaW5jaXBhbHM6IFtwcmluY2lwYWwxXSxcbiAgICB9KSxcbiAgXSwgW1xuICAgIHtcbiAgICAgIEVmZmVjdDogJ0RlbnknLFxuICAgICAgUmVzb3VyY2U6IFsnYScsICdiJ10sXG4gICAgICBBY3Rpb246ICdzZXJ2aWNlOkFjdGlvbicsXG4gICAgICBQcmluY2lwYWw6IHsgQVdTOiBQUklOQ0lQQUxfQVJOMSB9LFxuICAgIH0sXG4gIF0pO1xufSk7XG5cbnRlc3QoJ21lcmdlcyAzIHN0YXRlbWVudHMgaW4gbXVsdGlwbGUgc3RlcHMnLCAoKSA9PiB7XG4gIGFzc2VydE1lcmdlZChbXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIHByaW5jaXBhbHM6IFtwcmluY2lwYWwxXSxcbiAgICB9KSxcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnYiddLFxuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkFjdGlvbiddLFxuICAgICAgcHJpbmNpcGFsczogW3ByaW5jaXBhbDFdLFxuICAgIH0pLFxuICAgIC8vIFRoaXMgY2FuIGNvbWJpbmUgd2l0aCB0aGUgcHJldmlvdXMgdHdvIG9uY2UgdGhleSBoYXZlIGJlZW4gbWVyZ2VkXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnLCAnYiddLFxuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkFjdGlvbjInXSxcbiAgICAgIHByaW5jaXBhbHM6IFtwcmluY2lwYWwxXSxcbiAgICB9KSxcbiAgXSwgW1xuICAgIHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIFJlc291cmNlOiBbJ2EnLCAnYiddLFxuICAgICAgQWN0aW9uOiBbJ3NlcnZpY2U6QWN0aW9uJywgJ3NlcnZpY2U6QWN0aW9uMiddLFxuICAgICAgUHJpbmNpcGFsOiB7IEFXUzogUFJJTkNJUEFMX0FSTjEgfSxcbiAgICB9LFxuICBdKTtcbn0pO1xuXG50ZXN0KCd3aW5ub3cgZG93biBsaXRlcmFsIGR1cGxpY2F0ZXMnLCAoKSA9PiB7XG4gIGFzc2VydE1lcmdlZChbXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIHByaW5jaXBhbHM6IFtwcmluY2lwYWwxXSxcbiAgICB9KSxcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnYScsICdiJ10sXG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6QWN0aW9uJ10sXG4gICAgICBwcmluY2lwYWxzOiBbcHJpbmNpcGFsMV0sXG4gICAgfSksXG4gIF0sIFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBSZXNvdXJjZTogWydhJywgJ2InXSxcbiAgICAgIEFjdGlvbjogJ3NlcnZpY2U6QWN0aW9uJyxcbiAgICAgIFByaW5jaXBhbDogeyBBV1M6IFBSSU5DSVBBTF9BUk4xIH0sXG4gICAgfSxcbiAgXSk7XG59KTtcblxudGVzdCgnd2lubm93IGRvd24gbGl0ZXJhbCBkdXBsaWNhdGVzIGlmIHRoZXkgYXJlIFJlZnMnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHVzZXIxID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcjEnKTtcbiAgY29uc3QgdXNlcjIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyMicpO1xuXG4gIGFzc2VydE1lcmdlZChbXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIHByaW5jaXBhbHM6IFt1c2VyMV0sXG4gICAgfSksXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIHByaW5jaXBhbHM6IFt1c2VyMSwgdXNlcjJdLFxuICAgIH0pLFxuICBdLCBbXG4gICAge1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUmVzb3VyY2U6ICdhJyxcbiAgICAgIEFjdGlvbjogJ3NlcnZpY2U6QWN0aW9uJyxcbiAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICBBV1M6IFtcbiAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydVc2VyMUUyNzhBNzM2JywgJ0FybiddIH0sXG4gICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnVXNlcjIxRjE0ODZEMScsICdBcm4nXSB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICBdKTtcbn0pO1xuXG50ZXN0KCdtZXJnZXMgMiBwYWlycyBzZXBhcmF0ZWx5JywgKCkgPT4ge1xuICAvLyBNZXJnZXMgcGFpcnMgKDAsMikgYW5kICgxLDMpXG4gIGFzc2VydE1lcmdlZChbXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJ2EnXSxcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBY3Rpb24nXSxcbiAgICAgIHByaW5jaXBhbHM6IFtwcmluY2lwYWwxXSxcbiAgICB9KSxcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnYyddLFxuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkFjdGlvbjEnXSxcbiAgICAgIHByaW5jaXBhbHM6IFtwcmluY2lwYWwxXSxcbiAgICB9KSxcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnYiddLFxuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkFjdGlvbiddLFxuICAgICAgcHJpbmNpcGFsczogW3ByaW5jaXBhbDFdLFxuICAgIH0pLFxuICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWydjJ10sXG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6QWN0aW9uMiddLFxuICAgICAgcHJpbmNpcGFsczogW3ByaW5jaXBhbDFdLFxuICAgIH0pLFxuICBdLCBbXG4gICAge1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUmVzb3VyY2U6IFsnYScsICdiJ10sXG4gICAgICBBY3Rpb246ICdzZXJ2aWNlOkFjdGlvbicsXG4gICAgICBQcmluY2lwYWw6IHsgQVdTOiBQUklOQ0lQQUxfQVJOMSB9LFxuICAgIH0sXG4gICAge1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUmVzb3VyY2U6ICdjJyxcbiAgICAgIEFjdGlvbjogWydzZXJ2aWNlOkFjdGlvbjEnLCAnc2VydmljZTpBY3Rpb24yJ10sXG4gICAgICBQcmluY2lwYWw6IHsgQVdTOiBQUklOQ0lQQUxfQVJOMSB9LFxuICAgIH0sXG4gIF0pO1xufSk7XG5cbnRlc3QoJ2RvIG5vdCBkZWVwLW1lcmdlIGluZm8gUmVmcyBhbmQgR2V0QXR0cycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgdXNlcjEgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyMScpO1xuICBjb25zdCB1c2VyMiA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1VzZXIyJyk7XG5cbiAgYXNzZXJ0TWVyZ2VkKFtcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnYSddLFxuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkFjdGlvbiddLFxuICAgICAgcHJpbmNpcGFsczogW3VzZXIxXSxcbiAgICB9KSxcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnYSddLFxuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkFjdGlvbiddLFxuICAgICAgcHJpbmNpcGFsczogW3VzZXIyXSxcbiAgICB9KSxcbiAgXSwgW1xuICAgIHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIFJlc291cmNlOiAnYScsXG4gICAgICBBY3Rpb246ICdzZXJ2aWNlOkFjdGlvbicsXG4gICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgQVdTOiBbXG4gICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnVXNlcjFFMjc4QTczNicsICdBcm4nXSB9LFxuICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ1VzZXIyMUYxNDg2RDEnLCAnQXJuJ10gfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgXSk7XG59KTtcblxudGVzdCgncHJvcGVybHkgbWVyZ2UgdW50eXBlZCBwcmluY2lwYWxzIChzdGFyKScsICgpID0+IHtcbiAgY29uc3Qgc3RhdGVtZW50cyA9IFtcbiAgICBQb2xpY3lTdGF0ZW1lbnQuZnJvbUpzb24oe1xuICAgICAgQWN0aW9uOiBbJ3NlcnZpY2U6QWN0aW9uMSddLFxuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUmVzb3VyY2U6IFsnUmVzb3VyY2UnXSxcbiAgICAgIFByaW5jaXBhbDogJyonLFxuICAgIH0pLFxuICAgIFBvbGljeVN0YXRlbWVudC5mcm9tSnNvbih7XG4gICAgICBBY3Rpb246IFsnc2VydmljZTpBY3Rpb24yJ10sXG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBSZXNvdXJjZTogWydSZXNvdXJjZSddLFxuICAgICAgUHJpbmNpcGFsOiAnKicsXG4gICAgfSksXG4gIF07XG5cbiAgYXNzZXJ0TWVyZ2VkKHN0YXRlbWVudHMsIFtcbiAgICB7XG4gICAgICBBY3Rpb246IFsnc2VydmljZTpBY3Rpb24xJywgJ3NlcnZpY2U6QWN0aW9uMiddLFxuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUmVzb3VyY2U6ICdSZXNvdXJjZScsXG4gICAgICBQcmluY2lwYWw6ICcqJyxcbiAgICB9LFxuICBdKTtcbn0pO1xuXG50ZXN0KCdmYWlsIG1lcmdpbmcgdHlwZWQgYW5kIHVudHlwZWQgcHJpbmNpcGFscycsICgpID0+IHtcbiAgY29uc3Qgc3RhdGVtZW50cyA9IFtcbiAgICBQb2xpY3lTdGF0ZW1lbnQuZnJvbUpzb24oe1xuICAgICAgQWN0aW9uOiBbJ3NlcnZpY2U6QWN0aW9uJ10sXG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBSZXNvdXJjZTogWydSZXNvdXJjZSddLFxuICAgICAgUHJpbmNpcGFsOiAnKicsXG4gICAgfSksXG4gICAgUG9saWN5U3RhdGVtZW50LmZyb21Kc29uKHtcbiAgICAgIEFjdGlvbjogWydzZXJ2aWNlOkFjdGlvbiddLFxuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUmVzb3VyY2U6IFsnUmVzb3VyY2UnXSxcbiAgICAgIFByaW5jaXBhbDogeyBBV1M6IFBSSU5DSVBBTF9BUk4xIH0sXG4gICAgfSksXG4gIF07XG5cbiAgYXNzZXJ0TWVyZ2VkKHN0YXRlbWVudHMsIFtcbiAgICB7XG4gICAgICBBY3Rpb246ICdzZXJ2aWNlOkFjdGlvbicsXG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBSZXNvdXJjZTogJ1Jlc291cmNlJyxcbiAgICAgIFByaW5jaXBhbDogJyonLFxuICAgIH0sXG4gICAge1xuICAgICAgQWN0aW9uOiAnc2VydmljZTpBY3Rpb24nLFxuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUmVzb3VyY2U6ICdSZXNvdXJjZScsXG4gICAgICBQcmluY2lwYWw6IHsgQVdTOiBQUklOQ0lQQUxfQVJOMSB9LFxuICAgIH0sXG4gIF0pO1xufSk7XG5cbnRlc3QoJ2tlZXAgbWVyZ2luZyBldmVuIGlmIGl0IHJlcXVpcmVzIG11bHRpcGxlIHBhc3NlcycsICgpID0+IHtcbiAgLy8gW0EsIFIxXSwgW0IsIFIxXSwgW0EsIFIyXSwgW0IsIFIyXVxuICAvLyAtPiBbe0EsIEJ9LCBSMV0sIFt7QSwgQl0sIFIyXVxuICAvLyAtPiBbe0EsIEJ9LCB7UjEsIFIyfV1cbiAgYXNzZXJ0TWVyZ2VkKFtcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6QSddLFxuICAgICAgcmVzb3VyY2VzOiBbJ1IxJ10sXG4gICAgfSksXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkInXSxcbiAgICAgIHJlc291cmNlczogWydSMSddLFxuICAgIH0pLFxuICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpBJ10sXG4gICAgICByZXNvdXJjZXM6IFsnUjInXSxcbiAgICB9KSxcbiAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6QiddLFxuICAgICAgcmVzb3VyY2VzOiBbJ1IyJ10sXG4gICAgfSksXG4gIF0sIFtcbiAgICB7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246IFsnc2VydmljZTpBJywgJ3NlcnZpY2U6QiddLFxuICAgICAgUmVzb3VyY2U6IFsnUjEnLCAnUjInXSxcbiAgICB9LFxuICBdKTtcbn0pO1xuXG50ZXN0KCdsYXppbHkgZ2VuZXJhdGVkIHN0YXRlbWVudHMgYXJlIG1lcmdlZCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gIGFzc2VydE1lcmdlZChbXG4gICAgbmV3IExhenlTdGF0ZW1lbnQoKHMpID0+IHtcbiAgICAgIHMuYWRkQWN0aW9ucygnc2VydmljZTpBJyk7XG4gICAgICBzLmFkZFJlc291cmNlcygnUjEnKTtcbiAgICB9KSxcbiAgICBuZXcgTGF6eVN0YXRlbWVudCgocykgPT4ge1xuICAgICAgcy5hZGRBY3Rpb25zKCdzZXJ2aWNlOkInKTtcbiAgICAgIHMuYWRkUmVzb3VyY2VzKCdSMScpO1xuICAgIH0pLFxuICBdLCBbXG4gICAge1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgQWN0aW9uOiBbJ3NlcnZpY2U6QScsICdzZXJ2aWNlOkInXSxcbiAgICAgIFJlc291cmNlOiAnUjEnLFxuICAgIH0sXG4gIF0pO1xufSk7XG5cbmZ1bmN0aW9uIGFzc2VydE5vTWVyZ2Uoc3RhdGVtZW50czogaWFtLlBvbGljeVN0YXRlbWVudFtdKSB7XG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICBjb25zdCByZWd1bGFyUmVzdWx0ID0gc3RhY2sucmVzb2x2ZShuZXcgaWFtLlBvbGljeURvY3VtZW50KHsgbWluaW1pemU6IGZhbHNlLCBzdGF0ZW1lbnRzIH0pKTtcbiAgY29uc3QgbWluUmVzdWx0ID0gc3RhY2sucmVzb2x2ZShuZXcgaWFtLlBvbGljeURvY3VtZW50KHsgbWluaW1pemU6IHRydWUsIHN0YXRlbWVudHMgfSkpO1xuXG4gIGV4cGVjdChtaW5SZXN1bHQpLnRvRXF1YWwocmVndWxhclJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIGFzc2VydE1lcmdlZChzdGF0ZW1lbnRzOiBpYW0uUG9saWN5U3RhdGVtZW50W10sIGV4cGVjdGVkOiBhbnlbXSkge1xuICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgY29uc3QgbWluUmVzdWx0ID0gc3RhY2sucmVzb2x2ZShuZXcgaWFtLlBvbGljeURvY3VtZW50KHsgbWluaW1pemU6IHRydWUsIHN0YXRlbWVudHMgfSkpO1xuXG4gIGV4cGVjdChtaW5SZXN1bHQuU3RhdGVtZW50KS50b0VxdWFsKGV4cGVjdGVkKTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgTWVyZ2VkIENvbmRpdGlvbmFsXG4gKlxuICogQmFzZWQgb24gYSBib29sZWFuLCBlaXRoZXIgY2FsbCBhc3NlcnRNZXJnZWQgb3IgYXNzZXJ0Tm9NZXJnZS4gVGhlICdleHBlY3RlZCdcbiAqIGFyZ3VtZW50IG9ubHkgYXBwbGllcyBpbiB0aGUgY2FzZSB3aGVyZSBgZG9NZXJnZWAgaXMgdHJ1ZS5cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0TWVyZ2VkQyhkb01lcmdlOiBib29sZWFuLCBzdGF0ZW1lbnRzOiBpYW0uUG9saWN5U3RhdGVtZW50W10sIGV4cGVjdGVkOiBhbnlbXSkge1xuICByZXR1cm4gZG9NZXJnZSA/IGFzc2VydE1lcmdlZChzdGF0ZW1lbnRzLCBleHBlY3RlZCkgOiBhc3NlcnROb01lcmdlKHN0YXRlbWVudHMpO1xufVxuXG4vKipcbiAqIEEgc3RhdGVtZW50IHRoYXQgZmlsbHMgaXRzZWxmIG9ubHkgd2hlbiBmcmVlemUoKSBpcyBjYWxsZWQuXG4gKi9cbmNsYXNzIExhenlTdGF0ZW1lbnQgZXh0ZW5kcyBpYW0uUG9saWN5U3RhdGVtZW50IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBtb2RpZnlNZTogKHg6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpID0+IHZvaWQpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGZyZWV6ZSgpIHtcbiAgICB0aGlzLm1vZGlmeU1lKHRoaXMpO1xuICAgIHJldHVybiBzdXBlci5mcmVlemUoKTtcbiAgfVxufVxuIl19