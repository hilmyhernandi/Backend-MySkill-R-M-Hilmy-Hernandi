import bcrypt from "bcrypt";

export class PasswordBcrypt {
  private readonly saltRounds = 12;

  public generateHash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  public isPasswordValid(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
