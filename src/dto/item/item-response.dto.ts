export class ItemResponseDto {
  constructor(
    public readonly id: number,
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly quantity: number,
    public readonly receivedAt: Date,
    public readonly isActive: boolean,
    public readonly inactiveAt: Date | null,
    public readonly categoryId: number,
    public readonly category: { id: number; name: string; description: string | null } | null,
    public readonly createdBy: { id: number; username: string } | null,
    public readonly updatedBy: { id: number; username: string } | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static fromEntity(item: any): ItemResponseDto {
    return new ItemResponseDto(
      item.id,
      item.sku,
      item.name,
      item.description,
      item.quantity,
      item.receivedAt,
      item.isActive,
      item.inactiveAt,
      item.categoryId,
      item.category
        ? {
            id: item.category.id,
            name: item.category.name,
            description: item.category.description,
          }
        : null,
      item.createdBy
        ? {
            id: item.createdBy.id,
            username: item.createdBy.username,
          }
        : null,
      item.updatedBy
        ? {
            id: item.updatedBy.id,
            username: item.updatedBy.username,
          }
        : null,
      item.createdAt,
      item.updatedAt
    );
  }
}
