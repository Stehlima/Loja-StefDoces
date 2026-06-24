# Stef Doces B2B - Landing Page & Lead Generator

🌐 **Site ao Vivo:** [https://stehlima.github.io/Loja-StefDoces/](https://stehlima.github.io/Loja-StefDoces/)
🔗 **Repositório:** [https://github.com/Stehlima/Loja-StefDoces](https://github.com/Stehlima/Loja-StefDoces)

**Conceito**: Uma landing page focada em conversão e automação B2B para uma confeitaria de alto padrão (eventos de grande porte, casamentos e brindes corporativos).

## Diferenciais do Projeto
1. **Design System Premium**: Cores pastéis refinadas (Rosa e Lilás) aliadas a um layout minimalista e expansivo, onde as imagens dos produtos são as verdadeiras protagonistas.
2. **UX Focado em Conversão**: Uso inteligente de espaços em branco, animações (*micro-interactions*) e tipografia elegante.
3. **Automação Front-end (Chatbot de Qualificação)**: Integrado diretamente na tela, emulamos um assistente virtual em Vanilla JavaScript que captura 3 dados cruciais do Lead antes de mostrar o catálogo:
   - Tipo de Evento
   - Data do Evento
   - Volume (Convidados/Kits)
   
Isso filtra curiosos e entrega informações preciosas *pré-qualificadas* para a equipe comercial.

## Integração Back-end (Próximos Passos)
Embora a aplicação atual seja um showcase front-end (HTML/CSS/JS), o fluxo de dados em `app.js` finaliza o processo emulando uma chamada de API. 
*A rota técnica ideal para escalar este sistema B2B inclui:*

- Captura do objeto `leadData` no front-end.
- Disparo de requisição `POST /api/leads` para um backend em **Python (FastAPI ou Flask)**.
- O Back-end salva os dados em um banco de dados (ex: PostgreSQL) e automaticamente integra com um **CRM (HubSpot, Pipedrive)** ou dispara um e-mail formatado via biblioteca como `smtplib` ou SendGrid para a equipe comercial da Stef Doces.

---
