export interface Usuario {
  id: number;
  nome: string;
  usuario: string; // E-mail usado no login
  foto?: string;
  nomePet: string;
  raca: string;
  porte: string;
}

export interface Categoria {
  id: number;
  descricao: string;
}

export interface Viagem {
  id: number;
  origem: string;
  destino: string;
  distanciaKm: number;
  velocidadeMediaKmh: number;
  valor: number;
  dataViagem: string; // Formato DD-MM-AAAA
  status: string;
  tempoViagemHoras?: number;
  usuario: Usuario;
  categoria: Categoria;
}