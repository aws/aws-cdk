"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("@aws-cdk/aws-iam");
const kms = require("../lib");
test('Via service, any principal', () => {
    // WHEN
    const statement = new iam.PolicyStatement({
        actions: ['abc:call'],
        principals: [new kms.ViaServicePrincipal('bla.amazonaws.com')],
        resources: ['*'],
    });
    // THEN
    expect(statement.toStatementJson()).toEqual({
        Action: 'abc:call',
        Condition: { StringEquals: { 'kms:ViaService': 'bla.amazonaws.com' } },
        Effect: 'Allow',
        Principal: { AWS: '*' },
        Resource: '*',
    });
});
test('Via service, principal with conditions', () => {
    // WHEN
    const statement = new iam.PolicyStatement({
        actions: ['abc:call'],
        principals: [new kms.ViaServicePrincipal('bla.amazonaws.com', new iam.OrganizationPrincipal('o-1234'))],
        resources: ['*'],
    });
    // THEN
    expect(statement.toStatementJson()).toEqual({
        Action: 'abc:call',
        Condition: {
            StringEquals: {
                'kms:ViaService': 'bla.amazonaws.com',
                'aws:PrincipalOrgID': 'o-1234',
            },
        },
        Effect: 'Allow',
        Principal: { AWS: '*' },
        Resource: '*',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlhLXNlcnZpY2UtcHJpbmNpcGFsLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2aWEtc2VydmljZS1wcmluY2lwYWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF3QztBQUN4Qyw4QkFBOEI7QUFFOUIsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtJQUN0QyxPQUFPO0lBQ1AsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQ3hDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztRQUNyQixVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzlELFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztLQUNqQixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMxQyxNQUFNLEVBQUUsVUFBVTtRQUNsQixTQUFTLEVBQUUsRUFBRSxZQUFZLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxFQUFFO1FBQ3RFLE1BQU0sRUFBRSxPQUFPO1FBQ2YsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtRQUN2QixRQUFRLEVBQUUsR0FBRztLQUNkLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtJQUNsRCxPQUFPO0lBQ1AsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQ3hDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztRQUNyQixVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3ZHLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztLQUNqQixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMxQyxNQUFNLEVBQUUsVUFBVTtRQUNsQixTQUFTLEVBQUU7WUFDVCxZQUFZLEVBQUU7Z0JBQ1osZ0JBQWdCLEVBQUUsbUJBQW1CO2dCQUNyQyxvQkFBb0IsRUFBRSxRQUFRO2FBQy9CO1NBQ0Y7UUFDRCxNQUFNLEVBQUUsT0FBTztRQUNmLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7UUFDdkIsUUFBUSxFQUFFLEdBQUc7S0FDZCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICcuLi9saWInO1xuXG50ZXN0KCdWaWEgc2VydmljZSwgYW55IHByaW5jaXBhbCcsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBzdGF0ZW1lbnQgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgYWN0aW9uczogWydhYmM6Y2FsbCddLFxuICAgIHByaW5jaXBhbHM6IFtuZXcga21zLlZpYVNlcnZpY2VQcmluY2lwYWwoJ2JsYS5hbWF6b25hd3MuY29tJyldLFxuICAgIHJlc291cmNlczogWycqJ10sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHN0YXRlbWVudC50b1N0YXRlbWVudEpzb24oKSkudG9FcXVhbCh7XG4gICAgQWN0aW9uOiAnYWJjOmNhbGwnLFxuICAgIENvbmRpdGlvbjogeyBTdHJpbmdFcXVhbHM6IHsgJ2ttczpWaWFTZXJ2aWNlJzogJ2JsYS5hbWF6b25hd3MuY29tJyB9IH0sXG4gICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgIFByaW5jaXBhbDogeyBBV1M6ICcqJyB9LFxuICAgIFJlc291cmNlOiAnKicsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1ZpYSBzZXJ2aWNlLCBwcmluY2lwYWwgd2l0aCBjb25kaXRpb25zJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICBhY3Rpb25zOiBbJ2FiYzpjYWxsJ10sXG4gICAgcHJpbmNpcGFsczogW25ldyBrbXMuVmlhU2VydmljZVByaW5jaXBhbCgnYmxhLmFtYXpvbmF3cy5jb20nLCBuZXcgaWFtLk9yZ2FuaXphdGlvblByaW5jaXBhbCgnby0xMjM0JykpXSxcbiAgICByZXNvdXJjZXM6IFsnKiddLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGF0ZW1lbnQudG9TdGF0ZW1lbnRKc29uKCkpLnRvRXF1YWwoe1xuICAgIEFjdGlvbjogJ2FiYzpjYWxsJyxcbiAgICBDb25kaXRpb246IHtcbiAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAna21zOlZpYVNlcnZpY2UnOiAnYmxhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAnYXdzOlByaW5jaXBhbE9yZ0lEJzogJ28tMTIzNCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgIFByaW5jaXBhbDogeyBBV1M6ICcqJyB9LFxuICAgIFJlc291cmNlOiAnKicsXG4gIH0pO1xufSk7XG4iXX0=