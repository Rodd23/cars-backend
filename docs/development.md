# Desenvolvimento

## Ambiente

A raiz Git é `cars/`. Execute os comandos da API a partir de `cars/backend/`. O projeto usa npm e TypeScript ESM. A versão de Node.js, a versão de npm e a versão do servidor PostgreSQL ainda precisam ser definidas. Não infira o runtime a partir de `@types/node`.

As dependências estão declaradas em `package.json` e resolvidas em `package-lock.json`. Instalação ou atualização de dependências não faz parte da entrega inicial de documentação.

## Variáveis de ambiente

`src/config/env.ts` carrega dotenv e valida:

| Variável | Regra |
|---|---|
| `NODE_ENV` | `development`, `production` ou `test`; padrão `development` |
| `PORT` | Inteiro a partir de 1; padrão `3333` |
| `DATABASE_URL` | String não vazia |
| `OPENAI_API_KEY` | String não vazia |
| `OPENAI_MODEL` | String não vazia; modelo não fixado no código |

Não copie valores de `.env` para documentação, logs ou commits. Não há `.env.example` versionado na configuração analisada. Um exemplo sem segredos pode ser proposto em tarefa futura.

## Comandos existentes

| Comando | Efeito |
|---|---|
| `npm run build` | Executa `tsc -p tsconfig.json` e escreve em `dist/` |
| `npm run dev` | Executa `tsx watch src/server.ts`, inicia servidor e carrega configuração |
| `npm run typecheck` | Verifica tipos sem emitir arquivos |
| `npm test` | Executa testes locais do catálogo com node:test e tsx; repositório simulado, sem banco ou OpenAI |

Iniciar o servidor constrói clientes de banco e OpenAI. Chamadas a `POST /cars` gravam no banco; chamadas a `POST /cars/search` acionam OpenAI e banco. `GET /teste` não é um health check dessas dependências.

## Verificação de tipos sem emissão

Com dependências já instaladas, no PowerShell:

```powershell
.\node_modules\.bin\tsc.cmd -p tsconfig.json --noEmit
```

Em ambientes POSIX:

```sh
./node_modules/.bin/tsc -p tsconfig.json --noEmit
```

Esses comandos não são scripts npm existentes. Não iniciam a aplicação nem devem exigir chamadas aos serviços externos.

## Testes e automação

Há sete testes em `backend/tests/catalog.test.ts`, usando `node:test`, Fastify inject e tsx já instalado. Cobrem os novos endpoints GET com repositório simulado e compilação dos filtros SQL. Ainda não há integração com PostgreSQL isolado, linter, formatter ou CI/CD. Não existem scripts `lint`, `format`, `start` ou migrations.

O runtime disponível foi identificado como Node v22.17.0 em `C:\nvm4w\nodejs\node.exe` (link para instalação fora do sandbox). Isso é uma observação do ambiente, não uma versão fixada pelo projeto. Na sessão atual, executar esse runtime exigiu aprovação fora do sandbox. Se `node` não estiver no PATH, é possível executar o typecheck com esse binário e `node_modules/typescript/bin/tsc`, ou os testes com `--import tsx --test tests/catalog.test.ts`, a partir do backend e com a aprovação necessária.

Prioridades propostas: testes do query builder, falhas de interpretação da IA com mocks e contratos HTTP; banco isolado para integração. Escolha de ferramentas, scripts e CI exige implementação própria. Não use banco de produção ou chamadas pagas como validação padrão.

## Banco e migrations

O Drizzle Kit está instalado e configurado para PostgreSQL. Não há procedimento operacional validado para gerar ou aplicar migrations. Antes de executar qualquer operação, identifique o banco alvo, examine o SQL, avalie dados existentes e obtenha autorização específica. Não use `push`, reset ou migrations automaticamente para corrigir erros de ambiente.

## Estado da documentação inicial

Esta configuração foi baseada em leitura do código, manifests e migration. Build, verificação de tipos, servidor e integrações não foram executados como parte dessa análise. Ao realizar validações futuras, registre comando, resultado e limites na especificação correspondente.
