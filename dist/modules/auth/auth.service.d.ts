import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly authRepo;
    private readonly jwtService;
    private readonly logger;
    constructor(authRepo: AuthRepository, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: any;
            full_name: any;
            email: any;
            skill_points: any;
            created_at: any;
            access_token: string;
        };
    }>;
    validateUser(email: string, password: string): Promise<any>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: any;
                full_name: any;
                email: any;
                skill_points: any;
            };
        };
    }>;
    me(userId: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
}
