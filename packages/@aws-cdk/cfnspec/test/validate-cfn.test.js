"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_cfn_1 = require("../build-tools/validate-cfn");
describe('single-valued type', () => {
    test('error if Type and PrimitiveType are both absent', () => {
        expect(errorsFor(resourceTypeProperty({}))).toEqual([
            expect.stringContaining("must have exactly one of 'Type', 'PrimitiveType'"),
        ]);
    });
    test('error if referenced type does not exist', () => {
        expect(errorsFor(resourceTypeProperty({
            Type: 'Xyz',
        }))).toEqual([
            expect.stringContaining("unknown property type name 'Xyz'"),
        ]);
    });
    test('error if Type and PrimitiveType are both present', () => {
        expect(errorsFor(resourceTypeProperty({
            Type: 'Asdf',
            PrimitiveType: 'String',
        }))).toEqual([
            expect.stringContaining("must have exactly one of 'Type', 'PrimitiveType'"),
        ]);
    });
    test('error if ItemType is present', () => {
        expect(errorsFor(resourceTypeProperty({
            PrimitiveType: 'String',
            ItemType: 'Asdf',
        }))).toEqual([
            expect.stringContaining("only 'List' or 'Map' types"),
        ]);
    });
    test('error if PrimitiveItemType is present and Type is not a collection', () => {
        expect(errorsFor(resourceTypeProperty({
            PrimitiveType: 'String',
            PrimitiveItemType: 'Asdf',
        }))).toEqual([
            expect.stringContaining("only 'List' or 'Map' types"),
        ]);
    });
});
describe('collection type', () => {
    test('error if ItemType or PrimitiveItemType are both present', () => {
        expect(errorsFor(resourceTypeProperty({
            Type: 'List',
            PrimitiveItemType: 'String',
            ItemType: 'Asdf',
        }))).toEqual([
            expect.stringContaining("must have exactly one of 'ItemType', 'PrimitiveItemType'"),
        ]);
    });
    test('error if ItemType or PrimitiveItemType are both absent', () => {
        expect(errorsFor(resourceTypeProperty({
            Type: 'List',
        }))).toEqual([
            expect.stringContaining("must have exactly one of 'ItemType', 'PrimitiveItemType'"),
        ]);
    });
});
function errorsFor(spec) {
    return validate_cfn_1.CfnSpecValidator.validate(spec).map(e => e.message);
}
function resourceTypeProperty(prop) {
    return {
        PropertyTypes: {
            'My::Resource::Type.Asdf': {
                Properties: {
                    SomeString: { PrimitiveType: 'String' },
                },
            },
        },
        ResourceTypes: {
            'My::Resource::Type': {
                Properties: {
                    MyProperty: prop,
                },
            },
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtY2ZuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YWxpZGF0ZS1jZm4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUErRDtBQUUvRCxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDM0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrREFBa0QsQ0FBQztTQUM1RSxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztZQUNwQyxJQUFJLEVBQUUsS0FBSztTQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ1gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtDQUFrQyxDQUFDO1NBQzVELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtRQUM1RCxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO1lBQ3BDLElBQUksRUFBRSxNQUFNO1lBQ1osYUFBYSxFQUFFLFFBQVE7U0FDeEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDWCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsa0RBQWtELENBQUM7U0FDNUUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1FBQ3hDLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7WUFDcEMsYUFBYSxFQUFFLFFBQVE7WUFDdkIsUUFBUSxFQUFFLE1BQU07U0FDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDWCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsNEJBQTRCLENBQUM7U0FDdEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsb0VBQW9FLEVBQUUsR0FBRyxFQUFFO1FBQzlFLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7WUFDcEMsYUFBYSxFQUFFLFFBQVE7WUFDdkIsaUJBQWlCLEVBQUUsTUFBTTtTQUMxQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNYLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyw0QkFBNEIsQ0FBQztTQUN0RCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQ25FLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7WUFDcEMsSUFBSSxFQUFFLE1BQU07WUFDWixpQkFBaUIsRUFBRSxRQUFRO1lBQzNCLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ1gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLDBEQUEwRCxDQUFDO1NBQ3BGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtRQUNsRSxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO1lBQ3BDLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDWCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsMERBQTBELENBQUM7U0FDcEYsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsU0FBUyxDQUFDLElBQVM7SUFDMUIsT0FBTywrQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLElBQVM7SUFDckMsT0FBTztRQUNMLGFBQWEsRUFBRTtZQUNiLHlCQUF5QixFQUFFO2dCQUN6QixVQUFVLEVBQUU7b0JBQ1YsVUFBVSxFQUFFLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRTtpQkFDeEM7YUFDRjtTQUNGO1FBQ0QsYUFBYSxFQUFFO1lBQ2Isb0JBQW9CLEVBQUU7Z0JBQ3BCLFVBQVUsRUFBRTtvQkFDVixVQUFVLEVBQUUsSUFBSTtpQkFDakI7YUFDRjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5TcGVjVmFsaWRhdG9yIH0gZnJvbSAnLi4vYnVpbGQtdG9vbHMvdmFsaWRhdGUtY2ZuJztcblxuZGVzY3JpYmUoJ3NpbmdsZS12YWx1ZWQgdHlwZScsICgpID0+IHtcbiAgdGVzdCgnZXJyb3IgaWYgVHlwZSBhbmQgUHJpbWl0aXZlVHlwZSBhcmUgYm90aCBhYnNlbnQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGVycm9yc0ZvcihyZXNvdXJjZVR5cGVQcm9wZXJ0eSh7fSkpKS50b0VxdWFsKFtcbiAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKFwibXVzdCBoYXZlIGV4YWN0bHkgb25lIG9mICdUeXBlJywgJ1ByaW1pdGl2ZVR5cGUnXCIpLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdlcnJvciBpZiByZWZlcmVuY2VkIHR5cGUgZG9lcyBub3QgZXhpc3QnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGVycm9yc0ZvcihyZXNvdXJjZVR5cGVQcm9wZXJ0eSh7XG4gICAgICBUeXBlOiAnWHl6JyxcbiAgICB9KSkpLnRvRXF1YWwoW1xuICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoXCJ1bmtub3duIHByb3BlcnR5IHR5cGUgbmFtZSAnWHl6J1wiKSxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXJyb3IgaWYgVHlwZSBhbmQgUHJpbWl0aXZlVHlwZSBhcmUgYm90aCBwcmVzZW50JywgKCkgPT4ge1xuICAgIGV4cGVjdChlcnJvcnNGb3IocmVzb3VyY2VUeXBlUHJvcGVydHkoe1xuICAgICAgVHlwZTogJ0FzZGYnLFxuICAgICAgUHJpbWl0aXZlVHlwZTogJ1N0cmluZycsXG4gICAgfSkpKS50b0VxdWFsKFtcbiAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKFwibXVzdCBoYXZlIGV4YWN0bHkgb25lIG9mICdUeXBlJywgJ1ByaW1pdGl2ZVR5cGUnXCIpLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdlcnJvciBpZiBJdGVtVHlwZSBpcyBwcmVzZW50JywgKCkgPT4ge1xuICAgIGV4cGVjdChlcnJvcnNGb3IocmVzb3VyY2VUeXBlUHJvcGVydHkoe1xuICAgICAgUHJpbWl0aXZlVHlwZTogJ1N0cmluZycsXG4gICAgICBJdGVtVHlwZTogJ0FzZGYnLFxuICAgIH0pKSkudG9FcXVhbChbXG4gICAgICBleHBlY3Quc3RyaW5nQ29udGFpbmluZyhcIm9ubHkgJ0xpc3QnIG9yICdNYXAnIHR5cGVzXCIpLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdlcnJvciBpZiBQcmltaXRpdmVJdGVtVHlwZSBpcyBwcmVzZW50IGFuZCBUeXBlIGlzIG5vdCBhIGNvbGxlY3Rpb24nLCAoKSA9PiB7XG4gICAgZXhwZWN0KGVycm9yc0ZvcihyZXNvdXJjZVR5cGVQcm9wZXJ0eSh7XG4gICAgICBQcmltaXRpdmVUeXBlOiAnU3RyaW5nJyxcbiAgICAgIFByaW1pdGl2ZUl0ZW1UeXBlOiAnQXNkZicsXG4gICAgfSkpKS50b0VxdWFsKFtcbiAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKFwib25seSAnTGlzdCcgb3IgJ01hcCcgdHlwZXNcIiksXG4gICAgXSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjb2xsZWN0aW9uIHR5cGUnLCAoKSA9PiB7XG4gIHRlc3QoJ2Vycm9yIGlmIEl0ZW1UeXBlIG9yIFByaW1pdGl2ZUl0ZW1UeXBlIGFyZSBib3RoIHByZXNlbnQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGVycm9yc0ZvcihyZXNvdXJjZVR5cGVQcm9wZXJ0eSh7XG4gICAgICBUeXBlOiAnTGlzdCcsXG4gICAgICBQcmltaXRpdmVJdGVtVHlwZTogJ1N0cmluZycsXG4gICAgICBJdGVtVHlwZTogJ0FzZGYnLFxuICAgIH0pKSkudG9FcXVhbChbXG4gICAgICBleHBlY3Quc3RyaW5nQ29udGFpbmluZyhcIm11c3QgaGF2ZSBleGFjdGx5IG9uZSBvZiAnSXRlbVR5cGUnLCAnUHJpbWl0aXZlSXRlbVR5cGUnXCIpLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdlcnJvciBpZiBJdGVtVHlwZSBvciBQcmltaXRpdmVJdGVtVHlwZSBhcmUgYm90aCBhYnNlbnQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGVycm9yc0ZvcihyZXNvdXJjZVR5cGVQcm9wZXJ0eSh7XG4gICAgICBUeXBlOiAnTGlzdCcsXG4gICAgfSkpKS50b0VxdWFsKFtcbiAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKFwibXVzdCBoYXZlIGV4YWN0bHkgb25lIG9mICdJdGVtVHlwZScsICdQcmltaXRpdmVJdGVtVHlwZSdcIiksXG4gICAgXSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGVycm9yc0ZvcihzcGVjOiBhbnkpIHtcbiAgcmV0dXJuIENmblNwZWNWYWxpZGF0b3IudmFsaWRhdGUoc3BlYykubWFwKGUgPT4gZS5tZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gcmVzb3VyY2VUeXBlUHJvcGVydHkocHJvcDogYW55KSB7XG4gIHJldHVybiB7XG4gICAgUHJvcGVydHlUeXBlczoge1xuICAgICAgJ015OjpSZXNvdXJjZTo6VHlwZS5Bc2RmJzoge1xuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU29tZVN0cmluZzogeyBQcmltaXRpdmVUeXBlOiAnU3RyaW5nJyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIFJlc291cmNlVHlwZXM6IHtcbiAgICAgICdNeTo6UmVzb3VyY2U6OlR5cGUnOiB7XG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBNeVByb3BlcnR5OiBwcm9wLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xufSJdfQ==