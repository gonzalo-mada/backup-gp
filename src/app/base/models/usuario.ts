export interface Usuario {
  uid: string;
  rut: string;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  correo_uv: string;
  correo_personal: string;
  foto: string;
  idioma: string;
  anonimo: boolean;
  adicional?: any;
}
