/**
 * A file designed to be used with Jest's `--setupFilesAfterEnv` flag, to automatically clean temporary directories.
 *
 * This is an effective alternative to adding an `afterAll()` to every individual test file.
 *
 * Can be used as follows:
 *
 * ```
 * $ jest --setupFilesAfterEnv aws-cdk-lib/testhelpers/jest-autoclean
 * ```
 */
import { CloudAssembly } from '../cx-api';

afterAll(CloudAssembly.cleanupTemporaryDirectories);
