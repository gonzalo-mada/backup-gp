import { Item } from './item';

export interface Menu {
  estado: number;
  nombre: string;
  icono: string;
  estilo: string | null;
  metodo: string;
  descripcion: string;
  id: number;
  grupo: string | null;
  items: Item[];
}
