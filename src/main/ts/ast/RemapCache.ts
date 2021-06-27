import { ObjectCache, createObjectCache } from '../utils/ObjectCache';
import { MainModuleInfo } from './js/MainModule';

interface RemapCache {
  readonly mainModuleCache: ObjectCache<MainModuleInfo>;
  readonly moduleResolveCache: ObjectCache<string>;
  readonly mainModuleResolveCache: ObjectCache<string>;
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
