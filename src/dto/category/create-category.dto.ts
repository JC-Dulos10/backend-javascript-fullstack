export class CreateCategoryDto {
  constructor(
    public readonly name: string,
    public readonly description: string | null
  ) {}
}
