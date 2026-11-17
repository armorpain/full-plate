# Full Plate

Aplicativo mobile feito em React Native (Expo) para o desafio CitizenTech.

## Integrantes

Preencher com nome completo e RM de cada integrante, em ordem alfabética.

## Solução

O Full Plate é uma plataforma de planos mensais em que empresas pagam para que suas sobras limpas de alimentos cheguem a ONGs, bancos de alimentos e cozinhas solidárias, em vez de irem para o aterro. Motoristas certificados fazem o transporte, e todo o caminho fica registrado.

O app tem um seletor de perfil, e cada perfil segue a sua parte da jornada:

- **Empresa:** registra a sobra em um assistente de 3 passos com checklist de sobra limpa, acompanha a coleta e vê o impacto confirmado.
- **ONG:** avalia a oferta com checklist, aceita e confirma o recebimento.
- **Motorista:** vê as rotas, faz o checklist sanitário, confirma a coleta e a entrega.

Os três perfis compartilham os mesmos dados: ao aceitar, coletar e entregar, o status muda em todos e o impacto da empresa aumenta quando a ONG confirma o recebimento. Os dados são simulados.

## Motion design

- Abertura: a seta circular do logo gira e o nome aparece, apresentando a marca.
- Entrada das telas e dos cartões: deslizar e surgir, orientando o olhar.
- Botões: reduzem levemente ao toque, dando retorno da ação.
- Assistente de doação: cada passo entra animado, mostrando o avanço.
- Linha do tempo: a barra de progresso cresce a cada etapa da coleta.
- Contador de impacto: os quilos sobem até o valor final.
- Confirmações: o check cresce e o aparelho vibra de leve.
- Todas as animações são reduzidas quando o usuário ativa "Reduzir movimento" no app ou no sistema.

## Acessibilidade

- Cores com contraste acima de 4,5 para 1, com texto Carvão sobre o laranja.
- Áreas de toque de pelo menos 48 px, bem espaçadas.
- Fonte Atkinson Hyperlegible, com ajuste de tamanho do texto no app e suporte ao tamanho do sistema.
- Estados sempre com ícone e texto, nunca só cor.
- Rótulos de leitor de tela em botões, ícones, checklists e opções.
- Opções de reduzir movimento e alto contraste.
- Linguagem simples e direta.

## ODS

ODS 2 (Fome zero) e ODS 12 (Consumo e produção responsáveis), com apoio aos ODS 13 e 17.

## Como executar

1. Instale o Node.js e o app Expo Go no celular.
2. Na pasta do projeto, rode `npm install`.
3. Rode `npx expo install --fix` para alinhar as versões das bibliotecas ao Expo.
4. Rode `npx expo start` e leia o QR code com o Expo Go.
