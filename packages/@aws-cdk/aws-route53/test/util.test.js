"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
const util = require("../lib/util");
describe('util', () => {
    test('throws when zone name ending with a \'.\'', () => {
        expect(() => util.validateZoneName('zone.name.')).toThrow(/trailing dot/);
    });
    test('accepts a valid domain name', () => {
        const domainName = 'amazonaws.com';
        util.validateZoneName(domainName);
    });
    test('providedName ending with a dot returns the name', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const providedName = 'test.domain.com.';
        const qualified = util.determineFullyQualifiedDomainName(providedName, lib_1.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
            hostedZoneId: 'fakeId',
            zoneName: 'ignored',
        }));
        // THEN
        expect(qualified).toEqual('test.domain.com.');
    });
    test('providedName that matches zoneName returns providedName with a trailing dot', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const providedName = 'test.domain.com';
        const qualified = util.determineFullyQualifiedDomainName(providedName, lib_1.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
            hostedZoneId: 'fakeId',
            zoneName: 'test.domain.com.',
        }));
        // THEN
        expect(qualified).toEqual('test.domain.com.');
    });
    test('providedName that ends with zoneName returns providedName with a trailing dot', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const providedName = 'test.domain.com';
        const qualified = util.determineFullyQualifiedDomainName(providedName, lib_1.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
            hostedZoneId: 'fakeId',
            zoneName: 'domain.com.',
        }));
        // THEN
        expect(qualified).toEqual('test.domain.com.');
    });
    test('providedName that does not match zoneName concatenates providedName and zoneName', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const providedName = 'test';
        const qualified = util.determineFullyQualifiedDomainName(providedName, lib_1.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
            hostedZoneId: 'fakeId',
            zoneName: 'domain.com.',
        }));
        // THEN
        expect(qualified).toEqual('test.domain.com.');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXRpbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLGdDQUFvQztBQUNwQyxvQ0FBb0M7QUFFcEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDcEIsSUFBSSxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsRUFBRTtRQUNyRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUN2QyxNQUFNLFVBQVUsR0FBRyxlQUFlLENBQUM7UUFDbkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtRQUMzRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsT0FBTztRQUNQLE1BQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxZQUFZLEVBQUUsZ0JBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQzlILFlBQVksRUFBRSxRQUFRO1lBQ3RCLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTztRQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2RUFBNkUsRUFBRSxHQUFHLEVBQUU7UUFDdkYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQztRQUN2QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUNBQWlDLENBQUMsWUFBWSxFQUFFLGdCQUFVLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUM5SCxZQUFZLEVBQUUsUUFBUTtZQUN0QixRQUFRLEVBQUUsa0JBQWtCO1NBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTztRQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrRUFBK0UsRUFBRSxHQUFHLEVBQUU7UUFDekYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQztRQUN2QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUNBQWlDLENBQUMsWUFBWSxFQUFFLGdCQUFVLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUM5SCxZQUFZLEVBQUUsUUFBUTtZQUN0QixRQUFRLEVBQUUsYUFBYTtTQUN4QixDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87UUFDUCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0ZBQWtGLEVBQUUsR0FBRyxFQUFFO1FBQzVGLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixPQUFPO1FBQ1AsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDO1FBQzVCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxZQUFZLEVBQUUsZ0JBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQzlILFlBQVksRUFBRSxRQUFRO1lBQ3RCLFFBQVEsRUFBRSxhQUFhO1NBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTztRQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSG9zdGVkWm9uZSB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL2xpYi91dGlsJztcblxuZGVzY3JpYmUoJ3V0aWwnLCAoKSA9PiB7XG4gIHRlc3QoJ3Rocm93cyB3aGVuIHpvbmUgbmFtZSBlbmRpbmcgd2l0aCBhIFxcJy5cXCcnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHV0aWwudmFsaWRhdGVab25lTmFtZSgnem9uZS5uYW1lLicpKS50b1Rocm93KC90cmFpbGluZyBkb3QvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWNjZXB0cyBhIHZhbGlkIGRvbWFpbiBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IGRvbWFpbk5hbWUgPSAnYW1hem9uYXdzLmNvbSc7XG4gICAgdXRpbC52YWxpZGF0ZVpvbmVOYW1lKGRvbWFpbk5hbWUpO1xuICB9KTtcblxuICB0ZXN0KCdwcm92aWRlZE5hbWUgZW5kaW5nIHdpdGggYSBkb3QgcmV0dXJucyB0aGUgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHByb3ZpZGVkTmFtZSA9ICd0ZXN0LmRvbWFpbi5jb20uJztcbiAgICBjb25zdCBxdWFsaWZpZWQgPSB1dGlsLmRldGVybWluZUZ1bGx5UXVhbGlmaWVkRG9tYWluTmFtZShwcm92aWRlZE5hbWUsIEhvc3RlZFpvbmUuZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIGhvc3RlZFpvbmVJZDogJ2Zha2VJZCcsXG4gICAgICB6b25lTmFtZTogJ2lnbm9yZWQnLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocXVhbGlmaWVkKS50b0VxdWFsKCd0ZXN0LmRvbWFpbi5jb20uJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Byb3ZpZGVkTmFtZSB0aGF0IG1hdGNoZXMgem9uZU5hbWUgcmV0dXJucyBwcm92aWRlZE5hbWUgd2l0aCBhIHRyYWlsaW5nIGRvdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHByb3ZpZGVkTmFtZSA9ICd0ZXN0LmRvbWFpbi5jb20nO1xuICAgIGNvbnN0IHF1YWxpZmllZCA9IHV0aWwuZGV0ZXJtaW5lRnVsbHlRdWFsaWZpZWREb21haW5OYW1lKHByb3ZpZGVkTmFtZSwgSG9zdGVkWm9uZS5mcm9tSG9zdGVkWm9uZUF0dHJpYnV0ZXMoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgaG9zdGVkWm9uZUlkOiAnZmFrZUlkJyxcbiAgICAgIHpvbmVOYW1lOiAndGVzdC5kb21haW4uY29tLicsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChxdWFsaWZpZWQpLnRvRXF1YWwoJ3Rlc3QuZG9tYWluLmNvbS4nKTtcbiAgfSk7XG5cbiAgdGVzdCgncHJvdmlkZWROYW1lIHRoYXQgZW5kcyB3aXRoIHpvbmVOYW1lIHJldHVybnMgcHJvdmlkZWROYW1lIHdpdGggYSB0cmFpbGluZyBkb3QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwcm92aWRlZE5hbWUgPSAndGVzdC5kb21haW4uY29tJztcbiAgICBjb25zdCBxdWFsaWZpZWQgPSB1dGlsLmRldGVybWluZUZ1bGx5UXVhbGlmaWVkRG9tYWluTmFtZShwcm92aWRlZE5hbWUsIEhvc3RlZFpvbmUuZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIGhvc3RlZFpvbmVJZDogJ2Zha2VJZCcsXG4gICAgICB6b25lTmFtZTogJ2RvbWFpbi5jb20uJyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHF1YWxpZmllZCkudG9FcXVhbCgndGVzdC5kb21haW4uY29tLicpO1xuICB9KTtcblxuICB0ZXN0KCdwcm92aWRlZE5hbWUgdGhhdCBkb2VzIG5vdCBtYXRjaCB6b25lTmFtZSBjb25jYXRlbmF0ZXMgcHJvdmlkZWROYW1lIGFuZCB6b25lTmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHByb3ZpZGVkTmFtZSA9ICd0ZXN0JztcbiAgICBjb25zdCBxdWFsaWZpZWQgPSB1dGlsLmRldGVybWluZUZ1bGx5UXVhbGlmaWVkRG9tYWluTmFtZShwcm92aWRlZE5hbWUsIEhvc3RlZFpvbmUuZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIGhvc3RlZFpvbmVJZDogJ2Zha2VJZCcsXG4gICAgICB6b25lTmFtZTogJ2RvbWFpbi5jb20uJyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHF1YWxpZmllZCkudG9FcXVhbCgndGVzdC5kb21haW4uY29tLicpO1xuICB9KTtcbn0pO1xuIl19