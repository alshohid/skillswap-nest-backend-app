import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class PostgresExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: any, host: ArgumentsHost): void;
}
