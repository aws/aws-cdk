This module generates at build time all individual packages in V2
that we release separately from 'aws-cdk-lib'
(right now, those are the unstable packages).

The logic of the copying of the packages,
and mutating them to fit the V2 standards,
lives in the [`gen.js` file](./gen.js).
