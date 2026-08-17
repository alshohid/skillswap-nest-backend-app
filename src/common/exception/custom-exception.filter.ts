import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { MulterError } from 'multer';

function isObject(value: any): value is { message: string; details?: any } {
  return typeof value === 'object' && value !== null;
}

function isString(value: any): value is string {
  return typeof value === 'string';
}

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status = exception.getStatus();
    let responseBody: any;

    const exceptionResponse = exception?.getResponse();

    // Handle Multer file errors
    if (exception instanceof MulterError) {
      if ((exception as MulterError).code === 'LIMIT_FILE_SIZE') {
        status = 400;
        responseBody = {
          message: 'File too large. Maximum allowed size exceeded.',
        };
      } else {
        responseBody = {
          message: `File upload error: ${exception.message}`,
        };
      }

      return response.status(status).json({
        success: false,
        ...responseBody,
      });
    }

    if (isObject(exceptionResponse)) {
      responseBody = exceptionResponse;
    } else if (isString(exceptionResponse)) {
      responseBody = {
        message: exceptionResponse,
      };
    } else {
      responseBody = {
        message: 'Internal Server Error',
      };
    }

    // Log unexpected errors (non-4xx) for debugging
    if (status >= 500) {
      this.logger.error(
        `Unhandled error: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      success: false,
      ...responseBody,
    });
  }
}
