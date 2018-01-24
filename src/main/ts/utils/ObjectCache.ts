interface ObjectCache<T> {
  get(key: string): T;
  put(key: string, value: T);
  getOrThunk(key: string, f: () => T);
}

const createObjectCache = <T>(): ObjectCache<T> => {
  const cache = {};

  const get = (key: string) => cache[key] as T;
  const put = (key: string, value: T) => cache[key] = value;
  const getOrThunk = (key: string, f: () => T) => {
    const item = get(key);

    if (item === undefined) {
      const newItem = f();
      put(key, newItem);
      return newItem;
    } else {
      return item;
    }
  };

  return {
    get,
    put,
    getOrThunk
  };
};

export {
  ObjectCache,
  createObjectCache
};
