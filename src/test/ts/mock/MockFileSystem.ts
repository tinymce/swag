import { FileSystem } from '../../../main/ts/fs/FileSystem';

export interface File {
  filePath: string;
  data: Buffer;
}

const findFileByPath = (files: File[], filePath: string) => files.find((file) => file.filePath === filePath);

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

  return {
    isFile,
    readFile,
    isFileSync,
    readFileSync,
    realpathSync
  };
};

export {
  getFileSystem,
  createFile,
  createJsonFile
};
