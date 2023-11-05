import { exec } from '../lib';

describe('options', () => {

  let original: any;
  const mockedConsoleError = jest.fn();

  beforeEach(() => {
    // eslint-disable-next-line no-console
    original = console.error;
    // eslint-disable-next-line no-console
    console.error = mockedConsoleError;
  });

  afterEach(() => {
    mockedConsoleError.mockReset();
    // eslint-disable-next-line no-console
    console.error = original;
  });

  test('fails on invalid options', async () => {
    // @ts-ignore
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('Process exited');
    });
    await expect(async () => {
      await exec(['version', '--foo-bar', '-v']);
    }).rejects.toThrowError(/Process exited/);
    expect(mockedConsoleError).toHaveBeenCalledWith('Unknown arguments: foo-bar, fooBar');
  });

  test('succeeds with valid options', async () => {
    // @ts-ignore
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('Process exited');
    });
    await expect(async () => {
      await exec(['version', '-v']);
    }).resolves;
    expect(mockedConsoleError).not.toHaveBeenCalled();
  });
});
