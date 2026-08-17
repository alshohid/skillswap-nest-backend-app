import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly db;
    private readonly reflector;
    private readonly logger;
    constructor(jwtService: JwtService, db: DatabaseService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
