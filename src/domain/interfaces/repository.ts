export interface IRepository<T, ID, C, U> {
  findMany(): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  create(params: C): Promise<T>;
  update(id: ID, params: U): Promise<T>;
  delete(id: ID): Promise<void>;
}
