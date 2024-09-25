"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const mockfs = require("mock-fs");
const docker_credentials_1 = require("../../lib/private/docker-credentials");
const mock_aws_1 = require("../mock-aws");
const _ENV = process.env;
let aws;
beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    aws = (0, mock_aws_1.mockAws)();
    process.env = { ..._ENV };
});
afterEach(() => {
    mockfs.restore();
    process.env = _ENV;
});
describe('cdkCredentialsConfigFile', () => {
    test('Can be overridden by CDK_DOCKER_CREDS_FILE', () => {
        const credsFile = '/tmp/insertfilenamehere_cdk_config.json';
        process.env.CDK_DOCKER_CREDS_FILE = credsFile;
        expect((0, docker_credentials_1.cdkCredentialsConfigFile)()).toEqual(credsFile);
    });
    test('Uses homedir if no process env is set', () => {
        expect((0, docker_credentials_1.cdkCredentialsConfigFile)()).toEqual(path.join(os.userInfo().homedir, '.cdk', 'cdk-docker-creds.json'));
    });
});
describe('cdkCredentialsConfig', () => {
    const credsFile = '/tmp/foo/bar/does/not/exist/config.json';
    beforeEach(() => { process.env.CDK_DOCKER_CREDS_FILE = credsFile; });
    test('returns undefined if no config exists', () => {
        expect((0, docker_credentials_1.cdkCredentialsConfig)()).toBeUndefined();
    });
    test('returns parsed config if it exists', () => {
        mockfs({
            [credsFile]: JSON.stringify({
                version: '0.1',
                domainCredentials: {
                    'test1.example.com': { secretsManagerSecretId: 'mySecret' },
                    'test2.example.com': { ecrRepository: 'arn:aws:ecr:bar' },
                },
            }),
        });
        const config = (0, docker_credentials_1.cdkCredentialsConfig)();
        expect(config).toBeDefined();
        expect(config?.version).toEqual('0.1');
        expect(config?.domainCredentials['test1.example.com']?.secretsManagerSecretId).toEqual('mySecret');
        expect(config?.domainCredentials['test2.example.com']?.ecrRepository).toEqual('arn:aws:ecr:bar');
    });
});
describe('fetchDockerLoginCredentials', () => {
    let config;
    beforeEach(() => {
        config = {
            version: '0.1',
            domainCredentials: {
                'misconfigured.example.com': {},
                'secret.example.com': { secretsManagerSecretId: 'mySecret' },
                'secretwithrole.example.com': {
                    secretsManagerSecretId: 'mySecret',
                    assumeRoleArn: 'arn:aws:iam::0123456789012:role/my-role',
                },
                'secretwithcustomfields.example.com': {
                    secretsManagerSecretId: 'mySecret',
                    secretsUsernameField: 'name',
                    secretsPasswordField: 'apiKey',
                    assumeRoleArn: 'arn:aws:iam::0123456789012:role/my-role',
                },
                'ecr.example.com': { ecrRepository: true },
                'ecrwithrole.example.com': {
                    ecrRepository: true,
                    assumeRoleArn: 'arn:aws:iam::0123456789012:role/my-role',
                },
            },
        };
    });
    test('throws on unknown domain', async () => {
        await expect((0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'unknowndomain.example.com')).rejects.toThrow(/unknown domain/);
    });
    test('throws on misconfigured domain (no ECR or SM)', async () => {
        await expect((0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'misconfigured.example.com')).rejects.toThrow(/unknown credential type/);
    });
    test('does not throw on correctly configured raw domain', async () => {
        mockSecretWithSecretString({ username: 'secretUser', secret: 'secretPass' });
        await expect((0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'https://secret.example.com/v1/')).resolves.toBeTruthy();
    });
    describe('SecretsManager', () => {
        test('returns the credentials successfully if configured correctly - domain', async () => {
            mockSecretWithSecretString({ username: 'secretUser', secret: 'secretPass' });
            const creds = await (0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'secret.example.com');
            expect(creds).toEqual({ Username: 'secretUser', Secret: 'secretPass' });
        });
        test('returns the credentials successfully if configured correctly - raw domain', async () => {
            mockSecretWithSecretString({ username: 'secretUser', secret: 'secretPass' });
            const creds = await (0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'https://secret.example.com');
            expect(creds).toEqual({ Username: 'secretUser', Secret: 'secretPass' });
        });
        test('throws when SecretsManager returns an error', async () => {
            const errMessage = "Secrets Manager can't find the specified secret.";
            aws.mockSecretsManager.getSecretValue = (0, mock_aws_1.mockedApiFailure)('ResourceNotFoundException', errMessage);
            await expect((0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'secret.example.com')).rejects.toThrow(errMessage);
        });
        test('supports assuming a role', async () => {
            mockSecretWithSecretString({ username: 'secretUser', secret: 'secretPass' });
            const creds = await (0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'secretwithrole.example.com');
            expect(creds).toEqual({ Username: 'secretUser', Secret: 'secretPass' });
            expect(aws.secretsManagerClient).toHaveBeenCalledWith({ assumeRoleArn: 'arn:aws:iam::0123456789012:role/my-role' });
        });
        test('supports configuring the secret fields', async () => {
            mockSecretWithSecretString({ name: 'secretUser', apiKey: '01234567' });
            const creds = await (0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'secretwithcustomfields.example.com');
            expect(creds).toEqual({ Username: 'secretUser', Secret: '01234567' });
        });
        test('throws when secret does not have the correct fields - key/value', async () => {
            mockSecretWithSecretString({ principal: 'foo', credential: 'bar' });
            await expect((0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'secret.example.com')).rejects.toThrow(/malformed secret string/);
        });
        test('throws when secret does not have the correct fields - plaintext', async () => {
            mockSecretWithSecretString('myAPIKey');
            await expect((0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'secret.example.com')).rejects.toThrow(/malformed secret string/);
        });
    });
    describe('ECR getAuthorizationToken', () => {
        test('returns the credentials successfully', async () => {
            mockEcrAuthorizationData(Buffer.from('myFoo:myBar', 'utf-8').toString('base64'));
            const creds = await (0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'ecr.example.com');
            expect(creds).toEqual({ Username: 'myFoo', Secret: 'myBar' });
        });
        test('throws if ECR errors', async () => {
            aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiFailure)('ServerException', 'uhoh');
            await expect((0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'ecr.example.com')).rejects.toThrow(/uhoh/);
        });
        test('supports assuming a role', async () => {
            mockEcrAuthorizationData(Buffer.from('myFoo:myBar', 'utf-8').toString('base64'));
            const creds = await (0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'ecrwithrole.example.com');
            expect(creds).toEqual({ Username: 'myFoo', Secret: 'myBar' });
            expect(aws.ecrClient).toHaveBeenCalledWith({ assumeRoleArn: 'arn:aws:iam::0123456789012:role/my-role' });
        });
        test('throws if ECR returns no authData', async () => {
            aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({ authorizationData: [] });
            await expect((0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'ecr.example.com')).rejects.toThrow(/No authorization data received from ECR/);
        });
        test('throws if ECR authData is in an incorrect format', async () => {
            mockEcrAuthorizationData('notabase64encodedstring');
            await expect((0, docker_credentials_1.fetchDockerLoginCredentials)(aws, config, 'ecr.example.com')).rejects.toThrow(/unexpected ECR authData format/);
        });
    });
});
function mockSecretWithSecretString(secretString) {
    aws.mockSecretsManager.getSecretValue = (0, mock_aws_1.mockedApiResult)({
        ARN: 'arn:aws:secretsmanager:eu-west-1:0123456789012:secret:mySecret',
        Name: 'mySecret',
        VersionId: 'fa81fe61-c167-4aca-969e-4d8df74d4814',
        SecretString: JSON.stringify(secretString),
        VersionStages: [
            'AWSCURRENT',
        ],
    });
}
function mockEcrAuthorizationData(authorizationToken) {
    aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
        authorizationData: [
            {
                authorizationToken,
                proxyEndpoint: 'https://0123456789012.dkr.ecr.eu-west-1.amazonaws.com',
            },
        ],
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLWNyZWRlbnRpYWxzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb2NrZXItY3JlZGVudGlhbHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0Isa0NBQWtDO0FBQ2xDLDZFQUE0SjtBQUM1SiwwQ0FBeUU7QUFFekUsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUV6QixJQUFJLEdBQStCLENBQUM7QUFDcEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFFckIsR0FBRyxHQUFHLElBQUEsa0JBQU8sR0FBRSxDQUFDO0lBRWhCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO0FBQzVCLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxDQUFDLEdBQUcsRUFBRTtJQUNiLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQixPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsSUFBSSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtRQUN0RCxNQUFNLFNBQVMsR0FBRyx5Q0FBeUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztRQUU5QyxNQUFNLENBQUMsSUFBQSw2Q0FBd0IsR0FBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUNqRCxNQUFNLENBQUMsSUFBQSw2Q0FBd0IsR0FBRSxDQUFDLENBQUMsT0FBTyxDQUFD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WUFDakI7Z0JBQ0Usa0JBQWtCO2dCQUNsQixhQUFhLEVBQUUsdURBQXVEO2FBQ3ZFO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIG1vY2tmcyBmcm9tICdtb2NrLWZzJztcbmltcG9ydCB7IGNka0NyZWRlbnRpYWxzQ29uZmlnLCBjZGtDcmVkZW50aWFsc0NvbmZpZ0ZpbGUsIERvY2tlckNyZWRlbnRpYWxzQ29uZmlnLCBmZXRjaERvY2tlckxvZ2luQ3JlZGVudGlhbHMgfSBmcm9tICcuLi8uLi9saWIvcHJpdmF0ZS9kb2NrZXItY3JlZGVudGlhbHMnO1xuaW1wb3J0IHsgbW9ja0F3cywgbW9ja2VkQXBpRmFpbHVyZSwgbW9ja2VkQXBpUmVzdWx0IH0gZnJvbSAnLi4vbW9jay1hd3MnO1xuXG5jb25zdCBfRU5WID0gcHJvY2Vzcy5lbnY7XG5cbmxldCBhd3M6IFJldHVyblR5cGU8dHlwZW9mIG1vY2tBd3M+O1xuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIGplc3QucmVzZXRNb2R1bGVzKCk7XG4gIGplc3QucmVzZXRBbGxNb2NrcygpO1xuXG4gIGF3cyA9IG1vY2tBd3MoKTtcblxuICBwcm9jZXNzLmVudiA9IHsgLi4uX0VOViB9O1xufSk7XG5cbmFmdGVyRWFjaCgoKSA9PiB7XG4gIG1vY2tmcy5yZXN0b3JlKCk7XG4gIHByb2Nlc3MuZW52ID0gX0VOVjtcbn0pO1xuXG5kZXNjcmliZSgnY2RrQ3JlZGVudGlhbHNDb25maWdGaWxlJywgKCkgPT4ge1xuICB0ZXN0KCdDYW4gYmUgb3ZlcnJpZGRlbiBieSBDREtfRE9DS0VSX0NSRURTX0ZJTEUnLCAoKSA9PiB7XG4gICAgY29uc3QgY3JlZHNGaWxlID0gJy90bXAvaW5zZXJ0ZmlsZW5hbWVoZXJlX2Nka19jb25maWcuanNvbic7XG4gICAgcHJvY2Vzcy5lbnYuQ0RLX0RPQ0tFUl9DUkVEU19GSUxFID0gY3JlZHNGaWxlO1xuXG4gICAgZXhwZWN0KGNka0NyZWRlbnRpYWxzQ29uZmlnRmlsZSgpKS50b0VxdWFsKGNyZWRzRmlsZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1VzZXMgaG9tZWRpciBpZiBubyBwcm9jZXNzIGVudiBpcyBzZXQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNka0NyZWRlbnRpYWxzQ29uZmlnRmlsZSgpKS50b0VxdWFsKHBhdGguam9pbihvcy51c2VySW5mbygpLmhvbWVkaXIsICcuY2RrJywgJ2Nkay1kb2NrZXItY3JlZHMuanNvbicpKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2Nka0NyZWRlbnRpYWxzQ29uZmlnJywgKCkgPT4ge1xuICBjb25zdCBjcmVkc0ZpbGUgPSAnL3RtcC9mb28vYmFyL2RvZXMvbm90L2V4aXN0L2NvbmZpZy5qc29uJztcbiAgYmVmb3JlRWFjaCgoKSA9PiB7IHByb2Nlc3MuZW52LkNES19ET0NLRVJfQ1JFRFNfRklMRSA9IGNyZWRzRmlsZTsgfSk7XG5cbiAgdGVzdCgncmV0dXJucyB1bmRlZmluZWQgaWYgbm8gY29uZmlnIGV4aXN0cycsICgpID0+IHtcbiAgICBleHBlY3QoY2RrQ3JlZGVudGlhbHNDb25maWcoKSkudG9CZVVuZGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdyZXR1cm5zIHBhcnNlZCBjb25maWcgaWYgaXQgZXhpc3RzJywgKCkgPT4ge1xuICAgIG1vY2tmcyh7XG4gICAgICBbY3JlZHNGaWxlXTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4xJyxcbiAgICAgICAgZG9tYWluQ3JlZGVudGlhbHM6IHtcbiAgICAgICAgICAndGVzdDEuZXhhbXBsZS5jb20nOiB7IHNlY3JldHNNYW5hZ2VyU2VjcmV0SWQ6ICdteVNlY3JldCcgfSxcbiAgICAgICAgICAndGVzdDIuZXhhbXBsZS5jb20nOiB7IGVjclJlcG9zaXRvcnk6ICdhcm46YXdzOmVjcjpiYXInIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IGNka0NyZWRlbnRpYWxzQ29uZmlnKCk7XG4gICAgZXhwZWN0KGNvbmZpZykudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoY29uZmlnPy52ZXJzaW9uKS50b0VxdWFsKCcwLjEnKTtcbiAgICBleHBlY3QoY29uZmlnPy5kb21haW5DcmVkZW50aWFsc1sndGVzdDEuZXhhbXBsZS5jb20nXT8uc2VjcmV0c01hbmFnZXJTZWNyZXRJZCkudG9FcXVhbCgnbXlTZWNyZXQnKTtcbiAgICBleHBlY3QoY29uZmlnPy5kb21haW5DcmVkZW50aWFsc1sndGVzdDIuZXhhbXBsZS5jb20nXT8uZWNyUmVwb3NpdG9yeSkudG9FcXVhbCgnYXJuOmF3czplY3I6YmFyJyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdmZXRjaERvY2tlckxvZ2luQ3JlZGVudGlhbHMnLCAoKSA9PiB7XG4gIGxldCBjb25maWc6IERvY2tlckNyZWRlbnRpYWxzQ29uZmlnO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGNvbmZpZyA9IHtcbiAgICAgIHZlcnNpb246ICcwLjEnLFxuICAgICAgZG9tYWluQ3JlZGVudGlhbHM6IHtcbiAgICAgICAgJ21pc2NvbmZpZ3VyZWQuZXhhbXBsZS5jb20nOiB7fSxcbiAgICAgICAgJ3NlY3JldC5leGFtcGxlLmNvbSc6IHsgc2VjcmV0c01hbmFnZXJTZWNyZXRJZDogJ215U2VjcmV0JyB9LFxuICAgICAgICAnc2VjcmV0d2l0aHJvbGUuZXhhbXBsZS5jb20nOiB7XG4gICAgICAgICAgc2VjcmV0c01hbmFnZXJTZWNyZXRJZDogJ215U2VjcmV0JyxcbiAgICAgICAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czppYW06OjAxMjM0NTY3ODkwMTI6cm9sZS9teS1yb2xlJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ3NlY3JldHdpdGhjdXN0b21maWVsZHMuZXhhbXBsZS5jb20nOiB7XG4gICAgICAgICAgc2VjcmV0c01hbmFnZXJTZWNyZXRJZDogJ215U2VjcmV0JyxcbiAgICAgICAgICBzZWNyZXRzVXNlcm5hbWVGaWVsZDogJ25hbWUnLFxuICAgICAgICAgIHNlY3JldHNQYXNzd29yZEZpZWxkOiAnYXBpS2V5JyxcbiAgICAgICAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czppYW06OjAxMjM0NTY3ODkwMTI6cm9sZS9teS1yb2xlJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ2Vjci5leGFtcGxlLmNvbSc6IHsgZWNyUmVwb3NpdG9yeTogdHJ1ZSB9LFxuICAgICAgICAnZWNyd2l0aHJvbGUuZXhhbXBsZS5jb20nOiB7XG4gICAgICAgICAgZWNyUmVwb3NpdG9yeTogdHJ1ZSxcbiAgICAgICAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czppYW06OjAxMjM0NTY3ODkwMTI6cm9sZS9teS1yb2xlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIG9uIHVua25vd24gZG9tYWluJywgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGV4cGVjdChmZXRjaERvY2tlckxvZ2luQ3JlZGVudGlhbHMoYXdzLCBjb25maWcsICd1bmtub3duZG9tYWluLmV4YW1wbGUuY29tJykpLnJlamVjdHMudG9UaHJvdygvdW5rbm93biBkb21haW4vKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIG9uIG1pc2NvbmZpZ3VyZWQgZG9tYWluIChubyBFQ1Igb3IgU00pJywgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGV4cGVjdChmZXRjaERvY2tlckxvZ2luQ3JlZGVudGlhbHMoYXdzLCBjb25maWcsICdtaXNjb25maWd1cmVkLmV4YW1wbGUuY29tJykpLnJlamVjdHMudG9UaHJvdygvdW5rbm93biBjcmVkZW50aWFsIHR5cGUvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9lcyBub3QgdGhyb3cgb24gY29ycmVjdGx5IGNvbmZpZ3VyZWQgcmF3IGRvbWFpbicsIGFzeW5jICgpID0+IHtcbiAgICBtb2NrU2VjcmV0V2l0aFNlY3JldFN0cmluZyh7IHVzZXJuYW1lOiAnc2VjcmV0VXNlcicsIHNlY3JldDogJ3NlY3JldFBhc3MnIH0pO1xuXG4gICAgYXdhaXQgZXhwZWN0KGZldGNoRG9ja2VyTG9naW5DcmVkZW50aWFscyhhd3MsIGNvbmZpZywgJ2h0dHBzOi8vc2VjcmV0LmV4YW1wbGUuY29tL3YxLycpKS5yZXNvbHZlcy50b0JlVHJ1dGh5KCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdTZWNyZXRzTWFuYWdlcicsICgpID0+IHtcbiAgICB0ZXN0KCdyZXR1cm5zIHRoZSBjcmVkZW50aWFscyBzdWNjZXNzZnVsbHkgaWYgY29uZmlndXJlZCBjb3JyZWN0bHkgLSBkb21haW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrU2VjcmV0V2l0aFNlY3JldFN0cmluZyh7IHVzZXJuYW1lOiAnc2VjcmV0VXNlcicsIHNlY3JldDogJ3NlY3JldFBhc3MnIH0pO1xuXG4gICAgICBjb25zdCBjcmVkcyA9IGF3YWl0IGZldGNoRG9ja2VyTG9naW5DcmVkZW50aWFscyhhd3MsIGNvbmZpZywgJ3NlY3JldC5leGFtcGxlLmNvbScpO1xuXG4gICAgICBleHBlY3QoY3JlZHMpLnRvRXF1YWwoeyBVc2VybmFtZTogJ3NlY3JldFVzZXInLCBTZWNyZXQ6ICdzZWNyZXRQYXNzJyB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JldHVybnMgdGhlIGNyZWRlbnRpYWxzIHN1Y2Nlc3NmdWxseSBpZiBjb25maWd1cmVkIGNvcnJlY3RseSAtIHJhdyBkb21haW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrU2VjcmV0V2l0aFNlY3JldFN0cmluZyh7IHVzZXJuYW1lOiAnc2VjcmV0VXNlcicsIHNlY3JldDogJ3NlY3JldFBhc3MnIH0pO1xuXG4gICAgICBjb25zdCBjcmVkcyA9IGF3YWl0IGZldGNoRG9ja2VyTG9naW5DcmVkZW50aWFscyhhd3MsIGNvbmZpZywgJ2h0dHBzOi8vc2VjcmV0LmV4YW1wbGUuY29tJyk7XG5cbiAgICAgIGV4cGVjdChjcmVkcykudG9FcXVhbCh7IFVzZXJuYW1lOiAnc2VjcmV0VXNlcicsIFNlY3JldDogJ3NlY3JldFBhc3MnIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoZW4gU2VjcmV0c01hbmFnZXIgcmV0dXJucyBhbiBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGVyck1lc3NhZ2UgPSBcIlNlY3JldHMgTWFuYWdlciBjYW4ndCBmaW5kIHRoZSBzcGVjaWZpZWQgc2VjcmV0LlwiO1xuICAgICAgYXdzLm1vY2tTZWNyZXRzTWFuYWdlci5nZXRTZWNyZXRWYWx1ZSA9IG1vY2tlZEFwaUZhaWx1cmUoJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nLCBlcnJNZXNzYWdlKTtcblxuICAgICAgYXdhaXQgZXhwZWN0KGZldGNoRG9ja2VyTG9naW5DcmVkZW50aWFscyhhd3MsIGNvbmZpZywgJ3NlY3JldC5leGFtcGxlLmNvbScpKS5yZWplY3RzLnRvVGhyb3coZXJyTWVzc2FnZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzdXBwb3J0cyBhc3N1bWluZyBhIHJvbGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrU2VjcmV0V2l0aFNlY3JldFN0cmluZyh7IHVzZXJuYW1lOiAnc2VjcmV0VXNlcicsIHNlY3JldDogJ3NlY3JldFBhc3MnIH0pO1xuXG4gICAgICBjb25zdCBjcmVkcyA9IGF3YWl0IGZldGNoRG9ja2VyTG9naW5DcmVkZW50aWFscyhhd3MsIGNvbmZpZywgJ3NlY3JldHdpdGhyb2xlLmV4YW1wbGUuY29tJyk7XG5cbiAgICAgIGV4cGVjdChjcmVkcykudG9FcXVhbCh7IFVzZXJuYW1lOiAnc2VjcmV0VXNlcicsIFNlY3JldDogJ3NlY3JldFBhc3MnIH0pO1xuICAgICAgZXhwZWN0KGF3cy5zZWNyZXRzTWFuYWdlckNsaWVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czppYW06OjAxMjM0NTY3ODkwMTI6cm9sZS9teS1yb2xlJyB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3N1cHBvcnRzIGNvbmZpZ3VyaW5nIHRoZSBzZWNyZXQgZmllbGRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1NlY3JldFdpdGhTZWNyZXRTdHJpbmcoeyBuYW1lOiAnc2VjcmV0VXNlcicsIGFwaUtleTogJzAxMjM0NTY3JyB9KTtcblxuICAgICAgY29uc3QgY3JlZHMgPSBhd2FpdCBmZXRjaERvY2tlckxvZ2luQ3JlZGVudGlhbHMoYXdzLCBjb25maWcsICdzZWNyZXR3aXRoY3VzdG9tZmllbGRzLmV4YW1wbGUuY29tJyk7XG5cbiAgICAgIGV4cGVjdChjcmVkcykudG9FcXVhbCh7IFVzZXJuYW1lOiAnc2VjcmV0VXNlcicsIFNlY3JldDogJzAxMjM0NTY3JyB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIHNlY3JldCBkb2VzIG5vdCBoYXZlIHRoZSBjb3JyZWN0IGZpZWxkcyAtIGtleS92YWx1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tTZWNyZXRXaXRoU2VjcmV0U3RyaW5nKHsgcHJpbmNpcGFsOiAnZm9vJywgY3JlZGVudGlhbDogJ2JhcicgfSk7XG5cbiAgICAgIGF3YWl0IGV4cGVjdChmZXRjaERvY2tlckxvZ2luQ3JlZGVudGlhbHMoYXdzLCBjb25maWcsICdzZWNyZXQuZXhhbXBsZS5jb20nKSkucmVqZWN0cy50b1Rocm93KC9tYWxmb3JtZWQgc2VjcmV0IHN0cmluZy8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoZW4gc2VjcmV0IGRvZXMgbm90IGhhdmUgdGhlIGNvcnJlY3QgZmllbGRzIC0gcGxhaW50ZXh0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1NlY3JldFdpdGhTZWNyZXRTdHJpbmcoJ215QVBJS2V5Jyk7XG5cbiAgICAgIGF3YWl0IGV4cGVjdChmZXRjaERvY2tlckxvZ2luQ3JlZGVudGlhbHMoYXdzLCBjb25maWcsICdzZWNyZXQuZXhhbXBsZS5jb20nKSkucmVqZWN0cy50b1Rocm93KC9tYWxmb3JtZWQgc2VjcmV0IHN0cmluZy8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnRUNSIGdldEF1dGhvcml6YXRpb25Ub2tlbicsICgpID0+IHtcbiAgICB0ZXN0KCdyZXR1cm5zIHRoZSBjcmVkZW50aWFscyBzdWNjZXNzZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrRWNyQXV0aG9yaXphdGlvbkRhdGEoQnVmZmVyLmZyb20oJ215Rm9vOm15QmFyJywgJ3V0Zi04JykudG9TdHJpbmcoJ2Jhc2U2NCcpKTtcblxuICAgICAgY29uc3QgY3JlZHMgPSBhd2FpdCBmZXRjaERvY2tlckxvZ2luQ3JlZGVudGlhbHMoYXdzLCBjb25maWcsICdlY3IuZXhhbXBsZS5jb20nKTtcblxuICAgICAgZXhwZWN0KGNyZWRzKS50b0VxdWFsKHsgVXNlcm5hbWU6ICdteUZvbycsIFNlY3JldDogJ215QmFyJyB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiBFQ1IgZXJyb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdzLm1vY2tFY3IuZ2V0QXV0aG9yaXphdGlvblRva2VuID0gbW9ja2VkQXBpRmFpbHVyZSgnU2VydmVyRXhjZXB0aW9uJywgJ3Vob2gnKTtcblxuICAgICAgYXdhaXQgZXhwZWN0KGZldGNoRG9ja2VyTG9naW5DcmVkZW50aWFscyhhd3MsIGNvbmZpZywgJ2Vjci5leGFtcGxlLmNvbScpKS5yZWplY3RzLnRvVGhyb3coL3Vob2gvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3N1cHBvcnRzIGFzc3VtaW5nIGEgcm9sZScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tFY3JBdXRob3JpemF0aW9uRGF0YShCdWZmZXIuZnJvbSgnbXlGb286bXlCYXInLCAndXRmLTgnKS50b1N0cmluZygnYmFzZTY0JykpO1xuXG4gICAgICBjb25zdCBjcmVkcyA9IGF3YWl0IGZldGNoRG9ja2VyTG9naW5DcmVkZW50aWFscyhhd3MsIGNvbmZpZywgJ2VjcndpdGhyb2xlLmV4YW1wbGUuY29tJyk7XG5cbiAgICAgIGV4cGVjdChjcmVkcykudG9FcXVhbCh7IFVzZXJuYW1lOiAnbXlGb28nLCBTZWNyZXQ6ICdteUJhcicgfSk7XG4gICAgICBleHBlY3QoYXdzLmVjckNsaWVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czppYW06OjAxMjM0NTY3ODkwMTI6cm9sZS9teS1yb2xlJyB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiBFQ1IgcmV0dXJucyBubyBhdXRoRGF0YScsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3cy5tb2NrRWNyLmdldEF1dGhvcml6YXRpb25Ub2tlbiA9IG1vY2tlZEFwaVJlc3VsdCh7IGF1dGhvcml6YXRpb25EYXRhOiBbXSB9KTtcblxuICAgICAgYXdhaXQgZXhwZWN0KGZldGNoRG9ja2VyTG9naW5DcmVkZW50aWFscyhhd3MsIGNvbmZpZywgJ2Vjci5leGFtcGxlLmNvbScpKS5yZWplY3RzLnRvVGhyb3coL05vIGF1dGhvcml6YXRpb24gZGF0YSByZWNlaXZlZCBmcm9tIEVDUi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIEVDUiBhdXRoRGF0YSBpcyBpbiBhbiBpbmNvcnJlY3QgZm9ybWF0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0VjckF1dGhvcml6YXRpb25EYXRhKCdub3RhYmFzZTY0ZW5jb2RlZHN0cmluZycpO1xuXG4gICAgICBhd2FpdCBleHBlY3QoZmV0Y2hEb2NrZXJMb2dpbkNyZWRlbnRpYWxzKGF3cywgY29uZmlnLCAnZWNyLmV4YW1wbGUuY29tJykpLnJlamVjdHMudG9UaHJvdygvdW5leHBlY3RlZCBFQ1IgYXV0aERhdGEgZm9ybWF0Lyk7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcblxuZnVuY3Rpb24gbW9ja1NlY3JldFdpdGhTZWNyZXRTdHJpbmcoc2VjcmV0U3RyaW5nOiBhbnkpIHtcbiAgYXdzLm1vY2tTZWNyZXRzTWFuYWdlci5nZXRTZWNyZXRWYWx1ZSA9IG1vY2tlZEFwaVJlc3VsdCh7XG4gICAgQVJOOiAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjpldS13ZXN0LTE6MDEyMzQ1Njc4OTAxMjpzZWNyZXQ6bXlTZWNyZXQnLFxuICAgIE5hbWU6ICdteVNlY3JldCcsXG4gICAgVmVyc2lvbklkOiAnZmE4MWZlNjEtYzE2Ny00YWNhLTk2OWUtNGQ4ZGY3NGQ0ODE0JyxcbiAgICBTZWNyZXRTdHJpbmc6IEpTT04uc3RyaW5naWZ5KHNlY3JldFN0cmluZyksXG4gICAgVmVyc2lvblN0YWdlczogW1xuICAgICAgJ0FXU0NVUlJFTlQnLFxuICAgIF0sXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtb2NrRWNyQXV0aG9yaXphdGlvbkRhdGEoYXV0aG9yaXphdGlvblRva2VuOiBzdHJpbmcpIHtcbiAgYXdzLm1vY2tFY3IuZ2V0QXV0aG9yaXphdGlvblRva2VuID0gbW9ja2VkQXBpUmVzdWx0KHtcbiAgICBhdXRob3JpemF0aW9uRGF0YTogW1xuICAgICAge1xuICAgICAgICBhdXRob3JpemF0aW9uVG9rZW4sXG4gICAgICAgIHByb3h5RW5kcG9pbnQ6ICdodHRwczovLzAxMjM0NTY3ODkwMTIuZGtyLmVjci5ldS13ZXN0LTEuYW1hem9uYXdzLmNvbScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufVxuIl19