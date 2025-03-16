import { SWAGGER_RESPONSES } from '@common/constants/swagger.constants';
import { SwaggerResponseOptions } from '@common/interfaces/swagger.interface';
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiResponseDecorator(
  options: Partial<SwaggerResponseOptions> = {},
) {
  return applyDecorators(
    ApiResponse({
      status: options.status || SWAGGER_RESPONSES.OK.status,
      description: options.description || SWAGGER_RESPONSES.OK.description,
      type: options.type,
      example: options.example,
    }),
  );
}

export function ApiCommonResponses() {
  return applyDecorators(
    ApiResponse(SWAGGER_RESPONSES.BAD_REQUEST),
    ApiResponse(SWAGGER_RESPONSES.UNAUTHORIZED),
    ApiResponse(SWAGGER_RESPONSES.FORBIDDEN),
    ApiResponse(SWAGGER_RESPONSES.INTERNAL_ERROR),
  );
}
