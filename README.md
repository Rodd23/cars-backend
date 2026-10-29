# Cars

Catálogo de veículos com backend TypeScript/Fastify e frontend interno planejado.

- [backend/](backend/README.md): API existente, dependências e scripts próprios.
- [Produto](docs/product.md), [arquitetura](docs/architecture.md), [desenvolvimento](docs/development.md) e [roadmap](docs/roadmap.md).
- [AGENTS.md](AGENTS.md): instruções compartilhadas.
- `.agents/skills/`: workflows locais de especificação e revisão.

O frontend ainda não foi criado. A [especificação do catálogo interno](docs/specs/001-catalogo-web/spec.md) está aprovada; implementação e tecnologia frontend permanecem pendentes.

A raiz Git é `cars/`. Execute comandos npm dentro de `backend/`; não há workspace npm na raiz.

A reorganização preservou o histórico sem commits. Até um staging/commit autorizado, o status pode mostrar caminhos antigos removidos e `backend/` não rastreado. Não use reset ou clean para resolver essa transição.