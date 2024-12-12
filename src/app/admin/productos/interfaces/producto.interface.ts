export interface Producto {
  id?: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  color: string;
  tallas: string[];
  categoria: string;
  imagen_url?: string;
  rating?: number;
} 