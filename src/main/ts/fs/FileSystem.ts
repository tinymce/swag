interface FileSystem {
  isFile(file: string, cb: (err:any, state?: boolean) => any): void;
  readFile(filePath: string, callback: (err: any, data?: Buffer) => any): void;
  isFileSync(filePath: string): boolean;
  readFileSync(filePath: string): Buffer;
  realpathSync(filePath: string): string;
}

export {
  FileSystem
}