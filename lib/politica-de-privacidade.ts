/**
 * A Política de Privacidade e Termos de Uso do Villa Stradale, transcrita do documento enviado
 * pelo Gustavo em 13/11/2026 (Politica_de_Privacidade_VillaStradale.docx). O texto é o do
 * documento, palavra por palavra: aqui só ganha a forma de página. Mudou o documento, muda aqui.
 * Única mudança, pedida por ele: na definição de Encarregado, "o Bullla" (sobra de outro
 * documento) virou "os prestadores de serviços".
 */

export type Bloco =
  | { tipo: 'secao'; texto: string }
  | { tipo: 'subsecao'; texto: string }
  | { tipo: 'item'; texto: string }
  | { tipo: 'paragrafo'; texto: string; rotulo?: string }
  | { tipo: 'rotulo'; texto: string }
  | { tipo: 'lista'; itens: string[] }
  | { tipo: 'termos'; itens: [string, string][] };

export const TITULO_DA_POLITICA = 'Política de Privacidade e Termos de Uso';
export const SUBTITULO_DA_POLITICA = 'das plataformas relacionadas ao empreendimento Villa Stradale';

export const POLITICA: Bloco[] = [
  { tipo: 'secao', texto: 'A. Objetivo' },
  {
    tipo: 'paragrafo',
    texto:
      'Estabelecer como os prestadores de serviços essenciais e/ou representantes do proprietário do empreendimento Villa Stradale coletam, utilizam, armazenam e protegem seus dados pessoais, com transparência e respeito à sua privacidade, informando:',
  },
  { tipo: 'lista', itens: ['Quais dados são coletados', 'Os motivos da coleta', 'Como você pode exercer seus direitos'] },
  { tipo: 'paragrafo', texto: 'Tudo em conformidade com a Lei Geral de Proteção de Dados (LGPD) e a legislação brasileira vigente.' },

  { tipo: 'secao', texto: 'B. Abrangência' },
  {
    tipo: 'paragrafo',
    texto:
      'Esta política aplica-se aos prestadores de serviços essenciais e/ou representantes do proprietário do empreendimento Villa Stradale e abrange todas as suas plataformas.',
  },

  { tipo: 'secao', texto: 'C. Definições' },
  {
    tipo: 'termos',
    itens: [
      ['Adolescente', 'Toda e qualquer pessoa natural entre 12 (doze) anos completos e 18 (dezoito) anos de idade incompletos.'],
      ['ANPD', 'Autoridade Nacional de Proteção de Dados.'],
      ['Controlador', 'Pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais.'],
      [
        'Cookies ou Dados de Navegação',
        'Arquivos de texto enviados pelas plataformas ao computador do usuário, armazenando informações relacionadas à navegação no site, como dados de acesso (local e horário).',
      ],
      ['Criança', 'Toda e qualquer pessoa natural com até 12 (doze) anos de idade incompletos.'],
      ['Dado Pessoal', 'Informação relacionada a pessoa natural identificada ou identificável, como nome, e-mail, telefone, CPF, RG, CNH.'],
      [
        'Dado Pessoal Sensível',
        'Informação sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural.',
      ],
      [
        'Encarregado',
        'Pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre os prestadores de serviços, os titulares dos dados e a ANPD. Também conhecido como DPO (Data Protection Officer).',
      ],
      ['LGPD', 'Lei Geral de Proteção de Dados.'],
      ['Operador', 'Pessoa natural ou jurídica que realiza operações de tratamento de dados pessoais em nome do controlador.'],
      ['Plataformas', 'Ambiente virtual que suporta a interação e o compartilhamento informacional entre Usuários, via website, e-mails e serviço e mensagens eletrônicas.'],
      [
        'SCR',
        'Sistema de Informações de Crédito, constituído por informações remetidas ao Banco Central do Brasil sobre operações de crédito, nos termos definidos na Resolução CMN nº 5.037, de 29 de setembro de 2022, conforme alterada.',
      ],
      [
        'Termo de Aceite',
        'Registro da manifestação livre, informada e inequívoca do titular dos dados pessoais, concordando com o tratamento dos seus dados para uma finalidade específica, realizado por meio do website e/ou por documento específico.',
      ],
      ['Titular', 'Pessoa natural a quem se referem os dados pessoais objeto de tratamento.'],
      [
        'Tratamento',
        'Qualquer operação envolvendo dados pessoais, como coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação, controle, modificação, comunicação, transferência, difusão ou extração.',
      ],
      [
        'Usuário',
        'Pessoa que utiliza o website www.villastradale.com.br e/ou comunica-se por e-mails, serviços de mensagens instantâneas e/ou telefone com os prestadores de serviços essenciais e/ou representantes do proprietário do empreendimento Villa Stradale fornecendo dados pessoais para permitir contato e tratar de interesses afins.',
      ],
    ],
  },

  { tipo: 'secao', texto: 'D. Diretrizes' },

  { tipo: 'subsecao', texto: '1. Dados coletados' },
  {
    tipo: 'paragrafo',
    texto:
      'Os prestadores de serviços essenciais e/ou representantes do proprietário do empreendimento Villa Stradale realizam a coleta e o tratamento de dados pessoais com a finalidade de:',
  },
  { tipo: 'lista', itens: ['Fornecer seus produtos e serviços', 'Manter o funcionamento eficaz de suas plataformas', 'Cumprir as obrigações legais a que está sujeita'] },
  { tipo: 'paragrafo', texto: 'A obtenção desses dados ocorre durante:' },
  {
    tipo: 'lista',
    itens: [
      'A utilização das Plataformas pelo titular',
      'Interações diretas com os prestadores de serviços',
      'Quando necessário para propósitos administrativos e de gestão de pessoal',
    ],
  },
  { tipo: 'item', texto: '1.1. Atuação como Controlador ou Operador' },
  { tipo: 'paragrafo', texto: 'Os prestadores de serviços poderão realizar o tratamento de dados pessoais tanto na qualidade de:' },
  {
    tipo: 'termos',
    itens: [
      ['Controlador', 'quando o tratamento for realizado em nome próprio'],
      ['Operador', 'quando o tratamento for realizado em nome de outro Controlador'],
    ],
  },
  { tipo: 'item', texto: '1.2. Detalhamento dos Dados Pessoais Coletados' },
  {
    tipo: 'paragrafo',
    texto:
      'Para acessar e utilizar as Plataformas, o Usuário deverá fornecer seus dados pessoais para identificação e acesso às informações do empreendimento Villa Stradale:',
  },
  { tipo: 'rotulo', texto: 'Dados de Identificação:' },
  { tipo: 'lista', itens: ['Nome completo', 'CPF'] },
  { tipo: 'rotulo', texto: 'Dados de Contato:' },
  { tipo: 'lista', itens: ['E-mail', 'Telefone'] },
  { tipo: 'rotulo', texto: 'Dados de Acesso:' },
  { tipo: 'lista', itens: ['Logs de acesso às plataformas', 'Cookies', 'IP (Internet Protocol)'] },
  { tipo: 'item', texto: '1.2.1. Dados Pessoais de Crianças ou Adolescentes' },
  {
    tipo: 'paragrafo',
    texto:
      'A coleta e o tratamento de dados pessoais de crianças e adolescentes ocorre apenas mediante consentimento específico e destacado de, pelo menos, um dos pais ou responsável legal, conforme estabelecido pela LGPD. Esses dados são utilizados exclusivamente para as finalidades necessárias à prestação dos serviços oferecidos, garantindo sempre a segurança e a privacidade dos menores.',
  },

  { tipo: 'subsecao', texto: '2. Consentimento do titular' },
  {
    tipo: 'paragrafo',
    texto:
      'O tratamento de dados pessoais é realizado com base nas hipóteses legais previstas na LGPD. O consentimento será coletado de forma livre, informada e inequívoca, mediante ação positiva do titular durante o uso das plataformas, produtos e serviços.',
  },
  {
    tipo: 'paragrafo',
    texto:
      'Ao aceitar esta Política de Privacidade, o usuário concorda também com as políticas de privacidade para utilização dos cookies das empresas de análise que atuam em conjunto com os prestadores de serviços.',
  },
  { tipo: 'item', texto: '2.1. Revogação do Consentimento' },
  {
    tipo: 'paragrafo',
    texto:
      'O titular poderá revogar o consentimento a qualquer momento, de forma gratuita, através do canal de comunicação oficial informado nesta Política. Em caso de revogação, os prestadores de serviços informarão os terceiros com quem os dados foram compartilhados, para que repitam o processo de revogação, exceto em casos de impossibilidade ou esforço desproporcional.',
  },
  { tipo: 'item', texto: '2.2. Gestão do Consentimento' },
  { tipo: 'paragrafo', texto: 'Os prestadores de serviços manterão registros das operações de tratamento de dados, incluindo:' },
  { tipo: 'lista', itens: ['Consentimento', 'Coleta', 'Revogação'] },
  {
    tipo: 'paragrafo',
    texto:
      'Implementando medidas técnicas e organizacionais para gerenciar o consentimento e evitar tratamento indevido de dados de quem não consentiu ou revogou o consentimento.',
  },

  { tipo: 'subsecao', texto: '3. Tratamento de dados pessoais' },
  { tipo: 'paragrafo', texto: 'O tratamento de dados pessoais observa a boa-fé e os princípios da:' },
  {
    tipo: 'lista',
    itens: [
      'Finalidade',
      'Adequação',
      'Necessidade',
      'Livre acesso',
      'Qualidade dos dados',
      'Segurança',
      'Prevenção',
      'Não discriminação',
      'Responsabilização',
      'Prestação de contas',
    ],
  },
  { tipo: 'item', texto: '3.1. Bases Legais' },
  {
    tipo: 'lista',
    itens: [
      'Consentimento do Titular',
      'Cumprimento de obrigação legal ou regulatória pelo Controlador',
      'Execução de contrato ou de procedimentos preliminares relacionados com o contrato',
      'Exercício regular de direitos em processo judicial, administrativo ou arbitral',
      'Legítimo interesse do controlador ou de terceiros',
      'Proteção ao crédito',
      'Prevenção à fraude e à segurança',
      'Proteção da vida ou incolumidade física',
      'Tutela da saúde',
    ],
  },
  { tipo: 'item', texto: '3.2. Finalidades para Tratamento dos Dados' },
  { tipo: 'rotulo', texto: 'Operação e Serviços:' },
  {
    tipo: 'lista',
    itens: [
      'Fornecer e operar as Plataformas, incluindo identificação de usuários, fornecimento de informações sobre o empreendimento Villa Stradale, serviços de atendimento ao cliente',
      'Formalizar contratos com fornecedores, prestadores de serviços, parceiros, clientes e/ou potenciais compradores',
    ],
  },
  { tipo: 'rotulo', texto: 'Comunicação:' },
  { tipo: 'lista', itens: ['Enviar comunicações por e-mails, SMS, WhatsApp e notificações sobre as plataformas, alertas e lembretes'] },
  { tipo: 'rotulo', texto: 'Melhoria e Personalização:' },
  {
    tipo: 'lista',
    itens: [
      'Desenvolver estudos sobre interesses, comportamentos e demografia dos Usuários para aprimorar serviços e ofertas',
      'Personalizar conteúdos e ofertas com base no perfil do usuário',
      'Aprimorar iniciativas comerciais e promocionais, analisando páginas visitadas e buscas',
      'Identificar necessidades específicas dos Usuários para criar novos produtos, serviços e/ou desenvolver novos empreendimentos',
      'Criar promoções ou comunicações personalizadas',
    ],
  },
  { tipo: 'rotulo', texto: 'Infraestrutura e Segurança:' },
  { tipo: 'lista', itens: ['Armazenar dados em centros de processamento', 'Prevenir fraudes', 'Atualizar dados pessoais'] },
  { tipo: 'rotulo', texto: 'Obrigações Legais e Regulatórias:' },
  {
    tipo: 'lista',
    itens: ['Compartilhar dados com autoridades públicas e órgãos reguladores, quando exigido por lei', 'Responder a processos judiciais e participar de litígios'],
  },
  { tipo: 'rotulo', texto: 'Compartilhamento com Parceiros:' },
  {
    tipo: 'lista',
    itens: [
      'Compartilhar dados mínimos necessários com parceiros para viabilizar o fornecimento de informações e/ou avaliação de adequação ao perfil de investimento e/ou perfil de crédito para eventual aquisição de unidades do empreendimento',
    ],
  },

  { tipo: 'subsecao', texto: '4. Compartilhamento de dados pessoais' },
  { tipo: 'paragrafo', texto: 'Para realizar a avaliação cadastral e creditícia dos usuários, os prestadores de serviços compartilham dados pessoais com:' },
  {
    tipo: 'lista',
    itens: [
      'Parceiros e fornecedores',
      'Autoridades públicas e órgãos reguladores (para cumprimento de obrigações legais)',
      'Empresas especializadas em prevenção de fraudes e segurança',
      'Instituições especializadas em análise de crédito',
    ],
  },
  {
    tipo: 'paragrafo',
    texto:
      'Também poderão realizar transferência internacional de dados para centros de processamento, certificando-se de que o grau de proteção de Dados Pessoais do país destinatário é reconhecido pela ANPD como adequado ao previsto na legislação brasileira vigente.',
  },
  { tipo: 'rotulo', texto: 'Compromissos:' },
  {
    tipo: 'lista',
    itens: [
      'Seleção cuidadosa dos terceiros com quem compartilhará dados',
      'Exigência de medidas de segurança adequadas e respeito à LGPD',
      'Não comercialização de dados pessoais',
      'Compartilhamento conforme as finalidades informadas e as bases legais da LGPD',
    ],
  },
  { tipo: 'item', texto: '4.1. Consulta ao SCR e Serviços de Proteção ao Crédito' },
  {
    tipo: 'paragrafo',
    texto:
      'Para fins de avaliação de perfil de investimento e/ou perfil de crédito dos Usuários, os parceiros financeiros poderão efetuar consultas ao SCR (para conhecimento de informação de operação de crédito de clientes no mercado financeiro) e serviços de proteção ao crédito.',
  },
  {
    tipo: 'paragrafo',
    texto: 'Por solicitação do Usuário, os prestadores de serviços poderão informar os parceiros que tenham efetuado as consultas em seu nome, além das orientações sobre o SCR.',
  },
  {
    tipo: 'paragrafo',
    texto:
      'A autorização de consulta é realizada por meio da seleção da opção: "Declaro que li e concordo com a Política de Privacidade e Termos de Usos, incluindo consulta ao SCR" selecionada anteriormente ao envio dos dados pessoais por meio das Plataformas.',
  },
  { tipo: 'item', texto: '4.2. Segurança dos Dados' },
  {
    tipo: 'paragrafo',
    texto: 'Os prestadores de serviços se comprometem com a segurança dos dados pessoais, implementando medidas técnicas e administrativas como:',
  },
  { tipo: 'lista', itens: ['Criptografia', 'Controles de acesso'] },
  {
    tipo: 'paragrafo',
    texto: 'Para protegê-los contra perdas, roubos e acessos não autorizados, apesar de não poderem garantir segurança absoluta de dados divulgados pela internet.',
  },
  { tipo: 'paragrafo', rotulo: 'Limitações de Responsabilidade:', texto: 'Os prestadores de serviços não serão responsáveis por:' },
  {
    tipo: 'lista',
    itens: [
      'Interceptações ilegais ou violação de seus sistemas ou bases de dados por pessoas não autorizadas',
      'Indevida utilização da informação obtida por esses meios',
    ],
  },
  { tipo: 'rotulo', texto: 'Em Caso de Incidentes de Segurança:' },
  {
    tipo: 'lista',
    itens: [
      'Os riscos serão avaliados',
      'A ANPD e os titulares serão notificados em até 3 dias úteis da ciência',
      'Informações complementares serão fornecidas em até 20 dias úteis',
    ],
  },
  { tipo: 'item', texto: '4.2.1. Armazenamento e Término do Tratamento de Dados Pessoais' },
  {
    tipo: 'paragrafo',
    texto: 'Os dados pessoais são armazenados em centros de dados físicos ou virtuais, localizados no Brasil e/ou em outros países, como:',
  },
  { tipo: 'lista', itens: ['Estados Unidos da América', 'Países da União Europeia'] },
  { tipo: 'paragrafo', texto: 'Priorizando o uso de computação em nuvem com o tratamento de dados no Brasil.' },
  { tipo: 'paragrafo', texto: 'Em caso de venda, fusão ou reorganização societária, os dados poderão ser transferidos, garantindo:' },
  {
    tipo: 'lista',
    itens: ['A continuidade da proteção', 'Comunicação ao usuário caso haja alterações significativas na Política de Privacidade'],
  },

  { tipo: 'subsecao', texto: '5. DPO e exercício dos direitos dos usuários' },
  {
    tipo: 'paragrafo',
    texto:
      'Os prestadores de serviços se comprometem a responder às solicitações no prazo previsto na legislação vigente, atendendo aos seguintes direitos dos usuários:',
  },
  {
    tipo: 'termos',
    itens: [
      ['Acesso', 'Confirmar a existência de tratamento e acessar seus dados pessoais'],
      ['Correção', 'Corrigir dados incompletos, inexatos ou desatualizados'],
      ['Eliminação', 'Solicitar a eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD'],
      ['Anonimização, bloqueio ou eliminação', 'Solicitar a anonimização, bloqueio ou eliminação de dados'],
      ['Portabilidade', 'Transferir seus dados para outro fornecedor de serviço ou produto'],
      ['Revogação do consentimento', 'Revogar o consentimento para tratamento de dados'],
      ['Informação sobre o compartilhamento', 'Obter informações sobre as entidades com as quais seus dados são compartilhados'],
      ['Informação sobre consequências da negativa de consentimento', 'Obter informações sobre as consequências de não fornecer ou revogar o consentimento'],
      ['Outros direitos', 'Exercer quaisquer outros direitos previstos na LGPD'],
    ],
  },

  { tipo: 'subsecao', texto: '6. Atualização da Política de Privacidade' },
  { tipo: 'paragrafo', texto: 'Os prestadores de serviços revisarão e atualizarão esta Política de Privacidade:' },
  {
    tipo: 'lista',
    itens: ['Periodicamente', 'Sempre que houver mudanças significativas na legislação', 'Sempre que houver mudanças em suas práticas de tratamento de dados'],
  },
  { tipo: 'paragrafo', rotulo: 'Comunicação de Alterações:', texto: 'Os Usuários poderão ser comunicados sobre alterações significativas por meio de:' },
  { tipo: 'lista', itens: ['Notificações nas Plataformas', 'E-mail e/ou mensagens', 'Divulgação da versão atualizada nas Plataformas'] },
  { tipo: 'paragrafo', rotulo: 'Recomendação:', texto: 'Os Usuários devem revisar esta política no momento da utilização das Plataformas.' },
  { tipo: 'rotulo', texto: 'Contatos Importantes:' },
  { tipo: 'lista', itens: ['Website: www.villastradale.com.br'] },
];
