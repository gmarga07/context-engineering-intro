// Minimal Jest typings stub to satisfy TypeScript when @types/jest is absent
export {};

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => Promise<void> | void): void;
declare function test(name: string, fn: () => Promise<void> | void): void;
declare function expect(value: any): any;

declare namespace jest {
  function fn(): any;
}