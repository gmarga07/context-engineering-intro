declare module "fs/promises" {
  const value: any;
  export = value;
}

declare module "path" {
  export function resolve(...paths: any[]): string;
  export function join(...paths: any[]): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
  export const sep: string;
}

declare module "child_process" {
  export function exec(command: string, cb: (error: any, stdout: string, stderr: string) => void): any;
}

declare module "util" {
  export function promisify(fn: any): any;
}