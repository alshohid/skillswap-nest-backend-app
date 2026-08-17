// external imports
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

// internal imports
import { DatabaseService } from '../../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findById(id: number) {
    const result = await this.db.query(
      `SELECT id, full_name, email, skill_points, created_at, updated_at
       FROM users WHERE id = $1`,
      [id],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: result.rows[0],
    };
  }

  async update(id: number, dto: UpdateUserDto) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (dto.fullName) {
      updates.push(`full_name = $${paramIndex++}`);
      values.push(dto.fullName);
    }

    if (updates.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query(
      `UPDATE users SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, full_name, email, skill_points, created_at, updated_at`,
      values,
    );

    return {
      success: true,
      message: 'User profile updated successfully',
      data: result.rows[0],
    };
  }

  /**
   * Get the authenticated user's profile (from JWT).
   */
  async me(id: number) {
    return this.findById(id);
  }
}
