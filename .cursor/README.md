# Configuração do MCP para este Projeto

Este diretório contém configurações específicas do Cursor MCP para este projeto.

## 📝 Configuração do Supabase MCP

### 1. Obter o Access Token do Supabase

Para usar o MCP do Supabase neste projeto, você precisa de um Personal Access Token:

1. Acesse: https://supabase.com/dashboard/account/tokens
2. Clique em "Generate new token"
3. Dê um nome (ex: "MCP - Projeto Cliente X")
4. Copie o token gerado (começa com `sbp_`)

### 2. Configurar o Token

Edite o arquivo `.cursor/mcp.json` e substitua `SEU_TOKEN_DO_SUPABASE_AQUI` pelo token real:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_seu_token_real_aqui"
      ]
    }
  }
}
```

### 3. Reiniciar o Cursor

Após configurar o token, reinicie o Cursor para que as mudanças tenham efeito.

## ⚠️ Importante

- O arquivo `.cursor/mcp.json` está no `.gitignore` e **NÃO** será commitado
- Cada projeto pode ter seu próprio token do Supabase
- Mantenha o token do cliente específico neste arquivo
- O arquivo `.cursor/mcp.example.json` serve como template

## 🔄 Trabalhando com Múltiplos Projetos

Com esta configuração, cada projeto terá seu próprio MCP do Supabase configurado:

- Projeto A → `.cursor/mcp.json` com token do Cliente A
- Projeto B → `.cursor/mcp.json` com token do Cliente B
- Projeto C → `.cursor/mcp.json` com token do Cliente C

Não precisa mais ficar trocando o arquivo global `~/.cursor/mcp.json`! 🎉

