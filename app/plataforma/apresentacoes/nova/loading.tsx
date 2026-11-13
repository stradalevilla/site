import { Esqueleto } from '@/components/plataforma/esqueleto';

// aparece no instante do toque, enquanto o servidor monta a tela
export default function Carregando() {
  return <Esqueleto titulo="Nova apresentação" voltar="/apresentacoes" cartoes={3} />;
}
