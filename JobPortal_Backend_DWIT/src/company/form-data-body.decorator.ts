import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FormDataBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    // Handle the parsed fields here
    return body;
  },
);
