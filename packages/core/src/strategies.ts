import {Strategy, StrategyCtor} from './types';

const debug = require('debug')('provair:factory');

export type ModuleLoader<T> = (name: string) => T | undefined;

export function isStrategy(x: any): x is Strategy {
  return typeof x === 'object' && typeof x.calc === 'function';
}

// List possible strategy module names
function strategyModuleNames(name: string) {
  const names = []; // Check the name as is
  if (!name.match(/^\//)) {
    names.push('./strategies/' + name); // Check built-in strategies
    if (name.indexOf('provair-strategy-') !== 0) {
      names.push('provair-strategy-' + name); // Try provair-strategy-<name>
    }
  }
  return names;
}

// testable with DI
function tryModules<T>(
  names: string[],
  loader?: ModuleLoader<T>,
): T | undefined {
  let mod: T | undefined = undefined;
  loader = loader ?? require;
  for (const name of names) {
    try {
      mod = loader(name);
    } catch (e) {
      const notFound =
        e.code === 'MODULE_NOT_FOUND' &&
        e.message &&
        e.message.indexOf(name) > 0;

      if (notFound) {
        debug('Module %s not found, will try another candidate.', name);
        continue;
      }

      debug('Cannot load strategy %s: %s', name, e.stack || e);
      throw e;
    }
    if (mod) {
      break;
    }
  }
  return mod;
}

const NotInstalledMessage = (name: string, names: string[]) => `
WARNING: Provair strategy "${name}" is not installed as any of the following modules:
 
${names.join('\n')}

To fix, run:
    
    npm install ${names[names.length - 1]}
`;

export function resolveStrategyCtor(
  name: string,
  loader?: ModuleLoader<StrategyCtor>,
): StrategyCtor | Error {
  const names = strategyModuleNames(name);
  let strategy: any = tryModules(names, loader);
  strategy = strategy?.default ?? strategy;
  let error = null;
  if (!strategy) {
    error = new Error(NotInstalledMessage(name, names));
  }
  return strategy ?? error;
}

export function resolveStrategy(
  name: string,
  loader?: ModuleLoader<StrategyCtor>,
): Strategy;
export function resolveStrategy(strategy: Strategy): Strategy;
export function resolveStrategy(
  strategy: StrategyCtor,
  options?: Record<string, any>,
): Strategy;
export function resolveStrategy(
  nameOrStrategy: string | StrategyCtor | Strategy,
  loaderOrOptions?: ModuleLoader<StrategyCtor> | Record<string, any>,
): Strategy {
  if (isStrategy(nameOrStrategy)) {
    return nameOrStrategy;
  }
  let name: string | undefined;
  let loader: ModuleLoader<StrategyCtor> | undefined;
  let options: Record<string, any> | undefined;
  if (typeof loaderOrOptions === 'function') {
    loader = <ModuleLoader<StrategyCtor>>loaderOrOptions;
  } else {
    options = loaderOrOptions;
  }
  let ctor: StrategyCtor;
  if (typeof nameOrStrategy === 'string') {
    name = nameOrStrategy;
    const resolved = resolveStrategyCtor(nameOrStrategy, loader);
    if (resolved instanceof Error) {
      throw resolved;
    }
    ctor = resolved;
  } else {
    ctor = nameOrStrategy;
  }

  try {
    return new ctor(options);
  } catch (err) {
    if (err.message) {
      err.message =
        'Cannot construct strategy ' +
        JSON.stringify(name ?? ctor.name) +
        ': ' +
        err.message;
    }
    throw err;
  }
}
