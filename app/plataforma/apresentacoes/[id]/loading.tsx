import { Esqueleto } from '@/components/plataforma/esqueleto';

// aparece no instante do toque, enquanto o servidor monta a tela
export default function Carregando() {
  return <Esqueleto titulo="Apresentação" voltar="/apresentacoes" cartoes={1} destaque />;
}
