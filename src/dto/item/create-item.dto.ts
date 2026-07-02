export class CreateItemDto {
  constructor(
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly quantity: number,
    public readonly receivedAt: string,
    public readonly categoryId: number
  ) {}
}
