export class RegisterDto {
  constructor(
    public readonly username: string,
    public readonly password: string
  ) {}
}