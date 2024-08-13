export class Token {
  constructor(
    public id: string,
    public createdAt: Date,
    public brand: string,
    public name: string,
    public lastFour: string,
    public bin: string,
    public expYear: string,
    public expMonth: string,
    public cardHolder: string,
    public expiresAt: Date,
  ) {}
}
