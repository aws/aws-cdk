import { Runtime, RuntimeFamily } from '../runtime';

/**
 * The preferred NodeJS runtime to use for unit tests
 *
 * We're centralizing these runtimes, and avoiding using any *real* `NODEJS_xx`
 * runtimes, so that when it comes time to upgrade Node there are only limited places
 * to changed and it will be an easy grep to figure them all out.
 */
export const DEFAULT_UNITTEST_RUNTIME = new Runtime('nodejs99.x', RuntimeFamily.NODEJS, {
  supportsInlineCode: true,
  supportsSnapStart: true,
});
