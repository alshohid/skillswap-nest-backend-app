import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApplyTaskDto } from './dto/apply-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(dto: CreateTaskDto, userId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findOpen(page?: number, limit?: number): Promise<{
        success: boolean;
        data: any;
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: any;
    }>;
    apply(taskId: number, userId: number, body: ApplyTaskDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getApplications(taskId: number, userId: number): Promise<{
        success: boolean;
        data: any;
    }>;
    assign(taskId: number, appId: number, userId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    complete(taskId: number, userId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            task_id: any;
            points_transferred: any;
            from_user_id: number;
            to_user_id: any;
        };
    }>;
    cancel(taskId: number, userId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
