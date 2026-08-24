I have everything I need from the site. Compiling the comparison.

# A) Divergências entre o BOOK e o SITE

**Distância até São Paulo — 96 km (book) × 90 km (site), e o site se contradiz internamente**
- Book, pág. 6: "O Villa Stradale foi criado sobre uma península irreplicável em Piracaia, **a 96km de São Paulo**."
- Site: `components/localizacao-section.tsx:34` e `:82` dizem **96 km** ("Piracaia, 96 km de São Paulo" / "96 km de São Paulo. Acesso pela Fernão Dias…"). Mas `components/intro-section.tsx:89` diz **"a 90km de São Paulo*"** e `app/villa-stradale/o-projeto/page.tsx:104` e `:380` repetem **90 km** ("Um condomínio pé na água de edição limitada, a 90 km de São Paulo." / "Cercado pela água. A 90 km de São Paulo.").
- Fonte mais confiável: o book (96 km) tem o mesmo número que a página de localização do site, que é a página mais detalhada e cita a rota (Fernão Dias → SP-036). O "90 km" aparece só em headlines/manifestos — parece arredondamento de copy que virou fato. **Divergência interna do site, não só com o book**: dois números distintos no mesmo site, em três arquivos.
- Bônus: o "90km de São Paulo\*" em `intro-section.tsx:89` tem **asterisco sem nota de rodapé em nenhum lugar da página** (mesmo problema do book, item B).

**Número de lotes — 54 (book) × 52 (site)**
- Book, pág. 6 (duas vezes: "São **54 lotes** residenciais voltados à água" e o número-âncora "**54 LOTES** DE 2.000 A 4.554 M²") e pág. 34 ("edição limitada de **54 lotes**, curada por afinidade").
- Site: 52 em todo lugar, com uma constante única (`lib/lotes.ts:1` → `export const TOTAL_LOTES = 52`), consumida por `o-projeto/page.tsx`; e literais em `intro-section.tsx:68` ("52 famílias"), `:85` ("52 Lotes de 2.000 a 4.554 m²"), `masterplan-section.tsx:51`, `stakeholders/page.tsx:159` (alt: "os 52 lotes redesenhados") e `:285` ("52 famílias").
- Fonte mais confiável: **o site (52)** — conforme a planta topográfica. Registrada aqui só como divergência: o book precisa de correção, não o site.

**Metragem dos lotes — coincide (2.000 a 4.554 m²)**
- Book pág. 6: "54 LOTES DE 2.000 A 4.554 M²". Site: `intro-section.tsx:85` e `o-projeto/page.tsx:15`/`:22` ("2.000–4.554 m² por lote"). Sem divergência de faixa — só o número de lotes difere. Vale confirmar com o arquiteto se a faixa de metragem continua válida depois do reloteamento de 54→52.

**Racket Club: piso das quadras de tênis — saibro (render do book) × "piso rápido" (site), e o masterplan concorda com o site**
- Book pág. 26, masterplan: "10. **2 quadras de tênis rápida**". Book pág. 22, render do Racket Club: mostra **duas quadras de saibro/terra batida** (terracota, linhas brancas) + 1 de padel.
- Site: `intro-section.tsx:292` e `o-projeto/page.tsx:40`: "Duas quadras de tênis em **piso rápido**, uma quadra de padel, duas de beach tennis e um campo de futebol society."
- Fonte mais confiável: a legenda do masterplan (pág. 26) e o site batem em "rápido"; o render de perspectiva é que está desatualizado ou fez licença artística. Como o site já usa a imagem das quadras (`/images/casaclube/Quadras.png` e `/images/amenities/quadras.jpg`), **a imagem publicada pode contradizer o texto publicado** — confirmar o piso com o arquiteto antes de manter as duas coisas juntas.

**Pickleball: o book promete, o site não menciona**
- Book pág. 22 (texto): "o Racket Club reúne tênis, padel, **pickleball** e beach tennis". Book pág. 23 (texto): "Quadras de tênis, padel, beach tennis e o campo society" — **sem pickleball**. Book pág. 26 (masterplan): não há item de pickleball, e a numeração **salta o item 11** (vai de "10. 2 quadras de tênis rápida" para "12. 1 quadra de paddle"), o que sugere que o pickleball era o item 11 e foi perdido na arte.
- Site: não cita pickleball em nenhum lugar (`intro-section.tsx:292`, `o-projeto/page.tsx:40` listam apenas tênis, padel, beach tennis e society).
- Fonte mais confiável: o site e a pág. 23 são consistentes entre si; a pág. 22 é a única fonte de pickleball no book inteiro, e o masterplan não a sustenta. **Não adicionar pickleball ao site sem confirmação** — e se o pickleball existir, o item 11 do masterplan precisa voltar.

**Garagem náutica: "até 30 jet skis" só existe no site — o book nunca dá esse número**
- Book: pág. 23 fala em "garagem náutica com rampa de acesso à água", pág. 26 lista "08. Apoio Náutico" e "09. Píer para acesso a Casa Clube", pág. 24 mostra o render — **em nenhum lugar há capacidade numérica**.
- Site: `intro-section.tsx:341-343` e `o-projeto/page.tsx:48`: "Garagem náutica com capacidade para **até 30 jet skis** e lanchas de wakeboard."
- Fonte mais confiável: nenhuma das duas — é um número **sem fonte no material**. O book, que é a peça oficial de vendas, não o assume. Precisa vir do arquiteto/incorporador antes de continuar publicado, porque é uma promessa contratável.

**Vocabulário oficial da náutica: "marina" × "garagem náutica" × "Apoio Náutico"**
- Book: "marina" aparece na pág. 6 ("com casa-clube, marina, heliponto"), na pág. 30 ("o heliponto recuado permanece junto à marina") e na pág. 35; "garagem náutica" na pág. 23; "Apoio Náutico" e "Píer" no masterplan (pág. 26).
- Site: usa os três — título do card é "Garagem Náutica" (`intro-section.tsx:338`, `o-projeto/page.tsx:45`), mas o comentário de código e o arquivo dizem "Marina Stradale"/`Marina.png` (`intro-section.tsx:317-324`), o alt de `o-projeto/page.tsx:50` diz "Enseada da marina", `masterplan-section.tsx:51` diz "marina" e o texto do heliponto diz "recuados junto à marina" (`intro-section.tsx:366`, `o-projeto/page.tsx:56`).
- Fonte mais confiável: indefinida no book também — ele mistura os três termos. É uma decisão de nomenclatura a fechar, não um erro de um lado só. Note que o site herdou literalmente a construção da pág. 30 ("recuados junto à marina"), inclusive o problema.

**Heliponto: "três spots" — book e site batem; "Helicidade" é só do site**
- Book pág. 23: "o heliponto com **três spots**"; pág. 25: o render mostra de fato três marcações de pouso. Site: `intro-section.tsx:365-367` e `o-projeto/page.tsx:56`: "Três spots privativos". **Sem divergência.**
- Mas o site acrescenta origem e tempo de voo que o book não tem: "**Do Helicidade, em São Paulo**, direto ao heliponto" (`intro-section.tsx:365`, `o-projeto/page.tsx:56`) e "**20 minutos** de São Paulo" (`localizacao-section.tsx:105`). Nada disso está no book — sem fonte no material.

**"Shuttle de Helicóptero" / "Serviço de Shuttle" do book não existe no site**
- Book pág. 33 lista "**Shuttle de Helicóptero**" entre os diferenciais, e pág. 26 lista "07. Serviço de Shuttle\*". O site não menciona shuttle em nenhum lugar. Fonte mais confiável: **o site, por omissão, está mais seguro** — a promessa do book não tem operador, frequência nem cobrança definidos (ver seção B).

**Trilha de 3 km: o book quantifica, o site não menciona**
- Book pág. 26: "15. **Trilha de 3km** para corrida, caminhada ou bicicleta"; pág. 23 fala em "a pista de cooper **e as trilhas**" (plural). O site não traz pista de cooper nem trilha em nenhum dos arquivos lidos — nem na lista de amenities de `o-projeto/page.tsx` (que tem Casa Clube, Racket Club, Garagem Náutica, Heliponto e Conveniência). **Item do produto ausente no site**, não divergência de fato.

**Bio de Greg Bousquet: o site cortou credenciais e trocou "23 anos" por "mais de duas décadas"**
- Book pág. 30: "Co-fundador da Triptyque, acumulou **23 anos** de trajetória internacional antes de fundar, **em 2021**, a Architects Office (AO) […] atua em **14 estados** no Brasil e em países como Peru, Chile e Portugal."
- Site: `arquitetura-paisagismo/page.tsx:22` — "Co-fundador da Triptyque, com **mais de duas décadas de obra construída no Brasil**." Perdeu 2021, os 14 estados e os países; e "trajetória internacional" virou "obra construída no Brasil", que é uma afirmação diferente (e mais fraca/menos precisa) do que o book diz.
- Fonte mais confiável: o book, por ser mais específico. Mas atenção: `components/arquitetos-section.tsx:9` traz a bio do book **cortada no meio de uma frase** — "acumulou 23 anos de" — e é isso que está no ar na home.

**Bio de Orsini: o site cortou o Inhotim quantificado e a frase está truncada na home**
- Book pág. 31: "formado em **1984** na Escuela de Jardinería y Paisajismo 'Castillo de Batres' (Madri). **Atua desde 1979** […] Entre 2000 e 2004, foi responsável por **25 ha do Instituto Inhotim** […] Autor de […] (2008) e Orsini (2017), mantém escritórios em SP e BH."
- Site: `arquitetura-paisagismo/page.tsx:35` — "formado na Escuela […] Castillo de Batres, em Madri. Atua desde 1979 — entre os seus jardins estão os do Inhotim." Perdeu 1984, os 25 ha, o recorte 2000-2004 e os livros; e "entre os seus jardins estão os do Inhotim" é uma paráfrase mais vaga (e mais ampla) do que "foi responsável por 25 ha do Instituto Inhotim".
- Nota de datas do próprio book: "formado em 1984" e "atua desde 1979" — atua **cinco anos antes de se formar**. Não é contradição impossível, mas é a leitura que um jornalista faria; confirmar.
- E igual ao caso Bousquet: `components/arquitetos-section.tsx:15` publica a bio **truncada** — "Atua desde 1979 e se".

**"270 graus" — o site usa como fato geográfico; o book usa como frase de atmosfera, sem atribuição**
- Book pág. 31: "atmosfera que **o autor** descreveu como '270 graus de paz'" — sem dizer quem é "o autor".
- Site: usa nos dois registros. Como número do produto: `o-projeto/page.tsx:23` → "**270°** / de represa ao redor"; e em `intro-section.tsx:68` → "uma península cercada por **270 graus de represa**". E como citação atribuída a Orsini: `arquitetura-paisagismo/page.tsx:40` → "o que Orsini resume numa frase: 270 graus de paz", e `:274` como título de faixa.
- Fonte mais confiável: o site **decidiu** que "o autor" é Orsini — o book não autoriza isso. E transformou uma frase poética em medida angular do terreno ("270° de represa ao redor" aparece na grade "O produto, sem adjetivos"), o que é uma promessa geográfica verificável na planta. Confirmar as duas coisas: a atribuição e o ângulo real.

**Área da península: 275.951 m² só existe no site**
- Book: não dá área total em nenhuma página (pág. 6 só dá lotes e metragem por lote). Site: `masterplan-section.tsx:48`, `o-projeto/page.tsx:15`, `:23`, `:361`. Sem fonte no book — presumivelmente vem da planta, mas registro que o book não sustenta.

**Distâncias regionais: o site é mais específico que o book, e acrescenta cidade nova**
- Book pág. 27: "fica **a 30 minutos de Piracaia**, com Bragança Paulista, Atibaia e Joanópolis como vizinhas"; o mapa também rotula Extrema e Monte Verde, que o texto não cita.
- Site `localizacao-section.tsx:45-47`: "**Atibaia está a 25 km**. Bragança Paulista, Joanópolis e **Bom Jesus dos Perdões** são vizinhas diretas. **Monte Verde, em Minas Gerais, fica a 40 km**." — os 25 km e os 40 km não estão no book, **Bom Jesus dos Perdões não aparece em nenhuma página do book**, e o site abandonou o "30 minutos de Piracaia" (que é a única referência de proximidade que o book dá).
- Fonte mais confiável: nenhuma verificável no material. Números novos sem fonte.

**Casa Clube: a lista do site bate com a pág. 8, mas o site omite dois itens do masterplan**
- Book pág. 8 e site `intro-section.tsx:138` / `o-projeto/page.tsx:32`: "Piscina, bangalôs, spa, capela, brinquedoteca, restaurante e bar" — **idêntico, sem divergência**.
- Mas o masterplan (pág. 26) detalha "**Piscina adulto e infantil**", "Playground", "Sala de jogos e convivência com lareira" e "**Capela ecumênica**". O site diz só "Piscina" e "capela" — a capela do site perde o "ecumênica", que é uma qualificação relevante. E "sala de jogos" e "playground" não aparecem no site, embora os renders das págs. 13/16 (sinuca, biblioteca, bar, adega, lareira) sejam justamente disso.

**Academia: o site afirma marca, o book dá alternativa**
- Book pág. 26: "Academia com equipamentos **TecnoGym ou LifeFitness**".
- Site: `intro-section.tsx:191` (alt) e `:223` — "Academia com equipamentos **TecnoGym**", sem o "ou LifeFitness".
- Fonte mais confiável: o book, que preserva a alternativa. O site fechou uma escolha que a incorporadora deixou aberta — isso é promessa de marca específica em material público. Além disso, **a grafia correta da marca é "Technogym"**, não "TecnoGym"; o erro veio do book (pág. 26) e foi replicado no site.

**Infraestrutura: o site tem um item que o book não tem, e omite os números do book**
- Site `o-projeto/page.tsx:85-87` lista "**ETE** — Estação de tratamento de efluentes própria". **A palavra ETE / tratamento de efluentes não aparece em nenhuma página do book**, inclusive na lista de infraestrutura da pág. 26. Sem fonte no material.
- Ao contrário, o book dá números que o site descartou: "**Poço artesiano de 250 metros**", "**Caixa d'água de 200 mil litros**", "Infra de elétrica nível T3 **125 ampères e 47 kva**", tubulação PEAD Kanaflex, piso intertravado permeável, guias em formato americano. O site só diz "Poço artesiano — abastecimento de água próprio", sem os 250 m.

**Segurança: o site diz "uma só entrada por terra"; o book diz o contrário**
- Site `o-projeto/page.tsx:91`: "Uma península tem **uma só entrada por terra** — e ela é vigiada 24 horas."
- Book pág. 33: "**Acesso independente para moradores, visitantes e serviços**" — ou seja, acessos segregados na portaria.
- Não é necessariamente contradição (podem ser faixas distintas de um mesmo ponto de acesso), mas do jeito que está escrito o site sugere um portão e o book sugere três. Vale alinhar a frase.
- O site também **omite a BBZ da administração**: o book pág. 33 lista "Administração e protocolo operacional pela BBZ" como diferencial; o site atribui à BBZ **obra e execução** (`stakeholders/page.tsx:193-206`: "Responsável pela obra: administração e execução do empreendimento"), não a administração condominial. São papéis diferentes — confirmar qual é o da BBZ.

**Pedro Costa: o site dá 2020 e sete dias; o book dá outra narrativa**
- Book pág. 34: Pedro "escolheu uma Península irreplicável às margens da represa de Piracaia"; e "foi em **2020** que nasceu o braço imobiliário do grupo, a Stradale Empreendimentos Imobiliários". Traz também Caçula de Pneus, FAAP, INSPER, COO, venda à Pirelli, Stradale Car Service (2018), flagship Michelin, três lojas, Forbes Under 30 e o título de Campeão Sul-Americano da Porsche GT3 Cup 2017.
- Site `stakeholders/page.tsx:101-103`: "**Em 2020, no meio da pandemia**, viu a península pela primeira vez — e em **sete dias** ela era inteira do projeto." O "meio da pandemia" e os "sete dias" **não estão no book**; e o site usa 2020 para a compra do terreno, enquanto o book usa 2020 para a fundação da empresa imobiliária. Nenhuma credencial do book (Forbes, Pirelli, Porsche, INSPER) foi para o site.
- Fonte mais confiável: nenhuma — são narrativas paralelas. O "sete dias" é o tipo de detalhe que precisa vir do próprio Pedro.

**Marcello: existe no site, não existe no book**
- `stakeholders/page.tsx:130-151` apresenta "Marcello" no desenvolvimento de produto e o redesenho dos lotes, com a citação "Não existe lote ruim". **Nenhuma página do book menciona Marcello** — o book só nomeia Pedro Costa (34), Greg Bousquet (30), Orsini (31) e a BBZ (33). Sem sobrenome no site, ainda: só "Marcello".

**Contagem: o alt da implantação diz 52; a imagem é de maio**
- `stakeholders/page.tsx:159`: alt "A implantação da península, com os **52 lotes** redesenhados", sobre `/images/aereas/implantacao-maio.jpg`. Consistente com o site, mas registro porque é o único lugar onde a contagem aparece dentro de um alt de imagem — se a planta mudar, esse texto também tem de mudar.

---

# B) Contradições internas do book e material que não deveria ir ao público

**Nota interna escrita no book por engano — a mais grave**
- Pág. 31, dentro do parágrafo de bio do Orsini, no fim: "**(Credenciais externas informadas pelo cliente.)**" Isto é ressalva de produção/jurídica, não copy. Está no corpo do texto público do book de vendas. Fora do site (o site não replicou isso — confirmei em `arquitetura-paisagismo/page.tsx:35` e `arquitetos-section.tsx:15`), mas está no PDF que circula com o cliente. Além do vazamento, **o que ela significa é que as credenciais do Orsini — 1984, Madri, 25 ha do Inhotim, os dois livros — não foram verificadas pela produção**; e o site publicou algumas delas.

**Credencial com ressalva de responsabilidade e sem verificação — pág. 31**
- Como acima: a única credencial do book que vem com aviso de "não conferimos" é a do paisagista. O site usa "entre os seus jardins estão os do Inhotim" e "Atua desde 1979" derivados dela.

**Datas contraditórias da própria incorporadora — 2019 × 2020, e duas razões sociais**
- Pág. 35: "**Stradale Inc. nasceu em 2019** com o propósito de ocupar um espaço muito específico no mercado imobiliário."
- Pág. 34: "**foi em 2020 que nasceu o braço imobiliário do grupo, a Stradale Empreendimentos Imobiliários**."
- Duas datas de fundação e **dois nomes diferentes** (Stradale Inc. × Stradale Empreendimentos Imobiliários) para o que parece ser a mesma empresa, em páginas consecutivas. O site adotou "Stradale Inc." (`stakeholders/page.tsx:13`, `:106`, `:241`) e não publica data nenhuma — o que, nesse caso, é a escolha segura.

**54 lotes afirmado duas vezes numa página e repetido em outra**
- Pág. 6: "São **54 lotes** residenciais" e "**54 LOTES** DE 2.000 A 4.554 M²". Pág. 34: "uma edição limitada de **54 lotes**, curada por afinidade". Três ocorrências, número errado (são 52) — o erro é consistente dentro do book, o que sugere que veio de uma versão antiga do masterplan e nunca foi revisado. Já registrado em (A); repito aqui porque é o número mais reproduzido do book.

**Pickleball: prometido numa página, ausente na página seguinte e ausente do masterplan**
- Pág. 22 (texto do Racket Club): "reúne tênis, padel, **pickleball** e beach tennis".
- Pág. 23 (texto de esportes): "Quadras de tênis, padel, beach tennis e o campo society" — **sem pickleball**.
- Pág. 26 (masterplan): sem item de pickleball, **e a numeração salta o 11** (10 → 12). O item 11 desaparecido é quase certamente o pickleball, perdido na arte.
- Resultado: o book promete uma quadra que o próprio book não lista nem mostra.

**Numeração do masterplan salta o item 11 — pág. 26**
- A legenda vai de "10. 2 quadras de tênis rápida" direto para "12. 1 quadra de paddle". Falta o 11.

**Os 8 marcadores do masterplan estão todos escritos "01" — pág. 26**
- Placeholders de arte que foram para a versão final: os oito pinos sobre o mapa trazem todos o número "01", nenhum correspondendo ao item certo da legenda. Se alguém tentar ler o mapa, nada fecha.

**Asterisco sem nota de rodapé — pág. 26**
- "07. **Serviço de Shuttle\***" — o asterisco existe, a nota de rodapé não existe em nenhum lugar da página. Uma ressalva foi prevista e nunca escrita, o que deixa uma promessa de serviço sem condição alguma.
- Mesmo padrão no site: `intro-section.tsx:89` traz "Condomínio fechado, a 90km de São Paulo\*" — asterisco sem nota correspondente em toda a página. Herdado ou coincidente, é o mesmo defeito.

**Promessa de serviço sem detalhamento nenhum — pág. 33**
- "**Shuttle de Helicóptero**" listado como diferencial, sem operador, frequência, capacidade ou se é cobrado. Combinado com o asterisco órfão da pág. 26, é o item de maior risco do book: um serviço aéreo prometido em material de venda sem uma única condição.

**"BBZ" citada sem identificação — pág. 33**
- "Administração e protocolo operacional pela **BBZ**". Quem é a BBZ não é explicado em nenhuma página do book. Duas questões: se o nome do terceiro pode ser divulgado, e o que exatamente ele administra — porque o site atribui à BBZ **obra e execução** (`stakeholders/page.tsx:200`), não administração condominial.

**Piso das quadras: masterplan × render — págs. 22 e 26**
- Pág. 26 diz "2 quadras de tênis **rápida**" (piso rápido); o render da pág. 22 mostra **saibro/terra batida**. O texto e a imagem do mesmo produto se contradizem dentro do book.

**Grafia da mesma modalidade em duas formas — págs. 22, 23 e 26**
- "padel" (págs. 22 e 23) × "**paddle**" (pág. 26, "12. 1 quadra de paddle"). São esportes diferentes na origem; a grafia correta para o que o projeto tem é "padel".

**Marca escrita errado, e o erro foi replicado no site — pág. 26**
- "**TecnoGym**". A marca real é **Technogym**. O site copiou a grafia errada (`intro-section.tsx:191`, `:223`).

**Pista de cooper: plural na copy, singular no masterplan — págs. 23 e 26**
- Pág. 23: "**a pista de cooper e as trilhas** acompanham o desenho da península" (dois equipamentos, trilhas no plural). Pág. 26: um item só, "15. **Trilha de 3km** para corrida, caminhada ou bicicleta". A copy sugere mais infraestrutura do que a lista técnica entrega.

**Heliponto "junto à marina" × heliponto e náutica separados — págs. 26 e 30**
- Pág. 30: "o heliponto recuado permanece **junto à marina**". Pág. 26: "06. Heliponto" e "08. Apoio Náutico" são itens separados do masterplan, e nos renders (págs. 23 e 25) o heliponto está na entrada/istmo, junto às quadras e ao estacionamento — não junto à marina. A palavra "marina" aparece só nas págs. 6, 30 e 35; o masterplan nunca a usa. O site herdou a frase da pág. 30 literalmente (`intro-section.tsx:366`, `o-projeto/page.tsx:56`: "recuados junto à marina") — se o masterplan estiver certo, o site está publicando uma localização errada.

**Dois itens de infraestrutura grudados no mesmo bullet — pág. 26**
- "Cabeamento subterrâneo, incluindo luz e internet **Iluminação perimetral e de vias com fotocélulas**" — falta a marca do segundo item, então os dois se leem como um só.

**Aspas soltas, sem par — págs. 26 e 34**
- Pág. 26: "Guias no formato americano**”**" — aspa de fechamento sem abertura.
- Pág. 34: o título é uma citação do fundador que **fecha e nunca abre**: PRIMEIRO FOI UM SONHO; POR ACASO, VIROU EMPREENDIMENTO**”**.

**Duas credenciais do fundador que pedem verificação antes de qualquer publicação — pág. 34**
- "recebeu o prêmio da **Forbes Under 30**" e "**Campeão Sul Americano da Porsche GT3 Cup de 2017**". São credenciais verificáveis publicamente e citadas sem fonte; note que a pág. 31 traz ressalva explícita de "credenciais informadas pelo cliente" para o Orsini e a pág. 34 não traz nenhuma — o que não significa que estas foram conferidas. Nenhuma das duas está no site.

**Jargão interno de mercado no texto público — pág. 35**
- "criar projetos de segunda residência que conversem com o **público AAA**". "Público AAA" é classificação interna de segmentação, não linguagem de comprador. O site não replicou.

**Erros de português no book (não estão no site, mas estão no PDF que circula)**
- Pág. 4: "um refúgio pé na água tão raro, **que não parecem existir**" — singular com verbo no plural.
- Pág. 5: "um dos pontos mais singulares **de** represa" — falta o artigo ("da represa").
- Pág. 31: "O mineiro Luiz Carlos Orsini é paisagista **mineiro** (BH)" — "mineiro" duas vezes na mesma frase. **Este erro ESTÁ no site**: `components/arquitetos-section.tsx:15` publica a frase inteira, verbatim, com a repetição.
- Pág. 34: "**as** margens" (falta crase), "**Logo seguida**" (falta "em"), "se consagrando **a** Flagship store" (crase/concordância), "**Títulos**" com maiúscula indevida, "portfolio" sem acento.

**Renders sem legenda em nove páginas seguidas**
- Págs. 9-21 (com exceção das que têm copy) são render mudo: nenhum título, nenhuma legenda, nenhum número de chamada. A copy da seção existe só na pág. 8. Isso não é erro de fato, mas significa que **todo texto de apoio dessas imagens no site foi escrito do zero** — e portanto nenhuma legenda do site sobre spa, restaurante, academia, sinuca ou piscina tem respaldo no book. Casos concretos onde isso já importa: o book não identifica qual lâmina de água é o hot spa e qual é o cold spa (pág. 20), e o site fala de "Hot spa com vista. Cold spa." (`intro-section.tsx:224`) sobre imagens não legendadas.

---

**Arquivos do site consultados** (todos absolutos): `D:\villastradale\components\intro-section.tsx`, `D:\villastradale\components\arquitetos-section.tsx`, `D:\villastradale\components\localizacao-section.tsx`, `D:\villastradale\components\regiao-section.tsx` (só imagem de fundo, sem texto), `D:\villastradale\app\villa-stradale\o-projeto\page.tsx`, `D:\villastradale\app\villa-stradale\arquitetura-paisagismo\page.tsx`, `D:\villastradale\app\villa-stradale\stakeholders\page.tsx`. Também `D:\villastradale\lib\lotes.ts` (`export const TOTAL_LOTES = 52`) e `D:\villastradale\components\masterplan-section.tsx`, que apareceram na busca por números e contêm afirmações relevantes.

**Os três itens mais urgentes**, na minha leitura: (1) o "90 km" × "96 km" **dentro do próprio site**, em três arquivos — é o único caso em que o site se contradiz publicamente; (2) as duas bios **truncadas no meio da frase** em `arquitetos-section.tsx:9` e `:15`, que estão no ar na home; (3) o "até 30 jet skis", que é promessa numérica contratável sem nenhuma fonte no book.