import { ObjectCache, createObjectCache } from '../utils/ObjectCache';
import { MainModuleInfo } from './MainModule';

interface RemapCache {
  mainModuleCache: ObjectCache<MainModuleInfo>;
  moduleResolveCache: ObjectCache<string>;
  mainModuleResolveCache: ObjectCache<string>;
}

const createRemapCache = (): RemapCache => {
  return {
    mainModuleCache: createObjectCache<MainModuleInfo>(),
    moduleResolveCache: createObjectCache<string>(),
    mainModuleResolveCache: createObjectCache<string>()
  };
};

export {
  RemapCache,
  createRemapCache
};
