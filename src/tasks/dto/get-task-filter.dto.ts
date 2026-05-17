import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class GetTaskFilterDto {
    @ApiPropertyOptional({ description: "Filter tasks by status (e.g., OPEN, COMPLETED)" })
    @IsOptional()
    @IsString()
    status?: string

    @ApiPropertyOptional({ description: "Page number (default: 1)" })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: "Number of item per page (default: 10)" })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}