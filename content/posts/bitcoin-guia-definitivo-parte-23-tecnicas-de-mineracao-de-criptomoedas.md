---
title: "Bitcoin : Experiências e técnicas de mineração de criptomoedas"
date: "2014-06-17T06:37:04.000Z"
lastmod: "2022-03-31T11:03:54.000Z"
tags: ["bitcoin", "pt_BR", "mineração", "Altcoins", "Litecoin", "Darkcoin", "P2pool", "Cloud mining", "Solo mining"]
slug: "bitcoin-guia-definitivo-parte-23-tecnicas-de-mineracao-de-criptomoedas"
url: "/bitcoin-guia-definitivo-parte-23-tecnicas-de-mineracao-de-criptomoedas/"
---
Devido à dificuldade de mineração sempre crescente do Bitcoin, esta tarefa tem se tornado uma batalha de gigantes, acabando sendo inviável até mesmo para quem esteja disposto a investir alto em hardware. Neste artigo vou detalhar os princípios de mineração desde o Solo Mining até P2P e Cloud-mining, tomando como base criptomoedas que estão em constante desenvolvimento e permitem você obter lucro minerando até mesmo com aquele seu velho notebook.

Agora que você já possui um bom entendimento sobre a estrutura das criptomoedas, vou detalhar tecnicamente a prática da mineração, a base de conhecimento necessária para minerar qualquer criptomoeda, desde o bitcoin à aquela altcoin de sua escolha.

### Solo mining

> A mineração em “solo” consiste em usar seu poder de processamento local para tentar sozinho decifrar e criar um novo bloco na Blockchain. Todo minerador deve praticar e dominar essa técnica, independente de qual seja seu plano de mineração no futuro.

Ter a capacidade de minerar blocos sozinho é o que todos desejam, afinal é a maior recompensa da mineração. No caso do Bitcoin são 25 BTC por bloco, uma fortuna na cotação atual. Mas por motivos óbvios o Bitcoin não é uma opção de estudo para este tutorial. Então vamos escolher uma Altcoin com dificuldade de mineração bem baixa, o suficiente para você fazer testes até mesmo com sua CPU.

#### Qual é minha capacidade de mineração?

Primeiramente você descobrir sua capacidade de mineração, quantos Hashes por segundo faz seu CPU ou sua GPU(caso possua uma placa de vídeo razoável). Para isso usaremos tabelas prontas, que já possuem um comparativo dos hardwares mais comuns. Essas tabelas são criadas de maneira colaborativa e são sempre atualizadas.

Antes de iniciar, identifique qual Hardware você possui usando o aplicativo CPU-Z.   
![](/content/images/2015/08/image12.png)
*[CPU-Z](http://www.cpuid.com/softwares/cpu-z.html) exibindo detalhes da minha placa de vídeo. No caso, possuo uma placa de vídeo Nvidia GTX 560, usarei ela como exemplo.*

#### Algoritmo de proof-of-work

É algorítmo que define a dificuldade de mineração da criptomoeda. Quando você diz que uma moeda é baseada em Scrypt, está se referindo ao algorítmo de proof-of-work. No momento existem três que se destacaram, SHA-256, Scrypt e X11. Tenha em mente que um é basicamente a evolução do outro.

Agora que já sabemos qual é nosso hardware, o próximo passo é partir para as tabelas comparativas para identificar qual é nossa capacidade de mineração e qual moeda vamos escolher para minerar.

- **SHA-256** (Bitcoin, Namecoin, Devcoin) – <https://en.bitcoin.it/wiki/Mining>*hardware*comparison
- **Scrypt** (Litecoin, Dogecoin, Worldcoin, Fastcoin) – <https://litecoin.info/Mining>*hardware*comparison
- **X11** (Darkcoin, Anonymouscoin) – <https://docs.zoho.com/sheet/published.do?rid=12cbm2fe8ce55abb2476daa0f8c576b442d40&mode=html>

Comparado ao SHA-256, o Scrypt aumenta em 1000x a dificuldade de mineração. Tornando sua mineração com hardwares específicos muito mais complicada e aumentando o custo de produção desses equipamentos, o que dá chances também aos pequenos mineradores. Além disso, o Scrypt também é a base da maioria das Altcoins criadas até o momento, então por esse motivo nossa moeda para o teste de mineração será baseada em Scrypt.

Tabela comparativa, caso não encontre sua placa de vídeo, procure por uma equivalente.   
![](/content/images/2015/08/image13.png)
*Segundo a tabela comparativa, minha GPU faz cerca de 116 Kh/s minerando criptomoedas baseadas em Scrypt.*

Note que a tabela acima também mostra mais duas colunas informando qual aplicativo, sistema operacional e argumentos de configuração usados pelos mineradores.

Lembrando que esse valor é apenas um valor sugerido, sua velocidade de hashing vai depender também do restante de seu hardware e das configurações de tuning(ajustes finos) que você fizer em seu aplicativo de mineração. No meu caso já cheguei a 250kh/s com a GTX 560, como vou mostrar mais abaixo.

#### Escolhendo uma Altcoin para mineração

Já sabemos que nossa capacidade de mineração para Scrypt é de **116Kh/s**.

> Se um hardware faz 116Kh/s minerando Scrypt, então deverá fazer 116Gh/s minerando SHA-256, considerando que é 1000x mais rápido, dificultando a chance de pequenos mineradores conquistarem seus blocos.

Existem diversas ferramentas comparativas que exibem em tempo real a dificuldade de todas as criptomoedas emergentes, e com isso permitem você comparar qual lhe retornará maior lucro naquele momento.

- **[Coinwarz](http://www.coinwarz.com/cryptocurrency/?sha256hr=0.25&sha256p=100.00&sha256pc=0.0000&scrypthr=250.00&scryptp=0.00&scryptpc=0.0000&scryptnhr=45520.00&scryptnp=500.00&scryptnpc=0.0000&x11hr=250.00&x11p=500.00&x11pc=0.0000&keccakhr=45.52&keccakp=500.00&keccakpc=0.0000&quarkhr=45520.00&quarkp=500.00&quarkpc=0.0000&groestlhr=46000000.00&groestlp=500.00&groestlpc=0.0000&sha256c=true&scryptc=true&scryptnc=false&x11c=true&keccakc=false&quarkc=false&groestlc=false&e=Bitstamp)** – Principal ferramenta para esta finalidade. Sempre que uma nova Altcoin é aceita por uma Exchange, ela automaticamente é inserida no banco de dados deste serviço.
- **[Dustcoin mining](http://dustcoin.com/mining)** – Diferente do Coinwarz, essa ferramenta mostra apenas as moedas em destaque no momento numa interface mais user-friendly.

##### Utilizando o Coinwarz para encontrar a melhor moeda para mineração

![](/content/images/2015/08/image14.png)
*Selecione apenas a caixa Scrypt e defina como 0(zero) os custos de energia, pois estamos em uma abordagem educativa e não pretendemos estimar os custos de energia neste momento.*

![](/content/images/2015/08/image15.png)
*Coinwarz exibindo as moedas mais lucrativas para minerar com meu hardware.*

A tabela será automaticamente ordenada destacando moedas que lhe retorna maior lucro neste momento. Ele também exibe uma coluna com o gráfico informando se seu valor nas exchanges está ou não em crescimento, isso é muito importante, pois você pode estar minerando uma moeda indicada como lucrativa hoje e amanha já não estar valendo nada, então fique ligado nas tendências.

A CGA seria a melhor moeda pra minerar e me retornaria `0.44 dólares/dia` (desconsiderando meus gastos de energia elétrica), mas como estamos num exemplo de Solo Mining, vamos ignorar os lucros e escolher uma moeda com dificuldade baixa para gerar um bloco rapidamente e confirmar que realmente estamos minerando corretamente.

> Minha opção foi a Fastcoin, a dificuldade dela é muito baixa 0.4509, seu valor nas exchanges é bem estável, podendo subir no futuro, e imediatamente vai me render `$0.21/dia`.

##### Quanto tempo vou demorar para minerar meu primeiro bloco de Fastcoin?

Agora que já possuímos a dificuldade atual da moeda que decidimos minerar(`0.4509`), e também nossa capacidade de mineração(`116Kh/s`), podemos efetuar um cálculo usando o script abaixo.

- Calculate solo mining – <http://jsfiddle.net/eduncan911/UXJR5/>

Apenas altere os valores dessas duas variáveis e clique Run:   
![](/content/images/2015/08/image16.png)
*Script de cálculo p/ previsão do primeiro bloco em Solo mining.*

Este resultado é uma previsão de quanto tempo vamos demorar para conseguir sozinho minerar um bloco nesta dificuldade, conseguindo nosso primeiro lucro(*share*).

##### Analisando detalhes técnicos da proposta de projeto da criptomoeda

Antes de decidir se minerar essa criptomoeda é realmente uma boa escolha, verifique também sua proposta e detalhes do projeto.

> Todos os anúncios de novas criptomoedas estão centralizados nesta área do fórum **Bitcointalk.org**: <https://bitcointalk.org/index.php?board=159.0>
> ![](/content/images/2015/08/image17.png)
> Anúncio da Fastcoin no fórum bitcointalk.org com os detalhes técnicos da moeda

Logo de cara, notamos que o anúncio da moeda foi feito dia 29 de maio de 2013, É uma proposta interessante, ela pretende ser a mais rápida da rede, tendo sua transação confirmada em apenas 48 segundos. Também notamos que foi bem recebida pela comunidade, pois seu tópico possui mais de 50 páginas de respostas, a maioria positivas.

##### Instalando e configurando a Wallet(carteira)

Acesse o site oficial da criptomoeda e baixe a carteira para seu sistema operacional. A carteira é sempre um fork(versão alterada) da clássica bitcoin-qt, carteira oficial do Bitcoin.   
![](/content/images/2015/08/image19.png)
*Faça o download da Wallet(carteira) e também do Zip contendo o **bootstrap da Blockchain**.*

Na página oficial ou no post de anúncio da criptomoeda, você encontrará também o arquivo de bootstrap da Blockchain disponível p/ download direto ou via Torrent.

> Isso agiliza muito a instalação/sincronia da carteira, pois o `bootstrap.dat` contém a Blockchain parcialmente sincronizada, com ele sua carteira não precisará fazer download de bloco por bloco desde o início da moeda. (mais detalhes sobre seu uso abaixo).

###### Diretório de criptomoedas

Crie então o diretório `c:\cryptos` na raiz de seu sistema, e instale dentro dele a wallet que acabou de baixar (nele também ficará localizada todas as futuras criptomoedas que pretende minerar).   
![](/content/images/2015/08/image20.png)
*Fastcoin-qt devidamente instalada.*

Agora, dentro do diretório onde foi instalada a wallet `c:\cryptos\fastcoin`, usando o `Nootepad` crie dois arquivos com o conteúdo abaixo...

###### conf.conf

O arquivo `conf.conf` vai conter todas as configurações necessárias para rodar a carteira para receber conexões do aplicativo de mineração. Copie e cole o conteúdo abaixo, ele é padrão e serve para minerar qualquer moeda.

```
listen=1  
daemon=1  
server=1  
rpcuser=myus  
rpcpassword=11  
rpcallowip=127.0.0.1  
rpcport=9527  
rpcconnect=127.0.0.1
```

Fique atento ao usuário(`myus`), password(`11`) e porta(`9527`) que você usou neste arquivo, pois será através desses dados que você irá se conectar futuramente com seu aplicativo minerador.

Verifique também no post de anúncio da criptomoeda se os desenvolvedores já disponibilizaram um exemplo do arquivo de configuração. Caso seja positivo, ignore meu conteúdo acima e use o conteúdo que eles disponibilizaram, pois normalmente eles especificam também alguns Nodes(`addnode`), que são usados para facilitar o download/propagação da Blockchain em novas criptomoedas.

![](/content/images/2015/08/image21.png)
*Arquivo de configuração da fastcoin-qt, já com alguns Nodes definidos, conteúdo disponível no site oficial da criptomoeda.*

###### Diretório \data e bootstrap.dat

Dentro do diretório da sua wallet, crie também um diretório vazio nomeado de data. O diretório data vai armazenar sua chave privada(`wallet.dat`) e também todo o conteúdo da blockchain.

![](/content/images/2015/08/image22.png)
Arquivo `bootstrap.dat` em seu devido lugar, dentro do diretório `\data`

> É dentro deste diretório que você deverá copiar o arquivo `bootstrap.dat` que você baixou junto da sua carteira. Ele contém a Blockchain parcialmente sincronizada e será processado na primeira execução. Caso não possua este arquivo não tem problema, mas a sincronia de sua carteira vai demorar muito mais tempo.

###### start.bat

O arquivo `start.bat` será nosso Launcher. Criei este arquivo para facilitar o carregamento da carteira com as devidas configurações. Ele vai forçar a carteira a carregar o arquivo de configuração que criamos, e também controlar o caminho do diretório data.

Na raiz de sua carteira(fora do diretório data), no mesmo lugar onde foi criado o `conf.conf`, crie também o `start.bat` e edite ele com o Notepad inserindo o conteúdo abaixo.

```
start fastcoin-qt.exe -datadir=C:\cryptos\fastcoin\data -conf=C:\cryptos\fastcoin\conf.conf
```

Salve e verifique se o arquivo realmente tem a extensão `.bat` (O Windows por padrão oculta a extensão do arquivo, muito cuidado para não salvar `start.bat.txt`)

##### Iniciando a Wallet

Como criamos um arquivo `start.bat`, você sempre deverá iniciar sua wallet através dele, nunca usando o atalho que foi criado pelo instalador. Caso faça isso, as configurações necessárias não serão carregadas.

Após executar o `start.bat`, a carteira deverá ser iniciada.   
![](/content/images/2015/08/image23.png)

*Tela da carteira fastcoin-qt, finalizando a sincronia da Blockchain.*

Ela deverá iniciar sincronizando o conteúdo do `bootstrap.dat`, até finalizar o último bloco.   
![](/content/images/2015/08/image24.png)
Conteúdo do diretório `\data` após iniciar pela primeira vez o nossa carteira

Enquanto a carteira sincroniza, verifique se a mesma foi carregada e está funcionando corretamente. De uma olhada em seu diretório data, nele deverá aparecer o `wallet.dat` e todo o conteúdo da Blockchain. Caso o data ainda esteja vazio ou contendo apenas o `bootstrap.dat`, você cometeu algum erro no arquivo `start.dat`.

##### O aplicativo de mineração

Ao finalizar a sincronia da carteira, você precisará escolher o aplicativo de mineração.

Neste momento existem três principais mineradores que atendem praticamente todas as criptomoedas e todos os hardwares.

- [pooler-cpuminer](https://bitcointalk.org/index.php?topic=55038.0) – Para minerar criptomoedas usando seu CPU, esta versão do cpuminer suporta mineração de Scrypt. (Mas não funciona com X11, mas basta fazer uma busca no google para encontrar uma versão dele para X11)
- [cudaminer](https://bitcointalk.org/index.php?topic=167229.0) – Otimizado para placas de video(GPU) Nvidia. (não suporta GPU ATI).
- [sph-sgminer](https://bitcointalk.org/index.php?topic=475795.0;all) – O melhor minerador do momento na minha opnião, a versão SPH suporta SHA-256, Scrypt, X11 e muitos outros, e também funciona em GPU’s ATI e Nvidia. Por mais que o Cudaminer seja otimizado para Nvidia, eu consegui um desempenho muito melhor com minha Nvidia neste minerador, mas recomendo você testar ambos.

Para fazer download do minerador, vá até o post de anúncio e faça download do binário compilado para seu sistema operacional(ex: Windows x64).

###### Instalando e configurando o minerador

Vamos começar pelo `sph-sgminer`, então extraia todo seu conteúdo dentro de `c:\cryptos\sgminer`.

Crie então um arquivo `mine_fst_local.bat` usando o Notepad, da mesma forma que criou o `start.bat` para a carteira e nele insira o conteúdo:

```
setx GPU_MAX_ALLOC_PERCENT 100  
setx GPU_USE_SYNC_OBJECTS 1  
cd \  
cd C:\cryptos\sgminer  
sgminer.exe -o stratum+tcp://localhost:9527 -u myus -p 11 -I 15  
pause
```

Essa configuração que montamos poderá ser usada também em qualquer variante do **CGMINER**, **SGMINER**, mas fique sempre atento nas instruções do post de anúncio no bitcointalk.org   
![](/content/images/2015/08/image25.png)
Exemplo de arquivo `.bat` de inicialização do `SPH-SGMiner`.

Note que eu usei exatamente o mesmo usuário/senha e porta especificados em nosso arquivo `conf.conf` (porta `9527`, usuário `myus`, senha `11`), já o argumento `-I 15` é a intensidade, foi o máximo suportado pela minha placa de vídeo.

> Você deve iniciar o teste com a Intesidade 1 e ir subindo até sua placa de video não suportar mais. Recomendo não usar um valor muito alto, pois pode retornar diversos erros durante a mineração e causar a perda de blocos, além de travar sua máquina.
>
> O parametro do executável p/ minerar uma moeda X11, é `-k darkcoin` (mesmo que não esteja minerando a Darkcoin)

###### Minerando com o sgminer

Rode o arquivo `mine_fst_local.bat` e aguarde a tela de `Loading`, talvez demore um pouco a primeira vez. Se não retornar erro, aguarde.   
![](/content/images/2015/08/image26.png)
*Tela de status do SPH-SGMiner.*

Se você chegou a esta tela, então você provavelmente já está minerando. Nela você precisa ficar atento nas seguintes informações básicas:

- **(avg)219.9Kh/s** – Sua velocidade de mineração estimada
- **Diff: 0.303** – Dificuldade atual de mineração do bloco, ela pode aumentar o diminiur dependendo da natureza da criptomoeda que você está minerando
- **Best share: 10** – Sempre que você conseguir minerar um novo bloco, o contador de shares aumentará e automaticamente você receberá em sua carteira a recompensa do bloco
- **Erros** de hardware exibidos no log.

> O tempo para conseguir o primeiro **Share** pode ser calculado com aquele [Script](http://jsfiddle.net/eduncan911/UXJR5/) citado acima.

###### Minerando com o Cudaminer (apenas Nvidia GPUs)

Se você possui uma placa de vídeo **Nvidia**, é recomendável testar o desempenho de mineração com o `Cudaminer`, ainda mais se for ele o minerador especificado na tabela comparativa.

Faça download e extraia em sua pasta `c:\cryptos\cudaminer`, então crie um arquivo `mine_fst_local.bat`, da mesma forma que fez com o sgminer e insira o conteúdo abaixo nele.

```
@echo off
setx GPU_MAX_ALLOC_PERCENT 100  
setx GPU_USE_SYNC_OBJECTS 1  
cudaminer -o localhost:9527 -H 1 -i 0 -l auto -C 1 -m 1 -u myus -p 11 2>logfile.txt  
pause
```

Detalhando os argumentos usados:

- **-o localhost:9527** – host e porta onde o minerador deve ser conectado, você definiu isso no arquivo conf.cof
- **-H 1** – Além da GPU, ativa também o CPU como helper para a mineração
- **-i 0** – Está opcão é útil caso o minerador esteja rodando em uma máquina que você pretende trabalhar, ativando este argumento(-i 1), o minerador baixa a intensidade automaticamente quando a máquina está em uso. Como eu possuo um computador dedicado para a mineração deixo ele desativado.
- **-l auto** – Opção para o fine tuning, recomendo deixar no auto-tune, dessa forma o Cudaminer vai realizar testes e definir qual a melhor configuração para seu hardware. Mas caso deseje especificar manualmente poderá consultar o site <http://rumorscity.com/2014/01/19/cudaminer-guide-for-nvidia-gpus/> e encontrar suas configurações, no meu caso seria -l L28x4, e partindo disso voc^e poderia ir subindo os valores at’e encontrar o limite da sua GPU.
- **-C 1** – Dedica o cache de textura da GPU também para a mineração.
- **-m 1** – Define a maneira como será usada a memória da GPU para decriptar os blocos, recomendo deixar 1.
- **-u myus** – Usuário que você definiu no arquivo conf.conf
- **-p 11** – Senha que você definiu no arquivo conf.conf
- **2>logfile.txt** – Usei este argumento para salvar todo resultado do minerador em um arquivo de texto, dessa forma você poderá consultar o .txt facilmente, mesmo que feche o minerador.

Então execute o `mine_fst_local.bat`   
![](/content/images/2015/08/image28.png)
*Tela de status do **CUDAminer** com o output direcionado para um arquivo de texto.*

Note que o minerador não está exibindo seus resultados, isso ocorre por que usei o argumento `2>logfile.txt` no arquivo `.bat`

Para monitorar o desempenho, verifique o arquivo `logfile.txt` que foi criado no mesmo diretório.   
![](/content/images/2015/08/image29.png)
*Log em texto do output do **CUDAminer***

Quando o Cudaminer conseguir minerar um bloco com sucesso, ele vai retornar um `yay!!!`

```
[2014-06-14 10:06:14] GPU #0: GeForce GTX 560, 125.72 khash/s
[2014-06-14 10:06:21] GPU #0: GeForce GTX 560, 125.44 khash/s
[2014-06-14 10:06:21] accepted: 1/1 (100.00%), 125.44 khash/s (yay!!!)
```

O tempo para conseguir o primeiro Share pode ser calculado com aquele **Script** que citei acima.

###### Minerando com o cpumimer (CPU apenas)

Mesmo que você não possua uma GPU, é possível minerar com seu CPU.

Faça o download do poolers-cpuminer, extraia em `c:\cryptos\cpuminer`, como de costume, crie um `mine_fst_local.bat` e insira o conteúdo abaixo nele.

```
@echo off
minerd.exe -a scrypt -t 2 -o http://localhost:9527 -O myus:1
```

Execute então o `.bat` e acompanhe a mineração.   
![](/content/images/2015/08/image30.png)
*Tela de status do **CPUMiner***

Com o argumento `–t` você poderá controlar a quantidade de threads disponíveis para a mineração, faça testes aumentando este valor.

Assim como o Cudaminer, você poderá adicionar o argumento `2>logfile.txt` para salvar em arquivo de texto o output do minerador.

##### Como identificar se estou recebendo as recompensas de mineração em solo?

Sua carteira vai lhe notificar através da **Tray**(ícone ao lado do relógio do sistema), e você também na janela principal.

![](/content/images/2015/08/image31.png)
Recompensa de mineração em Solo Mining, informando que recebi `16 FST` por decriptar um bloco inteiro sozinho.

##### Pool mining (mineração em grupo)

Uma **Pool** nada mais é que um servidor onde todos os mineradores se conectam e recebem uma parte do trabalho, juntos trabalham para tentar descriptografar o código do mesmo bloco, ao final, cada um deles envia seu trabalho à Pool e caso aquele bloco tenha sido minerado com sucesso por algum deles, todos os envolvidos recebem uma recompensa equivalente ao seu trabalho.

Agora que você já domina o Solo mining, minerar através de uma pool pode ser bem simples.

> Diferente do Solo, minerar através da Pool não necessita ter a carteira instalada no computador. Você usará a carteira apenas para sacar as moedas para seu computador caso seja necessário.

Primeiro escolha uma pool para sua criptomoeda, faça testes em diversas pools, começe com a maior (normalmente você encontra ela no post de anúncio da moeda). No caso da Fastcoin usarei a <http://fst.zabmail.ru/>

Acessando o **Site da Pool**, você logo encontra a potência de mineração e alguns detalhes técnicos importantes.   
![](/content/images/2015/08/image32.png)

- Tem **63** mineradores ativos na pool
- Sua capacidade de mineração é de **62Mh/s (62.000Kh/s)**
- Essa pool vai lhe pagar **16 coins por bloco minerado**, no caso **16 FST**
- Esta pool só vai liberar o pagamento a você após **80 confirmações**. Então pode demorar algumas horas para você receber o que minerou, de qualquer forma é possível monitorar quanto você tem à receber através da dashboard da pool.
- Essa pool permite você trocar seus **FST por BTC**, mas não recomendo fazer isso através da pool, devido à suas taxas altíssimas. Recomendo sacar as FSTs para uma Exchange e através dela negociar suas coins.

Crie uma conta na pool preenchendo o formulário de `Signup`. Muito cuidado com o `PIN`, não o perca, pois ele será usado para saque futuramente.

###### Configurando a pool para receber nossos mineradores

Estando logado na Pool, vá até a aba `My Workers` e crie seu minerador:   
![](/content/images/2015/08/image34.png)

Você pode criar quantos mineradores desejar, caso vá minerar com 3 computadores, crie um minerador pra cada, descrevendo algum detalhe de cada computador. Normalmente eu uso o nome/modelo da minha GPU. (Neste caso ficou sendo **intrd.GTX560**).

> Talvez você queira pré-configurar os mineradores e passar para seus amigos lhe ajudar na mineração, neste caso especifique o `nome/hardware` de cada um deles.

O `Password` pode ser qualquer coisa (não precisa ser necessariamente o mesmo que você definiu na carteira anteriormente).

###### Configurando o minerador para a Pool

Feito isso, abra o minerador de sua escolha. Vou usar como exemplo o **SGMiner**.

Da mesma forma que você criou o `mine_fst_local.bat` para minerar em solo, agora você vai criar um novo arquivo chamado `mine_fst.bat` e inserir o conteúdo abaixo dentro dele usando o Notepad.

```
@echo off
setx GPU_MAX_ALLOC_PERCENT 100  
setx GPU_USE_SYNC_OBJECTS 1  
cd \  
cd C:\cryptos\sgminer  
sgminer.exe -o stratum+tcp://fst.zabmail.ru:3335 -u intrd.GTX560 -p 11 -I 15  
pause
```

Note que a única coisa que diferencia da configuração usada no **SGMiner** para Solo Mining, é o formato do `host`, que no caso da pool usa o protocolo **Stratum**.

![](/content/images/2015/08/image35.png)

Detalhes dessa configuração você encontrará na aba `Getting Start` da pool.

###### Stratum e Getwork

Para Solo Mining, o **Getwork** é um formato que funciona muito bem, pois você não tem muitos mineradores conectados em sua carteira requisitando o trabalho para mineração ao mesmo tempo.

> Diferente de uma pool, que mantém centenas, ou até milhares de mineradores conectados simultaneamente recebendo trabalhos. Pra isso foi criado o Stratum, um protocolo que quebra o getwork em listas para facilitar a distribuição de trabalho na pool.

###### Stratum mining proxy

Atualmente os melhores aplicativos de mineração já suportam Stratum nativamente, mas caso não suporte você deverá usar um [Stratum Mining Proxy](https://github.com/slush0/stratum-mining-proxy), que é um aplicativo bem simples que se conecta na pool de sua escolha através de Stratum e abre uma nova porta local para você se conectar com o minerador através de Getwork.

> O Stratum mining proxy pode ser usado também para solo mining caso você esteja montando uma Mining Rig, onde seu nó local usaria diversos hardwares conectados na mesma pool. Alguns hardwares não suportam Stratum nativamente.

###### Minerando na pool com o Sgminer

Com o sgminer devidamente configurado, basta executar o arquivo `mine_fst_local.bat` e acompanhar a mineração como já explicamos acima.   
![](/content/images/2015/08/image36.png)

###### Monitorando a mineração na Pool

Através da `Dashboard` você poderá monitorar o andamento de sua mineração.   
![](/content/images/2015/08/image37.png)
Diferente do Solo mining, na maioria das pools seus ganhos não são direcionados diretamente em sua carteira, você deverá sacá-los para uma Exchange ou p/ sua carteira local (no caso dessa pool, o saque deverá ser feito em `Edit account`).

##### Diferentes tipos de pool

Existem diversos tipos de pool, algumas podem variar no método de pagamento, outras na criação de Workers, algumas até mesmo nem necessitam da criação de workers, elas nem possuem websites, você configura seu minerador usando o endereço público de sua carteira como usuário.

##### Minerando através da P2pool

Na tentativa de evitar a centralização do poder de mineração, foi criada a **P2pool**, um projeto antigo de pool descentralizada que mantém a ideologia do Bitcoin.

Numa P2Pool seus ganhos com mineração são repassados diretamente para sua carteira, isso elimina a necessidade de confiar na segurança/administração do “dono da Pool”, também devido a isto, não existem taxas absurdas de manutenção e mesmo que um nó da P2Pool fique offline, você poderá se conectar a outro e continuar minerando normalmente.

> Diferente das outras Pools, a p2pool não está centralizada em um servidor, então você deverá rodar o client p2p local em seu computador e conectar seus mineradores nele.

Partindo do princípio que você já possui a carteira de sua criptomoeda instalada e configurada para receber mineração (sim, a p2pool necessita da carteira rodando para minerar).

- Faça download do client da p2pool através do site oficial <http://p2pool.in/>

Extraia o conteúdo em `c:\cryptos\p2pool` e crie um arquivo `start.bat` como já é de costume, então insira o conteúdo abaixo nele:

```
@echo off
cd \  
cd C:\cryptos\p2pool  
C:\cryptos\p2pool\run_p2pool.exe –give-author 0 –net fastcoin –bitcoind-rpc-port 9527 –bitcoind-p2p-port 9338 myus 11  
pause
```

A porta `9332` é padrão, mas recomendo você definir adicionando a linha `port=9338` no arquivo arquivo `conf.conf` de sua wallet. (não esqueça de reiniciar-la após a alteração).

Execute o `start.bat` e aguarde a sincronia da p2pool. (sim, a p2pool também precisa sincronizar cada vez que você reinicia)

![](/content/images/2015/08/aaa.png)
Quando passar pelo status de `Started sucessfully`, você já poderá conectar seu minerador em seu client da p2pool.

Um exemplo de configuração com o **SGMiner** seria:

```
@echo off
setx GPU_MAX_ALLOC_PERCENT 100  
setx GPU_USE_SYNC_OBJECTS 1  
cd \  
cd C:\cryptos\sgminer  
sgminer.exe -o http://localhost:9327 -u myus -p 11 -I 15  
pause
```

Note que eu usei a porta `9327`, que é a porta que foi aberta pelo client da p2pool como você pode notar na tela de status Listening for workers on port `9327`

> No caso da p2pool, seus ganhos não ficam restritos por terceiros e é feito diretamente na sua carteira.

###### Observações referente à p2pool:

Você só necessita rodar o client da p2pool, caso queira rodar um nó e ficar independente de terceiros. Caso contrário o procedimento para se conectar num nó rodando a p2pool é o mesmo de qualquer outra pool.

> **Atenção**: O serviço p2pool.org não é uma p2pool, ele nem ao menos usa a p2pool em sua pool.

###### Monitorando a p2pool

Como informou a janela de status, a p2pool também abriu uma porta para monitoramento que deverá ser acessada através de seu browser: `http://127.0.0.1:9327/`

![](/content/images/2015/08/image33.png)

*Exemplo de interface local de monitoramento da p2pool para uma rede p2p de mineração de Bitcoin.*

###### Desvantagens do P2Pool para mineradores pequenos em moedas grandes

Mineradores pequenos devem saber muito bem escolher a p2pool que vai ingressar, pois se ele escolher uma pool relativamente grande e que esteja trabalhando com uma dificuldade altíssima, ele provavelmente não conseguirá completar nem ao menos **1 trabalho no prazo de 24 horas**, que é o limite estipulado pelo sistema de pagamento **PPLNS(pay-per-last-n-shares)** da p2pool para considerar um trabalho válido. E o pequeno minerador não receberá seu pagamento, por mais que deixe sua máquina dedicada trabalhando nessa p2pool.

##### Cloud mining (mineração na nuvem)

Numa tentativa de centralizar o máximo possível de poder de mineração possível, foi criado o Cloud-mining. Um serviço que permite você comprar capacidade de processamento.

> Você paga para uma empresa investir em hardware e minerar, ela te repassa um percentual do lucro com a mineração.

Algo que se tornou atrativo para muitos usuários, pois é um lucro fixo onde o usuário não precisa manter hardware algum e no final, teoricamente ainda pode recuperar seu investimento vendendo a **capacidade de processamento** comprada.

###### Minerando na nuvem do cex.io

O serviço que está dominando o mercado neste momento é o [cex.io](http://cex.io), nele é possível comprar GHS, uma moeda própria que simboliza a sua capacidade de mineração na nuvem. Pense nele como um ativo que você poderá comprar e vender futuramente, o preço dele é definido por um mercado interno onde você abre uma ordem de venda/compra no valor(em Bitcoin) que desejar, funciona da mesma forma que uma exchange.

![](/content/images/2015/08/image38.png)

*Neste momento `1 GHS` está custando `0.00763533 BTC`, algo em torno de `$5,00`*

![](/content/images/2015/08/image40.png)
*Comprando GHS e iniciando a mineração no mercado interno da cex.io através de ordens de compra/venda de GHS/BTC.*

![](/content/images/2015/08/image11.png)
Após comprar seus GHS, você já estará automaticamente minerando na núvem. E você poderá monitorar seus ganhos na mineracão e suas taxas por bloco minerado

> Note que você não pode escolher a moeda que deseja minerar, a prioridade sempre será BTC, mas o cex.io se reserva o direito de direcionar seu poder de mineração para uma Altcoin que está sendo lucrativa no momento.

![](/content/images/2015/08/image41.png)

*Cex.io minerando diversas Altcoins que ele julga lucrativo. (Você poderá sacar suas moedas mineradas a qualquer momento sem restrição alguma)*

##### Projetando lucros

Agora que você já sabe quanto custa **1 GHS**, vamos à calculadora para estimar se o capital que você possui para investir em mineração na núvem vai lhe dar o retorno desejado.

> <https://cex.io/calc> – Calculadora de cloud-mining do cex.io

Tendo em base que você possua `$1000,00` para investir e a `unidade de GHS` está custando `$5,00`, então podemos afirmar que você poderá comprar `200 GHS`. Insira o valor de 200 GHS na calculadora, o restante dos campos(taxas/dificuldade da rede/valor do btc) deixe o valor padrão, eles são alterados automaticamente.

![](/content/images/2015/08/image42.png)

Investindo 200 GHS você terá um ganho de `0.21 BTC até dia 14/jun`, depois `0.13 BTC em 14/jul`, e assim vai, reduzindo seus ganhos a `cada dia 14`, pois é o dia que a dificuldade de mineração da rede do Bitcoin aumenta e seus GHS passam a render menos.

###### Depreciação dos GHS

Ao chegar no dia 14/nov você já lucrou `0.45 BTC($250,00)` e é neste momento que seu investimento inicial começa dar **prejuizo**, pois os 200 GHS já não são mais o suficiente para cobrir os gastos de manutenção do cex.io. Neste momento você deverá vender seus GHS.

> Para recuperar os $1000,00 investidos você terá de contar com a sorte, pois envolvem `3 variáveis`.

- A **dificuldade** de mineração aumentou, então houve uma depreciação no GHS, naturalmente será difícil vender no mesmo preço que comprou.
- O valor do **BTC é muito volátil**, poderá dar a sorte de ter comprado 1 GHS quando o BTC custava $600,00 e no momento da vender ele estar custando $1000,00, ou o azar dele estar custando $100.
- Essa calculadora se baseia nas **taxas de manutenção** que o cex.io aplica hoje, que já são altíssimas comparada à sua inauguração e tendem sempre a subir.

### Conclusão

Dominando essas técnicas você poderá minerar qualquer moeda em qualquer tipo de pool com qualquer hardware/minerador. Por mais que essa tecnologia evolua, esses conhecimentos serão sempre a base da mineração de criptomoedas.

### Referências

- Site oficial da p2pool: <http://p2pool.in/>
- BitcoinBR @ Facebook: <https://www.facebook.com/groups/btcbr/807052202638283/>
- Bitcointalk: <http://bitcointalk.org>
- Fastcoin official website: <http://www.fastcoin.ca/>
- /r/bitcoin – <http://reddit.com/r/bitcoin>
- SPH-SGMiner – <https://bitcointalk.org/index.php?topic=475795.0;all>
- Cudaminer – <https://bitcointalk.org/index.php?topic=167229.0>
- poolers-cpuminer – <https://bitcointalk.org/index.php?topic=55038.0>
- Fastcoin official pool – <http://fst.zabmail.ru/>
- CPU-Z – <http://www.cpuid.com/softwares/cpu-z.html>
- Bitcoin mining comparison – <https://en.bitcoin.it/wiki/Mining>*hardware*comparison
- Litecoin mining comparison – [https://litecoin.info/Mining*hardware*comparison](https://litecoin.info/Mining_hardware_comparison)
- Darkcoin mining comparison – <https://docs.zoho.com/sheet/published.do?rid=12cbm2fe8ce55abb2476daa0f8c576b442d40&mode=html>
- Coinwarz mining – <http://www.coinwarz.com>
- Dustcoin mining information – <http://dustcoin.com/mining>
- Altcoins announcements thread – <https://bitcointalk.org/index.php?board=159.0>
- P2Pool: <http://p2pool.in>
