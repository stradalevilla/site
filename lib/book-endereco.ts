/** O que passa da tela da senha para o book e de volta: a tela aberta e a marca de prévia do usuário */
export function consultaDoBook(busca: Record<string, string | string[] | undefined>, extra: Record<string, string> = {}) {
  const consulta = new URLSearchParams();
  for (const chave of ['tela', 'previa']) {
    const valor = busca[chave];
    if (typeof valor === 'string' && /^[0-9a-z]{1,3}$/.test(valor)) consulta.set(chave, valor);
  }
  for (const [chave, valor] of Object.entries(extra)) consulta.set(chave, valor);
  const texto = consulta.toString();
  return texto ? `?${texto}` : '';
}
