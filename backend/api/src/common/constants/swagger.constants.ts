import { SwaggerResponseOptions } from '@common/interfaces/swagger.interface';
import { HttpStatus } from '@nestjs/common';

export const RESPONSE_MESSAGES = {
  OPERATION_SUCCESSFUL: 'Operation successful',
  ENTITY_CREATED: 'Entity successfully created',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Entity not found',
  INTERNAL_ERROR: 'Internal server error',
};

export const CRUD_SUMMARIES = {
  CREATE: 'Создание нового объекта',
  FIND_ALL: 'Возврат нескольких объектов',
  FIND_ONE: 'Возврат объекта по ID',
  UPDATE: 'Обновление объекта по ID',
  REMOVE: 'Удаление объекта по ID',
};

export const SWAGGER_RESPONSES: Record<
  Uppercase<string>,
  SwaggerResponseOptions
> = {
  OK: {
    status: HttpStatus.OK,
    description: RESPONSE_MESSAGES.OPERATION_SUCCESSFUL,
  },
  CREATED: {
    status: HttpStatus.CREATED,
    description: RESPONSE_MESSAGES.ENTITY_CREATED,
    example: {
      statusCode: HttpStatus.CREATED,
      message: RESPONSE_MESSAGES.ENTITY_CREATED,
    },
  },
  BAD_REQUEST: {
    status: HttpStatus.BAD_REQUEST,
    description: RESPONSE_MESSAGES.BAD_REQUEST,
    example: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: RESPONSE_MESSAGES.BAD_REQUEST,
    },
  },
  UNAUTHORIZED: {
    status: HttpStatus.UNAUTHORIZED,
    description: RESPONSE_MESSAGES.UNAUTHORIZED,
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: RESPONSE_MESSAGES.UNAUTHORIZED,
    },
  },
  FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    description: RESPONSE_MESSAGES.FORBIDDEN,
    example: {
      statusCode: HttpStatus.FORBIDDEN,
      message: RESPONSE_MESSAGES.FORBIDDEN,
    },
  },
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    description: RESPONSE_MESSAGES.NOT_FOUND,
    example: {
      statusCode: HttpStatus.NOT_FOUND,
      message: RESPONSE_MESSAGES.NOT_FOUND,
    },
  },
  INTERNAL_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: RESPONSE_MESSAGES.INTERNAL_ERROR,
    example: {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    },
  },
};
