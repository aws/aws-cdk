"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const synthetics = require("../lib");
describe('cron', () => {
    test('day and weekDay are mutex: given week day', () => {
        expect(synthetics.Schedule.cron({
            weekDay: 'MON-FRI',
        }).expressionString).toEqual('cron(* * ? * MON-FRI *)');
    });
    test('day and weekDay are mutex: given month day', () => {
        expect(synthetics.Schedule.cron({
            day: '1',
        }).expressionString).toEqual('cron(* * 1 * ? *)');
    });
    test('day and weekDay are mutex: given neither', () => {
        expect(synthetics.Schedule.cron({}).expressionString).toEqual('cron(* * * * ? *)');
    });
    test('day and weekDay are mutex: throw if given both', () => {
        expect(() => synthetics.Schedule.cron({
            day: '1',
            weekDay: 'MON',
        })).toThrow('Cannot supply both \'day\' and \'weekDay\', use at most one');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNjaGVkdWxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFFckMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDcEIsSUFBSSxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsRUFBRTtRQUNyRCxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDOUIsT0FBTyxFQUFFLFNBQVM7U0FDbkIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUM5QixHQUFHLEVBQUUsR0FBRztTQUNULENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtRQUNwRCxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNyRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7UUFDMUQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3BDLEdBQUcsRUFBRSxHQUFHO1lBQ1IsT0FBTyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsNkRBQTZELENBQUMsQ0FBQztJQUM3RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc3ludGhldGljcyBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnY3JvbicsICgpID0+IHtcbiAgdGVzdCgnZGF5IGFuZCB3ZWVrRGF5IGFyZSBtdXRleDogZ2l2ZW4gd2VlayBkYXknLCAoKSA9PiB7XG4gICAgZXhwZWN0KHN5bnRoZXRpY3MuU2NoZWR1bGUuY3Jvbih7XG4gICAgICB3ZWVrRGF5OiAnTU9OLUZSSScsXG4gICAgfSkuZXhwcmVzc2lvblN0cmluZykudG9FcXVhbCgnY3JvbigqICogPyAqIE1PTi1GUkkgKiknKTtcbiAgfSk7XG5cbiAgdGVzdCgnZGF5IGFuZCB3ZWVrRGF5IGFyZSBtdXRleDogZ2l2ZW4gbW9udGggZGF5JywgKCkgPT4ge1xuICAgIGV4cGVjdChzeW50aGV0aWNzLlNjaGVkdWxlLmNyb24oe1xuICAgICAgZGF5OiAnMScsXG4gICAgfSkuZXhwcmVzc2lvblN0cmluZykudG9FcXVhbCgnY3JvbigqICogMSAqID8gKiknKTtcbiAgfSk7XG5cbiAgdGVzdCgnZGF5IGFuZCB3ZWVrRGF5IGFyZSBtdXRleDogZ2l2ZW4gbmVpdGhlcicsICgpID0+IHtcbiAgICBleHBlY3Qoc3ludGhldGljcy5TY2hlZHVsZS5jcm9uKHt9KS5leHByZXNzaW9uU3RyaW5nKS50b0VxdWFsKCdjcm9uKCogKiAqICogPyAqKScpO1xuICB9KTtcblxuICB0ZXN0KCdkYXkgYW5kIHdlZWtEYXkgYXJlIG11dGV4OiB0aHJvdyBpZiBnaXZlbiBib3RoJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBzeW50aGV0aWNzLlNjaGVkdWxlLmNyb24oe1xuICAgICAgZGF5OiAnMScsXG4gICAgICB3ZWVrRGF5OiAnTU9OJyxcbiAgICB9KSkudG9UaHJvdygnQ2Fubm90IHN1cHBseSBib3RoIFxcJ2RheVxcJyBhbmQgXFwnd2Vla0RheVxcJywgdXNlIGF0IG1vc3Qgb25lJyk7XG4gIH0pO1xufSk7XG4iXX0=