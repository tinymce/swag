interface FileSystem {
  isFile(filePath: string, cb: (err: any, state?: boolean) => any): void;
  readFile(filePath: string, callback: (err: any, data?: Buffer) => any): void;
  isFileSync(filePath: string): boolean;
  readFileSync(filePath: string): Buffer;
  realpathSync(filePath: string): string;
  isDirectory(dirPath: string, cb: (err: any, state?: boolean) => any): void;
  isDirectorySync(dirPath: string): boolean;
}

export {
  FileSystem
};