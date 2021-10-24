"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lib_1 = require("../lib");
test('generate lock for fixture directory', async () => {
    const lockFile = await lib_1.generateShrinkwrap({
        packageJsonFile: path.join(__dirname, 'test-fixture', 'package1', 'package.json'),
        hoist: false,
    });
    expect(lockFile).toEqual({
        lockfileVersion: 1,
        name: "package1",
        requires: true,
        version: "1.1.1",
        dependencies: {
            package2: {
                version: "2.2.2",
            },
            registrydependency1: {
                dependencies: {
                    registrydependency2: {
                        integrity: "sha512-pineapple",
                        resolved: "https://registry.bla.com/stuff",
                        version: "2.3.999",
                    },
                },
                integrity: "sha512-banana",
                requires: {
                    registrydependency2: "^2.3.4",
                },
                resolved: "https://registry.bla.com/stuff",
                version: "1.2.999",
            },
        },
    });
});
test('generate hoisted lock for fixture directory', async () => {
    const lockFile = await lib_1.generateShrinkwrap({
        packageJsonFile: path.join(__dirname, 'test-fixture', 'package1', 'package.json'),
        hoist: true,
    });
    expect(lockFile).toEqual({
        lockfileVersion: 1,
        name: "package1",
        requires: true,
        version: "1.1.1",
        dependencies: {
            package2: {
                version: "2.2.2",
            },
            registrydependency1: {
                integrity: "sha512-banana",
                requires: {
                    registrydependency2: "^2.3.4",
                },
                resolved: "https://registry.bla.com/stuff",
                version: "1.2.999",
            },
            registrydependency2: {
                integrity: "sha512-pineapple",
                resolved: "https://registry.bla.com/stuff",
                version: "2.3.999",
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpbmcudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsaW5nLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsZ0NBQTRDO0FBRTVDLElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLElBQUksRUFBRTtJQUNyRCxNQUFNLFFBQVEsR0FBRyxNQUFNLHdCQUFrQixDQUFDO1FBQ3hDLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQztRQUNqRixLQUFLLEVBQUUsS0FBSztLQUNiLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDdkIsZUFBZSxFQUFFLENBQUM7UUFDbEIsSUFBSSxFQUFFLFVBQVU7UUFDaEIsUUFBUSxFQUFFLElBQUk7UUFDZCxPQUFPLEVBQUUsT0FBTztRQUNoQixZQUFZLEVBQUU7WUFDWixRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLE9BQU87YUFDakI7WUFDRCxtQkFBbUIsRUFBRTtnQkFDbkIsWUFBWSxFQUFFO29CQUNaLG1CQUFtQixFQUFFO3dCQUNuQixTQUFTLEVBQUUsa0JBQWtCO3dCQUM3QixRQUFRLEVBQUUsZ0NBQWdDO3dCQUMxQyxPQUFPLEVBQUUsU0FBUztxQkFDbkI7aUJBQ0Y7Z0JBQ0QsU0FBUyxFQUFFLGVBQWU7Z0JBQzFCLFFBQVEsRUFBRTtvQkFDUixtQkFBbUIsRUFBRSxRQUFRO2lCQUM5QjtnQkFDRCxRQUFRLEVBQUUsZ0NBQWdDO2dCQUMxQyxPQUFPLEVBQUUsU0FBUzthQUNuQjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDN0QsTUFBTSxRQUFRLEdBQUcsTUFBTSx3QkFBa0IsQ0FBQztRQUN4QyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUM7UUFDakYsS0FBSyxFQUFFLElBQUk7S0FDWixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3ZCLGVBQWUsRUFBRSxDQUFDO1FBQ2xCLElBQUksRUFBRSxVQUFVO1FBQ2hCLFFBQVEsRUFBRSxJQUFJO1FBQ2QsT0FBTyxFQUFFLE9BQU87UUFDaEIsWUFBWSxFQUFFO1lBQ1osUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxPQUFPO2FBQ2pCO1lBQ0QsbUJBQW1CLEVBQUU7Z0JBQ25CLFNBQVMsRUFBRSxlQUFlO2dCQUMxQixRQUFRLEVBQUU7b0JBQ1IsbUJBQW1CLEVBQUUsUUFBUTtpQkFDOUI7Z0JBQ0QsUUFBUSxFQUFFLGdDQUFnQztnQkFDMUMsT0FBTyxFQUFFLFNBQVM7YUFDbkI7WUFDRCxtQkFBbUIsRUFBRTtnQkFDbkIsU0FBUyxFQUFFLGtCQUFrQjtnQkFDN0IsUUFBUSxFQUFFLGdDQUFnQztnQkFDMUMsT0FBTyxFQUFFLFNBQVM7YUFDbkI7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGdlbmVyYXRlU2hyaW5rd3JhcCB9IGZyb20gXCIuLi9saWJcIjtcblxudGVzdCgnZ2VuZXJhdGUgbG9jayBmb3IgZml4dHVyZSBkaXJlY3RvcnknLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGxvY2tGaWxlID0gYXdhaXQgZ2VuZXJhdGVTaHJpbmt3cmFwKHtcbiAgICBwYWNrYWdlSnNvbkZpbGU6IHBhdGguam9pbihfX2Rpcm5hbWUsICd0ZXN0LWZpeHR1cmUnLCAncGFja2FnZTEnLCAncGFja2FnZS5qc29uJyksXG4gICAgaG9pc3Q6IGZhbHNlLFxuICB9KTtcblxuICBleHBlY3QobG9ja0ZpbGUpLnRvRXF1YWwoe1xuICAgIGxvY2tmaWxlVmVyc2lvbjogMSxcbiAgICBuYW1lOiBcInBhY2thZ2UxXCIsXG4gICAgcmVxdWlyZXM6IHRydWUsXG4gICAgdmVyc2lvbjogXCIxLjEuMVwiLFxuICAgIGRlcGVuZGVuY2llczoge1xuICAgICAgcGFja2FnZTI6IHtcbiAgICAgICAgdmVyc2lvbjogXCIyLjIuMlwiLFxuICAgICAgfSxcbiAgICAgIHJlZ2lzdHJ5ZGVwZW5kZW5jeTE6IHtcbiAgICAgICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICAgICAgcmVnaXN0cnlkZXBlbmRlbmN5Mjoge1xuICAgICAgICAgICAgaW50ZWdyaXR5OiBcInNoYTUxMi1waW5lYXBwbGVcIixcbiAgICAgICAgICAgIHJlc29sdmVkOiBcImh0dHBzOi8vcmVnaXN0cnkuYmxhLmNvbS9zdHVmZlwiLFxuICAgICAgICAgICAgdmVyc2lvbjogXCIyLjMuOTk5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgaW50ZWdyaXR5OiBcInNoYTUxMi1iYW5hbmFcIixcbiAgICAgICAgcmVxdWlyZXM6IHtcbiAgICAgICAgICByZWdpc3RyeWRlcGVuZGVuY3kyOiBcIl4yLjMuNFwiLFxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlZDogXCJodHRwczovL3JlZ2lzdHJ5LmJsYS5jb20vc3R1ZmZcIixcbiAgICAgICAgdmVyc2lvbjogXCIxLjIuOTk5XCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2dlbmVyYXRlIGhvaXN0ZWQgbG9jayBmb3IgZml4dHVyZSBkaXJlY3RvcnknLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGxvY2tGaWxlID0gYXdhaXQgZ2VuZXJhdGVTaHJpbmt3cmFwKHtcbiAgICBwYWNrYWdlSnNvbkZpbGU6IHBhdGguam9pbihfX2Rpcm5hbWUsICd0ZXN0LWZpeHR1cmUnLCAncGFja2FnZTEnLCAncGFja2FnZS5qc29uJyksXG4gICAgaG9pc3Q6IHRydWUsXG4gIH0pO1xuXG4gIGV4cGVjdChsb2NrRmlsZSkudG9FcXVhbCh7XG4gICAgbG9ja2ZpbGVWZXJzaW9uOiAxLFxuICAgIG5hbWU6IFwicGFja2FnZTFcIixcbiAgICByZXF1aXJlczogdHJ1ZSxcbiAgICB2ZXJzaW9uOiBcIjEuMS4xXCIsXG4gICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICBwYWNrYWdlMjoge1xuICAgICAgICB2ZXJzaW9uOiBcIjIuMi4yXCIsXG4gICAgICB9LFxuICAgICAgcmVnaXN0cnlkZXBlbmRlbmN5MToge1xuICAgICAgICBpbnRlZ3JpdHk6IFwic2hhNTEyLWJhbmFuYVwiLFxuICAgICAgICByZXF1aXJlczoge1xuICAgICAgICAgIHJlZ2lzdHJ5ZGVwZW5kZW5jeTI6IFwiXjIuMy40XCIsXG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmVkOiBcImh0dHBzOi8vcmVnaXN0cnkuYmxhLmNvbS9zdHVmZlwiLFxuICAgICAgICB2ZXJzaW9uOiBcIjEuMi45OTlcIixcbiAgICAgIH0sXG4gICAgICByZWdpc3RyeWRlcGVuZGVuY3kyOiB7XG4gICAgICAgIGludGVncml0eTogXCJzaGE1MTItcGluZWFwcGxlXCIsXG4gICAgICAgIHJlc29sdmVkOiBcImh0dHBzOi8vcmVnaXN0cnkuYmxhLmNvbS9zdHVmZlwiLFxuICAgICAgICB2ZXJzaW9uOiBcIjIuMy45OTlcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTsiXX0=