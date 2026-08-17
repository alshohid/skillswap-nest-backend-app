import { DatabaseService } from '../../database/database.service';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class TasksService {
    private readonly db;
    private readonly tasksRepo;
    private readonly logger;
    constructor(db: DatabaseService, tasksRepo: TasksRepository);
    createTask(dto: CreateTaskDto, creatorId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findOpenTasks(page?: number, limit?: number): Promise<{
        success: boolean;
        data: any;
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    findOne(taskId: number): Promise<{
        success: boolean;
        data: any;
    }>;
    applyToTask(taskId: number, applicantId: number, coverLetter: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getApplications(taskId: number, userId: number): Promise<{
        success: boolean;
        data: any;
    }>;
    assignTask(taskId: number, appId: number, creatorId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    completeTask(taskId: number, creatorId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            task_id: any;
            points_transferred: any;
            from_user_id: number;
            to_user_id: any;
        };
    }>;
    cancelTask(taskId: number, creatorId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
