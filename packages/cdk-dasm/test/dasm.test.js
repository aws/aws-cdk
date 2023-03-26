"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
test('basic test', async () => {
    expect(await dasm({
        Resources: {
            MyTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    DisplayName: 'hello hello'
                }
            }
        }
    })).toMatchSnapshot();
});
test('no props', async () => {
    expect(await dasm({
        Resources: {
            Boom: {
                Type: 'AWS::S3::Bucket'
            }
        }
    })).toMatchSnapshot();
});
test('multiple of same type', async () => {
    expect(await dasm({
        Resources: {
            MyTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    DisplayName: 'hello hello'
                }
            },
            MyTopicDos: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    DisplayName: 'hello again'
                }
            }
        }
    })).toMatchSnapshot();
});
test('bucket-and-key', async () => {
    expect(await dasm(require('./bucket-key.json'))).toMatchSnapshot();
});
async function dasm(template) {
    return lib_1.dasmTypeScript(template, { timestamp: false });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzbS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGFzbS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQXdDO0FBRXhDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDNUIsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDO1FBQ2hCLFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixVQUFVLEVBQUU7b0JBQ1YsV0FBVyxFQUFFLGFBQWE7aUJBQzNCO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLElBQUksRUFBRTtJQUMxQixNQUFNLENBQUMsTUFBTSxJQUFJLENBQUM7UUFDaEIsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxpQkFBaUI7YUFDeEI7U0FDRjtLQUNGLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3ZDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQztRQUNoQixTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLGlCQUFpQjtnQkFDdkIsVUFBVSxFQUFFO29CQUNWLFdBQVcsRUFBRSxhQUFhO2lCQUMzQjthQUNGO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLFVBQVUsRUFBRTtvQkFDVixXQUFXLEVBQUUsYUFBYTtpQkFDM0I7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDaEMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUNyRSxDQUFDLENBQUMsQ0FBQztBQUVILEtBQUssVUFBVSxJQUFJLENBQUMsUUFBYTtJQUMvQixPQUFPLG9CQUFjLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDeEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRhc21UeXBlU2NyaXB0IH0gZnJvbSAnLi4vbGliJztcblxudGVzdCgnYmFzaWMgdGVzdCcsIGFzeW5jICgpID0+IHtcbiAgZXhwZWN0KGF3YWl0IGRhc20oe1xuICAgIFJlc291cmNlczoge1xuICAgICAgTXlUb3BpYzoge1xuICAgICAgICBUeXBlOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIERpc3BsYXlOYW1lOiAnaGVsbG8gaGVsbG8nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pKS50b01hdGNoU25hcHNob3QoKTtcbn0pO1xuXG50ZXN0KCdubyBwcm9wcycsIGFzeW5jICgpID0+IHtcbiAgZXhwZWN0KGF3YWl0IGRhc20oe1xuICAgIFJlc291cmNlczoge1xuICAgICAgQm9vbToge1xuICAgICAgICBUeXBlOiAnQVdTOjpTMzo6QnVja2V0J1xuICAgICAgfVxuICAgIH1cbiAgfSkpLnRvTWF0Y2hTbmFwc2hvdCgpO1xufSk7XG5cbnRlc3QoJ211bHRpcGxlIG9mIHNhbWUgdHlwZScsIGFzeW5jICgpID0+IHtcbiAgZXhwZWN0KGF3YWl0IGRhc20oe1xuICAgIFJlc291cmNlczoge1xuICAgICAgTXlUb3BpYzoge1xuICAgICAgICBUeXBlOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIERpc3BsYXlOYW1lOiAnaGVsbG8gaGVsbG8nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBNeVRvcGljRG9zOiB7XG4gICAgICAgIFR5cGU6ICdBV1M6OlNOUzo6VG9waWMnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgRGlzcGxheU5hbWU6ICdoZWxsbyBhZ2FpbidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSkpLnRvTWF0Y2hTbmFwc2hvdCgpO1xufSk7XG5cbnRlc3QoJ2J1Y2tldC1hbmQta2V5JywgYXN5bmMgKCkgPT4ge1xuICBleHBlY3QoYXdhaXQgZGFzbShyZXF1aXJlKCcuL2J1Y2tldC1rZXkuanNvbicpKSkudG9NYXRjaFNuYXBzaG90KCk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gZGFzbSh0ZW1wbGF0ZTogYW55KSB7XG4gIHJldHVybiBkYXNtVHlwZVNjcmlwdCh0ZW1wbGF0ZSwgeyB0aW1lc3RhbXA6IGZhbHNlIH0pO1xufSJdfQ==