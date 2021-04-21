/**
 * node.jsでtypescriptを実行するためのエントリーポイント
 * ・require('ts-node').register(options);を呼び出すことで、ts-nodeをロードして
 *   .tsファイルを事前コンパイルすることなしに実行する。
 */
const options = { transpileOnly: true, project:'./tsconfig.ts-node.json' };
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('ts-node').register(options);
require('./www.ts');
