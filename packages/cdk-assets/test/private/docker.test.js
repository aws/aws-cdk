"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const docker_1 = require("../../lib/private/docker");
describe('Docker', () => {
    describe('exists', () => {
        let docker;
        const makeShellExecuteMock = (fn) => jest.spyOn(docker_1.Docker.prototype, 'execute').mockImplementation(async (params, _options) => fn(params));
        afterEach(() => {
            jest.restoreAllMocks();
        });
        beforeEach(() => {
            docker = new docker_1.Docker();
        });
        test('returns true when image inspect command does not throw', async () => {
            const spy = makeShellExecuteMock(() => undefined);
            const imageExists = await docker.exists('foo');
            expect(imageExists).toBe(true);
            expect(spy.mock.calls[0][0]).toEqual(['inspect', 'foo']);
        });
        test('throws when an arbitrary error is caught', async () => {
            makeShellExecuteMock(() => {
                throw new Error();
            });
            await expect(docker.exists('foo')).rejects.toThrow();
        });
        test('throws when the error is a shell failure but the exit code is unrecognized', async () => {
            makeShellExecuteMock(() => {
                throw new (class extends Error {
                    constructor() {
                        super('foo');
                        this.code = 'PROCESS_FAILED';
                        this.exitCode = 47;
                        this.signal = null;
                    }
                });
            });
            await expect(docker.exists('foo')).rejects.toThrow();
        });
        test('returns false when the error is a shell failure and the exit code is 1 (Docker)', async () => {
            makeShellExecuteMock(() => {
                throw new (class extends Error {
                    constructor() {
                        super('foo');
                        this.code = 'PROCESS_FAILED';
                        this.exitCode = 1;
                        this.signal = null;
                    }
                });
            });
            const imageExists = await docker.exists('foo');
            expect(imageExists).toBe(false);
        });
        test('returns false when the error is a shell failure and the exit code is 125 (Podman)', async () => {
            makeShellExecuteMock(() => {
                throw new (class extends Error {
                    constructor() {
                        super('foo');
                        this.code = 'PROCESS_FAILED';
                        this.exitCode = 125;
                        this.signal = null;
                    }
                });
            });
            const imageExists = await docker.exists('foo');
            expect(imageExists).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb2NrZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUFrRDtBQUtsRCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUN0QixJQUFJLE1BQWMsQ0FBQztRQUVuQixNQUFNLG9CQUFvQixHQUFHLENBQzNCLEVBQThCLEVBQ1osRUFBRSxDQUNwQixJQUFJLENBQUMsS0FBSyxDQUE0QyxlQUFNLENBQUMsU0FBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQyxrQkFBa0IsQ0FDMUcsS0FBSyxFQUFFLE1BQWdCLEVBQUUsUUFBdUIsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUNoRSxDQUFDO1FBRUosU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNiLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyx3REFBd0QsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN4RSxNQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVsRCxNQUFNLFdBQVcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFL0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywwQ0FBMEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMxRCxvQkFBb0IsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNwQixDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNEVBQTRFLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDNUYsb0JBQW9CLENBQUMsR0FBRyxFQUFFO2dCQUN4QixNQUFNLElBQUksQ0FBQyxLQUFNLFNBQVEsS0FBSztvQkFLNUI7d0JBQ0UsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUxDLFNBQUksR0FBRyxnQkFBZ0IsQ0FBQTt3QkFDdkIsYUFBUSxHQUFHLEVBQUUsQ0FBQTt3QkFDYixXQUFNLEdBQUcsSUFBSSxDQUFBO29CQUk3QixDQUFDO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpRkFBaUYsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNqRyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxDQUFDLEtBQU0sU0FBUSxLQUFLO29CQUs1Qjt3QkFDRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBTEMsU0FBSSxHQUFHLGdCQUFnQixDQUFBO3dCQUN2QixhQUFRLEdBQUcsQ0FBQyxDQUFBO3dCQUNaLFdBQU0sR0FBRyxJQUFJLENBQUE7b0JBSTdCLENBQUM7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLFdBQVcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFL0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtRkFBbUYsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNuRyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxDQUFDLEtBQU0sU0FBUSxLQUFLO29CQUs1Qjt3QkFDRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBTEMsU0FBSSxHQUFHLGdCQUFnQixDQUFBO3dCQUN2QixhQUFRLEdBQUcsR0FBRyxDQUFBO3dCQUNkLFdBQU0sR0FBRyxJQUFJLENBQUE7b0JBSTdCLENBQUM7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLFdBQVcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFL0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEb2NrZXIgfSBmcm9tICcuLi8uLi9saWIvcHJpdmF0ZS9kb2NrZXInO1xuaW1wb3J0IHsgU2hlbGxPcHRpb25zLCBQcm9jZXNzRmFpbGVkRXJyb3IgfSBmcm9tICcuLi8uLi9saWIvcHJpdmF0ZS9zaGVsbCc7XG5cbnR5cGUgU2hlbGxFeGVjdXRlTW9jayA9IGplc3QuU3B5SW5zdGFuY2U8UmV0dXJuVHlwZTxEb2NrZXJbJ2V4ZWN1dGUnXT4sIFBhcmFtZXRlcnM8RG9ja2VyWydleGVjdXRlJ10+PjtcblxuZGVzY3JpYmUoJ0RvY2tlcicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2V4aXN0cycsICgpID0+IHtcbiAgICBsZXQgZG9ja2VyOiBEb2NrZXI7XG5cbiAgICBjb25zdCBtYWtlU2hlbGxFeGVjdXRlTW9jayA9IChcbiAgICAgIGZuOiAocGFyYW1zOiBzdHJpbmdbXSkgPT4gdm9pZCxcbiAgICApOiBTaGVsbEV4ZWN1dGVNb2NrID0+XG4gICAgICBqZXN0LnNweU9uPHsgZXhlY3V0ZTogRG9ja2VyWydleGVjdXRlJ10gfSwgJ2V4ZWN1dGUnPihEb2NrZXIucHJvdG90eXBlIGFzIGFueSwgJ2V4ZWN1dGUnKS5tb2NrSW1wbGVtZW50YXRpb24oXG4gICAgICAgIGFzeW5jIChwYXJhbXM6IHN0cmluZ1tdLCBfb3B0aW9ucz86IFNoZWxsT3B0aW9ucykgPT4gZm4ocGFyYW1zKSxcbiAgICAgICk7XG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgamVzdC5yZXN0b3JlQWxsTW9ja3MoKTtcbiAgICB9KTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZG9ja2VyID0gbmV3IERvY2tlcigpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmV0dXJucyB0cnVlIHdoZW4gaW1hZ2UgaW5zcGVjdCBjb21tYW5kIGRvZXMgbm90IHRocm93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc3B5ID0gbWFrZVNoZWxsRXhlY3V0ZU1vY2soKCkgPT4gdW5kZWZpbmVkKTtcblxuICAgICAgY29uc3QgaW1hZ2VFeGlzdHMgPSBhd2FpdCBkb2NrZXIuZXhpc3RzKCdmb28nKTtcblxuICAgICAgZXhwZWN0KGltYWdlRXhpc3RzKS50b0JlKHRydWUpO1xuICAgICAgZXhwZWN0KHNweS5tb2NrLmNhbGxzWzBdWzBdKS50b0VxdWFsKFsnaW5zcGVjdCcsICdmb28nXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3Mgd2hlbiBhbiBhcmJpdHJhcnkgZXJyb3IgaXMgY2F1Z2h0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgbWFrZVNoZWxsRXhlY3V0ZU1vY2soKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCBleHBlY3QoZG9ja2VyLmV4aXN0cygnZm9vJykpLnJlamVjdHMudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoZW4gdGhlIGVycm9yIGlzIGEgc2hlbGwgZmFpbHVyZSBidXQgdGhlIGV4aXQgY29kZSBpcyB1bnJlY29nbml6ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtYWtlU2hlbGxFeGVjdXRlTW9jaygoKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyAoY2xhc3MgZXh0ZW5kcyBFcnJvciBpbXBsZW1lbnRzIFByb2Nlc3NGYWlsZWRFcnJvciB7XG4gICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNvZGUgPSAnUFJPQ0VTU19GQUlMRUQnXG4gICAgICAgICAgcHVibGljIHJlYWRvbmx5IGV4aXRDb2RlID0gNDdcbiAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgc2lnbmFsID0gbnVsbFxuXG4gICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcignZm9vJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCBleHBlY3QoZG9ja2VyLmV4aXN0cygnZm9vJykpLnJlamVjdHMudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmV0dXJucyBmYWxzZSB3aGVuIHRoZSBlcnJvciBpcyBhIHNoZWxsIGZhaWx1cmUgYW5kIHRoZSBleGl0IGNvZGUgaXMgMSAoRG9ja2VyKScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1ha2VTaGVsbEV4ZWN1dGVNb2NrKCgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IChjbGFzcyBleHRlbmRzIEVycm9yIGltcGxlbWVudHMgUHJvY2Vzc0ZhaWxlZEVycm9yIHtcbiAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY29kZSA9ICdQUk9DRVNTX0ZBSUxFRCdcbiAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZXhpdENvZGUgPSAxXG4gICAgICAgICAgcHVibGljIHJlYWRvbmx5IHNpZ25hbCA9IG51bGxcblxuICAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoJ2ZvbycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW1hZ2VFeGlzdHMgPSBhd2FpdCBkb2NrZXIuZXhpc3RzKCdmb28nKTtcblxuICAgICAgZXhwZWN0KGltYWdlRXhpc3RzKS50b0JlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JldHVybnMgZmFsc2Ugd2hlbiB0aGUgZXJyb3IgaXMgYSBzaGVsbCBmYWlsdXJlIGFuZCB0aGUgZXhpdCBjb2RlIGlzIDEyNSAoUG9kbWFuKScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1ha2VTaGVsbEV4ZWN1dGVNb2NrKCgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IChjbGFzcyBleHRlbmRzIEVycm9yIGltcGxlbWVudHMgUHJvY2Vzc0ZhaWxlZEVycm9yIHtcbiAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY29kZSA9ICdQUk9DRVNTX0ZBSUxFRCdcbiAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZXhpdENvZGUgPSAxMjVcbiAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgc2lnbmFsID0gbnVsbFxuXG4gICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcignZm9vJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbWFnZUV4aXN0cyA9IGF3YWl0IGRvY2tlci5leGlzdHMoJ2ZvbycpO1xuXG4gICAgICBleHBlY3QoaW1hZ2VFeGlzdHMpLnRvQmUoZmFsc2UpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19