declare module 'fs/promises' { export const readFile: any; export const writeFile: any; export const mkdir: any; export const readdir: any; }
declare module 'path' { export const resolve: any; export const join: any; export const basename: any; export const extname: any; export const dirname: any; }
declare module 'child_process' { export const exec: any; }
declare module 'util' { export const promisify: any; }