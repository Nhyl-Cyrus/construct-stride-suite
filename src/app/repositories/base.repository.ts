// Base repository contract. Implementations either resolve from in-memory
// mock fixtures (today) or call into src/app/api/<feature>/service (later).
export interface Repository<T, Id = string> {
  list(): Promise<T[]>;
  getById(id: Id): Promise<T | undefined>;
}

export function ok<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}
