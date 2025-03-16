import { CrudActions, ResponseStatuses } from './crud.types';

type Operation = {
  OPERATION: {
    SUMMARY: string;
  };
};

type Response = {
  RESPONSE: {
    [Key in ResponseStatuses]?: {
      DESCRIPTION: string;
    };
  };
};

type ParamsProps = 'NAME' | 'DESCRIPTION';

type Params = {
  PARAMS: {
    [Key in Uppercase<string>]?: {
      [Prop in ParamsProps]: string;
    };
  };
};

export type BaseApiController = {
  [Property in CrudActions]?: Response & Operation & Partial<Params>;
};
