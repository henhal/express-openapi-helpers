export function isPromise(x: any): x is PromiseLike<any> {
  return typeof x?.then === 'function';
}

type Fn<A extends any[], R> = (...args: A) => R;

export function tap<A extends any[], R>(tapFn: (result: R) => void): (fn: Fn<A, R>) => Fn<A, R> {
  return fn => ((...args) => {
    const result = fn(...args);

    tapFn(result);

    return result;
  });
}

export function toExpressRoute(path: string) {
  return path.replace(/\/\{([^}]+)\}/g, '/:$1');
}