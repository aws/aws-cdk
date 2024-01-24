import * as path from 'path';

const myPath = [__dirname, '..', '../..', 'fixtures'];
path.join(...myPath); // Should fail but does not currently because myPath is treated as one 'SpreadElement' argument.