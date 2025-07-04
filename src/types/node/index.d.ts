// Minimal stub for Node.js typings when @types/node is not available in env
export {};

declare module "fs/promises" {
  import { PathLike } from "fs";
  export function readFile(path: PathLike | FileHandle, options?: any): Promise<string | Buffer>;
  export function writeFile(path: PathLike | FileHandle, data: any, options?: any): Promise<void>;
  export function readdir(path: PathLike, options?: any): Promise<any>;
  export function mkdir(path: PathLike, options?: any): Promise<void>;
  export function rm(path: PathLike, options?: any): Promise<void>;
  export interface FileHandle {}
}

declare module "path" {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
  export function dirname(p: string): string;
  export function basename(p: string, ext?: string): string;
  export function extname(p: string): string;
}

declare module "fs" {
  export type PathLike = string;
  export function readFileSync(path: PathLike, options?: any): string | Buffer;
  export function existsSync(path: PathLike): boolean;
}

declare module "child_process" {
  export interface ExecAsyncResult { stdout: string; stderr: string; }
  export function exec(
    command: string,
    options: any,
    callback: (error: any, stdout: string, stderr: string) => void
  ): any;
}

declare module "util" {
  export function promisify<T>(fn: (...args: any[]) => void): (...args: any[]) => Promise<T>;
}