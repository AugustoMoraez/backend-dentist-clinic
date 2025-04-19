fluxo de usuario login

registrar primeiramente -> nome, email, password
joga para pagina que apresenta o plano com o botao que abre a pagina do stripe para fazer a assinatura
Se a resposta for sucesso -> altera no banco de dados a tabela do cliente o subs_status para active



stripe listen --forward-to localhost:3000/webhook