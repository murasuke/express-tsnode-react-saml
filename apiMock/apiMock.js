const options = { transpileOnly: true, project:'./tsconfig.ts-node.json' };
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('ts-node').register(options);
require('./apiMock.ts');
