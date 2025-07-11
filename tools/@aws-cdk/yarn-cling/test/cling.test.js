"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lib_1 = require("../lib");
test('generate lock for fixture directory', async () => {
    const lockFile = await (0, lib_1.generateShrinkwrap)({
        packageJsonFile: path.join(__dirname, 'test-fixture', 'jsii', 'package.json'),
        hoist: false,
    });
    expect(lockFile).toEqual({
        lockfileVersion: 1,
        name: 'jsii',
        requires: true,
        version: '1.1.1',
        dependencies: {
            'cdk': {
                version: '2.2.2',
            },
            'aws-cdk': {
                dependencies: {
                    'aws-cdk-lib': {
                        integrity: 'sha512-pineapple',
                        resolved: 'https://registry.bla.com/stuff',
                        version: '2.3.999',
                    },
                },
                integrity: 'sha512-banana',
                requires: {
                    'aws-cdk-lib': '^2.3.4',
                },
                resolved: 'https://registry.bla.com/stuff',
                version: '1.2.999',
            },
        },
    });
});
test('generate hoisted lock for fixture directory', async () => {
    const lockFile = await (0, lib_1.generateShrinkwrap)({
        packageJsonFile: path.join(__dirname, 'test-fixture', 'jsii', 'package.json'),
        hoist: true,
    });
    expect(lockFile).toEqual({
        lockfileVersion: 1,
        name: 'jsii',
        requires: true,
        version: '1.1.1',
        dependencies: {
            'cdk': {
                version: '2.2.2',
            },
            'aws-cdk': {
                integrity: 'sha512-banana',
                requires: {
                    'aws-cdk-lib': '^2.3.4',
                },
                resolved: 'https://registry.bla.com/stuff',
                version: '1.2.999',
            },
            'aws-cdk-lib': {
                integrity: 'sha512-pineapple',
                resolved: 'https://registry.bla.com/stuff',
                version: '2.3.999',
            },
        },
    });
});
test('fail when requires cannot be satisfied', async () => {
    const lockFile = {
        lockfileVersion: 1,
        name: 'jsii',
        requires: true,
        version: '1.1.1',
        dependencies: {
            jsii: {
                version: '2.2.2',
                requires: {
                    cdk: '^3.3.3', // <- this needs to be adjusted
                },
            },
            cdk: {
                version: '4.4.4',
            },
        },
    };
    expect(() => (0, lib_1.checkRequiredVersions)(lockFile)).toThrow(/This can never/);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpbmcudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsaW5nLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsZ0NBQW1FO0FBRW5FLElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLElBQUksRUFBRTtJQUNyRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsd0JBQWtCLEVBQUM7UUFDeEMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDO1FBQzdFLEtBQUssRUFBRSxLQUFLO0tBQ2IsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN2QixlQUFlLEVBQUUsQ0FBQztRQUNsQixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsT0FBTyxFQUFFLE9BQU87UUFDaEIsWUFBWSxFQUFFO1lBQ1osS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxPQUFPO2FBQ2pCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRTtvQkFDWixhQUFhLEVBQUU7d0JBQ2IsU0FBUyxFQUFFLGtCQUFrQjt3QkFDN0IsUUFBUSxFQUFFLGdDQUFnQzt3QkFDMUMsT0FBTyxFQUFFLFNBQVM7cUJBQ25CO2lCQUNGO2dCQUNELFNBQVMsRUFBRSxlQUFlO2dCQUMxQixRQUFRLEVBQUU7b0JBQ1IsYUFBYSxFQUFFLFFBQVE7aUJBQ3hCO2dCQUNELFFBQVEsRUFBRSxnQ0FBZ0M7Z0JBQzFDLE9BQU8sRUFBRSxTQUFTO2FBQ25CO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxLQUFLLElBQUksRUFBRTtJQUM3RCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsd0JBQWtCLEVBQUM7UUFDeEMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDO1FBQzdFLEtBQUssRUFBRSxJQUFJO0tBQ1osQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN2QixlQUFlLEVBQUUsQ0FBQztRQUNsQixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsT0FBTyxFQUFFLE9BQU87UUFDaEIsWUFBWSxFQUFFO1lBQ1osS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxPQUFPO2FBQ2pCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFNBQVMsRUFBRSxlQUFlO2dCQUMxQixRQUFRLEVBQUU7b0JBQ1IsYUFBYSxFQUFFLFFBQVE7aUJBQ3hCO2dCQUNELFFBQVEsRUFBRSxnQ0FBZ0M7Z0JBQzFDLE9BQU8sRUFBRSxTQUFTO2FBQ25CO1lBQ0QsYUFBYSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxrQkFBa0I7Z0JBQzdCLFFBQVEsRUFBRSxnQ0FBZ0M7Z0JBQzFDLE9BQU8sRUFBRSxTQUFTO2FBQ25CO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLElBQUksRUFBRTtJQUN4RCxNQUFNLFFBQVEsR0FBRztRQUNmLGVBQWUsRUFBRSxDQUFDO1FBQ2xCLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxPQUFPLEVBQUUsT0FBTztRQUNoQixZQUFZLEVBQUU7WUFDWixJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLFFBQVEsRUFBRTtvQkFDUixHQUFHLEVBQUUsUUFBUSxFQUFFLCtCQUErQjtpQkFDL0M7YUFDRjtZQUNELEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsT0FBTzthQUNqQjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLDJCQUFxQixFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUUsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgY2hlY2tSZXF1aXJlZFZlcnNpb25zLCBnZW5lcmF0ZVNocmlua3dyYXAgfSBmcm9tICcuLi9saWInO1xuXG50ZXN0KCdnZW5lcmF0ZSBsb2NrIGZvciBmaXh0dXJlIGRpcmVjdG9yeScsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgbG9ja0ZpbGUgPSBhd2FpdCBnZW5lcmF0ZVNocmlua3dyYXAoe1xuICAgIHBhY2thZ2VKc29uRmlsZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Rlc3QtZml4dHVyZScsICdqc2lpJywgJ3BhY2thZ2UuanNvbicpLFxuICAgIGhvaXN0OiBmYWxzZSxcbiAgfSk7XG5cbiAgZXhwZWN0KGxvY2tGaWxlKS50b0VxdWFsKHtcbiAgICBsb2NrZmlsZVZlcnNpb246IDEsXG4gICAgbmFtZTogJ2pzaWknLFxuICAgIHJlcXVpcmVzOiB0cnVlLFxuICAgIHZlcnNpb246ICcxLjEuMScsXG4gICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICAnY2RrJzoge1xuICAgICAgICB2ZXJzaW9uOiAnMi4yLjInLFxuICAgICAgfSxcbiAgICAgICdhd3MtY2RrJzoge1xuICAgICAgICBkZXBlbmRlbmNpZXM6IHtcbiAgICAgICAgICAnYXdzLWNkay1saWInOiB7XG4gICAgICAgICAgICBpbnRlZ3JpdHk6ICdzaGE1MTItcGluZWFwcGxlJyxcbiAgICAgICAgICAgIHJlc29sdmVkOiAnaHR0cHM6Ly9yZWdpc3RyeS5ibGEuY29tL3N0dWZmJyxcbiAgICAgICAgICAgIHZlcnNpb246ICcyLjMuOTk5JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBpbnRlZ3JpdHk6ICdzaGE1MTItYmFuYW5hJyxcbiAgICAgICAgcmVxdWlyZXM6IHtcbiAgICAgICAgICAnYXdzLWNkay1saWInOiAnXjIuMy40JyxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZWQ6ICdodHRwczovL3JlZ2lzdHJ5LmJsYS5jb20vc3R1ZmYnLFxuICAgICAgICB2ZXJzaW9uOiAnMS4yLjk5OScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2dlbmVyYXRlIGhvaXN0ZWQgbG9jayBmb3IgZml4dHVyZSBkaXJlY3RvcnknLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGxvY2tGaWxlID0gYXdhaXQgZ2VuZXJhdGVTaHJpbmt3cmFwKHtcbiAgICBwYWNrYWdlSnNvbkZpbGU6IHBhdGguam9pbihfX2Rpcm5hbWUsICd0ZXN0LWZpeHR1cmUnLCAnanNpaScsICdwYWNrYWdlLmpzb24nKSxcbiAgICBob2lzdDogdHJ1ZSxcbiAgfSk7XG5cbiAgZXhwZWN0KGxvY2tGaWxlKS50b0VxdWFsKHtcbiAgICBsb2NrZmlsZVZlcnNpb246IDEsXG4gICAgbmFtZTogJ2pzaWknLFxuICAgIHJlcXVpcmVzOiB0cnVlLFxuICAgIHZlcnNpb246ICcxLjEuMScsXG4gICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICAnY2RrJzoge1xuICAgICAgICB2ZXJzaW9uOiAnMi4yLjInLFxuICAgICAgfSxcbiAgICAgICdhd3MtY2RrJzoge1xuICAgICAgICBpbnRlZ3JpdHk6ICdzaGE1MTItYmFuYW5hJyxcbiAgICAgICAgcmVxdWlyZXM6IHtcbiAgICAgICAgICAnYXdzLWNkay1saWInOiAnXjIuMy40JyxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZWQ6ICdodHRwczovL3JlZ2lzdHJ5LmJsYS5jb20vc3R1ZmYnLFxuICAgICAgICB2ZXJzaW9uOiAnMS4yLjk5OScsXG4gICAgICB9LFxuICAgICAgJ2F3cy1jZGstbGliJzoge1xuICAgICAgICBpbnRlZ3JpdHk6ICdzaGE1MTItcGluZWFwcGxlJyxcbiAgICAgICAgcmVzb2x2ZWQ6ICdodHRwczovL3JlZ2lzdHJ5LmJsYS5jb20vc3R1ZmYnLFxuICAgICAgICB2ZXJzaW9uOiAnMi4zLjk5OScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ZhaWwgd2hlbiByZXF1aXJlcyBjYW5ub3QgYmUgc2F0aXNmaWVkJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBsb2NrRmlsZSA9IHtcbiAgICBsb2NrZmlsZVZlcnNpb246IDEsXG4gICAgbmFtZTogJ2pzaWknLFxuICAgIHJlcXVpcmVzOiB0cnVlLFxuICAgIHZlcnNpb246ICcxLjEuMScsXG4gICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICBqc2lpOiB7XG4gICAgICAgIHZlcnNpb246ICcyLjIuMicsXG4gICAgICAgIHJlcXVpcmVzOiB7XG4gICAgICAgICAgY2RrOiAnXjMuMy4zJywgLy8gPC0gdGhpcyBuZWVkcyB0byBiZSBhZGp1c3RlZFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNkazoge1xuICAgICAgICB2ZXJzaW9uOiAnNC40LjQnLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIGV4cGVjdCgoKSA9PiBjaGVja1JlcXVpcmVkVmVyc2lvbnMobG9ja0ZpbGUpKS50b1Rocm93KC9UaGlzIGNhbiBuZXZlci8pO1xufSk7XG4iXX0=