/* ============================================================
   BIBLIOTECA DE SCRIPTS · ACQUACEL (Metodologia GeFit)
   Inclui os funis de natação infantil falando com pais e mães (Experiência Acquacel,
   Guia da Metodologia e Mapa de saúde para os pais). Conteúdo de natação: fonte "novo".
   Scripts da academia falando com lead e aluno.
   Genérico: nome da academia, presente de boas-vindas e cores vêm de
   ACADEMIA_CFG (pode ser definido em window.ACADEMIA_CFG antes de carregar).
   Estrutura: funil → etapa → toque {f, e, t (nº do contato na cadência),
   opc (opção 1 ou 2), dia, canal, obj, texto, var:{perfil:texto},
   aqui:{a,q,u,i}, op (orientação), fonte ('atual' = script que a academia
   já usava, preservado; 'novo' = criado agora, aguardando validação)}.
   Abre por cima da página com abrirBibliotecaAcademia({funil}).
   ============================================================ */
(function(){
const CFG=Object.assign({
  nome:'Acquacel',
  presente:'o Guia da Metodologia Acquacel para a família + o Mapa de saúde para a mãe ou o pai',
  avaliacao:'avaliação física tecnológica, onde você entende 15 áreas da sua saúde',
  cor:'#1B4FD8',corT:'#0A2472',corTexto:'#FFFFFF',escuro:'#0A2472',fundo:'#F8FAFF'
},window.ACADEMIA_CFG||{});

const PERFIS={
  geral:{nome:'Todos os perfis',dor:'Use a versão geral quando ainda não souber o perfil da pessoa.'},
  bebe:{"nome": "Natação · bebê (até 3 anos)", "dor": "Pai ou mãe com receio de começar cedo demais. Quer segurança, carinho e entender como é a aula de um bebê."},
  medo:{"nome": "Natação · criança com medo da água", "dor": "A criança chora, não quer molhar o rosto ou trava na borda. A família quer alguém paciente, que construa confiança sem forçar."},
  ja_nada:{"nome": "Natação · criança que já teve contato", "dor": "Já fez natação ou brinca bem na água. A família quer evolução de verdade e saber em que nível a criança está."},
  iniciante:{nome:'Sedentário / iniciante',dor:'Medo de não dar conta, vergonha do ambiente e de não saber usar os aparelhos. Precisa de acolhimento e acompanhamento de perto.'},
  outra_academia:{nome:'Já treina em outra academia',dor:'Compara preço e estrutura. Quer saber o que muda de verdade: método, acompanhamento e resultado.'},
  emagrecimento:{nome:'Emagrecimento',dor:'Já tentou outras vezes e parou. Quer resultado visível e constância, sem dieta maluca.'},
  saude:{nome:'Saúde, 50+ e cuidados especiais',dor:'Dor, limitação, recomendação médica ou idade. Quer segurança e alguém que entenda o caso dele.'},
  performance:{nome:'Performance / quer evoluir no treino',dor:'Treina há tempo e estagnou. Quer planejamento, avaliação e alguém que puxe a evolução.'}
};

const CANAIS={wpp:'💬 Texto de WhatsApp',audio:'🎙 Áudio',lig:'📞 Ligação',dm:'📷 DM Instagram',video:'🎬 Vídeo + texto',presencial:'🤝 Presencial'};

const FUNIS=[
 {"id": "nat", "nome": "Natação infantil · pais e mães (leads)", "perfilKanban": "leads", "desc": "Família que chegou pela página da natação infantil, Instagram, indicação ou Central de Leads. 15 dias com 10 contatos, cada um com opção 1 e opção 2. A conversa é sempre com o responsável, sobre a criança pelo nome. Objetivo: ligação e Experiência Acquacel.", "etapas": [{"id": "contato", "nome": "1º contato"}, {"id": "ligacao", "nome": "Direcionar para ligação"}, {"id": "convite", "nome": "Convite para a Experiência Acquacel"}, {"id": "fim", "nome": "Encerramento"}]},
 {"id": "natexp", "nome": "Experiência Acquacel → matrícula (natação infantil)", "desc": "Do agendamento até a matrícula. Na confirmação vai o presente: o Guia da Metodologia em PDF, pedindo nome e idade da criança, e o Mapa de saúde para a mãe ou o pai. Confirmação é sempre afirmação, nunca pergunta.", "etapas": [{"id": "confirma", "nome": "Confirmação e presente"}, {"id": "durante", "nome": "Durante a Experiência"}, {"id": "pos", "nome": "Devolutiva"}, {"id": "fecha", "nome": "Fechamento"}, {"id": "faltou", "nome": "Faltou / remarcar"}]},
 {"id": "natfam", "nome": "Família Acquacel (natação infantil matriculada)", "desc": "Criança matriculada: reforçar a decisão nas primeiras semanas, mostrar a evolução que a família consegue ver (avaliação, virtude da semana, passagem de nível), cuidar de quem está faltando e pedir indicação depois de um feedback positivo.", "etapas": [{"id": "onboarding", "nome": "Primeiras semanas"}, {"id": "evolucao", "nome": "Evolução e conquistas"}, {"id": "sumindo", "nome": "Criança faltando"}, {"id": "indicacao", "nome": "Indicação"}]},
 {id:'leads',nome:'Leads novos · estúdio de musculação',
  desc:'Quem chegou agora (anúncio, Instagram, indicação, Central de Leads). 15 dias com 10 contatos, cada um com opção 1 e opção 2. Sem resposta no fim: descanso de 30 dias e depois funil Desconectados.',
  etapas:[{id:'contato',nome:'1º contato'},{id:'qualif',nome:'Qualificação'},{id:'ligacao',nome:'Direcionar para ligação'},{id:'convite',nome:'Convite para a Experiência'},{id:'fim',nome:'Encerramento'}]},
 {id:'desc',nome:'Desconectados / sem resposta',
  desc:'Lead que conversou e sumiu, ou que voltou do descanso de 30 dias. 7 dias com 6 contatos. Nunca "seja bem-vindo": sempre atenção. As duas últimas são especiais.',
  etapas:[{id:'retomada',nome:'Retomada'},{id:'penultima',nome:'Penúltima (vai diminuir)'},{id:'ultima',nome:'Última (despedida real)'}]},
 {id:'exp',nome:'Experiência → Matrícula',
  desc:'Da Experiência agendada até a matrícula. Jornada de 5 a 12 dias, 7 contatos. Confirmação é sempre afirmação, nunca pergunta.',
  etapas:[{id:'confirma',nome:'Confirmação'},{id:'durante',nome:'Durante a Experiência'},{id:'pos',nome:'Pós-Experiência'},{id:'fecha',nome:'Fechamento'},{id:'faltou',nome:'Faltou / remarcar'}]},
 {id:'renov',nome:'Renovação',perfilKanban:'renovacao',
  desc:'Aluno ativo com plano vencendo. Plano trimestral, semestral ou anual: D-15 a D-2 (4 contatos). Mensalista: só nos últimos 5 dias (3 contatos). Nunca "seu plano está vencendo": sempre "próximos passos da jornada".',
  etapas:[{id:'planos',nome:'Planos maiores (D-15 a D-2)'},{id:'mensal',nome:'Mensalista (D-5 a D-1)'},{id:'upgrade',nome:'Upgrade para anual'}]},
 {id:'ex',nome:'Ex-alunos / rematrícula',perfilKanban:'rematricula',
  desc:'Ex-aluno não é lead: é relacionamento interrompido. 7 dias com 4 contatos. Sem resposta: descanso de 60 dias.',
  etapas:[{id:'reconexao',nome:'Reconexão'},{id:'pertenca',nome:'Pertencimento'},{id:'convite',nome:'Convite'},{id:'despedida',nome:'Despedida'}]},
 {id:'suc',nome:'Sucesso do cliente',perfilKanban:'sucesso_cliente',
  desc:'Aluno matriculado: reforçar a decisão nos primeiros dias, check-ins contínuos, aluno sumindo e indicação. Nunca vira pesquisa ou NPS.',
  etapas:[{id:'onboarding',nome:'Onboarding (D+3 a D+15)'},{id:'checkin',nome:'Check-in contínuo'},{id:'sumindo',nome:'Aluno sumindo'},{id:'indicacao',nome:'Indicação'}]}
];

// ---------- SCRIPTS ----------
const S=[
// ===== NATAÇÃO INFANTIL (Acquacel) =====
{"f": "nat", "e": "contato", "t": 1, "opc": 1, "dia": "D0", "canal": "wpp", "obj": "Boas-vindas, posicionar a metodologia e qualificar (idade e contato com a água)", "texto": "Oi, [Nome]! Que alegria receber sua mensagem 💙 Parabéns por pensar na natação pra [Criança], é um cuidado que fica pra vida toda.\n\nAqui na Acquacel a natação infantil segue uma metodologia própria: cada criança está em um nível, com um mascote, e a família acompanha cada conquista de perto.\n\nPra eu já te orientar direitinho: quantos anos a [Criança] tem, e ela já teve algum contato com piscina?", "var": {"bebe": "Oi, [Nome]! Que alegria receber sua mensagem 💙 Parabéns por pensar na água desde cedo pra [Criança], é um cuidado que fica pra vida toda.\n\nAqui na Acquacel cada fase tem o seu nível, com um mascote, e a família acompanha cada pequena conquista de perto, com muito carinho.\n\nPra eu já te orientar direitinho: quantos meses a [Criança] tem, e ela já entrou numa piscina com vocês?", "medo": "Oi, [Nome]! Que alegria receber sua mensagem 💙 Parabéns por pensar na natação pra [Criança].\n\nSe ela fica com receio da água, pode ficar tranquilo(a): aqui na Acquacel a primeira etapa é justamente construir confiança, no tempo da criança e sem forçar.\n\nPra eu já te orientar direitinho: quantos anos a [Criança] tem, e como ela costuma reagir quando está na água?", "ja_nada": "Oi, [Nome]! Que alegria receber sua mensagem 💙 Parabéns por querer levar a [Criança] mais longe na água.\n\nAqui na Acquacel a natação segue uma metodologia própria, com níveis e avaliações, e a família sabe exatamente o que a criança já conquistou e qual é o próximo passo.\n\nPra eu já te orientar direitinho: quantos anos a [Criança] tem, e o que ela já consegue fazer sozinha na água?"}, "aqui": {"a": "Parabeniza a decisão de cuidar da criança.", "q": "Idade da criança e contato anterior com a água.", "u": "Responder duas perguntas simples.", "i": "Uma metodologia em que a família vê a evolução."}, "op": "Fale com o responsável e use sempre o nome da criança. Registre a idade e o perfil (bebê, medo, já teve contato) no card.", "fonte": "novo"},
{"f": "nat", "e": "contato", "t": 1, "opc": 2, "dia": "D0", "canal": "audio", "obj": "Áudio complementar: reforça as boas-vindas e já justifica a ligação", "texto": "Oi, [Nome]! Aqui é a [Seu Nome], da Acquacel. Fiquei muito feliz que você chegou até aqui pensando na [Criança]. Separei um presente de boas-vindas pra família de vocês, e quero te explicar rapidinho como a gente cuida da criança na água, porque é isso que faz toda a diferença no começo. Consigo te ligar agora, ou prefere outro horário?", "aqui": {"a": "Felicidade genuína pelo contato.", "q": "(sem pergunta de qualificação no áudio)", "u": "Topar uma ligação rápida.", "i": "Presente de boas-vindas reservado para a família."}, "op": "Não detalhe o presente no áudio. Ele é revelado na ligação: Guia da Metodologia e Mapa de saúde para a mãe ou o pai.", "fonte": "novo"},
{"f": "nat", "e": "ligacao", "t": 2, "opc": 1, "dia": "D1", "canal": "wpp", "obj": "Direcionar para a ligação com o presente de boas-vindas", "texto": "[Nome], separei aqui um presente de boas-vindas pra vocês e prefiro te explicar rapidinho por telefone, é bem mais fácil que por mensagem. Consigo te ligar agora, ou fica melhor no fim do dia?", "aqui": {"a": "Presente separado para a família.", "q": "(implícita) melhor horário para falar.", "u": "Escolher um horário.", "i": "Explicação rápida e pessoal."}, "fonte": "novo"},
{"f": "nat", "e": "ligacao", "t": 2, "opc": 2, "dia": "D1", "canal": "audio", "obj": "Áudio: a evolução que a família consegue ver", "texto": "Oi, [Nome]! [Seu Nome] da Acquacel de novo. Quero te contar rapidinho por que as famílias daqui falam que conseguem enxergar a evolução dos filhos: cada etapa da natação é um nível, com um mascote, e em cada avaliação vocês recebem o que a [Criança] já conquistou, o que ela está desenvolvendo e qual é o próximo passo. Tenho um presente reservado pra vocês e te explico em dois minutinhos por ligação. Agora ou no fim da tarde, o que fica melhor?", "aqui": {"a": "Fala com a família, não só com a criança.", "q": "(implícita) horário da ligação.", "u": "Escolher agora ou mais tarde.", "i": "Avaliação clara: conquistou, desenvolvendo, próximo passo."}, "fonte": "novo"},
{"f": "nat", "e": "ligacao", "t": 3, "opc": 1, "dia": "D2", "canal": "lig", "obj": "Ligação: conectar, qualificar a criança e quem acompanha, pré-ancorar", "texto": "Conectar: \"Oi, [Nome], tudo bem? Aqui é a [Seu Nome], da Acquacel. Você tem dois minutinhos? Prometo que é rápido.\"\n\nQualificar: \"Me conta um pouquinho da [Criança]: como ela é no dia a dia, e o que fez você pensar na natação agora?\" Aprofunde a resposta antes de seguir (segurança na água, gastar energia, saúde, indicação, medo).\n\nVarinha mágica: \"Se daqui a alguns meses você olhasse pra [Criança] na piscina, o que te deixaria mais feliz de ver?\"\n\nQuem acompanha: \"E você, [Nome], já faz alguma atividade pra cuidar de você também?\"\n\nPré-ancorar: \"É exatamente isso que a nossa metodologia trabalha: segurança antes de técnica, níveis com mascotes, e vocês acompanhando cada conquista.\"\n\nConvite: \"Quero que a [Criança] viva a Experiência Acquacel. Tenho [dia] às [hora] ou [dia] às [hora], qual fica melhor pra vocês?\"", "aqui": {"a": "Conexão com a história da criança.", "q": "Motivo da natação, sonho da família e se o responsável se exercita.", "u": "Escolher um dos dois horários.", "i": "Experiência Acquacel com presente para a família."}, "op": "Se a mãe ou o pai já treina: ótimo, registre. Se não treina: ofereça o Mapa de saúde como presente. Nunca mande tabela de preço na ligação.", "fonte": "novo"},
{"f": "nat", "e": "ligacao", "t": 3, "opc": 2, "dia": "D2", "canal": "wpp", "obj": "Texto logo depois da ligação não atendida", "texto": "Oi, [Nome]! Tentei te ligar agora rapidinho. Imagino que a rotina com criança é corrida 😊 Assim que puder, me chama aqui que eu te explico em dois minutinhos o presente que separei pra vocês.", "aqui": {"a": "Compreensão com a rotina da família.", "q": "(sem pergunta)", "u": "Chamar quando puder.", "i": "Presente esperando por eles."}, "op": "Não ligue de novo em sequência. Mande este texto (ou um áudio curto) e siga a cadência.", "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 4, "opc": 1, "dia": "D3", "canal": "wpp", "obj": "Conexão: a primeira etapa é confiança", "texto": "[Nome], muitas famílias chegam aqui com a mesma dúvida: \"será que a [Criança] vai se adaptar?\". Aqui a primeira etapa é justamente essa, criar confiança na água, com o treinador do lado e no tempo da criança.\n\nPosso reservar um horário pra [Criança] viver a Experiência Acquacel? Tenho [opção 1] ou [opção 2].", "aqui": {"a": "Normaliza a dúvida da família.", "q": "(implícita) qual horário serve.", "u": "Escolher um horário.", "i": "Adaptação com carinho, sem forçar."}, "op": "Se tiver uma história real de uma criança daqui (com autorização), conte em uma frase. Nunca invente caso.", "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 4, "opc": 2, "dia": "D3", "canal": "audio", "obj": "Áudio: segurança e presença da família", "texto": "Oi, [Nome]! Lembrei de vocês hoje aqui na borda da piscina. É muito bonito ver o pai ou a mãe acompanhando a criança e percebendo cada pequena conquista. É isso que eu queria pra [Criança] também. Vou te ligar rapidinho mais tarde pra gente achar o melhor horário da Experiência, tá bom?", "aqui": {"a": "Imagem afetiva da família na borda.", "q": "(sem pergunta)", "u": "Atender a ligação mais tarde.", "i": "Viver a conquista junto com a criança."}, "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 5, "opc": 1, "dia": "D5", "canal": "video", "obj": "Vídeo + texto (autoridade): o treinador mostra a primeira etapa", "texto": "[Nome], pedi pro [Treinador] gravar um recadinho pra vocês mostrando como é a primeira etapa da criança na água aqui na Acquacel: [vídeo]\n\nRepara como cada atividade tem um porquê. Quero muito que a [Criança] viva isso de perto. Prefere [opção 1] ou [opção 2]?", "aqui": {"a": "Conteúdo feito pensando na família.", "q": "(implícita) qual horário.", "u": "Assistir e escolher um horário.", "i": "Método explicado por quem cuida da criança."}, "op": "Vídeo curto, gravado na piscina, sem aluno que não tenha autorização de imagem SIM no cadastro.", "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 5, "opc": 2, "dia": "D5", "canal": "audio", "obj": "Áudio: a estrutura pensada para a criança", "texto": "[Nome], uma coisa que os pais sempre perguntam: aqui são duas piscinas aquecidas, com dois sistemas de aquecimento, então a água nunca fica sem aquecer. O tratamento é com ozônio, tem vestiário infantil e o acesso à piscina é por rampa e escada de alvenaria, mais seguro pra criança entrar e sair. Tudo pensado pra segurança e pra família. Quando vocês vierem, eu mostro tudo pessoalmente. Fica melhor [opção 1] ou [opção 2]?", "aqui": {"a": "Responde antes a dúvida comum dos pais.", "q": "(implícita) qual horário.", "u": "Escolher um horário.", "i": "Estrutura pensada para segurança e família."}, "op": "Antes de atender, saiba a profundidade e a temperatura de cada piscina. Se a família perguntar, responda com segurança.", "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 6, "opc": 1, "dia": "D7", "canal": "lig", "obj": "Ligação (compromisso): retomar o que a família disse", "texto": "\"Oi, [Nome]! Aqui é a [Seu Nome], da Acquacel. Lembrei do que você me falou sobre a [Criança] e queria saber: a natação dela continua sendo um plano de vocês pra agora?\" Se sim: \"Então vamos garantir. Tenho [opção 1] ou [opção 2], qual fica melhor?\"", "aqui": {"a": "Retoma a fala da própria família.", "q": "Se a natação continua sendo prioridade.", "u": "Confirmar e escolher horário.", "i": "Coerência com o que eles mesmos disseram."}, "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 6, "opc": 2, "dia": "D7", "canal": "wpp", "obj": "Texto: a natação da criança ainda é prioridade?", "texto": "[Nome], tudo bem por aí? Fiquei pensando na [Criança]. A natação dela ainda está nos planos de vocês pra agora? Se estiver, eu deixo o horário reservado com o treinador.", "aqui": {"a": "Interesse genuíno pela criança.", "q": "Se ainda é prioridade.", "u": "Responder sim ou não.", "i": "Horário reservado com o treinador."}, "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 7, "opc": 1, "dia": "D9", "canal": "wpp", "obj": "Reaproximação leve", "texto": "Oi, [Nome]! Passando só pra saber como vocês estão 😊 Se a rotina estiver apertada, a gente encaixa a Experiência Acquacel da [Criança] num horário que combine com a escola. Me conta qual período fica melhor: manhã ou tarde?", "aqui": {"a": "Leveza, sem cobrança.", "q": "Período do dia que funciona.", "u": "Escolher manhã ou tarde.", "i": "Encaixe na rotina da família."}, "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 7, "opc": 2, "dia": "D9", "canal": "audio", "obj": "Áudio: um passo pequeno", "texto": "[Nome], a Experiência é um passo pequeno: vocês vêm, a [Criança] conhece a piscina e o treinador, e você sente de perto como funciona. Sem compromisso nenhum de decidir nada na hora. Me fala um período que eu já reservo pra vocês.", "aqui": {"a": "Tira o peso da decisão.", "q": "(implícita) melhor período.", "u": "Passar um período.", "i": "Conhecer antes de decidir."}, "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 8, "opc": 1, "dia": "D11", "canal": "video", "obj": "Vídeo + texto (prova social): uma conquista real", "texto": "[Nome], olha que momento bonito de hoje aqui na Acquacel: [vídeo de uma conquista ou passagem de nível, com autorização de imagem]\n\nÉ isso que eu quero ver com a [Criança] também. Tenho [opção 1] ou [opção 2] pra ela viver a Experiência.", "aqui": {"a": "Emoção de uma conquista real.", "q": "(implícita) qual horário.", "u": "Escolher um horário.", "i": "A família vendo a evolução acontecer."}, "op": "Só use imagem de aluno com autorização de imagem SIM no cadastro.", "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 8, "opc": 2, "dia": "D11", "canal": "wpp", "obj": "Texto: a história de uma família parecida", "texto": "[Nome], lembrei de vocês porque [história real de uma criança daqui com perfil parecido com a [Criança], em uma ou duas frases]. Cada criança tem o seu tempo, e aqui a gente respeita isso. Quer que eu reserve [opção 1] ou [opção 2]?", "aqui": {"a": "Identificação com outra família.", "q": "(implícita) qual horário.", "u": "Escolher um horário.", "i": "Respeito ao tempo de cada criança."}, "op": "Use apenas histórias reais. Sem história real, prefira a opção 1.", "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 9, "opc": 1, "dia": "D13", "canal": "wpp", "obj": "Reflexão (só para famílias mornas ou quentes)", "texto": "[Nome], uma reflexão rápida: natação não é só esporte, é segurança e confiança pra vida inteira. Cada conquista que a [Criança] tem na água agora vira autonomia lá na frente. Ainda consigo reservar o presente de boas-vindas pra vocês neste ciclo. Prefere [opção 1] ou [opção 2]?", "aqui": {"a": "Valoriza o cuidado dos pais.", "q": "(implícita) qual horário.", "u": "Escolher um horário.", "i": "Confiança e autonomia para a vida."}, "op": "Nunca use medo de afogamento como argumento. Fale de segurança, confiança e autonomia.", "fonte": "novo"},
{"f": "nat", "e": "convite", "t": 9, "opc": 2, "dia": "D13", "canal": "audio", "obj": "Áudio: o presente deste ciclo", "texto": "[Nome], o presente de boas-vindas que separei pra família de vocês fica reservado até o fim desta semana. Eu queria muito que a [Criança] aproveitasse. Me fala um horário que eu deixo tudo pronto com o treinador.", "aqui": {"a": "Cuidado em não deixar o presente passar.", "q": "(implícita) melhor horário.", "u": "Passar um horário.", "i": "Tudo pronto com o treinador."}, "op": "Use só se o prazo for real. Escassez inventada quebra a confiança.", "fonte": "novo"},
{"f": "nat", "e": "fim", "t": 10, "opc": 1, "dia": "D15", "canal": "wpp", "obj": "Encerramento com a porta aberta", "texto": "[Nome], vou parar de te mandar mensagens por aqui pra não encher seu WhatsApp 😊 Obrigado(a) pela atenção até aqui. Quando sentir que é o momento da [Criança] começar, é só me chamar que eu reservo tudo pra vocês. Um abraço pra família!", "aqui": {"a": "Gratidão pela atenção.", "q": "(sem pergunta: encerramento)", "u": "Saber que pode chamar a qualquer momento.", "i": "Porta aberta para a família."}, "op": "Depois do encerramento, descanso de 30 dias. A volta é sempre com \"atenção\", nunca com \"seja bem-vindo\".", "fonte": "novo"},
{"f": "nat", "e": "fim", "t": 10, "opc": 2, "dia": "D15", "canal": "audio", "obj": "Áudio de encerramento", "texto": "Oi, [Nome]! Passando pra agradecer o carinho de vocês. Vou deixar vocês à vontade, e quando for o momento da [Criança], pode me chamar que eu cuido de tudo. Um beijo pra ela!", "aqui": {"a": "Carinho com a família.", "q": "(sem pergunta)", "u": "Chamar quando for o momento.", "i": "Cuidado de ponta a ponta."}, "fonte": "novo"},
{"f": "natexp", "e": "confirma", "t": 1, "opc": 1, "dia": "Logo após agendar", "canal": "wpp", "obj": "Confirmar a Experiência e entregar o Guia da Metodologia (pedindo nome e idade da criança)", "texto": "Que alegria, [Nome]! A Experiência Acquacel da [Criança] está reservada pra [dia] às [hora] 💙\n\nPra deixar tudo pronto com o treinador, me confirma o nome completo da [Criança] e a idade dela?\n\nE como prometido, aqui está o seu presente de boas-vindas: o Guia da Metodologia Acquacel. Ele mostra como a criança é recebida, como funciona cada etapa e tem dicas pra vocês chegarem tranquilos. [PDF do Guia]", "aqui": {"a": "Comemora o agendamento.", "q": "Nome completo e idade da criança.", "u": "Responder dois dados simples.", "i": "Guia da Metodologia como presente."}, "op": "Mande o Guia em PDF direto no WhatsApp, só para quem agendou. Não mande o link da página para preencher de novo.", "fonte": "novo"},
{"f": "natexp", "e": "confirma", "t": 1, "opc": 2, "dia": "Logo após agendar", "canal": "audio", "obj": "Áudio: o Mapa de saúde para a mãe ou o pai", "texto": "[Nome], tem um presente pra você também! Aqui na Acquacel temos um estúdio com acompanhamento, e enquanto a [Criança] vive a Experiência, você pode fazer o Mapa de saúde, que mostra como está a sua saúde em vários pontos. Você já faz alguma atividade hoje?", "aqui": {"a": "Cuidado também com quem acompanha.", "q": "Se o responsável já faz atividade.", "u": "Responder sim ou não.", "i": "Mapa de saúde como presente."}, "op": "Já treina: ótimo, registre e siga. Não treina: reserve o Mapa de saúde no mesmo horário. Anote no card.", "fonte": "novo"},
{"f": "natexp", "e": "confirma", "t": 2, "opc": 1, "dia": "Véspera", "canal": "wpp", "obj": "Reforço de valor na véspera (afirmação)", "texto": "Oi, [Nome]! Amanhã é o dia da [Criança] na Acquacel 🐠 Às [hora] o [Treinador] já vai estar esperando por ela na borda, e eu já contei tudo que você me falou sobre ela. Dá uma olhadinha no Guia pra ver o que levar. Estamos esperando vocês!", "aqui": {"a": "Treinador já preparado para a criança.", "q": "(sem pergunta: confirmação é afirmação)", "u": "Separar o que levar.", "i": "Recepção personalizada."}, "fonte": "novo"},
{"f": "natexp", "e": "confirma", "t": 2, "opc": 2, "dia": "No dia", "canal": "wpp", "obj": "Confirmação no dia (afirmação)", "texto": "Bom dia, [Nome]! Hoje às [hora] é a Experiência Acquacel da [Criança]. A piscina já está aquecida e o [Treinador] já está esperando por ela. Até daqui a pouco! 💙", "aqui": {"a": "Clima de dia especial.", "q": "(sem pergunta)", "u": "Vir no horário.", "i": "Tudo pronto para receber a criança."}, "fonte": "novo"},
{"f": "natexp", "e": "durante", "t": 3, "opc": 1, "dia": "Depois da Experiência", "canal": "wpp", "obj": "Depois do primeiro contato com a piscina: a conquista do dia", "texto": "[Nome], que lindo ver a [Criança] hoje na água! O [Treinador] me contou que ela [conquista do dia, ex.: molhou o rosto, soltou da borda, ficou à vontade com o treinador]. Como ela chegou em casa? Falou alguma coisa da piscina?", "aqui": {"a": "Celebra uma conquista concreta.", "q": "Como a criança chegou em casa.", "u": "Contar a reação da criança.", "i": "A família vendo a evolução desde o primeiro dia."}, "op": "Peça ao treinador uma conquista real do dia antes de mandar.", "fonte": "novo"},
{"f": "natexp", "e": "durante", "t": 3, "opc": 2, "dia": "Depois da Experiência", "canal": "audio", "obj": "Áudio do treinador para a família", "texto": "(áudio do [Treinador]) Oi, [Nome]! Aqui é o [Treinador]. Adorei conhecer a [Criança] hoje. Ela [observação positiva e real]. O próximo passo com ela é [próxima habilidade]. Foi um prazer, viu?", "aqui": {"a": "Proximidade do treinador.", "q": "(sem pergunta)", "u": "Ouvir o recado.", "i": "Próximo passo claro para a criança."}, "fonte": "novo"},
{"f": "natexp", "e": "pos", "t": 4, "opc": 1, "dia": "Fim da Experiência", "canal": "wpp", "obj": "Convite para a devolutiva com o nível da criança", "texto": "[Nome], o [Treinador] preparou uma devolutiva da [Criança]: o que ela já conquistou, o que estamos desenvolvendo e qual é o próximo passo, já no nível dela, com o mascote. Quero te mostrar isso com calma, com um café. Fica melhor [opção 1] ou [opção 2]?", "aqui": {"a": "Devolutiva feita para a criança deles.", "q": "(implícita) qual horário.", "u": "Escolher um horário para a conversa.", "i": "Evolução que a família consegue ver."}, "fonte": "novo"},
{"f": "natexp", "e": "pos", "t": 4, "opc": 2, "dia": "Fim da Experiência", "canal": "lig", "obj": "Ligação de devolutiva", "texto": "\"[Nome], o [Treinador] observou a [Criança] e já sabemos em que nível ela começa: [nível e mascote]. Ela já conquistou [conquista], e o próximo passo é [próxima habilidade]. Quero te mostrar o mapa de evolução e como acompanhamos cada etapa. Consegue passar aqui [opção 1] ou [opção 2]?\"", "aqui": {"a": "Fala concreta sobre a criança.", "q": "(implícita) melhor horário.", "u": "Passar para conversar.", "i": "Mapa de evolução e acompanhamento."}, "fonte": "novo"},
{"f": "natexp", "e": "fecha", "t": 5, "opc": 1, "dia": "Na conversa presencial", "canal": "presencial", "obj": "Fechamento: validar, mostrar a jornada, ancorar e convidar", "texto": "Validar: \"O que você mais gostou de ver na [Criança] hoje?\" (deixe a família falar).\n\nMostrar a jornada: o nível em que ela começa, o mascote, os próximos níveis e como funcionam as avaliações e a passagem de nível.\n\nEmpilhar valor: metodologia própria, treinador acompanhando de perto, avaliação com devolutiva, virtudes trabalhadas com as crianças, estrutura (piscinas aquecidas, ozônio, vestiário infantil, acesso seguro).\n\nAncorar: apresente primeiro o projeto principal, o preço como fração do que foi empilhado, nunca o plano mais barato primeiro.\n\nConvidar: \"Vamos começar a jornada da [Criança]? Qual turma fica melhor, [opção 1] ou [opção 2]?\"", "aqui": {"a": "A família diz o que mais gostou.", "q": "O que mais encantou na Experiência.", "u": "Escolher a turma.", "i": "Jornada clara com evolução visível."}, "op": "Siga o \"Empilhar 3 Nãos\" se houver objeção: forma de pagamento, projeto alternativo, posicionamento final.", "fonte": "novo"},
{"f": "natexp", "e": "fecha", "t": 5, "opc": 2, "dia": "Depois da conversa", "canal": "wpp", "obj": "Resumo do projeto por escrito, com próximo passo", "texto": "[Nome], que bom ter conversado com você! Resumindo o projeto da [Criança]: ela começa no nível [nível e mascote], com foco em [habilidades do nível], acompanhamento do [Treinador] e avaliações com devolutiva pra vocês. Deixei a vaga dela reservada na turma de [dia e horário]. Assim que você me confirmar, já deixo tudo pronto pra primeira aula.", "aqui": {"a": "Retoma a conversa com carinho.", "q": "(implícita) confirmação.", "u": "Confirmar a vaga.", "i": "Projeto claro e vaga reservada."}, "fonte": "novo"},
{"f": "natexp", "e": "fecha", "t": 6, "opc": 1, "dia": "2 dias depois", "canal": "wpp", "obj": "Não fechou: retomar pelo sonho da família", "texto": "[Nome], lembrei do que você me falou, que queria ver a [Criança] [sonho que a família contou na ligação]. Isso ficou comigo. A vaga dela na turma de [dia e horário] ainda está guardada. Vamos garantir?", "aqui": {"a": "Retoma o que a própria família sonhou.", "q": "Se querem garantir a vaga.", "u": "Responder sim.", "i": "Vaga ainda guardada para a criança."}, "fonte": "novo"},
{"f": "natexp", "e": "fecha", "t": 6, "opc": 2, "dia": "2 dias depois", "canal": "audio", "obj": "Áudio: o treinador perguntou pela criança", "texto": "[Nome], o [Treinador] perguntou da [Criança] hoje, ele ficou muito animado com ela na Experiência. Queria muito ver ela começar a jornada aqui com a gente. Me fala se fica bom [opção 1] ou [opção 2] pra primeira aula.", "aqui": {"a": "Carinho real do treinador.", "q": "(implícita) qual horário.", "u": "Escolher a primeira aula.", "i": "A criança já é esperada."}, "fonte": "novo"},
{"f": "natexp", "e": "faltou", "t": 7, "opc": 1, "dia": "No dia, se faltar", "canal": "wpp", "obj": "Faltou: remarcar rápido", "texto": "[Nome], vi que não conseguimos receber a [Criança] hoje. Tudo bem por aí? Guardei o horário dela com carinho e quero muito que ela viva essa Experiência. Fica melhor [opção 1] ou [opção 2]?", "aqui": {"a": "Preocupação genuína, sem cobrança.", "q": "Se está tudo bem.", "u": "Escolher um novo horário.", "i": "Experiência guardada para a criança."}, "op": "Se a criança estava doente (febre, diarreia, vômito), elogie o cuidado e remarque depois que ela melhorar.", "fonte": "novo"},
{"f": "natexp", "e": "faltou", "t": 7, "opc": 2, "dia": "Se avisarem antes", "canal": "wpp", "obj": "Avisou que não vai poder: reagendar na hora", "texto": "Sem problema nenhum, [Nome], imprevistos acontecem, ainda mais com criança 😊 Não quero que a [Criança] perca esse momento. Prefere [opção 1] ou [opção 2]?", "aqui": {"a": "Acolhe o imprevisto.", "q": "(implícita) novo horário.", "u": "Escolher um horário.", "i": "Momento garantido para a criança."}, "fonte": "novo"},
{"f": "natfam", "e": "onboarding", "t": 1, "opc": 1, "dia": "D+3", "canal": "wpp", "obj": "Primeiras aulas: proximidade e validar a decisão", "texto": "[Nome], que alegria ter a [Criança] com a gente! Como ela está se sentindo nas primeiras aulas? Me conta o que ela tem falado da piscina em casa 💙", "aqui": {"a": "Celebra a entrada da criança.", "q": "Como ela está se sentindo.", "u": "Contar uma reação.", "i": "Proximidade desde o começo."}, "fonte": "novo"},
{"f": "natfam", "e": "onboarding", "t": 1, "opc": 2, "dia": "D+7", "canal": "audio", "obj": "Áudio do treinador na primeira semana", "texto": "(áudio do [Treinador]) [Nome], uma semana da [Criança] com a gente! Ela já [conquista real da semana]. Estamos trabalhando [habilidade do nível] e ela está indo muito bem. Qualquer dúvida, pode me chamar.", "aqui": {"a": "Treinador próximo da família.", "q": "(sem pergunta)", "u": "Ouvir o recado.", "i": "Evolução já na primeira semana."}, "fonte": "novo"},
{"f": "natfam", "e": "evolucao", "t": 2, "opc": 1, "dia": "Após cada avaliação", "canal": "wpp", "obj": "Devolutiva da avaliação (mensagem central da metodologia)", "texto": "[Nome], saiu a avaliação da [Criança]! Aqui está o que ela já conquistou, o que estamos desenvolvendo e qual é o próximo passo:\n\n✅ Já conquistou: [habilidades]\n🔄 Estamos desenvolvendo: [habilidades]\n⭐ Próximo passo: [objetivo do nível]\n\nÉ muito bonito acompanhar essa evolução. Parabéns pra ela e pra vocês!", "aqui": {"a": "Orgulho da evolução.", "q": "(sem pergunta)", "u": "Comemorar com a criança.", "i": "Evolução que a família consegue ver."}, "op": "A avaliação é uma fotografia do momento e um mapa para o próximo passo. Nunca compare com outras crianças.", "fonte": "novo"},
{"f": "natfam", "e": "evolucao", "t": 2, "opc": 2, "dia": "Passagem de nível", "canal": "wpp", "obj": "Passagem de nível: ritual de conquista", "texto": "Hoje é dia de festa, [Nome]! 🎉 A [Criança] passou de nível e agora é [mascote do novo nível]! Ela conquistou [habilidades que fecharam o nível]. Na próxima aula ela já começa o novo desafio. Que orgulho!", "aqui": {"a": "Celebração da conquista.", "q": "(sem pergunta)", "u": "Comemorar e compartilhar.", "i": "Novo desafio já começando."}, "op": "Mande junto o card ou certificado de passagem de nível, quando houver.", "fonte": "novo"},
{"f": "natfam", "e": "evolucao", "t": 3, "opc": 1, "dia": "Toda semana", "canal": "wpp", "obj": "Card da virtude da semana", "texto": "[Nome], aqui na Acquacel a natação é mais do que nadar: a cada semana trabalhamos uma virtude com as crianças. Nesta semana é [virtude, ex.: coragem]. Na piscina, ela aparece quando [exemplo na água]. Em casa, vocês podem reforçar assim: [dica simples para casa]. [card da virtude]", "aqui": {"a": "Mostra que o método vai além da água.", "q": "(sem pergunta)", "u": "Reforçar a virtude em casa.", "i": "Família participando do desenvolvimento."}, "op": "Processo em validação com a gestão. Use a virtude e o card definidos para a semana.", "fonte": "novo"},
{"f": "natfam", "e": "evolucao", "t": 3, "opc": 2, "dia": "D+30 e a cada mês", "canal": "presencial", "obj": "Conversa na borda com quem acompanha", "texto": "Na borda ou na recepção: \"[Nome], como você está vendo a evolução da [Criança] desde que começou? Tem alguma coisa que você gostaria que a gente reforçasse com ela?\"", "aqui": {"a": "Escuta genuína.", "q": "Como a família vê a evolução.", "u": "Contar a percepção.", "i": "Família ouvida e participando."}, "fonte": "novo"},
{"f": "natfam", "e": "sumindo", "t": 4, "opc": 1, "dia": "Após 2 faltas seguidas", "canal": "wpp", "obj": "Criança faltando: cuidado, não cobrança", "texto": "[Nome], sentimos falta da [Criança] na piscina essa semana! Está tudo bem com ela? O [Treinador] perguntou por ela, ela estava indo tão bem em [habilidade que estava desenvolvendo].", "aqui": {"a": "Saudade genuína.", "q": "Se está tudo bem.", "u": "Contar o que aconteceu.", "i": "A evolução dela está esperando."}, "op": "Se for doença, deseje melhoras e combine a volta. Se for rotina, ofereça outro horário de turma.", "fonte": "novo"},
{"f": "natfam", "e": "sumindo", "t": 4, "opc": 2, "dia": "Após 2 faltas seguidas", "canal": "audio", "obj": "Áudio do treinador para a criança", "texto": "(áudio do [Treinador], falando com a criança) Oi, [Criança]! Aqui é o [Treinador]! A piscina está com saudade de você. Na próxima aula eu tenho um desafio novo pra gente fazer juntos, tá bom? Te espero!", "aqui": {"a": "Fala direto com a criança.", "q": "(sem pergunta)", "u": "Vir para a próxima aula.", "i": "Desafio novo esperando."}, "fonte": "novo"},
{"f": "natfam", "e": "indicacao", "t": 5, "opc": 1, "dia": "Após feedback positivo", "canal": "wpp", "obj": "Reforço e abertura para indicação", "texto": "Que bom ouvir isso, [Nome]! Fico muito feliz pela [Criança]. Você conhece outra família com criança que também ia amar a água? Tenho um presente pra dar em nome da [Criança] pra essa família viver a Experiência Acquacel.", "aqui": {"a": "Comemora o feedback positivo.", "q": "Se conhece outra família.", "u": "Indicar um contato.", "i": "Presente em nome da criança."}, "op": "Só peça indicação depois de um feedback positivo. Se o feedback foi negativo, resolva primeiro.", "fonte": "novo"},
{"f": "natfam", "e": "indicacao", "t": 5, "opc": 2, "dia": "Após feedback positivo", "canal": "audio", "obj": "Áudio: presente em nome da criança", "texto": "[Nome], a evolução da [Criança] está tão bonita que eu queria fazer um convite: se tiver um amiguinho dela ou alguma família que você acha que ia gostar, me passa o contato. A gente dá a Experiência Acquacel de presente, em nome da [Criança].", "aqui": {"a": "Orgulho da evolução da criança.", "q": "(implícita) quem indicar.", "u": "Passar um contato.", "i": "Presente em nome da criança."}, "fonte": "novo"},
// ===== LEADS NOVOS =====
{f:'leads',e:'contato',t:1,opc:1,dia:'D0',canal:'wpp',fonte:'atual',obj:'Boas-vindas, posicionar e qualificar (idade e se treina)',
 texto:'Oi, [Nome]! Que alegria receber sua mensagem 🙌 Antes de mais nada, parabéns pela decisão, dar esse passo já mostra que você está levando sua saúde a sério, e isso já é o mais difícil.\n\nAqui na {ACADEMIA} a gente trabalha diferente das academias convencionais: montamos um projeto personalizado pra cada aluno, com acompanhamento de verdade.\n\nPra eu já entender como te ajudar melhor: qual sua idade, e você já está treinando ou se exercitando atualmente?',
 var:{
  iniciante:'Oi, [Nome]! Que alegria receber sua mensagem 🙌 Parabéns pela decisão, o primeiro passo é sempre o mais difícil, e você já deu.\n\nAqui na {ACADEMIA} ninguém treina sozinho: a gente monta um projeto pro seu momento e acompanha de perto, principalmente no começo.\n\nPra eu já entender como te ajudar melhor: qual sua idade, e faz quanto tempo que você está parado(a)?',
  outra_academia:'Oi, [Nome]! Que alegria receber sua mensagem 🙌 Parabéns por buscar algo a mais pro seu treino.\n\nAqui na {ACADEMIA} a gente trabalha diferente das academias convencionais: projeto personalizado, avaliação e acompanhamento de verdade, não só acesso aos aparelhos.\n\nPra eu já entender como te ajudar melhor: há quanto tempo você treina, e o que você sente que está faltando hoje?',
  emagrecimento:'Oi, [Nome]! Que alegria receber sua mensagem 🙌 Parabéns pela decisão de cuidar de você.\n\nAqui na {ACADEMIA} a gente monta um projeto personalizado pra cada aluno, com acompanhamento de perto, que é o que faz o resultado aparecer e ficar.\n\nPra eu já entender como te ajudar melhor: qual sua idade, e você já está treinando ou se exercitando atualmente?',
  saude:'Oi, [Nome]! Que alegria receber sua mensagem 🙌 Parabéns pela decisão de cuidar da sua saúde.\n\nAqui na {ACADEMIA} cada aluno começa com uma avaliação e um projeto pensado pro seu caso, com acompanhamento de perto e todo o cuidado necessário.\n\nPra eu já entender como te ajudar melhor: qual sua idade, e tem alguma dor, limitação ou recomendação médica que eu deva saber?',
  performance:'Oi, [Nome]! Que alegria receber sua mensagem 🙌 Parabéns por querer levar seu treino a outro nível.\n\nAqui na {ACADEMIA} o treino parte de uma avaliação e de um planejamento de verdade, com acompanhamento pra você continuar evoluindo.\n\nPra eu já entender como te ajudar melhor: há quanto tempo você treina, e qual é o seu objetivo agora?'
 },
 aqui:{a:'Parabenizar a decisão.',q:'Idade e se já treina.',u:'Responder as duas perguntas.',i:'Projeto personalizado e acompanhamento de verdade.'},
 op:'Mandar assim que o lead chega. Opção 2 (áudio) vai logo em seguida, como complemento. Variações 2 e 3 deste texto continuam na Central de Scripts (B.1a).'},
{f:'leads',e:'contato',t:1,opc:2,dia:'D0',canal:'audio',fonte:'atual',obj:'Áudio complementar: reforça as boas-vindas e já justifica a ligação',
 texto:'Só reforçando aqui: parabéns mesmo pela decisão de se cuidar e escolher uma academia com metodologia e acompanhamento de verdade, isso já faz toda diferença no resultado. Pra eu já te apresentar o projeto certo pra você, o próximo passo é um bate-papo rápido por telefone, de uns 2 a 3 minutinhos, só pra eu entender melhor seus objetivos. Consigo ligar agora, ou prefere que eu ligue em outro horário?',
 aqui:{a:'Reforço dos parabéns, voz de gente.',q:'(implícita) melhor horário.',u:'Topar a ligação.',i:'Projeto certo para ele.'},
 op:'25 a 30 segundos, falando e não lendo. Não repete as perguntas do texto.'},

{f:'leads',e:'qualif',dia:'Conversa',canal:'wpp',fonte:'novo',obj:'Respondeu idade e se treina: espelhar e descobrir o objetivo',
 texto:'Que bom saber disso, [Nome]! Obrigado por me contar.\n\nE me conta uma coisa: se você pudesse melhorar rapidinho uma coisa no seu dia a dia, o que seria? Disposição e energia, sono, emagrecimento, dor ou alguma outra coisa importante pra você?',
 aqui:{a:'Agradecer e espelhar a resposta.',q:'O objetivo principal (varinha mágica).',u:'Nomear uma coisa.',i:'Conversa sobre ele, não sobre preço.'},
 op:'Uma pergunta por mensagem. Anote o objetivo no card (Programa/pilar). Depois da resposta, aprofunde e direcione para a ligação.'},
{f:'leads',e:'qualif',dia:'Conversa',canal:'wpp',fonte:'novo',obj:'Contou o objetivo: aprofundar e levar para a ligação',
 texto:'Faz muito sentido, [Nome]. Isso é mais comum do que parece, e dá pra cuidar disso com um plano bem específico pro seu momento.\n\nPra eu te orientar direitinho, o jeito mais rápido é uma ligação de 2 a 3 minutinhos. Consigo te ligar agora, ou fica melhor mais tarde?',
 aqui:{a:'Normalizar o que ele contou.',q:'(implícita) melhor horário.',u:'Atender a ligação.',i:'Plano específico para o momento dele.'},
 op:'Telefone como consequência natural, nunca "agendar uma call comercial".'},
{f:'leads',e:'qualif',dia:'Conversa',canal:'wpp',fonte:'atual',obj:'Pediu o preço de cara: dar o mínimo real e reposicionar',
 texto:'[Nome], eu entendo que você quer saber o preço, já vou te ajudar. A partir de R$ [valor de entrada] você já consegue acessar produtos incríveis nossos. Só que tem projetos muito legais, e eu preciso entender como funciona o seu caso pra te indicar o certo.\n\nSe puder agora, me fala um horário que a gente reserva 2 minutinhos por telefone e eu te explico direitinho. E tenho um presente de boas-vindas pra te dar também.',
 aqui:{a:'Entender a pressa.',q:'(implícita) o caso dele.',u:'Reservar 2 minutos por telefone.',i:'Presente de boas-vindas.'},
 op:'Nunca mandar tabela de preço. Texto resumido da metodologia (Estágio 2). Nunca desmerecer outras academias.'},
{f:'leads',e:'ligacao',dia:'Conversa',canal:'wpp',fonte:'atual',obj:'Recusou a ligação: pedir um áudio',
 texto:'Sem problema! Você pode me mandar um áudio contando um pouco da sua história? Quanto tempo já treinou, o que já tentou antes, qual seu objetivo hoje, assim eu já consigo montar o projeto ideal pra você e te retorno rapidinho.',
 aqui:{a:'Respeitar a escolha.',q:'História e objetivo.',u:'Mandar um áudio.',i:'Projeto ideal e retorno rápido.'},
 op:'Última alternativa antes de insistir na ligação.'},
{f:'leads',e:'ligacao',dia:'Na ligação',canal:'lig',fonte:'atual',obj:'Roteiro da ligação: conectar, qualificar e pré-ancorar',
 texto:'Abertura: Que bom que você conseguiu falar agora comigo, [Nome]! Já vou conseguir te explicar as coisas com calma. Antes de tudo, parabéns pela decisão de dar esse passo, isso já mostra que você tá levando a sério.\n\nQualificação: Deixa eu te fazer uma pergunta: se você pudesse, com uma varinha mágica, melhorar rapidinho alguma coisa, tipo em 21 dias, o que você escolheria: sua disposição e energia, seu sono, sua nutrição, sua imunidade, sua disciplina e foco, ou tem alguma outra coisa que é bem importante pra você agora?\n\nAprofundamento: Isso faz muito sentido. Me conta um pouco mais, isso já vem de quanto tempo? Você já tentou resolver isso de alguma forma antes?\n\nPré-ancoragem: Olha, pelo que você me falou, dá pra montar algo bem específico pro seu momento. Isso aqui, inclusive, é uma das coisas que a gente faz diferente. Faz sentido pra você esse tipo de acompanhamento mais de perto?\n\nTransição: Baseado no que você me contou, eu já sei exatamente o próximo passo certo pra você. Deixa eu te explicar como funciona e a gente já resolve o seu horário.',
 aqui:{a:'Parabéns pela decisão.',q:'Varinha mágica e aprofundamento.',u:'Aceitar o próximo passo.',i:'Acompanhamento de perto, feito para ele.'},
 op:'Toda resposta importante vira uma segunda pergunta. Nenhum preço na ligação. Perfil 5% (decidido): Café/Visita de matrícula. Perfil 95% com qualificação profunda: Experiência.'},
{f:'leads',e:'convite',dia:'Pós-ligação',canal:'wpp',fonte:'atual',obj:'Convite para a Experiência (perfil 95%, qualificação profunda)',
 texto:'[Nome], pelo que você me contou, acho que a melhor forma de você sentir se isso é pra você é vivenciando de verdade, não só ouvindo de mim. Vou te dar a oportunidade de fazer uma Experiência aqui com a gente, pra você ver na prática como funciona. Prefere começar essa semana ou a que vem?',
 var:{
  iniciante:'[Nome], pelo que você me contou, a melhor forma de você se sentir seguro(a) é vivenciando, com alguém do seu lado desde o primeiro treino. Vou te dar a oportunidade de fazer uma Experiência aqui com a gente, com {PRESENTE}. Prefere começar essa semana ou a que vem?',
  outra_academia:'[Nome], pelo que você me contou, o jeito mais justo de comparar é você sentir na prática a diferença de treinar com acompanhamento. Vou te dar a oportunidade de fazer uma Experiência aqui com a gente, começando pela {AVALIACAO}. Prefere começar essa semana ou a que vem?',
  emagrecimento:'[Nome], pelo que você me contou, a melhor forma de você ver que dessa vez vai ser diferente é vivenciando. Vou te dar a oportunidade de fazer uma Experiência aqui com a gente, começando pelo mapeamento da sua saúde, pra montar o caminho certo pro seu objetivo. Prefere começar essa semana ou a que vem?',
  saude:'[Nome], pelo que você me contou, a melhor forma de você se sentir seguro(a) é ver de perto o cuidado que a gente tem com cada aluno. Vou te dar a oportunidade de fazer uma Experiência aqui com a gente, começando por uma avaliação completa. Prefere começar essa semana ou a que vem?',
  performance:'[Nome], pelo que você me contou, a melhor forma de você ver o que dá pra destravar no seu treino é vivenciando. Vou te dar a oportunidade de fazer uma Experiência aqui com a gente, começando pela {AVALIACAO}. Prefere começar essa semana ou a que vem?'
 },
 aqui:{a:'Reconhecer o que ele contou.',q:'(implícita) quando começar.',u:'Escolher a semana.',i:'Vivenciar antes de decidir.'},
 op:'Não queime a Experiência com quem ficou na qualificação rasa. Depois de agendar, siga o funil Experiência → Matrícula.'},
{f:'leads',e:'convite',dia:'Pós-ligação',canal:'wpp',fonte:'atual',obj:'Convite para Café/Visita de matrícula (perfil 5%, decidido)',
 texto:'[Nome], pelo que você me contou, já dá pra gente organizar tudo certinho pro seu caso. Vou te reservar um horário pra você vir aqui, tomar um café com a gente, conhecer a estrutura de perto e a gente já fecha os detalhes do seu projeto. Prefere de manhã ou à tarde essa semana?',
 aqui:{a:'Reconhecer a decisão dele.',q:'(implícita) manhã ou tarde.',u:'Escolher o período.',i:'Projeto fechado e pronto para começar.'},
 op:'Para quem já treina, tem urgência ou já está decidido.'},

{f:'leads',e:'ligacao',t:2,opc:1,dia:'D1',canal:'wpp',fonte:'atual',obj:'Direcionar para a ligação com o presente de boas-vindas',
 texto:'Oi, [Nome]! Passando novamente por aqui 😊 Separei um presente de boas-vindas especial pra você e quero te explicar rapidinho como funciona nossa metodologia. Entendo a correria e quero valorizar seu tempo, consigo ligar rapidinho agora, ou prefere que eu ligue em outro horário? São só 2 a 3 minutinhos, garanto que vai valer a pena.',
 aqui:{a:'Entender a correria.',q:'(implícita) melhor horário.',u:'Topar a ligação.',i:'Presente de boas-vindas.'},
 op:'Gatilho de reciprocidade (presente) e curiosidade.'},
{f:'leads',e:'ligacao',t:2,opc:2,dia:'D1',canal:'audio',fonte:'atual',obj:'Áudio: método, diferenciais e presente',
 texto:'Oi, [Nome]! Passando rapidinho aqui porque quero muito te explicar direitinho como funciona o nosso método, a gente tem alguns diferenciais que fazem toda a diferença no resultado. Ah, e separei um presente de boas-vindas especialmente pra você, quero muito te contar o que é. Consigo ligar agora, ou prefere que eu ligue em outro horário? É rápido, só 2 a 3 minutinhos, e garanto que vai valer a pena.',
 aqui:{a:'Tom próximo.',q:'(implícita) melhor horário.',u:'Topar a ligação.',i:'Presente e diferenciais.'},
 op:'25 a 30 segundos.'},
{f:'leads',e:'ligacao',t:3,opc:1,dia:'D2',canal:'lig',fonte:'atual',obj:'Ligação (presença)',
 texto:'Oi, [Nome]! Aqui é [Seu Nome] da {ACADEMIA}. Consigo falar 2 a 3 minutinhos com você agora? Vi que a gente trocou mensagem e quero entender rapidinho o que te motivou a procurar a gente nesse momento.',
 aqui:{a:'Se apresentar e pedir licença.',q:'O que motivou a procura.',u:'Conversar 2 minutos.',i:'Atenção ao momento dele.'},
 op:'Se atender, siga o Roteiro da ligação (etapa Direcionar para ligação). Se não atender, mande a opção 2.'},
{f:'leads',e:'ligacao',t:3,opc:2,dia:'D2',canal:'wpp',fonte:'atual',obj:'Texto logo depois da ligação não atendida',
 texto:'Oi, [Nome]! Fui eu que te liguei agorinha pouco. Separei um presente de boas-vindas especial pra você e quero te explicar rapidinho como funciona nossa metodologia. Consigo falar com você agora, ou prefere que eu ligue em outro horário? São só 2 a 3 minutinhos.',
 aqui:{a:'Explicar quem ligou.',q:'(implícita) melhor horário.',u:'Responder com um horário.',i:'Presente reservado.'},
 op:'Mandar até 5 minutos depois da ligação perdida.'},
{f:'leads',e:'convite',t:4,opc:1,dia:'D3',canal:'wpp',fonte:'atual',obj:'Conexão: presente reservado e prova social',
 texto:'Oi, [Nome]! Passando pra te lembrar que seu presente de boas-vindas continua reservado. Inclusive, alguns alunos que começaram recentemente comentaram que gostariam de ter conhecido esse processo antes. Consigo ligar rapidinho agora, ou prefere outro horário? Vou te mostrar como funciona.',
 aqui:{a:'Lembrar com leveza.',q:'(implícita) melhor horário.',u:'Topar a ligação.',i:'Prova social de quem começou.'},
 op:'Objetivo do contato: conexão.'},
{f:'leads',e:'convite',t:4,opc:2,dia:'D3',canal:'audio',fonte:'atual',obj:'Áudio: reforço emocional e anuncia a ligação',
 texto:'Oi, [Nome]! Só reforçando aqui: seu presente de boas-vindas ainda tá separado especialmente pra você. A gente tem um jeito bem diferente de acompanhar os alunos, e acho que você vai se identificar bastante com o que construímos. Consigo ligar agora, ou prefere outro horário? São só 2 a 3 minutinhos, prometo ser rápido.',
 aqui:{a:'Tom pessoal.',q:'(implícita) melhor horário.',u:'Topar a ligação.',i:'Identificação com o jeito de acompanhar.'},
 op:'Não repete o texto, complementa.'},
{f:'leads',e:'convite',t:5,opc:1,dia:'D5',canal:'video',fonte:'atual',obj:'Vídeo + texto (autoridade)',
 texto:'Separei um vídeo rapidinho pra você conhecer um pouco mais de como funciona por aqui, [Nome], acho que você vai se identificar com o que a gente construiu. [vídeo]',
 aqui:{a:'Pensar nele ao escolher o vídeo.',q:'(nenhuma)',u:'Assistir.',i:'Identificação.'},
 op:'Vídeo de até 30 segundos: estrutura, metodologia, bastidores ou depoimento.'},
{f:'leads',e:'convite',t:5,opc:2,dia:'D5',canal:'audio',fonte:'novo',obj:'Áudio: a avaliação como presente',
 texto:'Oi, [Nome]! Lembrei de você aqui. Queria te contar que o seu presente é {PRESENTE}. A gente começa pela {AVALIACAO}, e a partir dela monta um treino de verdade, só pra você. Separei dois horários essa semana pra você vir fazer: [dia, hora] ou [dia, hora]. Qual fica melhor?',
 aqui:{a:'Lembrar dele.',q:'(implícita) qual horário.',u:'Escolher um dos dois horários.',i:'Presente concreto: avaliação e plano.'},
 op:'Use quando ele não atende ligação: o convite vai direto para a Experiência, com dois horários.'},
{f:'leads',e:'convite',t:6,opc:1,dia:'D7',canal:'lig',fonte:'atual',obj:'Ligação (compromisso)',
 texto:'Oi, [Nome]! Aqui é [Seu Nome] de novo, da {ACADEMIA}. Queria só confirmar uma coisa com você: esse objetivo que você me contou ainda é prioridade pra esse momento, ou mudou alguma coisa aí?',
 aqui:{a:'Retomar com calma.',q:'O objetivo ainda é prioridade.',u:'Responder sim ou não.',i:'Coerência com o que ele mesmo disse.'},
 op:'Se o objetivo continua, convide para a Experiência com dois horários.'},
{f:'leads',e:'convite',t:6,opc:2,dia:'D7',canal:'wpp',fonte:'novo',obj:'Texto: o objetivo ainda é prioridade?',
 texto:'Oi, [Nome]! Tentei te ligar agora. Fiquei pensando naquilo que você me contou sobre [objetivo] e queria só entender: isso ainda é prioridade pra você nesse momento?',
 aqui:{a:'Lembrar do que ele contou.',q:'Se o objetivo ainda é prioridade.',u:'Responder.',i:'Ser lembrado pelo objetivo, não pela venda.'},
 op:'Se ainda não houve conversa, troque [objetivo] por "começar a treinar".'},
{f:'leads',e:'convite',t:7,opc:1,dia:'D9',canal:'wpp',fonte:'atual',obj:'Reaproximação',
 texto:'Oi, [Nome]! Algumas conversas acontecem exatamente no momento certo, por isso resolvi passar aqui de novo antes de encerrar seu acompanhamento inicial. Consigo ligar rapidinho agora, ou prefere outro horário?',
 aqui:{a:'Leveza.',q:'(implícita) melhor horário.',u:'Topar a ligação.',i:'Momento certo.'},
 op:'Objetivo do contato: reaproximação.'},
{f:'leads',e:'convite',t:7,opc:2,dia:'D9',canal:'audio',fonte:'novo',obj:'Áudio: um passo pequeno',
 texto:'Oi, [Nome], tudo bem? Sei que a rotina aperta, então pensei num passo bem pequeno: você vem aqui uns 30 minutinhos, faz o seu mapeamento, e sai sabendo exatamente por onde começar. Sem compromisso nenhum com nada. Tenho [dia, hora] ou [dia, hora], qual fica melhor pra você?',
 aqui:{a:'Reconhecer a rotina.',q:'(implícita) qual horário.',u:'Vir fazer o mapeamento.',i:'Sair sabendo por onde começar.'},
 op:'Baixo atrito: o pedido é só o mapeamento.'},
{f:'leads',e:'convite',t:8,opc:1,dia:'D11',canal:'video',fonte:'atual',obj:'Vídeo + texto (prova social)',
 texto:'Separei mais um vídeo que acho que você vai gostar de ver, [Nome], muita gente que treina com a gente hoje começou exatamente como você: com uma dúvida e uma mensagem. [vídeo]',
 aqui:{a:'Pensar nele.',q:'(nenhuma)',u:'Assistir.',i:'Gente como ele que começou.'},
 op:'Vídeo com aluno, ambiente ou depoimento parecido com o perfil do lead.'},
{f:'leads',e:'convite',t:8,opc:2,dia:'D11',canal:'wpp',fonte:'novo',obj:'Texto: história de um aluno parecido',
 texto:'[Nome], lembrei de você hoje. A [nome do aluno] chegou aqui com um objetivo bem parecido com o seu e hoje [resultado real dela]. Se quiser, te conto como foi o começo dela. Consigo te ligar amanhã rapidinho?',
 aqui:{a:'Lembrar dele.',q:'(implícita) se quer saber.',u:'Topar a ligação.',i:'Prova social real.'},
 op:'Só use resultado real, com autorização do aluno. Nada de promessa.'},
{f:'leads',e:'convite',t:9,opc:1,dia:'D13',canal:'wpp',fonte:'atual',obj:'Reflexão (só para leads mornos ou quentes)',
 texto:'Só uma reflexão rápida, [Nome]: quantas vezes você já disse pra si mesmo(a) que ia começar "semana que vem"? Consigo te ligar amanhã, ou prefere outro dia? São só 2 minutinhos pra gente conversar sobre isso.',
 aqui:{a:'Tom de conversa.',q:'(implícita) melhor dia.',u:'Topar a ligação.',i:'Começar agora.'},
 op:'Para lead frio, use a opção 2.'},
{f:'leads',e:'convite',t:9,opc:2,dia:'D13',canal:'audio',fonte:'novo',obj:'Áudio: última chance do presente neste ciclo',
 texto:'Oi, [Nome]! Passando pra te contar que estou organizando a agenda das Experiências da semana que vem e queria muito te incluir. O seu presente continua separado. Consigo te encaixar [dia, hora] ou [dia, hora]. Qual fica melhor?',
 aqui:{a:'Pensar nele na agenda.',q:'(implícita) qual horário.',u:'Escolher um horário.',i:'Presente separado.'},
 op:'Sem escassez falsa: só cite agenda que existe.'},
{f:'leads',e:'fim',t:10,opc:1,dia:'D15',canal:'wpp',fonte:'novo',obj:'Encerramento com a porta aberta',
 texto:'Oi, [Nome]! Como a gente não conseguiu conversar, vou dar uma pausa nas mensagens pra não ser mais uma cobrança no seu dia. O seu presente de boas-vindas continua reservado. Quando fizer sentido, é só me chamar aqui que eu te ajudo a começar.',
 aqui:{a:'Respeitar a rotina dele.',q:'(nenhuma)',u:'Chamar quando fizer sentido.',i:'Presente reservado.'},
 op:'Depois: descanso de 30 dias e funil Desconectados. Mova o card para Cadência Futura.'},
{f:'leads',e:'fim',t:10,opc:2,dia:'D15',canal:'audio',fonte:'novo',obj:'Áudio de encerramento',
 texto:'Oi, [Nome]! Passando só pra te dizer que vou dar um tempo nas mensagens, tá? Sei que a rotina às vezes não deixa. Mas o seu presente fica guardado aqui, e no dia que você quiser começar, me chama que eu mesmo(a) te recebo. Um abraço!',
 aqui:{a:'Tom pessoal.',q:'(nenhuma)',u:'Chamar quando quiser.',i:'Recepção pessoal.'},
 op:'Até 20 segundos.'},

// ===== DESCONECTADOS =====
{f:'desc',e:'retomada',t:1,opc:1,dia:'D0',canal:'wpp',fonte:'atual',obj:'Retomada (atenção, nunca "seja bem-vindo")',
 texto:'Nossa conversa ficou pela metade, [Nome], e resolvi aparecer novamente. Como você está?',
 aqui:{a:'Interesse pela pessoa.',q:'Como ele está.',u:'Responder.',i:'Conversa retomada.'},
 op:'Lead que já conversou antes ou voltou do descanso de 30 dias.'},
{f:'desc',e:'retomada',t:1,opc:2,dia:'D0',canal:'audio',fonte:'atual',obj:'Áudio de reconexão com o presente',
 texto:'Oi [nome], tudo bem? Aqui é [seu nome] da {ACADEMIA}. Passando rapidinho porque vi que você se interessou e quero te contar uma coisa importante: nossa academia é diferente das academias convencionais. A gente começa com uma {AVALIACAO}, e a partir disso montamos um planejamento de treino de verdade, totalmente individualizado. Queria muito te garantir o seu presente de boas-vindas: {PRESENTE}. Se você topar, eu te explico rapidinho como funciona. Leva menos de 3 minutinhos. Me chama aqui quando puder!',
 aqui:{a:'Tom pessoal.',q:'(implícita) se topa.',u:'Responder.',i:'Presente concreto.'},
 op:'Áudio do Funil de Reconexão (B.9).'},
{f:'desc',e:'retomada',t:2,opc:1,dia:'D1',canal:'wpp',fonte:'atual',obj:'Presente reservado',
 texto:'Seu presente de boas-vindas continua reservado, [Nome], separei um tempinho essa semana caso você queira retomar essa conversa.',
 aqui:{a:'Lembrar com leveza.',q:'(nenhuma)',u:'Retomar a conversa.',i:'Presente reservado.'},
 op:'Curiosidade.'},
{f:'desc',e:'retomada',t:2,opc:2,dia:'D1',canal:'wpp',fonte:'atual',obj:'Presente com dois horários',
 texto:'Oi [nome]! Consegui separar aqui seu presente de boas-vindas, {PRESENTE}. Vou te explicar rapidinho como funciona e já reservar seu horário. Consigo um encaixe amanhã ou depois, qual fica melhor pra você?',
 aqui:{a:'Algo separado para ele.',q:'(implícita) amanhã ou depois.',u:'Escolher o dia.',i:'Presente concreto.'},
 op:'Use com quem respondeu da outra vez e parou.'},
{f:'desc',e:'retomada',t:3,opc:1,dia:'D2',canal:'video',fonte:'atual',obj:'Prova social',
 texto:'Muita gente que treina com a gente hoje começou de um jeito parecido com o seu, [Nome], com uma pausa no meio do caminho. Separei um vídeo rápido que acho que vai fazer sentido pra você. [vídeo]',
 aqui:{a:'Normalizar a pausa.',q:'(nenhuma)',u:'Assistir.',i:'Gente como ele.'},
 op:'Vídeo curto de aluno real.'},
{f:'desc',e:'retomada',t:3,opc:2,dia:'D2',canal:'audio',fonte:'novo',obj:'Áudio: sem pressão',
 texto:'Oi, [Nome]! Só passando pra dizer que não tem pressa nenhuma, tá? Muita gente que hoje treina aqui demorou um tempinho pra dar o primeiro passo. Quando você quiser, a gente começa devagar, no seu ritmo. Me conta como estão as coisas por aí?',
 aqui:{a:'Tirar a pressão.',q:'Como estão as coisas.',u:'Responder.',i:'Começar no ritmo dele.'},
 op:'Até 25 segundos.'},
{f:'desc',e:'retomada',t:4,opc:1,dia:'D4',canal:'wpp',fonte:'atual',obj:'Convite com novidade como gancho',
 texto:'Tenho a impressão que você vai gostar de uma novidade que estamos preparando por aqui, [Nome]. Consigo te ligar amanhã rapidinho pra te contar, ou prefere outro horário? São só 2 a 3 minutinhos.',
 aqui:{a:'Pensar nele.',q:'(implícita) melhor horário.',u:'Topar a ligação.',i:'Novidade.'},
 op:'Só use se houver novidade real (turma, horário, equipamento, evento).'},
{f:'desc',e:'retomada',t:4,opc:2,dia:'D4',canal:'lig',fonte:'atual',obj:'Ligação de retomada',
 texto:'Consigo te ligar amanhã rapidinho, [Nome], ou prefere outro horário? São só 2 a 3 minutinhos, só pra retomarmos essa conversa com calma.',
 aqui:{a:'Calma.',q:'(implícita) melhor horário.',u:'Atender.',i:'Conversa com calma.'},
 op:'Se atender, siga o Roteiro da ligação.'},
{f:'desc',e:'penultima',t:5,opc:1,dia:'D5',canal:'wpp',fonte:'atual',obj:'Penúltima: avisa que o contato vai diminuir',
 texto:'Oi, [Nome]. Percebi que a rotina tá bem corrida pra você conversar comigo agora, e tudo bem, eu não quero ser mais uma cobrança no seu dia. A partir de agora vou dar mais espaço, mas o seu presente de boas-vindas continua reservado.',
 aqui:{a:'Respeitar a rotina.',q:'(nenhuma)',u:'(nenhuma, só avisar)',i:'Presente reservado.'},
 op:'Bloco B.10, usado no fim de qualquer cadência.'},
{f:'desc',e:'penultima',t:5,opc:2,dia:'D5',canal:'audio',fonte:'novo',obj:'Penúltima em áudio',
 texto:'Oi, [Nome]! Percebi que a rotina tá puxada aí, e tudo bem. Vou dar mais espaço por aqui, não quero ser mais uma cobrança no seu dia. Só queria que você soubesse que o seu presente continua guardado.',
 aqui:{a:'Respeitar a rotina.',q:'(nenhuma)',u:'(nenhuma, só avisar)',i:'Presente guardado.'},
 op:'Até 20 segundos.'},
{f:'desc',e:'ultima',t:6,opc:1,dia:'D7',canal:'wpp',fonte:'atual',obj:'Última: despedida real com a porta aberta',
 texto:'Oi, [Nome]. Como a gente não conseguiu se falar, entendo que agora não é prioridade pra você, e tudo bem. O importante é que eu não vou desistir de você: quando fizer sentido, é só me chamar que eu vou estar aqui pra te ajudar.',
 aqui:{a:'Aceitar o momento dele.',q:'(nenhuma)',u:'Chamar quando fizer sentido.',i:'Porta aberta.'},
 op:'Sem resposta: aguardar cerca de 30 dias antes de nova abordagem.'},
{f:'desc',e:'ultima',t:6,opc:2,dia:'D7',canal:'audio',fonte:'novo',obj:'Última em áudio',
 texto:'Oi, [Nome]! Como a gente não conseguiu se falar, imagino que agora não é o momento, e tá tudo bem. Só não queria sumir sem te dizer que, quando fizer sentido, é só me chamar. Vou estar aqui pra te ajudar. Um abraço!',
 aqui:{a:'Aceitar o momento dele.',q:'(nenhuma)',u:'Chamar quando fizer sentido.',i:'Porta aberta.'},
 op:'Até 20 segundos.'},

// ===== EXPERIÊNCIA → MATRÍCULA =====
{f:'exp',e:'confirma',t:1,opc:1,dia:'Véspera',canal:'wpp',fonte:'atual',obj:'Reforço de valor na véspera',
 texto:'[Nome], lembrei de uma coisa que você me falou sobre [ponto específico que a pessoa mencionou na ligação] e acho que você vai gostar muito do que preparei pra te mostrar sobre isso amanhã. Até lá!',
 aqui:{a:'Lembrar do que ele contou.',q:'(nenhuma)',u:'Vir amanhã.',i:'Algo preparado para ele.'},
 op:'Afirmação, nunca pergunta. Nunca "você vai?" ou "confirma?".'},
{f:'exp',e:'confirma',t:1,opc:2,dia:'Véspera',canal:'audio',fonte:'novo',obj:'Áudio na véspera',
 texto:'Oi, [Nome]! Passando pra te dizer que amanhã já está tudo pronto pra sua Experiência, às [hora]. Já falei com o treinador sobre o seu objetivo, então ele já vai te receber sabendo do seu caso. Vem com roupa confortável e uma garrafinha de água. Te espero aqui!',
 aqui:{a:'Tudo pronto para ele.',q:'(nenhuma)',u:'Vir no horário.',i:'Treinador já sabe do caso dele.'},
 op:'Afirmação. Até 25 segundos.'},
{f:'exp',e:'confirma',t:2,opc:1,dia:'No dia',canal:'wpp',fonte:'atual',obj:'Confirmação no dia (afirmação)',
 texto:'Olá, [Nome]! Passando aqui pra lembrar do nosso compromisso hoje. A gente está muito feliz de poder te receber hoje aqui às [horário]. Já falei com o treinador, inclusive, pra te receber, e a gente preparou algo bem legal aqui. Aproveita e me procura um pouquinho antes desse horário, pra gente tomar um café, eu quero te mostrar uma coisa bem interessante que vai ajudar no seu projeto. Qualquer coisa que precisar, nos avise, estamos te aguardando.',
 aqui:{a:'Feliz em receber.',q:'(nenhuma)',u:'Chegar um pouco antes.',i:'Algo preparado para ele.'},
 op:'Mandar de manhã ou 3 horas antes do horário.'},
{f:'exp',e:'confirma',t:2,opc:2,dia:'No dia',canal:'wpp',fonte:'atual',obj:'Confirmação no dia (versão curta do Kanban)',
 texto:'O seu momento chegou, hoje é o dia!\n\n[Nome], conforme combinamos, estamos te esperando hoje para iniciar sua Experiência. Foi a melhor decisão que você tomou, e pode ficar orgulhoso(a) disso.\n\nVamos começar hoje essa jornada juntos, inclusive, vou te mostrar uma coisa que vai garantir mais segurança e resultados ainda mais rápidos pra você.\n\nTe espero aqui. Qualquer dúvida antes do nosso encontro, é só me chamar. Até mais tarde!',
 aqui:{a:'Celebrar a decisão.',q:'(nenhuma)',u:'Vir hoje.',i:'Segurança e resultado.'},
 op:'Mesmo texto do modo Compromisso do card no Kanban.'},
{f:'exp',e:'durante',t:3,opc:1,dia:'Após o 1º treino',canal:'wpp',fonte:'novo',obj:'Depois do primeiro dia: como se sentiu',
 texto:'[Nome], que alegria ter você aqui hoje! O [nome do treinador] comentou que você mandou muito bem. Como você está se sentindo depois do treino?',
 aqui:{a:'Alegria e elogio real.',q:'Como se sentiu.',u:'Responder.',i:'Reconhecimento do treinador.'},
 op:'Mesmo dia, à noite. Só use elogio que o treinador realmente fez.'},
{f:'exp',e:'durante',t:3,opc:2,dia:'Após o 1º treino',canal:'audio',fonte:'novo',obj:'Áudio depois do primeiro dia',
 texto:'Oi, [Nome]! Passando pra te dar os parabéns pelo primeiro dia. O começo é sempre a parte mais difícil, e você já passou por ela. Amanhã pode ser que o corpo reclame um pouquinho, é normal. Me conta, o que você mais gostou hoje?',
 aqui:{a:'Parabéns pelo primeiro dia.',q:'O que mais gostou.',u:'Responder.',i:'Já passou pela parte difícil.'},
 op:'Até 25 segundos.'},
{f:'exp',e:'durante',t:4,opc:1,dia:'Meio da jornada',canal:'wpp',fonte:'novo',obj:'Check-in no meio da Experiência e consultoria técnica',
 texto:'[Nome], você já está na metade da sua Experiência! Já fez o seu mapeamento? Se já, o próximo passo é a consultoria com o treinador, uns 20 minutinhos na sala de avaliação pra montar o seu plano. Tenho [dia, hora] ou [dia, hora], qual fica melhor?',
 aqui:{a:'Celebrar o avanço.',q:'Se já fez o mapeamento.',u:'Agendar a consultoria.',i:'Plano montado para ele.'},
 op:'Checklist: baixou o app de treino? Fez o mapeamento? Agendou a consultoria técnica?'},
{f:'exp',e:'durante',t:4,opc:2,dia:'Meio da jornada',canal:'video',fonte:'novo',obj:'Vídeo do treinador para o convidado',
 texto:'[Nome], o [nome do treinador] gravou um recadinho pra você 👇 [vídeo]',
 aqui:{a:'Atenção pessoal do treinador.',q:'(nenhuma)',u:'Assistir.',i:'Ser acompanhado de perto.'},
 op:'Vídeo de até 20 segundos do treinador, chamando pelo nome e citando o objetivo dele.'},
{f:'exp',e:'pos',t:5,opc:1,dia:'Fim da Experiência',canal:'wpp',fonte:'novo',obj:'Convite para a conversa de resultado (café)',
 texto:'[Nome], sua Experiência está chegando ao fim, e eu quero muito ouvir como foi pra você. Separei um horário pra gente tomar um café e eu te mostrar o próximo passo do seu projeto. Te espero [dia] às [hora] ou [dia] às [hora]?',
 aqui:{a:'Interesse real em ouvir.',q:'(implícita) qual horário.',u:'Vir para o café.',i:'Próximo passo do projeto dele.'},
 op:'Agendar a conversa presencial antes da Experiência terminar. Etapa no Kanban: Agendada Visita/Matrícula.'},
{f:'exp',e:'pos',t:5,opc:2,dia:'Fim da Experiência',canal:'lig',fonte:'novo',obj:'Ligação de devolutiva',
 texto:'Oi, [Nome]! Aqui é [Seu Nome] da {ACADEMIA}. Tô te ligando porque sua Experiência está terminando e eu queria saber: o que mais fez diferença pra você nesses dias? (ouvir e aprofundar) Que bom! Então vamos fazer assim: te espero [dia] às [hora] pra um café, e eu já te mostro como fica o seu projeto daqui pra frente.',
 aqui:{a:'Ouvir primeiro.',q:'O que mais fez diferença.',u:'Vir para o café.',i:'Projeto daqui para frente.'},
 op:'Faça ele verbalizar o valor. Isso é pré-ancoragem para o fechamento.'},
{f:'exp',e:'fecha',t:6,opc:1,dia:'No café',canal:'presencial',fonte:'atual',obj:'Fechamento presencial: validar, ancorar e convidar',
 texto:'Validação: Me conta, o que mais chamou sua atenção nesses dias com a gente?\n\nAncoragem: Então deixa eu recapitular o que você mesmo(a) validou agora: [método], [acompanhamento], [resultado ou prova social]. Isso tudo, incluindo [item com valor isolado, ex.: avaliação tecnológica], normalmente sairia por mais de R$ [valor de referência]. Só que no nosso projeto principal, você paga bem menos que isso.\n\n(Preencher o Demonstrativo de Planos junto com a pessoa: programa, valor mensal e valor anual com a economia.)\n\nConvite: [Nome], baseado em tudo que a gente conversou, acho que já dá pra gente começar esse projeto hoje mesmo. Vamos fechar?',
 var:{
  iniciante:'Validação: Me conta, como você se sentiu treinando aqui nesses dias?\n\nAncoragem: Então deixa eu recapitular o que você mesmo(a) me disse: [se sentiu acolhido(a)], [o treinador acompanhou de perto], [o que mudou nesses dias]. Isso tudo, incluindo [avaliação e consultoria], normalmente sairia por mais de R$ [valor de referência]. Só que no nosso projeto principal, você paga bem menos que isso.\n\nConvite: [Nome], você já passou pela parte mais difícil, que é começar. Vamos garantir que você continue com esse acompanhamento? Vamos fechar?',
  emagrecimento:'Validação: Me conta, o que você sentiu de diferente nesses dias?\n\nAncoragem: Então deixa eu recapitular o que você mesmo(a) validou: [o plano pro seu objetivo], [o acompanhamento], [a reavaliação pra medir a evolução]. Isso tudo normalmente sairia por mais de R$ [valor de referência]. Só que no nosso projeto principal, você paga bem menos que isso.\n\nConvite: [Nome], resultado de verdade vem da constância, e é por isso que o projeto anual faz tanto sentido pro seu objetivo. Vamos começar hoje?',
  saude:'Validação: Me conta, como você se sentiu com o cuidado que a gente teve com o seu caso?\n\nAncoragem: Então deixa eu recapitular o que você mesmo(a) validou: [a avaliação completa], [o treino adaptado ao seu caso], [o acompanhamento de perto]. Isso tudo normalmente sairia por mais de R$ [valor de referência]. Só que no nosso projeto principal, você paga bem menos que isso.\n\nConvite: [Nome], o mais importante é você continuar com segurança. Vamos fechar o seu projeto hoje?',
  outra_academia:'Validação: Me conta, o que você viu aqui que não tinha onde você treinava?\n\nAncoragem: Então deixa eu recapitular o que você mesmo(a) validou: [avaliação], [planejamento], [acompanhamento]. Comparando com justiça, isso tudo normalmente sairia por mais de R$ [valor de referência]. Só que no nosso projeto principal, você paga bem menos que isso.\n\nConvite: [Nome], baseado em tudo que a gente conversou, acho que já dá pra gente começar esse projeto hoje mesmo. Vamos fechar?',
  performance:'Validação: Me conta, o que a avaliação te mostrou que você não sabia?\n\nAncoragem: Então deixa eu recapitular o que você mesmo(a) validou: [a avaliação], [o planejamento por fases], [as reavaliações]. Isso tudo normalmente sairia por mais de R$ [valor de referência]. Só que no nosso projeto principal, você paga bem menos que isso.\n\nConvite: [Nome], pra evoluir de verdade, o planejamento precisa de tempo. Vamos fechar o projeto anual hoje?'
 },
 aqui:{a:'Ouvir o que ele percebeu.',q:'O que chamou atenção.',u:'Fechar o projeto hoje.',i:'Valor empilhado antes do preço.'},
 op:'Nunca feche em pé no balcão: volte para o café. Comece pelo projeto principal (anual), nunca pelo mais barato. Se disser não, use a técnica Empilhar 3 Nãos (aba Objeções).'},
{f:'exp',e:'fecha',t:6,opc:2,dia:'Após o café',canal:'wpp',fonte:'novo',obj:'Resumo do projeto por escrito, com próximo passo',
 texto:'[Nome], adorei nossa conversa! Como combinamos, aqui vai o resumo do seu projeto:\n\n• Objetivo: [objetivo]\n• Programa: [programa]\n• O que está incluso: [avaliação, consultoria, acompanhamento, reavaliações]\n\nJá deixei sua vaga separada. Te espero [dia] às [hora] pra gente finalizar e você já começar.',
 aqui:{a:'Gratidão pela conversa.',q:'(nenhuma)',u:'Vir finalizar no horário.',i:'Vaga separada e projeto pronto.'},
 op:'Use quando ele pediu para pensar e já havia ancoragem feita. Valor só depois de "o que está incluso".'},
{f:'exp',e:'fecha',t:7,opc:1,dia:'2 dias depois',canal:'wpp',fonte:'novo',obj:'Não fechou: retomar pelo objetivo',
 texto:'Oi, [Nome]! Fiquei pensando na nossa conversa e naquilo que você me disse sobre [objetivo]. O que você sente que ainda falta pra gente começar?',
 aqui:{a:'Lembrar dele e do objetivo.',q:'O que ainda falta.',u:'Responder.',i:'Começar o projeto dele.'},
 op:'A resposta revela a objeção real. Responda pela aba Objeções.'},
{f:'exp',e:'fecha',t:7,opc:2,dia:'2 dias depois',canal:'audio',fonte:'novo',obj:'Áudio: o treinador perguntou por ele',
 texto:'Oi, [Nome]! O [nome do treinador] me perguntou hoje de você, ficou com vontade de continuar o trabalho que vocês começaram. Eu também! Me conta o que ainda tá te segurando, que eu te ajudo a resolver.',
 aqui:{a:'Ele faz falta.',q:'O que está segurando.',u:'Contar a objeção.',i:'Ajuda para resolver.'},
 op:'Só use se o treinador realmente perguntou. Até 20 segundos.'},
{f:'exp',e:'faltou',dia:'No dia',canal:'wpp',fonte:'atual',obj:'Faltou: reagendar rápido',
 texto:'[Nome], vi que a gente não conseguiu se encontrar hoje. Tudo bem por aí? Ainda separei esse momento especial pra você, quero muito que a gente consiga remarcar. Qual desses horários fica melhor: [opção 1] ou [opção 2]?',
 aqui:{a:'Preocupação com ele.',q:'Se está tudo bem.',u:'Escolher novo horário.',i:'Momento especial separado.'},
 op:'Mandar no mesmo dia, até 1 hora depois do horário.'},
{f:'exp',e:'faltou',dia:'No dia',canal:'wpp',fonte:'atual',obj:'Faltou: reconexão (versão do Kanban)',
 texto:'Sentimos sua falta hoje!\n\nImagino que algo tenha surgido de última hora. Quero muito que você não perca essa oportunidade.\n\nSeu projeto continua disponível pra você, não quero que você fique sem viver isso.\n\nConsigo remarcar pra amanhã ou depois, qual funciona melhor pra você?',
 aqui:{a:'Sentimos sua falta.',q:'(implícita) amanhã ou depois.',u:'Remarcar.',i:'Projeto disponível.'},
 op:'Mesmo texto do modo Reconexão do card no Kanban.'},
{f:'exp',e:'faltou',dia:'Avisou antes',canal:'wpp',fonte:'atual',obj:'Avisou que não vai poder ir',
 texto:'Sem problema nenhum, [Nome], imprevistos acontecem. Não quero que você perca esse momento, então vamos já achar um horário melhor pra você. Prefere [opção 1] ou [opção 2]?',
 aqui:{a:'Imprevistos acontecem.',q:'(implícita) qual opção.',u:'Escolher novo horário.',i:'Não perder o momento.'},
 op:'Já ofereça os dois horários na mesma mensagem.'},

// ===== RENOVAÇÃO =====
{f:'renov',e:'planos',t:1,opc:1,dia:'D-15',canal:'wpp',fonte:'atual',obj:'Abrir a conversa sobre os próximos passos',
 texto:'Estava olhando sua jornada por aqui, [Nome], e acho que vale a pena a gente conversar sobre os próximos passos.',
 aqui:{a:'Atenção à jornada dele.',q:'(nenhuma)',u:'Topar a conversa.',i:'Próximos passos.'},
 op:'Nunca "seu plano está vencendo". Planos trimestral, semestral e anual. Mensalista: etapa Mensalista.'},
{f:'renov',e:'planos',t:1,opc:2,dia:'D-15',canal:'audio',fonte:'novo',obj:'Áudio: a evolução até aqui',
 texto:'Oi, [Nome]! Tava olhando aqui a sua evolução desde que você começou, e fiquei muito feliz com o que vi. Queria separar uns minutinhos com você pra gente conversar sobre o que vem pela frente. Quando você vem treinar essa semana?',
 aqui:{a:'Feliz com a evolução.',q:'Quando vem treinar.',u:'Dizer o dia.',i:'O que vem pela frente.'},
 op:'Antes de mandar, veja a última reavaliação para citar algo real.'},
{f:'renov',e:'planos',t:2,opc:1,dia:'D-10',canal:'wpp',fonte:'atual',obj:'Antecipação de valor',
 texto:'Tenho algumas ideias que acho que fazem bastante sentido pro momento que você está vivendo agora, [Nome], quero te mostrar antes de mais nada.',
 aqui:{a:'Pensar no momento dele.',q:'(nenhuma)',u:'Querer ver as ideias.',i:'Ideias para ele.'},
 op:'Curiosidade: não revelar ainda.'},
{f:'renov',e:'planos',t:2,opc:2,dia:'D-10',canal:'wpp',fonte:'novo',obj:'Texto: próxima fase do projeto',
 texto:'[Nome], o treinador e eu já começamos a desenhar a próxima fase do seu projeto, pensando em [objetivo]. Quero te mostrar pessoalmente. Te encontro [dia] antes do seu treino?',
 aqui:{a:'Projeto pensado para ele.',q:'(implícita) se pode no dia.',u:'Encontrar antes do treino.',i:'Próxima fase.'},
 op:'Combine com o treinador antes de mandar.'},
{f:'renov',e:'planos',t:3,opc:1,dia:'D-5',canal:'wpp',fonte:'atual',obj:'Reforço de continuidade',
 texto:'Vou reservar uns minutinhos pra alinharmos como vai ser a continuidade do seu projeto, [Nome], consigo te encontrar essa semana.',
 aqui:{a:'Tempo reservado para ele.',q:'(nenhuma)',u:'Encontrar essa semana.',i:'Continuidade do projeto.'},
 op:'Afirmação, não pergunta.'},
{f:'renov',e:'planos',t:3,opc:2,dia:'D-5',canal:'lig',fonte:'atual',obj:'Ligação de renovação',
 texto:'Acolhimento: Olá, [Nome], tudo bem? Aqui é [Seu Nome] da {ACADEMIA}. Como você está?\nQualificação: Nosso propósito é avançar sempre e te ajudar a inserir novos hábitos, por isso a continuidade do projeto é fundamental.\nÚnica coisa: Como nosso cliente, você tem uma chance exclusiva de renovar e dar upgrade no seu projeto de resultados.\nIncentivo: Que tal agendarmos essa reunião para [dia] às [hora]?',
 aqui:{a:'Como você está.',q:'Continuidade do projeto.',u:'Agendar a conversa.',i:'Upgrade exclusivo.'},
 op:'Bloco B.3 (ligação).'},
{f:'renov',e:'planos',t:4,opc:1,dia:'D-2',canal:'wpp',fonte:'atual',obj:'Convite presencial (café)',
 texto:'Vamos tomar um café antes do seu próximo treino, [Nome]? Acho que essa conversa merece acontecer pessoalmente. Te espero [dia da semana]?',
 aqui:{a:'Conversa que merece atenção.',q:'(implícita) o dia.',u:'Vir para o café.',i:'Conversa pessoal.'},
 op:'Sem resposta: descanso de 15 dias. Vencido há mais de 31 dias vira Rematrícula.'},
{f:'renov',e:'planos',t:4,opc:2,dia:'D-2',canal:'presencial',fonte:'atual',obj:'Conversa presencial de renovação',
 texto:'Acolhimento: Oi, [Nome], que bom ver você aqui! Como estão seus treinos?\nQualificação: Percebi que estamos chegando no momento de planejar a continuidade e gostaria de discutir as melhores opções pra você.\nÚnica coisa: Temos algumas condições especiais para renovação que podem fazer sentido pra você.\nIncentivo: Vamos sentar e conversar sobre como podemos continuar avançando no seu projeto?',
 aqui:{a:'Que bom ver você.',q:'Como estão os treinos.',u:'Sentar para conversar.',i:'Continuar avançando.'},
 op:'Bloco B.4 (presencial). Comece pelo anual.'},
{f:'renov',e:'mensal',dia:'D-5',canal:'wpp',fonte:'novo',obj:'Mensalista: abrir a conversa',
 texto:'Oi, [Nome]! Tava olhando sua evolução aqui e queria separar uns minutinhos pra conversar com você sobre o seu próximo mês. Quando você vem treinar essa semana?',
 aqui:{a:'Atenção à evolução.',q:'Quando vem treinar.',u:'Dizer o dia.',i:'Próximo mês planejado.'},
 op:'Mensalista: só nos últimos 5 dias antes do vencimento.'},
{f:'renov',e:'mensal',dia:'D-3',canal:'presencial',fonte:'novo',obj:'Mensalista: conversa rápida no treino',
 texto:'[Nome], que bom te ver! Rapidinho: como você tá se sentindo com os treinos? (ouvir) Que bom! Olha, quem está nesse ritmo costuma evoluir muito mais com o projeto anual, porque o treinador consegue planejar por fases. Posso te mostrar como fica pra você?',
 aqui:{a:'Que bom te ver.',q:'Como se sente.',u:'Ver a proposta.',i:'Evolução planejada por fases.'},
 op:'Na academia, antes ou depois do treino.'},
{f:'renov',e:'mensal',dia:'D-1',canal:'wpp',fonte:'novo',obj:'Mensalista: véspera do vencimento',
 texto:'[Nome], amanhã começa o seu novo mês com a gente! Já deixei separado o seu próximo passo. Te encontro no seu treino de amanhã pra gente acertar tudo rapidinho.',
 aqui:{a:'Celebrar o novo mês.',q:'(nenhuma)',u:'Encontrar no treino.',i:'Próximo passo separado.'},
 op:'Afirmação: dá como certa a continuidade.'},
{f:'renov',e:'upgrade',dia:'Na conversa',canal:'presencial',fonte:'novo',obj:'Proposta de upgrade para anual',
 texto:'[Nome], olhando tudo que você já conquistou, [conquista real], o que mais faz sentido agora é planejar o ano inteiro. No projeto anual, o treinador monta as fases do seu treino, você tem as reavaliações garantidas e ainda economiza [valor] em relação ao mensal. Vamos garantir isso hoje?',
 aqui:{a:'Reconhecer a conquista.',q:'(nenhuma)',u:'Fechar o anual hoje.',i:'Fases, reavaliações e economia.'},
 op:'Preço sempre como fração do valor empilhado. Se disser não, Empilhar 3 Nãos.'},
{f:'renov',e:'upgrade',dia:'Após a conversa',canal:'wpp',fonte:'atual',obj:'Upgrade por mensagem',
 texto:'Seu próximo passo para o sucesso começa agora! 💪\nOi, [Nome]! Aqui é [Seu Nome] da {ACADEMIA}. Nós sabemos que a continuidade é essencial para alcançar seus objetivos. Responda a esta mensagem para garantir uma condição exclusiva na renovação do seu projeto. Estou muito empolgado(a) para ver você progredir ainda mais!',
 aqui:{a:'Empolgação com o progresso.',q:'(nenhuma)',u:'Responder a mensagem.',i:'Condição exclusiva.'},
 op:'Bloco B.4 (WhatsApp), com os rótulos A/Q/Ú/I tirados do texto.'},

// ===== EX-ALUNOS =====
{f:'ex',e:'reconexao',t:1,opc:1,dia:'D0',canal:'wpp',fonte:'atual',obj:'Reconexão',
 texto:'Seu nome apareceu numa conversa aqui na equipe hoje, [Nome], e resolvi te mandar uma mensagem.',
 aqui:{a:'Ele é lembrado.',q:'(nenhuma)',u:'Responder.',i:'Curiosidade.'},
 op:'Ex-aluno não é lead: é relacionamento interrompido.'},
{f:'ex',e:'reconexao',t:1,opc:2,dia:'D0',canal:'audio',fonte:'novo',obj:'Áudio de reconexão',
 texto:'Oi, [Nome]! Aqui é [Seu Nome] da {ACADEMIA}. Lembrei de você hoje e quis mandar um oi. Como você está? Como andam as coisas por aí?',
 aqui:{a:'Lembrar dele.',q:'Como está.',u:'Responder.',i:'Interesse genuíno.'},
 op:'Nada de oferta no primeiro toque. Até 15 segundos.'},
{f:'ex',e:'pertenca',t:2,opc:1,dia:'D2',canal:'wpp',fonte:'atual',obj:'Pertencimento',
 texto:'Algumas pessoas fazem parte da história da academia mesmo quando estão longe, [Nome], e você é uma delas.',
 aqui:{a:'Ele faz parte.',q:'(nenhuma)',u:'Responder.',i:'Pertencimento.'},
 op:'Se ele responder, pergunte como estão os treinos e o que fez parar, sem cobrança.'},
{f:'ex',e:'pertenca',t:2,opc:2,dia:'D2',canal:'video',fonte:'novo',obj:'Vídeo: o que mudou por aqui',
 texto:'[Nome], muita coisa nova por aqui desde que você treinava com a gente. Separei um vídeo rápido pra você ver 👇 [vídeo]',
 aqui:{a:'Pensar nele.',q:'(nenhuma)',u:'Assistir.',i:'Novidades.'},
 op:'Mostre o que mudou de verdade: equipe, equipamentos, turmas, horários.'},
{f:'ex',e:'convite',t:3,opc:1,dia:'D4',canal:'wpp',fonte:'atual',obj:'Convite para um café',
 texto:'Se fizer sentido pra você, [Nome], gostaria muito de tomar um café e ouvir como as coisas têm sido. Consigo essa semana, qual dia fica melhor?',
 aqui:{a:'Ouvir como ele está.',q:'Qual dia.',u:'Escolher o dia.',i:'Conversa, não venda.'},
 op:'No café: reavaliação de presente e proposta de retorno (rematrícula).'},
{f:'ex',e:'convite',t:3,opc:2,dia:'D4',canal:'lig',fonte:'novo',obj:'Ligação com reavaliação de presente',
 texto:'Oi, [Nome]! Aqui é [Seu Nome] da {ACADEMIA}. Tudo bem? Te liguei porque separei uma reavaliação de presente pra você, pra ver como está o seu corpo hoje comparado com a última vez. Consigo te encaixar [dia, hora] ou [dia, hora]. Qual fica melhor?',
 aqui:{a:'Presente para ele.',q:'(implícita) qual horário.',u:'Vir fazer a reavaliação.',i:'Comparar com a última vez.'},
 op:'A reavaliação vira a conversa de rematrícula.'},
{f:'ex',e:'despedida',t:4,opc:1,dia:'D7',canal:'wpp',fonte:'novo',obj:'Despedida com a porta aberta',
 texto:'[Nome], não quero ser insistente. Só queria que você soubesse que aqui sempre vai ter um lugar pra você. Quando quiser voltar, é só me chamar que eu mesmo(a) organizo tudo.',
 aqui:{a:'Respeitar o momento.',q:'(nenhuma)',u:'Chamar quando quiser.',i:'Lugar garantido.'},
 op:'Sem resposta: descanso de 60 dias.'},
{f:'ex',e:'despedida',t:4,opc:2,dia:'D7',canal:'audio',fonte:'novo',obj:'Despedida em áudio',
 texto:'Oi, [Nome]! Só passando pra dizer que não vou mais te encher de mensagem, tá? Mas a porta aqui tá sempre aberta. Quando der vontade de voltar, me chama. Um abraço!',
 aqui:{a:'Leveza.',q:'(nenhuma)',u:'Chamar quando quiser.',i:'Porta aberta.'},
 op:'Até 15 segundos.'},

// ===== SUCESSO DO CLIENTE =====
{f:'suc',e:'onboarding',t:1,opc:1,dia:'D+3',canal:'wpp',fonte:'atual',obj:'Primeiros dias: proximidade e validar a decisão',
 texto:'Passando pra saber como estão sendo esses primeiros dias, [Nome]. Quero reservar alguns minutinhos pra colocarmos a conversa em dia antes ou depois do seu próximo treino, consigo te encaixar essa semana.',
 aqui:{a:'Interesse nos primeiros dias.',q:'Como estão sendo.',u:'Conversar antes ou depois do treino.',i:'Decisão certa.'},
 op:'Nunca vira pesquisa ou NPS.'},
{f:'suc',e:'onboarding',t:1,opc:2,dia:'D+3',canal:'audio',fonte:'atual',obj:'Áudio das primeiras 48 horas',
 texto:'[Nome], que alegria ter você com a gente! Só passando pra saber como foram esses primeiros dias, e lembrar que qualquer dúvida, é só me chamar.',
 aqui:{a:'Alegria.',q:'Como foram os dias.',u:'Responder.',i:'Apoio sempre que precisar.'},
 op:'Pode ser mandado ainda nas primeiras 48 horas.'},
{f:'suc',e:'onboarding',t:2,opc:1,dia:'D+7',canal:'wpp',fonte:'atual',obj:'Uma semana: primeiras percepções',
 texto:'Os primeiros dias costumam ser os mais importantes, [Nome], por isso quero muito ouvir suas primeiras percepções pessoalmente. Quando vier treinar essa semana, me chama que eu já te encontro por lá.',
 aqui:{a:'Importância dos primeiros dias.',q:'Primeiras percepções.',u:'Chamar no treino.',i:'Atenção pessoal.'},
 op:'Feedback positivo: momento certo para pedir indicação.'},
{f:'suc',e:'onboarding',t:2,opc:2,dia:'D+7',canal:'presencial',fonte:'novo',obj:'Café de feedback na academia',
 texto:'[Nome], uma semana com a gente! Como você tá se sentindo até aqui? (ouvir) Que bom! E me conta, o que mais tem feito diferença pra você?',
 aqui:{a:'Uma semana.',q:'Como se sente e o que faz diferença.',u:'Contar.',i:'Reforçar a boa decisão.'},
 op:'Feedback positivo: siga para a indicação. Negativo: resolva primeiro, nunca peça indicação.'},
{f:'suc',e:'onboarding',t:3,opc:1,dia:'D+15',canal:'wpp',fonte:'atual',obj:'Curiosidade para a próxima etapa',
 texto:'Tenho acompanhado sua jornada por aqui, [Nome], e já tenho alguns pontos legais pra conversarmos. Inclusive, quero te mostrar uma coisa que acho que vai fazer ainda mais sentido pro seu momento. Vou te encontrar no seu próximo treino, combinado?',
 aqui:{a:'Acompanhar a jornada.',q:'(nenhuma)',u:'Encontrar no treino.',i:'Algo para o momento dele.'},
 op:'Prepara terreno para upgrade, consultoria ou indicação.'},
{f:'suc',e:'onboarding',t:3,opc:2,dia:'D+15',canal:'audio',fonte:'novo',obj:'Áudio de 15 dias',
 texto:'Oi, [Nome]! Quinze dias com a gente, hein? O treinador comentou que você tá firme. Já marcou a sua consultoria de acompanhamento? Tenho [dia, hora] ou [dia, hora].',
 aqui:{a:'Celebrar os 15 dias.',q:'Se marcou a consultoria.',u:'Escolher o horário.',i:'Reconhecimento do treinador.'},
 op:'Use se ainda não fez a consultoria técnica.'},
{f:'suc',e:'checkin',t:4,opc:1,dia:'D+30 e a cada mês',canal:'wpp',fonte:'atual',obj:'Check-in genuíno',
 texto:'Oi, [Nome]! Já faz um tempinho que você está com a gente, e eu queria muito saber como está sendo sua experiência até aqui. Tem alguma coisa que a gente pode melhorar?',
 aqui:{a:'Interesse genuíno.',q:'O que melhorar.',u:'Responder.',i:'Ser ouvido.'},
 op:'Registre a resposta no card.'},
{f:'suc',e:'checkin',t:4,opc:2,dia:'D+30 e a cada mês',canal:'presencial',fonte:'novo',obj:'Check-in no treino',
 texto:'[Nome], que bom te ver! Um mês já, né? Me conta, o que você já sente de diferente desde que começou?',
 aqui:{a:'Que bom te ver.',q:'O que mudou.',u:'Contar.',i:'Perceber a própria evolução.'},
 op:'Presencial, rápido, sem atrapalhar o treino.'},
{f:'suc',e:'indicacao',t:5,opc:1,dia:'Após feedback positivo',canal:'wpp',fonte:'atual',obj:'Reforço e abertura para indicação',
 texto:'Fico feliz que esteja gostando, [Nome]! Você conhece alguém que também tá procurando algo parecido? Adoraria poder ajudar essa pessoa também.',
 aqui:{a:'Feliz com o feedback.',q:'Quem também procura.',u:'Indicar alguém.',i:'Ajudar quem ele gosta.'},
 op:'Só depois de feedback positivo.'},
{f:'suc',e:'indicacao',t:5,opc:2,dia:'Após feedback positivo',canal:'audio',fonte:'novo',obj:'Áudio: presente em nome do aluno',
 texto:'Oi, [Nome]! Fiquei muito feliz com o que você me contou. Pensei numa coisa: que tal dar de presente, no seu nome, {PRESENTE} pra alguém que você gosta? Me passa o nome e o WhatsApp de quem você acha que ia gostar, que eu falo que foi você que mandou.',
 aqui:{a:'Feliz com ele.',q:'Quem ele indicaria.',u:'Passar nome e WhatsApp.',i:'Presente no nome dele.'},
 op:'Crie o card da pessoa indicada em Leads Novos, com origem Indicação.'},
{f:'suc',e:'checkin',t:6,opc:1,dia:'Fechamento do ciclo',canal:'wpp',fonte:'atual',obj:'Fechar a conversa com gratidão',
 texto:'Muito obrigado(a) pelo seu tempo, [Nome]! Qualquer coisa que precisar, é só me chamar.',
 aqui:{a:'Gratidão.',q:'(nenhuma)',u:'Chamar quando precisar.',i:'Apoio.'},
 op:'Fecha a sequência de sucesso do cliente.'},
{f:'suc',e:'sumindo',dia:'Dia 1',canal:'wpp',fonte:'atual',obj:'Aluno sem frequência: colocar a conversa em dia',
 texto:'Oi, [Nome]! Estávamos organizando algumas coisas por aqui e percebemos que faz um tempo que a gente não coloca a conversa em dia. Como você está?',
 aqui:{a:'Interesse pela pessoa.',q:'Como está.',u:'Responder.',i:'Conversa em dia.'},
 op:'Gatilho: 7, 10 ou 12 dias sem treinar. Sempre "sentimos sua falta", nunca "volte a treinar".'},
{f:'suc',e:'sumindo',dia:'Dia 2',canal:'audio',fonte:'atual',obj:'Áudio: sobre a pessoa, não sobre o treino',
 texto:'Oi, [Nome]! Passando pra saber mesmo como você está, não é sobre treino agora, é sobre você. Sentimos sua falta por aqui.',
 aqui:{a:'Sentimos sua falta.',q:'Como está.',u:'Responder.',i:'Cuidado com ele.'},
 op:'Humanizar.'},
{f:'suc',e:'sumindo',dia:'Dia 4',canal:'wpp',fonte:'atual',obj:'Curiosidade leve',
 texto:'Uma coisa que eu percebo com quem retorna depois de um tempo parado, [Nome]: o mais difícil é sempre dar o primeiro passo de novo, o resto flui naturalmente.',
 aqui:{a:'Normalizar a pausa.',q:'(nenhuma)',u:'Dar o primeiro passo.',i:'O resto flui.'},
 op:'Sem cobrança.'},
{f:'suc',e:'sumindo',dia:'Dia 5',canal:'wpp',fonte:'atual',obj:'Convite para um café',
 texto:'Vamos tomar um café antes ou depois do seu próximo treino, [Nome]? Vou separar um horário essa semana especialmente pra isso.',
 aqui:{a:'Horário só para ele.',q:'(implícita) quando.',u:'Vir para o café.',i:'Atenção pessoal.'},
 op:'No café: ouvir o motivo e ajustar treino ou horário com o treinador.'}
];

// ---------- OBJEÇÕES (as 18 da Central de Scripts, AQÚI) ----------
const OBJECOES=[
 {"t": "\"Meu filho tem medo de água\"", "m": "Receio da família de que a criança sofra ou traumatize.", "a": "Entendo, é muito comum e mostra o quanto você cuida dele(a).", "q": "Como ele(a) reage hoje quando está na água: chora, trava na borda ou não gosta de molhar o rosto?", "u": "A primeira etapa da nossa metodologia é justamente a adaptação: construir confiança no tempo da criança, com o treinador do lado e sem forçar. Vamos juntos fazer ele(a) se sentir seguro(a).", "i": "Vou reservar a Experiência Acquacel com um treinador que adora esse começo. Prefere [opção 1] ou [opção 2]?"},
 {"t": "\"Ele(a) chora, não vai querer entrar\"", "m": "Medo de passar vergonha ou de ver a criança sofrendo.", "a": "Faz todo sentido se preocupar com isso.", "q": "O choro costuma ser na hora de entrar na água ou na hora de se separar de você?", "u": "O choro no começo faz parte da adaptação, e aqui ele é acolhido com paciência. O treinador conduz no ritmo da criança, e vocês acompanham de perto cada pequena conquista.", "i": "Na Experiência você vai ver como a gente faz isso na prática. Fica melhor [opção 1] ou [opção 2]?"},
 {"t": "\"No frio ele(a) fica doente\"", "m": "Associação de piscina com gripe e resfriado.", "a": "Entendo a preocupação, ainda mais com criança.", "q": "O que mais te preocupa: a temperatura da água, a saída da piscina ou o caminho até em casa?", "u": "Aqui são duas piscinas aquecidas, com dois sistemas de aquecimento, então a água nunca fica sem aquecer. Tem vestiário infantil pra secar e trocar a criança com calma. Se tiver alguma condição de saúde, a orientação é sempre conversar com o pediatra.", "i": "Vem conhecer a estrutura de perto na Experiência, aí você sente a água e o vestiário. Prefere [opção 1] ou [opção 2]?"},
 {"t": "\"Ele(a) é muito pequeno(a), qual a idade certa?\"", "m": "Dúvida se está cedo demais para começar.", "a": "Ótima pergunta, muitos pais têm essa dúvida.", "q": "Quantos meses ou anos ele(a) tem hoje?", "u": "Na nossa metodologia cada faixa de idade tem o seu nível, com atividades pensadas pra fase da criança. O primeiro nível é a adaptação, com muito carinho e segurança.", "i": "Vou te mostrar o nível certo pra idade dele(a) na Experiência. Fica bom [opção 1] ou [opção 2]?"},
 {"t": "\"Vou ver com o pai/a mãe dele(a)\"", "m": "Decisão compartilhada, busca por segurança.", "a": "Perfeito, é uma decisão de vocês dois.", "q": "Quando você contar pra ele(a), o que acha que vai fazer mais sentido sobre a natação da [Criança]?", "u": "Isso mostra o cuidado de vocês. Se ajudar, os dois podem vir juntos na Experiência e ver de perto como funciona.", "i": "Vou deixar um horário reservado pra vocês virem juntos. Fica melhor [opção 1] ou [opção 2]?"},
 {"t": "\"Já fez natação em outro lugar e não deu certo\"", "m": "Medo de frustração e de gastar sem resultado.", "a": "Poxa, entendo, isso desanima mesmo.", "q": "O que você acha que não funcionou daquela vez: a adaptação, a falta de acompanhamento ou não conseguir ver a evolução?", "u": "É exatamente isso que a nossa metodologia resolve: níveis claros, avaliação com o que a criança já conquistou e o próximo passo, e vocês acompanhando tudo.", "i": "Dessa vez vai ser diferente, e você vai ver isso na Experiência. Prefere [opção 1] ou [opção 2]?"},
 {"t": "\"O horário não bate com a escola\"", "m": "Rotina da família apertada.", "a": "Entendo, a rotina com criança é corrida mesmo.", "q": "Ele(a) estuda de manhã ou à tarde? E quais dias ficam mais tranquilos pra vocês?", "u": "A gente monta a natação em volta da rotina de vocês, não o contrário. Vamos achar a turma que encaixa.", "i": "Tenho [opção 1] ou [opção 2], que combinam com o período da escola. Qual fica melhor?"},
 {"t": "\"Está caro\"", "m": "Ainda não percebeu o valor do método.", "a": "Entendo, é um investimento importante pra família.", "q": "Quando você pensa em caro, está comparando com outro lugar ou com o que tinha imaginado investir?", "u": "Aqui a [Criança] não entra só numa aula: entra numa jornada com níveis, avaliações, devolutiva pra família, treinador acompanhando de perto e uma estrutura pensada pra segurança. Vamos ver juntos o projeto que faz sentido pra vocês.", "i": "Vou te mostrar tudo que está incluso, com calma. Consigo agora ou prefere um horário específico?"},
 {"t": "\"Ele(a) já sabe nadar\"", "m": "Acha que não precisa de método.", "a": "Que ótimo, isso já é uma grande conquista!", "q": "O que ele(a) já faz sozinho(a) na água hoje?", "u": "Na avaliação a gente identifica o nível exato dele(a) e o próximo desafio, pra evoluir na técnica, na segurança e na autonomia.", "i": "Na Experiência o treinador já te mostra em que nível ele(a) está. Fica bom [opção 1] ou [opção 2]?"},
 {"t": "\"Vou deixar pro verão\"", "m": "Associa natação só a calor.", "a": "Faz sentido pensar assim, muita gente pensa.", "q": "O que pesa mais agora: o frio, a rotina ou outra coisa?", "u": "Com as piscinas aquecidas, a criança evolui o ano todo e chega no verão muito mais segura e confiante na água.", "i": "Vamos começar a jornada agora pra ele(a) aproveitar o verão já nadando melhor? Tenho [opção 1] ou [opção 2]."},
 {t:'"Está caro"',m:'"Não tenho certeza se vale o investimento" (percepção de custo-benefício).',a:'Entendo que o preço é uma consideração importante para você.',q:'Quando você pensa em caro... você está comparando com outra academia ou com o investimento que imaginava fazer?',u:'Entendo perfeitamente. A diferença é que aqui você não está comprando apenas acesso. Você está entrando em um projeto com acompanhamento e evolução.',i:'Vou te mostrar de perto tudo que está incluso, consigo um horário pra você conhecer a estrutura amanhã ou depois, qual fica melhor pra você?'},
 {t:'"Vou pensar"',m:'O cliente ainda não organizou a decisão.',a:'Perfeito, é natural querer pensar antes de decidir algo importante.',q:'O que você sente que ainda precisa avaliar antes de decidir?',u:'Se te ajudar a pensar com mais clareza, normalmente as pessoas com um objetivo parecido com o seu escolhem o projeto anual justamente para garantir constância.',i:'Vou te ajudar nessa decisão. Separo os pontos principais agora mesmo e já te confirmo um horário pra fecharmos isso juntos essa semana.'},
 {t:'"Vou ver outras academias"',m:'Comparação natural.',a:'Perfeito. Inclusive comparar é importante.',q:'Quando você compara academias, o que costuma olhar primeiro?',u:'(conduzir a comparação para método, acompanhamento e resultado)',i:'Para te ajudar a comparar com justiça, faço questão de te presentear com uma visita guiada e uma consultoria com nosso especialista. Consigo um encaixe amanhã ou depois, qual fica melhor pra você?'},
 {t:'"Preciso falar com meu marido/esposa"',m:'Busca por segurança.',a:'Perfeito, é importante decidir juntos.',q:'Quando você explicar para ele/ela, qual ponto você acha que vai fazer mais sentido?',u:'(o próprio cliente verbaliza o valor de novo, ao responder a pergunta acima)',i:'Vou te mandar agora as informações principais pra vocês decidirem juntos, e já deixo reservado um horário pra confirmarmos, amanhã ou depois?'},
 {t:'"Agora não é um bom momento"',m:'Prioridade emocional baixa.',a:'Entendo, momentos assim acontecem.',q:'O que está acontecendo nesse momento que faz você sentir isso?',u:'E se você deixar para depois, o que pode acontecer com esse objetivo que você comentou?',i:'Justamente por isso quero te ajudar a começar do jeito certo, sem pesar na sua rotina. Vou reservar um horário leve pra você essa semana, prefere de manhã ou à tarde?'},
 {t:'"Já tentei academia antes e não deu certo"',m:'Medo de frustração.',a:'Isso acontece com muita gente.',q:'O que você acha que fez não funcionar daquela vez?',u:'É exatamente por isso que aqui a gente trabalha com acompanhamento.',i:'Dessa vez vai ser diferente, porque você vai ter acompanhamento de verdade. Vou te mostrar como funciona na prática, consigo um horário amanhã, topa?'},
 {t:'"Não sei se vou conseguir manter"',m:'Dúvida sobre disciplina.',a:'Essa dúvida é mais comum do que parece.',q:'O que normalmente faz você parar quando começa?',u:'Aqui a gente acompanha evolução justamente para evitar isso.',i:'Vou te acompanhar de perto justamente pra isso não acontecer de novo. Bora começar com seu plano de adaptação, consigo te encaixar essa semana.'},
 {t:'"Vou começar mês que vem"',m:'Procrastinação elegante.',a:'Faz sentido querer se planejar.',q:'Se você começasse agora, o que mudaria na sua rotina?',u:'Às vezes começar agora ajuda exatamente a criar o ritmo que você comentou que precisa.',i:'Vou garantir sua condição especial agora, pra você não perder isso, e já começamos no seu ritmo, com uma avaliação essa semana.'},
 {t:'"Preciso organizar minhas finanças"',m:'Medo de compromisso.',a:'Entendo, isso é uma preocupação válida.',q:'Hoje o que mais pesa para você quando pensa em investir nisso?',u:'Por isso muita gente prefere o projeto anual, ele acaba sendo o melhor custo-benefício ao longo do ano.',i:'Vou te mostrar as opções que cabem no seu momento agora. Consigo um horário rápido pra vermos isso juntos, amanhã ou depois?'},
 {t:'"Estou só pesquisando"',m:'Fase inicial de decisão.',a:'Perfeito, pesquisar é importante.',q:'O que você espera encontrar em uma academia ideal?',u:'(conectar com os diferenciais da {ACADEMIA} a partir da resposta)',i:'Para te ajudar nessa pesquisa, vou te presentear com um Mapa Completo da Saúde e uma consultoria com nosso especialista, assim você compara com muito mais clareza. Consigo um encaixe amanhã, fico te esperando?'},
 {t:'"A academia X é mais barata"',m:'Comparação superficial.',a:'Pode ser mesmo.',q:'Você chegou a ver se lá também tem acompanhamento e avaliação periódica?',u:'(reposicionar a comparação de preço para valor)',i:'Vou te mostrar tudo que está incluso aqui, pra você comparar com justiça. Consigo um horário pra você conhecer de perto amanhã ou depois.'},
 {t:'"Preciso de mais tempo (para decidir)"',m:'O cliente ainda não se sente seguro.',a:'Sem problema, quero que você decida com segurança.',q:'O que você sente que ainda falta para tomar a decisão?',u:'Se te ajudar, posso revisar rapidamente os pontos que conversamos.',i:'Vou te ajudar a fechar esse ponto com segurança. Reservo 10 minutos pra gente amanhã, pode ser?'},
 {t:'"Não conheço/confio no vendedor"',m:'Confiança é pré-requisito para a decisão.',a:'Entendo que confiar no vendedor é essencial. Por isso, queria que você conhecesse alguns depoimentos de nossos alunos satisfeitos.',q:'Alguns dos nossos alunos também tinham dúvidas no início, mas após experimentar nossos serviços, tiveram transformações incríveis. O que faria você se sentir mais seguro?',u:'Estamos aqui para ajudar você a alcançar seus objetivos com a mesma dedicação que oferecemos a todos os nossos membros.',i:'Vou te apresentar nossa equipe e te mostrar de perto como trabalhamos. Consigo um horário pra você vir conhecer amanhã ou depois?'},
 {t:'"Será que esse método funciona?"',m:'Busca por evidência.',a:'Sei que é importante para você saber se nossos programas realmente funcionam.',q:'Posso compartilhar alguns estudos de caso e depoimentos de alunos que alcançaram resultados incríveis.',u:'Nossos programas são baseados em métodos comprovados e personalizados para atender às suas necessidades.',i:'Vou te mostrar resultados reais de quem já passou por aqui. Vamos marcar a sua Experiência, consigo um encaixe essa semana.'},
 {t:'"Será que funciona para mim?"',m:'Necessidade de personalização.',a:'Entendo que você quer ter certeza de que nossos programas vão funcionar especificamente para você.',q:'Quais são seus objetivos específicos e desafios que você enfrenta atualmente?',u:'Personalizamos nossos programas para atender às suas necessidades únicas, garantindo que você obtenha os melhores resultados possíveis.',i:'Vou montar com você um plano que faz sentido pro seu objetivo. Consigo um horário pra conversarmos sobre isso amanhã ou depois.'},
 {t:'"E se eu não conseguir usar/acompanhar?"',m:'Medo de falhar por falta de suporte.',a:'Entendo que você possa estar preocupado se conseguirá aproveitar da melhor forma.',q:'Quais são suas principais preocupações ou dificuldades quando se trata de frequentar uma academia?',u:'Oferecemos suporte contínuo com treinadores especializados que vão acompanhar seu progresso e ajustar o plano conforme necessário.',i:'Vou te acompanhar de perto desde o primeiro dia, com nossos treinadores especializados. Consigo te encaixar numa sessão de orientação essa semana.'},
 {t:'"E se eu não gostar?"',m:'Risco percebido, reduzido pela experiência direta.',a:'Sei que pode ser difícil decidir sem experimentar antes.',q:'Quais são os aspectos mais importantes para você em uma academia?',u:'Você pode viver a sua Experiência com o presente de boas-vindas, para ver por si mesmo se nossa academia é o lugar certo para você.',i:'Vou te mostrar como é treinar aqui de verdade, já separo a sua Experiência. Consigo começar amanhã ou prefere sexta?'},
 {t:'"Estou sem tempo" (rotina)',m:'Precisa ver que cabe na rotina.',a:'Percebi que você está bastante ocupado ultimamente.',q:'Poderia me contar um pouco mais sobre os horários que você tem disponíveis, mesmo que sejam apenas alguns minutos por dia?',u:'Temos uma série de treinos rápidos e eficientes que podem ser feitos em apenas 20-30 minutos, projetados para ótimos resultados mesmo com tempo limitado.',i:'Vou te mostrar como isso cabe na sua rotina sem pesar. Consigo uma avaliação rápida de 15 minutos, amanhã à noite ou no horário de almoço, qual funciona melhor?'}
];

const NAOS=[
 ['0 · Confirmar a objeção real','Só pra eu te ajudar direito: é mais uma questão de [o que a pessoa apontou, ex.: limite do cartão]? Se eu resolver isso, a gente já avança?'],
 ['1º não · Forma de pagamento (mesmo projeto)','Entendo. Olha, eu não preciso ocupar seu limite inteiro de uma vez. Consigo passar metade agora, te dar um fôlego de [30 a 60] dias, e passar a outra metade depois. Isso resolve?'],
 ['2º não · Projeto alternativo (nunca o mais barato de cara)','Entendo que esse não é o momento certo pra esse projeto específico. Deixa eu te mostrar uma outra opção, um pouco mais enxuta, que também entrega resultado real e cabe melhor nesse momento.'],
 ['3º não · Posicionamento final','[Nome], eu quero muito que você comece com a gente, mas preciso manter esse valor porque é o que garante a qualidade de tudo que a gente te mostrou hoje. Quando fizer sentido pro seu momento, as portas estão sempre abertas.']
];

const ROTINA=[
 ["Experiência Acquacel", "Nunca \"aula experimental\". É sempre a Experiência Acquacel, com presente de boas-vindas para a família: o Guia da Metodologia (em PDF) e o Mapa de saúde para a mãe ou o pai."],
 ["Quando mandar o Guia", "Só para quem agendou a Experiência, junto com a confirmação, pedindo o nome completo e a idade da criança. Mande o PDF direto no WhatsApp, sem pedir para preencher a página de novo."],
 ["Qualificar quem acompanha", "Pergunte se a mãe ou o pai já faz alguma atividade. Já treina: ótimo, registre. Não treina: ofereça o Mapa de saúde e o estúdio de musculação. Anote no card."],
 ["Metodologia em uma frase", "\"Evolução que a família consegue ver.\" 7 níveis, cada um com um mascote do universo aquático, e avaliações com o que a criança já conquistou, o que estamos desenvolvendo e qual é o próximo passo."],
 ["Níveis", "O primeiro nível é a adaptação (Estrelinha do mar, touca branca). Os mascotes incluem Foquinha, Tartaruga, Polvo, Golfinho e Tubarão. Use a sequência oficial dos 7 níveis definida pela equipe técnica."],
 ["Estrutura (o que a família pergunta)", "Duas piscinas aquecidas, com dois sistemas de aquecimento (a água nunca fica sem aquecer), tratamento com ozônio, vestiário infantil e acesso seguro por rampa e escada de alvenaria. Saiba a profundidade e a temperatura de cada piscina antes de atender."],
 ["Virtudes", "Mais do que natação: a cada semana uma virtude é trabalhada com as crianças, e a família recebe o card da virtude com uma dica para casa."],
 ["Saúde", "O questionário de saúde (PAR-Q) é preenchido antes da primeira aula. Criança com febre, diarreia ou vômito fica em casa e remarca. Dúvida médica: orientar a conversar com o pediatra, nunca dar diagnóstico."],
 ["Imagem", "Só use foto ou vídeo de aluno que tem autorização de imagem SIM no cadastro."],
 ["Nunca dizer (natação)", "\"Aula experimental\", comparação entre crianças, medo de afogamento como argumento de venda, promessa de prazo para a criança nadar."],
 ['Quem fala','A consultora, em nome da {ACADEMIA}, pelo WhatsApp da academia. Sempre com o próprio nome.'],
 ['Regras de conversa','AQÚI em todo toque: acolher, uma pergunta, uma única coisa por mensagem, incentivar. Espelhar a resposta antes da próxima pergunta. Sem travessões, frases curtas, tom de WhatsApp.'],
 ['Opção 1 e opção 2','Todo contato da cadência tem duas opções no mesmo dia: a 1 (texto, ligação ou vídeo) e a 2 (áudio ou outro canal). Use a 2 quando a 1 não teve resposta ou como complemento.'],
 ['Próximo passo','Nunca "quer que eu te mande os planos?". Sempre propor horário: dois dias ou dois períodos para escolher.'],
 ['Experiência','Não existe "aula experimental": é a Experiência, jornada de 5 a 12 dias, com presente de boas-vindas ({PRESENTE}). Não queime a Experiência com quem ficou na qualificação rasa.'],
 ['Confirmação','Sempre afirmação, nunca pergunta. Véspera e no dia.'],
 ['Cadências e descanso','Leads novos: 15 dias, 10 contatos, descanso de 30 dias. Desconectados: 7 dias, 6 contatos. Experiência: 5 a 12 dias, 7 contatos. Renovação: D-15 a D-2 (mensalista D-5 a D-1), descanso de 15 dias. Ex-alunos: 7 dias, 4 contatos, descanso de 60 dias.'],
 ['Preço','Nunca mandar tabela. Preço só depois de empilhar valor, sempre começando pelo projeto principal (anual), nunca pelo mais barato.'],
 ['Nunca dizer','"Quer que eu te mande os planos?", "aula experimental", "seu plano está vencendo", "seja bem-vindo" para quem já conversou antes, escassez que não existe.'],
 ['Registro','Todo toque termina com o próximo contato marcado no card do Kanban de Campanhas.'],
 ['Indicadores do dia','Leads novos atendidos, primeiras respostas, ligações feitas, Experiências agendadas e realizadas, matrículas, renovações.']
];

// ---------- RENDER ----------
const st={tab:'mesa',funil:'nat',etapa:null,perfil:'geral',canal:'todos',busca:'',aberto:null};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fill=s=>String(s||'').replaceAll('{ACADEMIA}',CFG.nome).replaceAll('{PRESENTE}',CFG.presente).replaceAll('{AVALIACAO}',CFG.avaliacao);
const textoDe=(s,perfil)=>fill((s.var&&s.var[perfil||st.perfil])||s.texto);
function chip(on,label,onclick){return `<button class="${on?'fa-on':'fa-off'}" onclick="${onclick}">${label}</button>`;}
function aquiBox(a){if(!a)return '';const l=(k,v)=>`<div style="margin-top:3px"><b>${k}</b> ${esc(fill(v))}</div>`;
  return `<div class="fa-aqui"><div style="font-weight:700">Como aplica o AQÚI (não vai na mensagem)</div>${l('A · Acolher:',a.a)}${l('Q · Qualificar:',a.q)}${l('Ú · Única coisa:',a.u)}${l('I · Incentivar:',a.i)}</div>`;}
const opcTag=s=>s.opc?`<span class="fa-tag fa-opc${s.opc}">Opção ${s.opc}</span>`:'';
const fonteTag=s=>s.fonte==='novo'?'<span class="fa-tag fa-novo">novo</span>':'';

function render(){
  const el=document.getElementById('fa-corpo');if(!el)return;
  const tabs=[['mesa','🗂 Scripts por funil'],['obj','🧠 Objeções'],['rotina','📋 Rotina'],['perfis','👤 Perfis']];
  let h=`<div class="fa-row">${tabs.map(([k,l])=>chip(st.tab===k,l,`ftAcademia.tab('${k}')`)).join('')}</div>`;
  if(st.tab==='mesa')h+=mesa();
  if(st.tab==='obj')h+=objecoes();
  if(st.tab==='rotina')h+=rotina();
  if(st.tab==='perfis')h+=perfis();
  el.innerHTML=h;
}

function mesa(){
  const f=FUNIS.find(x=>x.id===st.funil);
  const b=st.busca.toLowerCase();
  const lista=S.filter(s=>s.f===st.funil&&(!st.etapa||s.e===st.etapa)&&(st.canal==='todos'||s.canal===st.canal)&&(!b||(s.obj+' '+textoDe(s)).toLowerCase().includes(b)));
  const contatos=new Set(S.filter(s=>s.f===st.funil&&s.t).map(s=>s.t)).size;
  let h=`<div class="fa-filtros">
    <label>Funil<select onchange="ftAcademia.funil(this.value)">${FUNIS.map(x=>`<option value="${x.id}" ${x.id===st.funil?'selected':''}>${x.nome}</option>`).join('')}</select></label>
    <label>Perfil<select onchange="ftAcademia.perfil(this.value)">${Object.entries(PERFIS).map(([k,m])=>`<option value="${k}" ${k===st.perfil?'selected':''}>${m.nome}</option>`).join('')}</select></label>
    <label>Canal<select onchange="ftAcademia.canal(this.value)"><option value="todos">Todos</option>${Object.entries(CANAIS).map(([k,v])=>`<option value="${k}" ${k===st.canal?'selected':''}>${v}</option>`).join('')}</select></label>
    <label>Buscar<input id="fa-busca" placeholder="palavra do script" value="${esc(st.busca)}" oninput="ftAcademia.busca(this.value)"></label>
  </div>
  <div class="fa-desc">${esc(f.desc)}${contatos?` <b>${contatos} contatos na cadência.</b>`:''}${st.perfil!=='geral'?` <b>· ${esc(PERFIS[st.perfil].nome)}:</b> ${esc(PERFIS[st.perfil].dor)}`:''}</div>
  <div class="fa-row">${chip(!st.etapa,'Todas as etapas','ftAcademia.etapa(null)')}${f.etapas.map(e=>chip(st.etapa===e.id,e.nome,`ftAcademia.etapa('${e.id}')`)).join('')}</div>`;
  if(!lista.length)return h+`<div class="fa-vazio">Nenhum script com esses filtros.</div>`;
  h+=`<div class="fa-tab"><div class="fa-lin fa-cab"><div>Quando</div><div>Canal</div><div>Objetivo</div><div></div></div>`;
  lista.forEach(s=>{
    const idx=S.indexOf(s),open=st.aberto===idx,etapa=f.etapas.find(e=>e.id===s.e);
    const temVar=s.var&&s.var[st.perfil];
    h+=`<div class="fa-item${open?' fa-aberto':''}">
      <div class="fa-lin" onclick="ftAcademia.abrir(${idx})">
        <div><b>${s.t?'Contato '+s.t+' · ':''}${esc(s.dia)}</b><div class="fa-sub">${esc(etapa?etapa.nome:'')}</div></div>
        <div class="fa-canal">${CANAIS[s.canal]||s.canal}</div>
        <div>${opcTag(s)}${esc(s.obj)} ${fonteTag(s)}${st.perfil!=='geral'?`<span class="fa-tag">${temVar?'versão do perfil':'versão geral'}</span>`:''}</div>
        <div class="fa-abrir">${open?'fechar ▴':'abrir ▾'}</div>
      </div>
      ${open?`<div class="fa-det">
        <div class="fa-msg"><button class="fa-copiar" onclick="ftAcademia.copiar(${idx},event)">Copiar</button>
          <div id="fa-txt-${idx}" class="fa-txt">${esc(textoDe(s))}</div></div>
        ${aquiBox(s.aqui)}
        ${s.op?`<div class="fa-op"><b>Orientação:</b> ${esc(fill(s.op))}</div>`:''}
      </div>`:''}
    </div>`;
  });
  return h+`</div><div class="fa-rodape">Troque [Nome], [Seu Nome], [dia], [hora] e [vídeo] antes de enviar. O botão Copiar pega só a mensagem. Marcados como <span class="fa-tag fa-novo">novo</span> foram criados agora e aguardam validação; os demais são os scripts que a academia já usa.</div>`;
}

function objecoes(){
  return `<div class="fa-desc">As objeções mais comuns (as de natação infantil primeiro), no padrão AQÚI. Primeiro acolha e faça a pergunta; só depois da resposta use a Única coisa e o Incentivo.</div>`+OBJECOES.map((o,i)=>`
   <div class="fa-card">
     <div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><b style="font-size:14px">${i+1}. ${esc(o.t)}</b><button class="fa-copiar" style="position:static" onclick="ftAcademia.copiarObj(${i},event)">Copiar</button></div>
     <div class="fa-sub" style="margin:4px 0 8px">O que significa: ${esc(o.m)}</div>
     <div id="fa-obj-${i}" class="fa-txt">${esc(fill(o.a))} ${esc(fill(o.q))}\n\n${esc(fill(o.u))}\n\n${esc(fill(o.i))}</div>
     <div class="fa-aqui"><div><b>A</b> ${esc(fill(o.a))}</div><div><b>Q</b> ${esc(fill(o.q))}</div><div><b>Ú</b> ${esc(fill(o.u))}</div><div><b>I</b> ${esc(fill(o.i))}</div></div>
   </div>`).join('')+
   `<div class="fa-card" style="border-color:var(--fa-cor)"><b style="font-size:14px">Negociação: técnica Empilhar 3 Nãos</b>
     <div class="fa-sub" style="margin:4px 0 8px">Só existe se a ancoragem já foi feita. Nunca revele o plano mais barato primeiro. Avance uma camada por vez e só vá para a próxima se a anterior não resolver.</div>
     ${NAOS.map(([k,v],i)=>`<div style="margin-top:10px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><b>${esc(k)}</b><button class="fa-copiar" style="position:static" onclick="ftAcademia.copiarNao(${i},event)">Copiar</button></div><div id="fa-nao-${i}" class="fa-txt" style="margin-top:4px">${esc(v)}</div></div>`).join('')}
   </div>`;
}
function rotina(){
  return `<div class="fa-tab">`+ROTINA.map(([k,v])=>`<div class="fa-rot"><b>${esc(k)}</b><div>${esc(fill(v))}</div></div>`).join('')+`</div>`;
}
function perfis(){
  const n=k=>S.filter(s=>s.var&&s.var[k]).length;
  return `<div class="fa-desc">Cada perfil pode ter sua própria versão de qualquer script. Onde não houver, vale a versão geral. Este espaço é para irmos completando junto com o gestor.</div>
   <div class="fa-tab">`+Object.entries(PERFIS).filter(([k])=>k!=='geral').map(([k,m])=>`<div class="fa-rot fa-rot3"><b>${esc(m.nome)}</b><div>${esc(m.dor)}</div><button class="fa-off" onclick="ftAcademia.verPerfil('${k}')">${n(k)} script(s) próprio(s)</button></div>`).join('')+`</div>`;
}

function copiarEl(id,ev){ev&&ev.stopPropagation();const t=document.getElementById(id);if(!t)return;
  const ok=()=>{try{toast('Mensagem copiada!')}catch(e){}};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t.innerText).then(ok,ok);else ok();}

const CSS=`#fa-ov{--fa-cor:${CFG.cor};--fa-cort:${CFG.corT};--fa-ontx:${CFG.corTexto};--fa-esc:${CFG.escuro};--fa-fundo:${CFG.fundo};--fa-s1:#fff;--fa-s2:#F1EDED;--fa-bd:rgba(26,26,26,.12);--fa-tx:#1A1A1A;--fa-td:rgba(26,26,26,.62);
position:fixed;inset:0;z-index:2000;background:rgba(10,10,10,.6);display:flex;justify-content:center;align-items:flex-start;padding:24px 16px;overflow-y:auto;font-family:inherit;color:var(--fa-tx)}
#fa-ov *{box-sizing:border-box}
#fa-box{width:100%;max-width:1100px;background:var(--fa-fundo);border-radius:14px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.35)}
#fa-head{background:var(--fa-esc);color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
#fa-head h3{margin:0;font-size:19px;font-weight:800;text-transform:uppercase;letter-spacing:.3px}
#fa-head h3 span{color:#8FB6FF}
#fa-head p{margin:3px 0 0;font-size:12.5px;color:rgba(255,255,255,.7)}
#fa-head button{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:8px;padding:7px 13px;cursor:pointer;font-weight:600;font-size:12.5px}
#fa-corpo{padding:18px 20px}
#fa-ov .fa-row{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
#fa-ov .fa-on,#fa-ov .fa-off{font-size:12px;padding:6px 12px;border-radius:999px;cursor:pointer;font-weight:600;font-family:inherit}
#fa-ov .fa-on{background:var(--fa-cor);color:var(--fa-ontx);border:1px solid var(--fa-cor)}
#fa-ov .fa-off{background:var(--fa-s1);color:var(--fa-tx);border:1px solid var(--fa-bd)}
#fa-ov .fa-off:hover{border-color:var(--fa-cor);color:var(--fa-cort)}
#fa-ov .fa-filtros{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:12px}
#fa-ov .fa-filtros label{font-size:11px;color:var(--fa-td);text-transform:uppercase;letter-spacing:.5px;font-weight:700}
#fa-ov .fa-filtros select,#fa-ov .fa-filtros input{display:block;width:100%;margin-top:4px;padding:8px 10px;border:1px solid var(--fa-bd);border-radius:8px;background:var(--fa-s1);color:var(--fa-tx);font-size:13px;font-family:inherit;text-transform:none;letter-spacing:0;font-weight:400}
#fa-ov .fa-desc{font-size:12.5px;color:var(--fa-td);margin-bottom:12px;line-height:1.5}
#fa-ov .fa-desc b{color:var(--fa-tx)}
#fa-ov .fa-tab{border:1px solid var(--fa-bd);border-radius:10px;overflow:hidden;background:var(--fa-s1)}
#fa-ov .fa-lin{display:grid;grid-template-columns:150px 150px 1fr 70px;gap:10px;padding:11px 12px;cursor:pointer;align-items:center;font-size:13px}
#fa-ov .fa-cab{cursor:default;font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--fa-td);background:var(--fa-s2);font-weight:700}
#fa-ov .fa-item{border-top:1px solid var(--fa-bd)}
#fa-ov .fa-item:hover .fa-lin{background:#FBF9F9}
#fa-ov .fa-aberto{border-left:3px solid var(--fa-cor)}
#fa-ov .fa-sub{font-size:11px;color:var(--fa-td);font-weight:400}
#fa-ov .fa-canal{font-size:12.5px;color:var(--fa-td)}
#fa-ov .fa-abrir{text-align:right;font-size:12px;color:var(--fa-cort);font-weight:600}
#fa-ov .fa-det{padding:0 12px 14px}
#fa-ov .fa-msg{position:relative;background:var(--fa-s2);border:1px solid var(--fa-bd);border-radius:8px;padding:12px 14px}
#fa-ov .fa-txt{white-space:pre-line;font-size:13.5px;line-height:1.55;padding-right:70px}
#fa-ov .fa-copiar{position:absolute;top:8px;right:8px;font-size:11px;padding:5px 11px;background:var(--fa-cor);color:var(--fa-ontx);border:0;border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit}
#fa-ov .fa-aqui{font-size:12px;color:var(--fa-td);padding:9px 11px;border:1px dashed var(--fa-bd);border-radius:8px;margin-top:10px}
#fa-ov .fa-aqui b{color:var(--fa-tx)}
#fa-ov .fa-op{font-size:12px;color:var(--fa-tx);margin-top:8px}
#fa-ov .fa-tag{display:inline-block;margin:0 4px;font-size:10.5px;padding:1px 7px;border-radius:999px;border:1px solid var(--fa-bd);color:var(--fa-td);font-weight:600;vertical-align:1px}
#fa-ov .fa-opc1{margin-left:0;background:var(--fa-esc);color:#fff;border-color:var(--fa-esc)}
#fa-ov .fa-opc2{margin-left:0;background:#fff;color:var(--fa-cort);border-color:var(--fa-cor)}
#fa-ov .fa-novo{background:#FFF4D6;color:#8A5A00;border-color:#F0D48A}
#fa-ov .fa-vazio{padding:24px;text-align:center;color:var(--fa-td);border:1px dashed var(--fa-bd);border-radius:10px}
#fa-ov .fa-rodape{font-size:11.5px;color:var(--fa-td);margin-top:8px}
#fa-ov .fa-card{border:1px solid var(--fa-bd);border-radius:10px;background:var(--fa-s1);padding:12px 14px;margin-bottom:10px}
#fa-ov .fa-card .fa-txt{padding-right:0}
#fa-ov .fa-rot{display:grid;grid-template-columns:200px 1fr;gap:12px;padding:11px 14px;border-top:1px solid var(--fa-bd);font-size:13px}
#fa-ov .fa-rot:first-child{border-top:0}
#fa-ov .fa-rot3{grid-template-columns:240px 1fr 150px;align-items:center}
@media(max-width:700px){#fa-ov{padding:0}#fa-box{border-radius:0}#fa-corpo{padding:14px 12px}#fa-ov .fa-lin{grid-template-columns:1fr auto}#fa-ov .fa-lin>div:nth-child(2){display:none}#fa-ov .fa-cab{display:none}#fa-ov .fa-lin>div:nth-child(3){grid-column:1/-1;order:3}#fa-ov .fa-rot,#fa-ov .fa-rot3{grid-template-columns:1fr}}`;

function abrir(opts){
  opts=opts||{};
  if(opts.funil&&FUNIS.some(f=>f.id===opts.funil)){st.funil=opts.funil;st.etapa=opts.etapa||null;st.tab='mesa';st.aberto=null;}
  if(opts.tab)st.tab=opts.tab;
  let ov=document.getElementById('fa-ov');
  if(!ov){
    if(!document.getElementById('fa-css')){const c=document.createElement('style');c.id='fa-css';c.textContent=CSS;document.head.appendChild(c);}
    ov=document.createElement('div');ov.id='fa-ov';
    ov.innerHTML=`<div id="fa-box"><div id="fa-head"><div><h3>📚 Biblioteca de scripts · <span>${esc(CFG.nome)}</span></h3><p>Filtre por funil, etapa, canal ou perfil. Clique na linha e copie a mensagem.</p></div><button onclick="fecharBibliotecaAcademia()">✕ Fechar</button></div><div id="fa-corpo"></div></div>`;
    ov.addEventListener('click',e=>{if(e.target===ov)fechar();});
    document.body.appendChild(ov);
  }
  ov.style.display='flex';document.body.style.overflow='hidden';
  render();
}
function fechar(){const ov=document.getElementById('fa-ov');if(ov)ov.style.display='none';document.body.style.overflow='';}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const ov=document.getElementById('fa-ov');if(ov&&ov.style.display!=='none')fechar();}});

window.ftAcademia={
  tab:k=>{st.tab=k;render()},
  funil:v=>{st.funil=v;st.etapa=null;st.aberto=null;render()},
  etapa:v=>{st.etapa=v;st.aberto=null;render()},
  perfil:v=>{st.perfil=v;render()},
  canal:v=>{st.canal=v;st.aberto=null;render()},
  busca:v=>{st.busca=v;clearTimeout(window.__faB);window.__faB=setTimeout(()=>{render();const i=document.getElementById('fa-busca');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},250)},
  abrir:i=>{st.aberto=st.aberto===i?null:i;render()},
  copiar:(i,ev)=>copiarEl('fa-txt-'+i,ev),
  copiarObj:(i,ev)=>copiarEl('fa-obj-'+i,ev),
  copiarNao:(i,ev)=>copiarEl('fa-nao-'+i,ev),
  verPerfil:k=>{st.perfil=k;st.tab='mesa';render()}
};
window.abrirBibliotecaAcademia=abrir;
window.fecharBibliotecaAcademia=fechar;

// Cadência para o card do Kanban de Campanhas: por perfil da campanha,
// lista de contatos (t = 1..N) com a opção 1 e a opção 2.
// Placeholders trocados para {NOME} (padrão do Kanban).
function cadencia(){
  const out={};
  FUNIS.filter(f=>f.perfilKanban).forEach(f=>{
    const ts=[...new Set(S.filter(s=>s.f===f.id&&s.t).map(s=>s.t))].sort((a,b)=>a-b);
    out[f.perfilKanban]=ts.map(t=>{
      const o1=S.find(s=>s.f===f.id&&s.t===t&&s.opc===1),o2=S.find(s=>s.f===f.id&&s.t===t&&s.opc===2);
      const et=f.etapas.find(e=>e.id===o1.e);
      const conv=s=>s&&{tipo:(CANAIS[s.canal]||s.canal).replace(/^\S+\s/,''),texto:fill(s.texto).replaceAll('[Nome]','{NOME}').replaceAll('[nome]','{NOME}'),obj:s.obj,aqui:s.aqui,op:fill(s.op)};
      const c1=conv(o1);
      return Object.assign(c1,{tipo:`${o1.dia} · ${c1.tipo} · ${et?et.nome:''}`,funil:f.id,opcao2:conv(o2)});
    });
  });
  return out;
}
window.FT_ACADEMIA={CFG,PERFIS,CANAIS,FUNIS,S,OBJECOES,NAOS,ROTINA,cadencia,fill};
})();
