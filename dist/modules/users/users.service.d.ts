import { DatabaseService } from '../../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly db;
    constructor(db: DatabaseService);
    findById(id: number): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    me(id: number): Promise<{
        success: boolean;
        data: any;
    }>;
}
