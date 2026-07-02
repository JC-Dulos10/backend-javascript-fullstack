export class CategoryResponseDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static fromEntity(category: any): CategoryResponseDto {
    return new CategoryResponseDto(
      category.id,
      category.name,
      category.description,
      category.createdAt,
      category.updatedAt
    );
  }
}
