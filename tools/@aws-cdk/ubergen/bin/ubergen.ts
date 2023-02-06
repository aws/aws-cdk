import { main } from '../lib';

main().then(
  () => process.exit(0),
  (err) => {
    // eslint-disable-next-line no-console
    console.error('❌ An error occurred: ', err.stack);
    process.exit(1);
  },
);
