export class Product {
  constructor(
    public id: number,
    public name: string,
    public shortDescription: string,
    public description: string,
    public price: number,
    public stock: number,
    public imageUrl: string,
    public imageAltText: string,
    public slug: string,
    public isFeatured: boolean, // Nuevo campo para productos destacados
  ) {}
}
