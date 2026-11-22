# Convite de Casamento Digital

Projecto estático em HTML5, CSS3 e JavaScript puro. Não necessita de instalação de dependências, servidor ou framework.

## 1. Abrir no VS Code
1. Extraia `convite-casamento.zip`.
2. Abra o VS Code e escolha **File > Open Folder**.
3. Seleccione a pasta `convite-casamento`.
4. Abra `index.html` no navegador. Para uma experiência de desenvolvimento mais cómoda, instale a extensão **Live Server**, clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Também pode abrir `index.html` directamente com duplo clique. O convite, a contagem decrescente e a validação funcionam localmente. Google Fonts e WhatsApp precisam de ligação à Internet.

## 2. Personalizar
Abra `js/script.js` e altere os valores no objecto `CONFIG`:
- `bride` e `groom`: nomes.
- `weddingDate`: data e hora no formato `AAAA-MM-DDTHH:MM:SS`.
- `dateLabel`, `introDateLabel` e `footerDateLabel`: datas apresentadas.
- `ceremony` e `reception`: horas, locais e links do Google Maps.
- `dressCode`: traje.
- `whatsappNumber`: número que receberá as confirmações, com 244 e os 9 dígitos seguintes, sem `+`, espaços ou hífen. Exemplo de formato: `244923456789`.
- `rsvpDeadline`: prazo de confirmação.

### Fotografias
Substitua os ficheiros de exemplo na pasta `images/`, mantendo exactamente estes nomes:
- `casal-principal.jpg`
- `galeria-1.jpg`
- `galeria-2.jpg`
- `galeria-3.jpg`

Use fotografias próprias, optimizadas para a Web (JPG ou WebP). Se ainda não inserir as imagens, aparecem espaços reservados identificados.

### Música
Coloque o vosso ficheiro MP3 em `music/musica.mp3`. O botão de música e o botão de abertura controlam a reprodução. Os navegadores exigem uma interacção do utilizador antes de tocar áudio.

## 3. Como funciona o RSVP
O formulário valida o nome e a escolha de presença, constrói uma mensagem e abre o WhatsApp com o texto pré-preenchido. O convidado ainda precisa de carregar em **Enviar** no WhatsApp. Esta versão não guarda respostas numa base de dados nem envia mensagens silenciosamente. Para recolher confirmações automaticamente num painel, será necessário adicionar um serviço/backend (por exemplo, Supabase ou Firebase).

## 4. Testar no telemóvel
- Com o computador e o telemóvel na mesma rede Wi-Fi, inicie o Live Server.
- Descubra o endereço IP local do computador (`ipconfig` no Windows).
- Abra no telemóvel `http://IP-DO-COMPUTADOR:5500` (a porta pode variar conforme o Live Server).
- Se não abrir, permita o acesso do VS Code/Live Server na Firewall do Windows e confirme que ambos estão na mesma rede.
- Teste a abertura, rolagem, contagem, áudio, links de mapas e formulário RSVP.

## 5. Publicar gratuitamente

### GitHub Pages
1. Crie uma conta em https://github.com e um repositório público, por exemplo `convite-casamento`.
2. Envie todos os ficheiros e pastas do projecto para a raiz do repositório (incluindo `index.html`).
3. No repositório, abra **Settings > Pages**.
4. Em **Build and deployment**, seleccione **Deploy from a branch**.
5. Escolha `main` e `/ (root)`, depois carregue em **Save**.
6. Aguarde a publicação e abra o endereço apresentado pelo GitHub Pages.

### Vercel
1. Crie uma conta em https://vercel.com e ligue-a ao GitHub.
2. Importe o repositório do convite.
3. Como é um site estático, não precisa de Build Command nem Output Directory especial; deixe a configuração padrão ou indique a raiz (`.`).
4. Carregue em **Deploy**. A Vercel disponibiliza um endereço público.

Antes de publicar, confirme que as fotografias e o MP3 estão dentro das respectivas pastas e que o número WhatsApp foi substituído. Não publique dados pessoais que não queira tornar públicos.

## Estrutura
```text
convite-casamento/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   └── (as fotografias do casal)
├── music/
│   └── musica.mp3
└── README.md
```
Convite de casamento digital - projecto publicado com GitHub Pages.
