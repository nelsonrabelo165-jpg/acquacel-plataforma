-- ============================================================
-- ACQUACEL · COMPLEMENTO DA PLATAFORMA (módulos trazidos da matriz GeFit)
-- Projeto Supabase da Acquacel (oevngnabqlxsensaohdy), prefixo roi_
-- Academia: Acquacel Fitness · id b8ae52d9-ac2d-4785-bd9b-e5ebc9828f9e
--
-- Como rodar: SQL Editor do Supabase da Acquacel > colar tudo > Run.
-- Só CRIA o que falta (if not exists). Não apaga nem altera nenhuma tabela existente.
-- Pode rodar de novo quantas vezes precisar.
-- Módulos: Central de Leads (links, indicação, artes, ocultar), Hub de Pessoas e
-- Briefing respondido pelo gestor. O NPS continua usando roi_nps_respostas (já existe).
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- 2. Central de Leads (links de captação, indicação digital, convite, ranking, sorteio, artes, ocultar)
-- ============================================================
create table if not exists roi_lead_campanhas (
  id uuid primary key default gen_random_uuid(),
  academia_id text references roi_academias(id),
  slug text unique not null,
  nome text not null,
  origem text default 'evento',
  titulo text, subtitulo text, info text, capa_url text, cor text,
  sorteio boolean default false,
  perguntas jsonb default '{"idade":true,"treina":true,"parado":true}'::jsonb,
  ativo boolean default true,
  created_at timestamptz default now()
);
create table if not exists roi_leads (
  id uuid primary key default gen_random_uuid(),
  academia_id text references roi_academias(id),
  campanha_id uuid references roi_lead_campanhas(id) on delete set null,
  campanha_slug text,
  nome text not null,
  whatsapp text, whatsapp_norm text, idade int, treina text, tempo_parado text,
  respostas jsonb default '{}'::jsonb,
  origem text default 'outro',
  utm_source text, utm_medium text, utm_campaign text, utm_content text,
  pagina text, consultora_id text,
  status text default 'novo',
  observacoes text,
  consentimento boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists roi_leads_acad_idx on roi_leads (academia_id, created_at desc);
create index if not exists roi_leads_camp_idx on roi_leads (campanha_id);
create index if not exists roi_leads_wpp_idx on roi_leads (whatsapp_norm);
-- indicação digital
alter table roi_leads add column if not exists codigo text;
alter table roi_leads add column if not exists indicado_por_codigo text;
alter table roi_leads add column if not exists indicado_por_lead uuid;
alter table roi_leads add column if not exists indicado_por_nome text;
create unique index if not exists roi_leads_codigo_uidx on roi_leads (codigo) where codigo is not null;
create index if not exists roi_leads_indicador_idx on roi_leads (indicado_por_codigo);
alter table roi_lead_campanhas add column if not exists indicacao boolean default false;
alter table roi_lead_campanhas add column if not exists codigo_sigla text;
alter table roi_lead_campanhas add column if not exists indicacao_limite timestamptz;
alter table roi_lead_campanhas add column if not exists presentes jsonb;
alter table roi_lead_campanhas add column if not exists convite_img text;
alter table roi_lead_campanhas add column if not exists evento_titulo text;
alter table roi_lead_campanhas add column if not exists evento_texto text;
alter table roi_lead_campanhas add column if not exists evento_mapa text;
alter table roi_lead_campanhas add column if not exists evento_fim timestamptz;
alter table roi_lead_campanhas add column if not exists oferta_ativa boolean default false;
alter table roi_lead_campanhas add column if not exists oferta_titulo text;
alter table roi_lead_campanhas add column if not exists oferta_texto text;
alter table roi_lead_campanhas add column if not exists oferta_mensagem text;
alter table roi_lead_campanhas add column if not exists whatsapp_academia text;
-- artes da campanha
alter table roi_lead_campanhas add column if not exists capa_convidado text;
-- formulários, enriquecimento e envio para campanha
alter table roi_leads add column if not exists cargo text;
alter table roi_leads add column if not exists academia_nome text;
alter table roi_leads add column if not exists cidade text;
alter table roi_leads add column if not exists origem_primeira text;
alter table roi_leads add column if not exists historico jsonb default '[]'::jsonb;
alter table roi_leads add column if not exists card_id uuid;
alter table roi_leads add column if not exists demo boolean default false;
alter table roi_lead_campanhas add column if not exists publico text default 'aluno';
alter table roi_lead_campanhas add column if not exists campos_extra jsonb default '[]'::jsonb;
-- ocultar leads (testes e repetidos saem da lista e do sorteio, sem apagar)
alter table roi_leads add column if not exists oculto boolean default false;

-- Pasta pública de imagens das campanhas (Supabase Storage). Ela já existe no projeto
-- (é da matriz e de todas as academias): aqui só cria se faltar, sem mudar nada nela.
-- As artes da Power Fit ficam na subpasta com o id da academia.
do $$ begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('campanhas', 'campanhas', true, 2097152, array['image/jpeg','image/png','image/webp'])
    on conflict (id) do nothing;
    if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='campanhas_envio') then
      create policy campanhas_envio on storage.objects for insert to anon, authenticated with check (bucket_id = 'campanhas');
    end if;
  end if;
end $$;

-- ============================================================
-- 3. Hub de Pessoas (teste do candidato)
-- ============================================================
create table if not exists roi_pessoas_testes (
  id uuid primary key default gen_random_uuid(),
  academia_id uuid,
  nome text not null,
  cargo text,
  sc jsonb,
  cons numeric,
  respostas jsonb,
  created_at timestamptz not null default now()
);
create index if not exists roi_pessoas_testes_academia_idx on roi_pessoas_testes (academia_id, created_at desc);


-- ============================================================
-- 3. Briefing respondido pelo gestor (briefing-gestora.html)
-- ============================================================
create table if not exists roi_briefing_gestora (academia_id text primary key);
alter table roi_briefing_gestora add column if not exists respostas jsonb default '{}';
alter table roi_briefing_gestora add column if not exists status text default 'rascunho';
alter table roi_briefing_gestora add column if not exists updated_at bigint;

-- ============================================================
-- 4. Acesso: mesmo padrão das demais tabelas roi_ da Acquacel (login próprio, sem Supabase Auth)
--    Só nas tabelas novas deste arquivo.
-- ============================================================
alter table roi_lead_campanhas disable row level security;
alter table roi_leads disable row level security;
alter table roi_pessoas_testes disable row level security;
alter table roi_briefing_gestora disable row level security;

-- Conferência: deve listar as 4 tabelas novas
select tablename from pg_tables where tablename in ('roi_lead_campanhas','roi_leads','roi_pessoas_testes','roi_briefing_gestora') order by 1;
