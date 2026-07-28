# Pendências com o arquiteto / topógrafo

Divergências encontradas ao conferir o site contra a planta topográfica oficial
`KGL-STR-DE-098.001-K07.001.R01`. Cada item diz o que foi observado, como foi
verificado e o que o site está fazendo enquanto não há resposta.

---

## 1. Cota "59,45" do lote 6 não fecha

**O que acontece:** o número 59,45 está impresso sobre a frente do lote 6 (a
testada para a via), mas essa linha mede **33,26 m** na própria planta.

**Como foi verificado:** o perímetro do lote 6 medido na planta é 230,33 m. Com
33,26 m na frente, as cotas somam 229,58 m — fecha em 0,3%. Com 59,45 m, somariam
255,77 m, um erro de 11%. A área também confirma: o polígono medido dá 2.612 m²
contra os 2.597,56 m² cadastrados (0,6%). A mesma medição, aplicada ao lote 5
vizinho, reproduz a cota 34,53 dele com 0,0% de erro — ou seja, a régua está certa.

**Situação no site:** a frente do lote 6 está **sem medida exibida**. Preferimos
não publicar um número que não confere.

**O que precisamos:** confirmação de quanto mede a testada do lote 6 para a via.

---

## 2. Duas divisas sem cota na planta

- **Entre os lotes 5 e 6:** a divisa mede 77,79 m (medido na planta, consistente
  pelos dois lados), mas não há cota impressa.
- **Frente do lote 6:** ver item 1.

**Situação no site:** essas faces ficam sem medida exibida.

**O que precisamos:** as cotas oficiais desses trechos.

---

## 3. Limite sul do lote 30 não foi traçado

**O que acontece:** no PNG exportado da planta, o lote 30 não tem a linha do
limite sul desenhada. A cota "88,71" está lá, solta, sem a linha correspondente.

**Consequência:** não dá para extrair o contorno do lote 30 automaticamente da
planta, como foi feito nos outros. O desenho dele no site veio da marcação aérea
do arquiteto, que está bem posicionada — mas com menos precisão que os demais.

**O que precisamos:** uma exportação da planta com essa linha, se um dia o lote 30
precisar do mesmo nível de precisão dos outros.

---

## 4. Lotes 29 e 30 não têm arte nem parâmetros urbanísticos

**O que acontece:** no arquivo de artes (`Masterplan lotes/`), as páginas 29 e 30
estão **em branco** (~57 KB, contra ~2 MB das demais). O arquivo
`_TEXTOS_LOTES_SITE.md` também pula esses dois: tem 50 entradas (01–28 e 31–52).

**Mas os lotes existem e estão à venda** — a planta os traz com 3.268,23 m² e
3.263,17 m², na ponta oeste, ao sul da via. Confirmado com o cliente em 28/07/2026.

**Situação no site:** os dois estão publicados com a área correta e o desenho da
metragem gerado a partir da planta. O que falta é a aba "Área construtiva" e o
box de parâmetros urbanísticos (recuos, taxa de ocupação, altura máxima), que
dependem de dados que só o arquiteto tem.

**O que precisamos:** os parâmetros urbanísticos dos lotes 29 e 30 e, se possível,
as artes.

---

## 5. Numeração dos arquivos de marcação aérea está deslocada

**O que acontece:** o arquiteto exportou 52 marcações aéreas (uma por lote), mas
nomeou os arquivos pulando 29 e 30. Isso empurrou todos os nomes duas casas a
partir dali: o arquivo `masterplan-lote-31.jpg` mostra, na verdade, o lote 29 —
e sobraram dois nomes no fim ("53" e "54") que não correspondem a lote nenhum.

**Como foi verificado:** cada lote tem uma escala própria (metros por pixel do
desenho), que deveria ser igual para todos por virem da mesma foto. Antes da
correção a dispersão era de 8,8% com nove lotes fora da tolerância; depois de
realinhar a numeração, caiu para 2,5% e nenhum ficou fora.

**Situação no site:** já corrigido. O site usa 01 a 52, contínuo, como a planta.

**O que precisamos:** nada — é só um alerta para conferir a numeração de qualquer
arquivo novo que vier deles.

---

## 6. Medidas repetidas nas artes de detalhe

**O que acontece:** algumas artes trazem medidas que não podem estar certas:

- **Lote 01:** "56,45 m" aparece três vezes no mesmo terreno.
- **Lote 20:** repete o mesmo "56,45 m".
- **Lote 51:** traz as medidas do lote 39 (43,31 / 91,45 / 31,04 / 88,87).

**Situação no site:** essas artes foram substituídas pelo desenho gerado a partir
da planta, com as cotas do topógrafo. As medidas erradas não estão publicadas.

**O que precisamos:** nada, mas vale eles saberem que as artes têm esses erros.

---

## 7. Marcações laranja/vermelhas nas artes de área construtiva

**O que acontece:** algumas artes de área construtiva trazem marcações em
laranja/vermelho que o cliente identificou como erros de desenho.

**Situação no site:** ignoradas — o modo "Área construtiva" é gerado ao vivo, sem
essas marcações.

---

## 8. Três lotes que o mapeamento automático não identificou

Os lotes **14, 25 e 28** não casaram na varredura automática da planta (que
identificou 49 dos 52). Pode ser área muito próxima à de um vizinho, ou região
não fechada como aconteceu com o 30. Ainda não investigado — só afeta a
automação, não os dados publicados.
