import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(userId: number): Promise<{
        success: boolean;
        data: any;
    }>;
    findById(id: number): Promise<{
        success: boolean;
        data: any;
    }>;
    update(userId: number, dto: UpdateUserDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
