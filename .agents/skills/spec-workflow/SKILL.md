---
name: spec-workflow
description: Preparar e acompanhar especificações de funcionalidades ou mudanças de comportamento do catálogo de veículos, da definição dos contratos à validação da entrega.
---

# Desenvolvimento por especificações

Considere a raiz Git `cars/` como base dos caminhos; a API está em `backend/`. Leia `AGENTS.md`, `docs/product.md` e apenas o código/documentação relacionados à tarefa.

## Preparar a entrega

- Procure uma especificação existente em `docs/specs/` antes de criar outra.
- Use `docs/specs/TEMPLATE.md` para novas funcionalidades; para correções pequenas, uma especificação curta na conversa pode bastar.
- Registre o comportamento atual com evidências, o proposto, o escopo e critérios de aceite. Deixe decisões não resolvidas explícitas.
- Para catálogo web, defina os contratos antes das telas: formato de preço, filtros, paginação, detalhes e erros. Framework frontend, público e requisitos de indexação ainda não foram escolhidos.
- Para busca por IA, defina argumentos inválidos, critérios não suportados e consulta sem filtros. Não confunda o prompt atual com capacidades implementadas.
- Planeje validação reproduzível, identificando efeitos de comandos e dependências externas. Consulte `docs/development.md`.

## Aprovação e execução

Apresente uma especificação concreta para aprovação antes de implementar. Se a tarefa for somente análise, não crie arquivos. Se houver autorização explícita para o mesmo escopo na conversa, use-a sem pedir novamente. Não trate uma aprovação genérica da documentação como aprovação de funcionalidades.

Após aprovação, implemente e valide o escopo sem confirmações para decisões rotineiras. Apresente mudanças materiais de escopo antes de executá-las. Migrations, chamadas pagas e publicação não são autorizadas automaticamente pela aprovação da spec.

## Concluir

Relacione critérios de aceite às evidências reais, registre verificações não realizadas e atualize documentos afetados. Não marque a entrega concluída se critérios obrigatórios permanecerem pendentes. Evite criar documentos separados quando uma spec curta já atende à tarefa.
