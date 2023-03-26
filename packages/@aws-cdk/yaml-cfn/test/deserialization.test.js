"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml_cfn = require("../lib");
test('Unquoted year-month-day is treated as a string, not a Date', () => {
    const value = yaml_cfn.deserialize('Key: 2020-12-31');
    expect(value).toEqual({
        Key: '2020-12-31',
    });
});
test("Unquoted 'No' is treated as a string, not a boolean", () => {
    const value = yaml_cfn.deserialize('Key: No');
    expect(value).toEqual({
        Key: 'No',
    });
});
test("Short-form 'Ref' is deserialized correctly", () => {
    const value = yaml_cfn.deserialize('!Ref Resource');
    expect(value).toEqual({
        Ref: 'Resource',
    });
});
test("Short-form 'Fn::GetAtt' is deserialized correctly", () => {
    const value = yaml_cfn.deserialize('!GetAtt Resource.Attribute');
    expect(value).toEqual({
        'Fn::GetAtt': 'Resource.Attribute',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzZXJpYWxpemF0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXNlcmlhbGl6YXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUVuQyxJQUFJLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO0lBQ3RFLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUV0RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3BCLEdBQUcsRUFBRSxZQUFZO0tBQ2xCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtJQUMvRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTlDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDcEIsR0FBRyxFQUFFLElBQUk7S0FDVixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7SUFDdEQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUVwRCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3BCLEdBQUcsRUFBRSxVQUFVO0tBQ2hCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtJQUM3RCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFFakUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUNwQixZQUFZLEVBQUUsb0JBQW9CO0tBQ25DLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgeWFtbF9jZm4gZnJvbSAnLi4vbGliJztcblxudGVzdCgnVW5xdW90ZWQgeWVhci1tb250aC1kYXkgaXMgdHJlYXRlZCBhcyBhIHN0cmluZywgbm90IGEgRGF0ZScsICgpID0+IHtcbiAgY29uc3QgdmFsdWUgPSB5YW1sX2Nmbi5kZXNlcmlhbGl6ZSgnS2V5OiAyMDIwLTEyLTMxJyk7XG5cbiAgZXhwZWN0KHZhbHVlKS50b0VxdWFsKHtcbiAgICBLZXk6ICcyMDIwLTEyLTMxJyxcbiAgfSk7XG59KTtcblxudGVzdChcIlVucXVvdGVkICdObycgaXMgdHJlYXRlZCBhcyBhIHN0cmluZywgbm90IGEgYm9vbGVhblwiLCAoKSA9PiB7XG4gIGNvbnN0IHZhbHVlID0geWFtbF9jZm4uZGVzZXJpYWxpemUoJ0tleTogTm8nKTtcblxuICBleHBlY3QodmFsdWUpLnRvRXF1YWwoe1xuICAgIEtleTogJ05vJyxcbiAgfSk7XG59KTtcblxudGVzdChcIlNob3J0LWZvcm0gJ1JlZicgaXMgZGVzZXJpYWxpemVkIGNvcnJlY3RseVwiLCAoKSA9PiB7XG4gIGNvbnN0IHZhbHVlID0geWFtbF9jZm4uZGVzZXJpYWxpemUoJyFSZWYgUmVzb3VyY2UnKTtcblxuICBleHBlY3QodmFsdWUpLnRvRXF1YWwoe1xuICAgIFJlZjogJ1Jlc291cmNlJyxcbiAgfSk7XG59KTtcblxudGVzdChcIlNob3J0LWZvcm0gJ0ZuOjpHZXRBdHQnIGlzIGRlc2VyaWFsaXplZCBjb3JyZWN0bHlcIiwgKCkgPT4ge1xuICBjb25zdCB2YWx1ZSA9IHlhbWxfY2ZuLmRlc2VyaWFsaXplKCchR2V0QXR0IFJlc291cmNlLkF0dHJpYnV0ZScpO1xuXG4gIGV4cGVjdCh2YWx1ZSkudG9FcXVhbCh7XG4gICAgJ0ZuOjpHZXRBdHQnOiAnUmVzb3VyY2UuQXR0cmlidXRlJyxcbiAgfSk7XG59KTtcbiJdfQ==