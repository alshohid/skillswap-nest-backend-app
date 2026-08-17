import { DatabaseService } from '../../database/database.service';
export declare class TransactionsService {
    private readonly db;
    constructor(db: DatabaseService);
    getUserLedger(userId: number, page?: number, limit?: number): Promise<{
        success: boolean;
        data: any;
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getAllTransactions(page?: number, limit?: number): Promise<{
        success: boolean;
        data: any;
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getUserBalance(userId: number): Promise<{
        success: boolean;
        data: {
            user_id: number;
            skill_points: any;
        };
    }>;
}
