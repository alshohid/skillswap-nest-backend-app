import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    myLedger(userId: number, page: number, limit: number): Promise<{
        success: boolean;
        data: any;
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    myBalance(userId: number): Promise<{
        success: boolean;
        data: {
            user_id: number;
            skill_points: any;
        };
    }>;
    getAll(page: number, limit: number): Promise<{
        success: boolean;
        data: any;
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
}
