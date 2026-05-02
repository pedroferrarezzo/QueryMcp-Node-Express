# MCP Client - Arquitetura Refatorada

## Estrutura de Diretórios

```
src/
├── index.ts                          # Entry point - Orquestrador principal
├── config/
│   └── env-config.ts                # Validação e exportação de variáveis de ambiente
└── infrastructure/
    ├── input/
    │   └── http/
    │       └── routes/
    │           └── client-routes.ts  # Rotas HTTP (health check, etc)
    ├── output/
    │   ├── langchain/
    │   │   ├── langchain-client.ts   # Factory para criar cliente Langchain/Ollama
    │   │   └── langchain-tools.ts    # Conversão de ferramentas MCP para Langchain
    │   └── mcp/
    │       └── mcp-client.ts         # Factory para criar cliente MCP
    ├── websocket/
    │   └── handlers/
    │       └── websocket-handler.ts  # Handlers de conexão WebSocket e processamento de queries
    └── types/
        └── index.ts                  # Definições de tipos TypeScript
```

## Padrão Arquitetural

O `mcp-client` agora segue o mesmo padrão em camadas do `mcp-server`:

### 1. **Config** (`src/config/`)
- Valida e exporta variáveis de ambiente com Zod
- Centraliza toda configuração da aplicação

### 2. **Infrastructure/Output** (`src/infrastructure/output/`)
Camada de integração com sistemas externos:

- **`langchain/`**: Clientes Langchain
  - `langchain-client.ts`: Cria instância do ChatOllama
  - `langchain-tools.ts`: Converte ferramentas MCP para formato Langchain

- **`mcp/`**: Cliente Model Context Protocol
  - `mcp-client.ts`: Estabelece conexão com MCP Server

### 3. **Infrastructure/Input** (`src/infrastructure/input/`)
Camada de entrada de requisições:

- **`http/routes/`**: Rotas Express
  - `client-routes.ts`: Rotas HTTP (health check, etc)

### 4. **Infrastructure/WebSocket** (`src/infrastructure/websocket/`)
Camada de gerenciamento WebSocket:

- **`handlers/`**: Lógica de conexão e processamento
  - `websocket-handler.ts`: Setup de handlers, processamento de queries do agente

### 5. **Infrastructure/Types** (`src/infrastructure/types/`)
Definições de tipos TypeScript compartilhadas:
- `WebSocketMessage`: Formato de mensagens WebSocket
- `EventStream`: Tipo de stream de eventos Langchain
- `WebSocketConfig`: Configuração do WebSocket

## Flow de Execução

```
index.ts (Entry Point)
  ├─→ Carrega ENV
  ├─→ Cria MCP Client (infrastructure/output/mcp/)
  ├─→ Carrega Ferramentas MCP e converte para Langchain (infrastructure/output/langchain/)
  ├─→ Cria LLM Ollama (infrastructure/output/langchain/)
  ├─→ Cria Express App com Rotas (infrastructure/input/http/)
  ├─→ Cria WebSocket Server
  └─→ Para cada conexão WebSocket:
      └─→ Setup de handlers (infrastructure/websocket/handlers/)
          ├─→ Recebe prompt do cliente
          ├─→ Executa agente Langchain com ferramentas MCP
          └─→ Envia chunks de resposta via WebSocket
```

## Benefícios da Refatoração

✅ **Separação de Responsabilidades**: Cada módulo tem uma função clara
✅ **Reutilização**: Componentes podem ser testados e usados independentemente
✅ **Escalabilidade**: Fácil adicionar novos clientes, handlers ou tipos
✅ **Consistência**: Segue o mesmo padrão do mcp-server
✅ **Manutenibilidade**: Código mais organizado e documentado

## Migração de Código

Os arquivos antigos foram reorganizados:

| Arquivo Antigo | Novo Local |
|---|---|
| `src/services/mcp-client-service.ts` | `src/infrastructure/output/mcp/mcp-client.ts` |
| `src/services/langchain-service.ts` (createLLM) | `src/infrastructure/output/langchain/langchain-client.ts` |
| `src/services/langchain-service.ts` (getLangchainToolsFromMcp) | `src/infrastructure/output/langchain/langchain-tools.ts` |
| `src/services/langchain-service.ts` (processQuery) | `src/infrastructure/websocket/handlers/websocket-handler.ts` |
| `src/index.ts` (lógica WebSocket) | `src/infrastructure/websocket/handlers/websocket-handler.ts` |
| `src/index.ts` (setup Express) | `src/index.ts` (refatorado como orquestrador) |
