# 🚗 Car Classifieds

Plataforma de anúncios de veículos construída com Next.js e Supabase.

⚠️ Este projeto está em desenvolvimento ativo. Novas funcionalidades e melhorias estão sendo adicionadas progressivamente.

---

## 📌 Visão Geral

Aplicação que permite usuários cadastrarem, editarem, listarem e excluírem anúncios de veículos com upload de imagens armazenadas no Supabase Storage.

O objetivo deste projeto é praticar integração full-stack utilizando ferramentas modernas como Next.js App Router, Supabase e arquitetura baseada em componentes.

---

## 🧰 Tech Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Supabase (Database + Storage + Auth)
- React Hook Form + Controller
- Zod (Validação)

---

## 🚀 Funcionalidades Implementadas

markdown# 🚗 Car Classifieds

Plataforma de anúncios de veículos construída com Next.js e Supabase.

⚠️ Este projeto está em desenvolvimento ativo. Novas funcionalidades e melhorias estão sendo adicionadas progressivamente.

---

## 📌 Visão Geral

Aplicação que permite usuários cadastrarem, editarem, listarem e excluírem anúncios de veículos com upload de imagens armazenadas no Supabase Storage.

O objetivo deste projeto é praticar integração full-stack utilizando ferramentas modernas como Next.js App Router, Supabase e arquitetura baseada em componentes.

---

## 🧰 Tech Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS v4
- shadcn/ui
- Supabase (Database + Storage + Auth)
- React Hook Form + Controller
- Zod (Validação)

---

## 🚀 Funcionalidades Implementadas

### Autenticação
- ✅ Cadastro e login de usuários
- ✅ Proteção de rotas privadas via Middleware
- ✅ Header dinâmico baseado no estado de autenticação

### Anúncios
- ✅ Listagem pública de veículos
- ✅ Página de detalhe do veículo (rota pública e rota do dashboard)
- ✅ Cadastro completo de veículo com dados técnicos, opcionais e imagens
- ✅ Edição de veículo com atualização de imagens
- ✅ Exclusão de veículo com dialog de confirmação
- ✅ Destaque de veículos no dashboard (featured first)

### Imagens
- ✅ Upload de múltiplas imagens organizadas por usuário no Supabase Storage
- ✅ Preview de imagens antes do envio com badge de capa
- ✅ Remoção de imagens individuais no formulário de edição
- ✅ Exclusão automática das imagens no storage ao deletar veículo
- ✅ Exclusão automática das imagens removidas no storage ao editar veículo

### Filtros
- ✅ Filtros na listagem pública com múltipla seleção (marca, combustível, transmissão, categoria, cor)
- ✅ Filtros de range na listagem pública (ano, quilometragem, preço)
- ✅ Filtros no dashboard com seleção única (marca, combustível, transmissão, cor)
- ✅ Filtros de range no dashboard (ano, quilometragem, preço)
- ✅ Filtro mobile via Sheet com contador de filtros ativos
- ✅ Tags de filtros ativos com remoção individual
- ✅ Formatação de inputs de preço (R$) e quilometragem (km) em tempo real

### UI / UX
- ✅ Skeleton loading para imagens
- ✅ Menu lateral responsivo com Sheet (mobile) e sidebar (desktop)
- ✅ Layout de dashboard separado do layout público
- ✅ Página 404 customizada
- ✅ Componentes de formulário reutilizáveis (FormInput, FormSelect, FormSwitch, FormTextarea, FormPriceInput)

### Segurança
- ✅ Row Level Security (RLS) configurado na tabela e no storage

---

## 📦 Próximas Melhorias

- 🖼️ Slide de imagens na página de detalhe do veículo
- 👤 Página de perfil do vendedor
- 📞 Exibição de contato do vendedor na página de detalhe
- 📧 Disparo de e-mails (contato, notificações)
- 🎨 Branding (identidade visual, logo, cores)
- 🖥️ Revisão de layout do dashboard
- 🏠 Revisão de layout da home page
- 📄 Paginação
- 🚀 Deploy em produção