export type PartialByKeys<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};

export type MergeWithOverride<T, K> = {
  [Property in keyof T | keyof K]: Property extends keyof K
    ? any
    : Property extends keyof T
      ? T[Property]
      : never;
};
export type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
    : S;
