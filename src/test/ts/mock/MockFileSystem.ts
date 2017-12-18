import { FileSystem } from '../../../main/ts/fs/FileSystem';

interface File {
  filePath: string,
  data: Buffer
}

let findFileByPath = (files: File[], filePath: string) => files.find((file) => file.filePath === filePath);

let createFile = (filePath: string, data?: string): File => {
  return { filePath, data: new Buffer(data ? data : '', 'utf-8') };
};

let getFileSystem = (files: File[]): FileSystem => {
  let isFile = (filePath: string, cb: (err: any, state?: boolean) => any): void => {
    let file = findFileByPath(files, filePath);
    cb(null, file !== undefined);
  };

  let readFile = (filePath: string, callback: (err: any, data?: Buffer) => any): void => {
    let file = findFileByPath(files, filePath);
    callback(null, file ? file.data : null);
  }

  let isFileSync = (filePath: string): boolean => {
    let file = findFileByPath(files, filePath);
    return file !== undefined;
  };

  let readFileSync = (filePath: string): Buffer => {
    let file = findFileByPath(files, filePath);
    return file ? file.data : null;
  };

  let realpathSync = (filePath: string): string => {
    return filePath;
  };

  return {
    isFile,
    readFile,
    isFileSync,
    readFileSync,
    realpathSync
  }
};

export {
  getFileSystem,
  createFile
}
