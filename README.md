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

- ✅ Listagem pública de todos os veículos
- ✅ Autenticação de usuários (Login e Cadastro)
- ✅ Proteção de rotas privadas via Middleware
- ✅ Dashboard privado por usuário
- ✅ Cadastro de veículo vinculado ao usuário autenticado
- ✅ Edição de veículo
- ✅ Exclusão de veículo com dialog de confirmação
- ✅ Upload de imagens no Supabase Storage organizadas por usuário
- ✅ Exclusão automática da imagem ao deletar veículo
- ✅ Row Level Security (RLS) configurado na tabela e no storage
- ✅ Skeleton loading para imagens
- ✅ Estados de loading globais
- ✅ Menu lateral responsivo com Sheet (mobile) e sidebar (desktop)
- ✅ Header dinâmico baseado no estado de autenticação
- ✅ Layout de dashboard separado do layout público

---

## 📦 Próximas Melhorias

- 🔎 Busca e filtros (marca, ano, preço, vendedor)
- 📄 Paginação
- 📄 Página de detalhes do veículo
- 👤 Perfil do vendedor
- 🚀 Deploy em produção