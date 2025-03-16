import {
  CRUD_SUMMARIES,
  SWAGGER_RESPONSES,
} from '@common/constants/swagger.constants';
import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ApiCommonResponses, ApiResponseDecorator } from './response.decorator';

const ID_PARAM = ApiParam({
  name: 'id',
  required: true,
  description: 'Уникальный индентификатор',
  schema: { type: 'number' },
});

export function SwaggerCrudDecorators<T>() {
  return {
    Create: (type?: T) =>
      applyDecorators(
        ApiOperation({ summary: CRUD_SUMMARIES.CREATE }),
        ApiResponseDecorator({
          status: SWAGGER_RESPONSES.CREATED.status,
          description: SWAGGER_RESPONSES.CREATED.description,
          type,
        }),
        ApiCommonResponses(),
      ),

    FindAll: (type?: T) =>
      applyDecorators(
        ApiOperation({ summary: CRUD_SUMMARIES.FIND_ALL }),
        ApiResponseDecorator({
          status: SWAGGER_RESPONSES.OK.status,
          description: SWAGGER_RESPONSES.OK.description,
          type,
          // type: type ? [type] : undefined,
        }),
        ApiCommonResponses(),
      ),

    FindOne: (type?: T) =>
      applyDecorators(
        ApiOperation({ summary: CRUD_SUMMARIES.FIND_ONE }),
        ID_PARAM,
        ApiResponseDecorator({
          status: SWAGGER_RESPONSES.OK.status,
          description: SWAGGER_RESPONSES.OK.description,
          type,
        }),
        ApiResponseDecorator(SWAGGER_RESPONSES.NOT_FOUND),
        ApiCommonResponses(),
      ),

    Update: (type?: T) =>
      applyDecorators(
        ApiOperation({ summary: CRUD_SUMMARIES.UPDATE }),
        ID_PARAM,
        ApiResponseDecorator({
          status: SWAGGER_RESPONSES.OK.status,
          description: SWAGGER_RESPONSES.OK.description,
          type,
        }),
        ApiResponseDecorator(SWAGGER_RESPONSES.NOT_FOUND),
        ApiCommonResponses(),
      ),

    Remove: () =>
      applyDecorators(
        ApiOperation({ summary: CRUD_SUMMARIES.REMOVE }),
        ID_PARAM,
        ApiResponseDecorator({
          status: SWAGGER_RESPONSES.OK.status,
          description: SWAGGER_RESPONSES.OK.description,
        }),
        ApiResponseDecorator(SWAGGER_RESPONSES.NOT_FOUND),
        ApiCommonResponses(),
      ),
  };
}
