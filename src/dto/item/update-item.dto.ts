export class UpdateItemDto {
  constructor(
    public readonly sku?: string,
    public readonly name?: string,
    public readonly description?: string | null,
    public readonly quantity?: number,
    public readonly receivedAt?: string,
    public readonly categoryId?: number,
    public readonly isActive?: boolean
  ) {}
}
