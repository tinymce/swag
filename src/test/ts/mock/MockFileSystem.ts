import { FileSystem } from '../../../main/ts/fs/FileSystem';

export interface File {
  filePath: string;
  data: Buffer;
}

const findFileByPath = (files: File[], filePath: string) => files.find((file) => file.filePath === filePath);

const isDirInFiles = (files: File[], dirPath: string) => files.some((file) => {
  const dirs = file.filePath.split('/');
  const fileDirPath = dirs.slice(0, -1).join('/');
  return fileDirPath.indexOf(dirPath) !== -1;
});

const createFile = (filePath: string, data?: string): File => {
  return { filePath, data: Buffer.from(data ? data : '', 'utf-8') };
};

const createJsonFile = (filePath: string, data: any): File => {
  return createFile(filePath, JSON.stringify(data, null, 2));
};

const getFileSystem = (files: File[]): FileSystem => {
  const isFile = (filePath: string, callback: (err: any, state?: boolean) => any): void => {
    const file = findFileByPath(files, filePath);
    callback(null, file !== undefined);
  };

  const readFile = (filePath: string, callback: (err: any, data?: Buffer) => any): void => {
    const file = findFileByPath(files, filePath);
    callback(null, file ? file.data : null);
  };

  const isFileSync = (filePath: string): boolean => {
    const file = findFileByPath(files, filePath);
    return file !== undefined;
  };

  const readFileSync = (filePath: string): Buffer => {
    const file = findFileByPath(files, filePath);
    return file ? file.data : null;
  };

  const realpathSync = (filePath: string): string => {
    return filePath;
  };

  const isDirectory = (dirPath: string, callback: (err: any, state?: boolean) => any): void => {
    const exists = isDirInFiles(files, dirPath);
    callback(null, exists);
  };

  const isDirectorySync = (dirPath: string): boolean => {
    return isDirInFiles(files, dirPath);
  };

  return {
    isFile,
    readFile,
    isFileSync,
    readFileSync,
    realpathSync,
    isDirectory,
    isDirectorySync
  };
};

export {
  getFileSystem,
  createFile,
  createJsonFile
};
