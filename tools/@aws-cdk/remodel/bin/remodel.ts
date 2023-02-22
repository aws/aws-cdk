import { main } from '../lib/cli';

main()
  .then(() => process.exit(0))
  // eslint-disable-next-line no-console
  .catch(console.error);
