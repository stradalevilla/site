# Pendências com o arquiteto / topógrafo

Pontos levantados ao conferir o site contra a planta topográfica oficial
`KGL-STR-DE-098.001-K07.001.R01`.

**Todas as 52 páginas de lote estão publicadas com as cotas exatamente como
saem da planta.** Nada foi corrigido, arredondado ou omitido por nossa conta —
quando um número não fecha com o desenho, ele está publicado assim mesmo e
aparece listado aqui. São 229 medidas no total.

Cada item diz o que foi observado, como foi verificado e o que precisamos de
resposta.

---

## 1. Cota "59,45" do lote 6 não fecha

**O que acontece:** o número **59,45** está impresso sobre a frente do lote 6 (a
testada para a via), mas essa linha mede **33,26 m** na própria planta.

**Como foi verificado:** o perímetro do lote 6 medido na planta é 230,33 m. Com
33,26 m na frente, as cotas somam 229,58 m — fecha em 0,3%. Com 59,45 m somariam
255,77 m, um erro de 11%. A área confirma: o polígono medido dá 2.612 m² contra
os 2.597,56 m² cadastrados (0,6%). A mesma medição, aplicada ao lote 5 vizinho,
reproduz a cota 34,53 dele com 0,0% de erro — ou seja, a régua está certa.

**Situação no site:** publicado **59,45 m**, como está na planta. A frente
desenhada é visivelmente mais curta que isso.

**O que precisamos:** quanto mede, de fato, a testada do lote 6 para a via?

---

## 2. Duas divisas sem cota impressa

- **Entre os lotes 5 e 6:** medimos **77,79 m** na planta, consistente pelos dois
  lados, mas não há cota impressa.
- **Frente do lote 6:** ver item 1.

**Situação no site:** essas faces aparecem sem medida — não publicamos um valor
que não veio da planta.

**O que precisamos:** as cotas oficiais desses dois trechos.

---

## 3. Cotas que não correspondem ao trecho desenhado

Nestes casos a cota está impressa na planta, e nós a publicamos, mas o trecho
correspondente no desenho tem outro comprimento:

| lote | cota impressa | trecho no desenho | diferença |
|---|---|---|---|
| 38 | 20,86 m | 16,1 m | −23% |
| 38 | 11,17 m | 16,7 m | +49% |
| 50 | 4,53 m | 3,0 m | −35% |
| 50 | 7,64 m | 5,0 m | −34% |

São todos trechos curtos, de 3 a 21 m, ao longo de meio-fio e curvas. Em metros
a diferença vai de 1,5 a 5,5 m. Pode ser imprecisão do nosso traçado sobre a
foto aérea, ou cota trocada na planta — não dá para saber daqui.

**O que precisamos:** confirmação de que esses quatro valores estão corretos.

---

## 4. Lotes 29 e 30 sem arte e sem parâmetros urbanísticos

**O que acontece:** no arquivo de artes (`Masterplan lotes/`), as páginas 29 e 30
estão **em branco** (~57 KB, contra ~2 MB das demais). O arquivo
`_TEXTOS_LOTES_SITE.md` também pula esses dois: tem 50 entradas (01–28 e 31–52).

**Mas os lotes existem e estão à venda** — a planta os traz com 3.268,23 m² e
3.263,17 m², na ponta oeste, ao sul da via.

**Situação no site:** os dois estão publicados com a área correta e o desenho da
metragem gerado a partir da planta. Falta a aba "Área construtiva" e o box de
parâmetros urbanísticos (recuos, taxa de ocupação, altura máxima), que dependem
de dados que só o arquiteto tem. **É a única lacuna visível para o cliente.**

**O que precisamos:** os parâmetros urbanísticos dos lotes 29 e 30 e, se
possível, as artes.

---

## 5. Numeração dos arquivos de marcação aérea está deslocada

**O que acontece:** foram exportadas 52 marcações aéreas (uma por lote), mas os
arquivos foram nomeados pulando 29 e 30. Isso empurrou todos os nomes duas casas
a partir dali: o arquivo `masterplan-lote-31.jpg` mostra, na verdade, o lote 29 —
e sobraram dois nomes no fim ("53" e "54") que não correspondem a lote nenhum.

**Como foi verificado:** cada lote tem uma escala própria (metros por unidade do
desenho), que deveria ser igual para todos por virem da mesma foto. Antes da
correção a dispersão era de 8,8% com nove lotes fora da tolerância; depois de
realinhar a numeração, caiu para 2,3% e nenhum ficou fora.

**Situação no site:** já corrigido. O site usa 01 a 52, contínuo, como a planta.

**O que precisamos:** nada — é só um alerta para conferir a numeração de
qualquer arquivo novo.

---

## 6. Medidas repetidas nas artes de detalhe

Algumas artes trazem medidas que não podem estar certas:

- **Lote 01:** "56,45 m" aparece três vezes no mesmo terreno.
- **Lote 20:** repete o mesmo "56,45 m".
- **Lote 51:** traz as medidas do lote 39 (43,31 / 91,45 / 31,04 / 88,87).

**Situação no site:** essas artes foram substituídas pelo desenho gerado a partir
da planta, com as cotas do topógrafo. As medidas erradas não estão publicadas.

**O que precisamos:** nada, mas vale saberem que as artes têm esses erros.

---

## 7. Limite sul do lote 30 não foi traçado

No PNG exportado da planta, o lote 30 não tem a linha do limite sul desenhada. A
cota "88,71" está lá, solta, sem a linha correspondente. Por isso o contorno dele
no site veio da marcação aérea, e não da planta como os demais.

**O que precisamos:** uma exportação com essa linha, caso o lote 30 precise do
mesmo nível de precisão dos outros.

---

## 8. Faixa entre os lotes 43 e 44

Entre os lotes 43 e 44 existe uma faixa de cerca de 4 a 10 m de largura por 81 m
de comprimento (cotas 10,07 / 4,12 / 10,02), que não é lote. É o que explica a
divisa do 43 medir 81,50 m e a do 44 medir 80,99 m — não são a mesma linha.

**O que precisamos:** saber o que é (servidão? drenagem? passagem?) e se deveria
aparecer na implantação do site.

---

## Como as medidas foram conferidas

Para cada lote, o contorno foi extraído do próprio arquivo da planta (preenchendo
a região do lote e traçando a fronteira, então os cantos vêm do CAD) e projetado
sobre a foto aérea. Cada cota impressa foi comparada com o comprimento medido no
desenho; onde não fechava, o valor foi investigado antes de publicar — foi assim
que apareceram os itens 1, 2, 3 e 8 desta lista.

Duas checagens de conjunto confirmam o resultado:

- **Divisas lidas duas vezes.** Cada divisa entre lotes vizinhos foi lida em duas
  imagens diferentes, uma por lote. Todas bateram — por exemplo, a corrente
  88,75 (37↔38) · 91,45 (38↔39) · 88,87 (39↔40) · 85,65 (40↔41) · 81,95 (41↔42).
- **Escala dos desenhos.** Cada lote tem uma escala própria (metros por unidade do
  desenho), que deveria ser igual para todos por virem da mesma foto. A variação
  ficou em 2,3%, sem nenhum lote fora da tolerância de 10%.

Fora os itens acima, **46 dos 52 lotes** não têm nenhuma observação: cotas
impressas, desenho e área batem entre si.
