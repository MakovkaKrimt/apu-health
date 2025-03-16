export type SuccessStatuses = 'SUCCESS';

export type ErrorStatuses =
  | 'BAD_REQUEST'
  | 'INTERNAL_SERVER_ERROR'
  | 'NOT_FOUND';

export type ResponseStatuses = SuccessStatuses | ErrorStatuses;

export type CrudActions =
  | 'CREATE'
  | 'FIND_ALL'
  | 'FIND_ONE'
  | 'UPDATE'
  | 'DELETE';

export type BaseRoutesConstants<T extends string> = {
  BASE: T;
  FIND_ONE: ':id';
  FIND_ALL: '';
  UPDATE: ':id';
  DELETE: ':id';
  CREATE: '';
};

type ResponseSuccessActionStatuses =
  | 'UPDATED'
  | 'DELETED'
  | 'FOUND_ONE'
  | 'FOUND_MANY';

export type BaseSuccessResponses = {
  [Property in ResponseSuccessActionStatuses]?: {
    statusCode: number;
    message: string;
  };
};

export type BaseExceptionResponses = {
  [Property in ErrorStatuses]?: {
    MESSAGE: string;
  };
};
