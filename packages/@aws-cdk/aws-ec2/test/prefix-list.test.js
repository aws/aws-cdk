"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const prefix_list_1 = require("../lib/prefix-list");
describe('prefix list', () => {
    test('default empty prefixlist', () => {
        // GIVEN
        const stack = new core_1.Stack();
        new prefix_list_1.PrefixList(stack, 'prefix-list', {
            maxEntries: 100,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::PrefixList', {
            AddressFamily: 'IPv4',
            MaxEntries: 100,
        });
    });
    test('default empty IPv6 prefixlist', () => {
        // GIVEN
        const stack = new core_1.Stack();
        new prefix_list_1.PrefixList(stack, 'prefix-list', {
            maxEntries: 100,
            prefixListName: 'prefix-list',
            addressFamily: prefix_list_1.AddressFamily.IP_V6,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::PrefixList', {
            AddressFamily: 'IPv6',
            MaxEntries: 100,
            PrefixListName: 'prefix-list',
        });
    });
    test('prefixlist with entries', () => {
        // GIVEN
        const stack = new core_1.Stack();
        new prefix_list_1.PrefixList(stack, 'prefix-list', {
            entries: [
                { cidr: '10.0.0.1/32' },
                { cidr: '10.0.0.2/32', description: 'sample1' },
            ],
            prefixListName: 'prefix-list',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::PrefixList', {
            AddressFamily: 'IPv4',
            MaxEntries: 2,
            Entries: [
                { Cidr: '10.0.0.1/32' },
                { Cidr: '10.0.0.2/32', Description: 'sample1' },
            ],
        });
    });
    test('invalid prefixlist name startwith amazon', () => {
        // GIVEN
        const stack = new core_1.Stack();
        expect(() => {
            new prefix_list_1.PrefixList(stack, 'prefix-list', {
                maxEntries: 100,
                prefixListName: 'com.amazonawsprefix-list',
            });
        }).toThrow('The name cannot start with \'com.amazonaws.\'');
    });
    test('invalid prefixlist-name over 255 characters', () => {
        // GIVEN
        const stack = new core_1.Stack();
        expect(() => {
            new prefix_list_1.PrefixList(stack, 'prefix-list', {
                maxEntries: 100,
                prefixListName: 'a'.repeat(256),
            });
        }).toThrow('Lengths exceeding 255 characters cannot be set.');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LWxpc3QudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByZWZpeC1saXN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXNDO0FBQ3RDLG9EQUErRDtBQUUvRCxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksd0JBQVUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ25DLFVBQVUsRUFBRSxHQUFHO1NBQ2hCLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFO1lBQ3RFLGFBQWEsRUFBRSxNQUFNO1lBQ3JCLFVBQVUsRUFBRSxHQUFHO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtRQUN6QyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLHdCQUFVLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUNuQyxVQUFVLEVBQUUsR0FBRztZQUNmLGNBQWMsRUFBRSxhQUFhO1lBQzdCLGFBQWEsRUFBRSwyQkFBYSxDQUFDLEtBQUs7U0FDbkMsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUU7WUFDdEUsYUFBYSxFQUFFLE1BQU07WUFDckIsVUFBVSxFQUFFLEdBQUc7WUFDZixjQUFjLEVBQUUsYUFBYTtTQUM5QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7UUFDbkMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSx3QkFBVSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDbkMsT0FBTyxFQUFFO2dCQUNQLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRTtnQkFDdkIsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUU7YUFDaEQ7WUFDRCxjQUFjLEVBQUUsYUFBYTtTQUM5QixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRTtZQUN0RSxhQUFhLEVBQUUsTUFBTTtZQUNyQixVQUFVLEVBQUUsQ0FBQztZQUNiLE9BQU8sRUFBRTtnQkFDUCxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUU7Z0JBQ3ZCLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFO2FBQ2hEO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLHdCQUFVLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtnQkFDbkMsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsY0FBYyxFQUFFLDBCQUEwQjthQUMzQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFDdkQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksd0JBQVUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO2dCQUNuQyxVQUFVLEVBQUUsR0FBRztnQkFDZixjQUFjLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDaEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7SUFDaEUsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQWRkcmVzc0ZhbWlseSwgUHJlZml4TGlzdCB9IGZyb20gJy4uL2xpYi9wcmVmaXgtbGlzdCc7XG5cbmRlc2NyaWJlKCdwcmVmaXggbGlzdCcsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCBlbXB0eSBwcmVmaXhsaXN0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBuZXcgUHJlZml4TGlzdChzdGFjaywgJ3ByZWZpeC1saXN0Jywge1xuICAgICAgbWF4RW50cmllczogMTAwLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpQcmVmaXhMaXN0Jywge1xuICAgICAgQWRkcmVzc0ZhbWlseTogJ0lQdjQnLFxuICAgICAgTWF4RW50cmllczogMTAwLFxuICAgIH0pO1xuICB9KTtcbiAgdGVzdCgnZGVmYXVsdCBlbXB0eSBJUHY2IHByZWZpeGxpc3QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IFByZWZpeExpc3Qoc3RhY2ssICdwcmVmaXgtbGlzdCcsIHtcbiAgICAgIG1heEVudHJpZXM6IDEwMCxcbiAgICAgIHByZWZpeExpc3ROYW1lOiAncHJlZml4LWxpc3QnLFxuICAgICAgYWRkcmVzc0ZhbWlseTogQWRkcmVzc0ZhbWlseS5JUF9WNixcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6UHJlZml4TGlzdCcsIHtcbiAgICAgIEFkZHJlc3NGYW1pbHk6ICdJUHY2JyxcbiAgICAgIE1heEVudHJpZXM6IDEwMCxcbiAgICAgIFByZWZpeExpc3ROYW1lOiAncHJlZml4LWxpc3QnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwcmVmaXhsaXN0IHdpdGggZW50cmllcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IFByZWZpeExpc3Qoc3RhY2ssICdwcmVmaXgtbGlzdCcsIHtcbiAgICAgIGVudHJpZXM6IFtcbiAgICAgICAgeyBjaWRyOiAnMTAuMC4wLjEvMzInIH0sXG4gICAgICAgIHsgY2lkcjogJzEwLjAuMC4yLzMyJywgZGVzY3JpcHRpb246ICdzYW1wbGUxJyB9LFxuICAgICAgXSxcbiAgICAgIHByZWZpeExpc3ROYW1lOiAncHJlZml4LWxpc3QnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpQcmVmaXhMaXN0Jywge1xuICAgICAgQWRkcmVzc0ZhbWlseTogJ0lQdjQnLFxuICAgICAgTWF4RW50cmllczogMixcbiAgICAgIEVudHJpZXM6IFtcbiAgICAgICAgeyBDaWRyOiAnMTAuMC4wLjEvMzInIH0sXG4gICAgICAgIHsgQ2lkcjogJzEwLjAuMC4yLzMyJywgRGVzY3JpcHRpb246ICdzYW1wbGUxJyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW52YWxpZCBwcmVmaXhsaXN0IG5hbWUgc3RhcnR3aXRoIGFtYXpvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBQcmVmaXhMaXN0KHN0YWNrLCAncHJlZml4LWxpc3QnLCB7XG4gICAgICAgIG1heEVudHJpZXM6IDEwMCxcbiAgICAgICAgcHJlZml4TGlzdE5hbWU6ICdjb20uYW1hem9uYXdzcHJlZml4LWxpc3QnLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygnVGhlIG5hbWUgY2Fubm90IHN0YXJ0IHdpdGggXFwnY29tLmFtYXpvbmF3cy5cXCcnKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW52YWxpZCBwcmVmaXhsaXN0LW5hbWUgb3ZlciAyNTUgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBQcmVmaXhMaXN0KHN0YWNrLCAncHJlZml4LWxpc3QnLCB7XG4gICAgICAgIG1heEVudHJpZXM6IDEwMCxcbiAgICAgICAgcHJlZml4TGlzdE5hbWU6ICdhJy5yZXBlYXQoMjU2KSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coJ0xlbmd0aHMgZXhjZWVkaW5nIDI1NSBjaGFyYWN0ZXJzIGNhbm5vdCBiZSBzZXQuJyk7XG4gIH0pO1xuXG59KTsiXX0=