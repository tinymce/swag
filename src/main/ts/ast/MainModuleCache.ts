import { ObjectCache, createObjectCache } from '../utils/ObjectCache';
import { MainModuleInfo } from './MainModule';

type MainModuleCache = ObjectCache<MainModuleInfo>;

const createMainModuleCache = () => createObjectCache<MainModuleInfo>();

export {
  MainModuleCache,
  createMainModuleCache
};
