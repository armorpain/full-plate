# Full Plate

Aplicativo mobile feito em React Native (Expo) para o desafio CitizenTech.

## Integrantes

Felipe Gomes (rm)
Gabriela Guedes (rm567449)
Isabela Almeida (rm)
Victor Nogueira (rm567129)

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

### Pré-requisitos

- Node.js na versão 22 LTS (https://nodejs.org)
- Git
- App Expo Go instalado no celular (Android ou iOS), atualizado
- Celular e computador na mesma rede Wi-Fi

### Passo a passo

1. Clone o repositório:
   `git clone https://github.com/armorpain/full-plate.git`
2. Entre na pasta do projeto:
   `cd full-plate`
3. Instale as dependências:
   `npm install`
4. Inicie o app limpando o cache:
   `npx expo start -c`
5. Leia o QR code com o Expo Go (no iOS, use a câmera do celular).

Importante: não rode `npx expo install --fix`, pois isso altera as versões das bibliotecas definidas no projeto.

### Problemas comuns

- **Erro de `asset-registry` ou de módulo não encontrado:** apague a pasta `node_modules` e rode `npm install` de novo.
- **Erro de plugin do `expo-status-bar` ou "Stripping types":** no PowerShell, rode `$env:NODE_OPTIONS="--no-experimental-strip-types"` e depois `npx expo start -c`.
- **O app não abre no celular:** confirme que o celular e o computador estão na mesma rede Wi-Fi.
