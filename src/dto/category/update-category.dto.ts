export class UpdateCategoryDto {
  constructor(
    public readonly name?: string,
    public readonly description?: string | null
  ) {}
}
