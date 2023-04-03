"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elbv2 = require("../../lib");
describe('tests', () => {
    test('pathPatterns length greater than 5 will throw exception', () => {
        //GIVEN
        const array = ['/u1', '/u2', '/u3', '/u4', '/u5'];
        //WHEN
        elbv2.ListenerCondition.pathPatterns(array); // Does not throw
        array.push('/u6');
        // THEN
        expect(() => {
            elbv2.ListenerCondition.pathPatterns(array);
        }).toThrow(/A rule can only have '5' condition values/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZGl0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBRW5DLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBRXJCLElBQUksQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7UUFDbkUsT0FBTztRQUNQLE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxELE1BQU07UUFDTixLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCO1FBQzlELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEIsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBRTFELENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgndGVzdHMnLCAoKSA9PiB7XG5cbiAgdGVzdCgncGF0aFBhdHRlcm5zIGxlbmd0aCBncmVhdGVyIHRoYW4gNSB3aWxsIHRocm93IGV4Y2VwdGlvbicsICgpID0+IHtcbiAgICAvL0dJVkVOXG4gICAgY29uc3QgYXJyYXkgPSBbJy91MScsICcvdTInLCAnL3UzJywgJy91NCcsICcvdTUnXTtcblxuICAgIC8vV0hFTlxuICAgIGVsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLnBhdGhQYXR0ZXJucyhhcnJheSk7IC8vIERvZXMgbm90IHRocm93XG4gICAgYXJyYXkucHVzaCgnL3U2Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGVsYnYyLkxpc3RlbmVyQ29uZGl0aW9uLnBhdGhQYXR0ZXJucyhhcnJheSk7XG4gICAgfSkudG9UaHJvdygvQSBydWxlIGNhbiBvbmx5IGhhdmUgJzUnIGNvbmRpdGlvbiB2YWx1ZXMvKTtcblxuICB9KTtcblxufSk7XG4iXX0=