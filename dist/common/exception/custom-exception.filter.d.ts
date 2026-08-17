import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class CustomExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: HttpException, host: ArgumentsHost): any;
}
