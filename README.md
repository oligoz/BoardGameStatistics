# Board Game Statistics

Aplicação full stack para gerenciamento de partidas de jogos de tabuleiro, com cadastro de jogadores, jogos, locais, partidas, classificação por pontuação e integração com dados do BoardGameGeek (BGG).

## Deploy

A aplicação está publicada em:

- https://board-game-statistics.vercel.app

## Visão Geral

O projeto é dividido em duas partes:

- Frontend: React + Vite
- Backend: Django + Django REST Framework

Principais recursos:

- Autenticação por token (Knox)
- Cadastro e listagem de jogadores, jogos e locais
- Criação, edição e listagem de partidas
- Classificação de jogadores por desempenho
- Importação de jogos do BGG via arquivo JSON
- Código de convite para registro de novos usuários

## Stack

### Frontend

- React 19
- Vite 7
- React Router
- Axios
- Bootstrap + CoreUI
- Zustand

### Backend

- Python 3.11+
- Django 6
- Django REST Framework
- django-rest-knox (autenticação)
- django-cors-headers
- SQLite (padrão) ou PostgreSQL (opcional)

## Estrutura do Projeto

```text
BoardGameStatistics/
  backend/   # API Django
  frontend/  # App React
```

## Como Rodar Localmente

## 1) Backend (Django)

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
```

### Variáveis de ambiente do backend

Crie um arquivo .env em backend/ com os valores abaixo:

```env
SECRET_KEY=sua_chave_secreta
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# Banco padrão (sqlite3 ou postgresql)
DATABASE=sqlite3

# Use somente se DATABASE=postgresql
DB_NAME=
DB_USER=
DB_PWD=
DB_HOST=
DB_PORT=
```

Observações:

- Se DATABASE não for definido, o projeto usa sqlite3 por padrão.

Inicie o backend:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API local padrão:

- http://127.0.0.1:8000

## 2) Frontend (React + Vite)

```bash
cd frontend
npm install
```

Crie um arquivo .env em frontend/:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Inicie o frontend:

```bash
npm run dev
```

Frontend local padrão:

- http://127.0.0.1:5173

## Endpoints Principais da API

Autenticação:

- POST /api/auth/register/
- POST /api/auth/login/
- GET /api/auth/user-data/
- POST /api/auth/logout/
- POST /api/auth/logout-all/

Recursos:

- GET /api/jogadores/
- POST /api/jogador/create/
- GET /api/jogos/
- POST /api/jogo/create/
- GET /api/locais/
- POST /api/local/create/
- GET /api/partidas/
- POST /api/partida/create/
- PUT /api/partida/update/{id}/
- DELETE /api/partida/delete/{id}/

BGG e admin:

- GET /api/bgg-jogos/?search=...
- POST /api/bgg-jogo/create/
- GET /api/codigo-convite/

## Importação dos Jogos do BGG

Para que o site funcione corretamente, a tabela de jogos do BGG precisa ser populada antes do uso das funcionalidades que dependem dela.

O backend espera um arquivo JSON enviado para o endpoint `POST /api/bgg-jogo/create/` com uma lista de objetos no formato abaixo:

```json
[
  {
    "id": 224517,
    "name": "Brass: Birmingham",
    "yearpublished": 2018,
    "is_expansion": 0
  },
  {
    "id": 342942,
    "name": "Ark Nova",
    "yearpublished": 2021,
    "is_expansion": 0
  },
  {
    "id": 161936,
    "name": "Pandemic Legacy: Season 1",
    "yearpublished": 2015,
    "is_expansion": 0
  },
  {
    "id": 174430,
    "name": "Gloomhaven",
    "yearpublished": 2017,
    "is_expansion": 0
  }
]
```

O arquivo enviado como exemplo segue exatamente essa estrutura e pode ser usado como referência para preparar novos imports.

Campos esperados:

- `id`: identificador do jogo no BGG
- `name`: nome do jogo
- `yearpublished`: ano de publicação
- `is_expansion`: `0` ou `1`

Esse JSON pode ser gerado a partir do arquivo CSV disponível no dump oficial do BoardGameGeek:

- https://boardgamegeek.com/data_dumps/bg_ranks

## Autenticação

A API usa token Knox no formato abaixo no cabeçalho Authorization:

```text
Authorization: Token <seu_token>
```

No frontend, o token é salvo no localStorage e enviado automaticamente pelo Axios interceptor.

## Sobre o Sistema de Pontuação

A classificação considera a posição final em cada partida:

- Posições superiores recebem pontos positivos.
- Posições inferiores recebem pontos negativos.
- Em empates, os jogadores recebem a média das posições empatadas.

## Observações de Produção

- O frontend está hospedado na Vercel.
- Para ambiente produtivo do backend, configure:
  - DEBUG=False
  - SECRET_KEY forte
  - ALLOWED_HOSTS apropriado
  - Banco PostgreSQL recomendado
  - Política de CORS restritiva
