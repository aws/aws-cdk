import { main } from '../lib/cli';
import 'source-map-support/register';

main()
  .then(() => process.exit(0))
  // eslint-disable-next-line no-console
  .catch(console.error);
