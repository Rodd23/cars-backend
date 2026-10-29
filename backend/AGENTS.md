# Instruções específicas do backend

Leia as [instruções compartilhadas](../AGENTS.md) e a [documentação de desenvolvimento](../docs/development.md). A raiz Git é `cars/`; execute comandos npm e TypeScript neste diretório `backend/`.

- Preserve TypeScript ESM, imports relativos `.js` e as opções estritas do `tsconfig.json`.
- Mantenha rotas, controllers, serviços, repositórios e schemas nas camadas de `src/modules/`.
- Defina tabelas em `src/db/schema/`; não aplique migrations sem autorização específica.
- Derive tipos de Zod quando aplicável e evite reformatação não relacionada.
- Não edite `dist/` e `node_modules/` como fonte.
- Scripts existentes: `npm run dev` inicia servidor; `npm run build` escreve em `dist/`.
- `npm run typecheck` verifica tipos sem emissão; `npm test` executa os testes do catálogo com repositório simulado, sem banco ou OpenAI.
- Typecheck sem emissão: `.\node_modules\.bin\tsc.cmd -p tsconfig.json --noEmit` no PowerShell.
- Use mocks para OpenAI e banco isolado para integração. Não leia `.env` nem chame serviços reais como verificação padrão.

Consulte [README.md](README.md) para a API e [arquitetura](../docs/architecture.md) para limitações existentes. Os contratos aprovados estão em [001-catalogo-web](../docs/specs/001-catalogo-web/spec.md); aprovação não significa implementação concluída.
