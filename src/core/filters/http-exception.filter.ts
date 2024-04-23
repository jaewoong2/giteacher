import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';
import { ServiceException } from './exception/service.exception';

@Catch(ServiceException)
export class ServiceExceptionToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = +exception.errorCode.status;

    const log = {
      timestamp: new Date(),
      url: request.url,
      response,
    };

    console.error(log);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      path: request.url,
    });
  }
}
