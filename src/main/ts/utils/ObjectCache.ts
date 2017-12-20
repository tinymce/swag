interface ObjectCache<T> {
  get(key: string): T,
  put(key: string, value:T)
  getOrThunk(key: string, f: () => T)
}

let createObjectCache = <T>(): ObjectCache<T> => {
  let cache = {};

  let get = (key: string) => cache[key] as T;
  let put = (key: string, value: T) => cache[key] = value;
  let getOrThunk = (key: string, f: () => T) => {
    let item = get(key);

    if (item === undefined) {
      let newItem = f();
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
}
