---
title: "CryptoWall : Ransomware, métodos de recuperação dos arquivos sequestrados"
date: "2015-10-22T03:24:30.000Z"
lastmod: "2017-04-25T13:50:25.000Z"
tags: ["pt_BR", "RansomWare", "CryptoLocker", "CryptoWall", "Arquivos sequestrados", "Sequestro de dados", "Resgate de dados"]
slug: "cryptowall-ransomware-recuperando-os-arquivos-encriptados"
url: "/cryptowall-ransomware-recuperando-os-arquivos-encriptados/"
---
Há algum tempo, um amigo solicitou ajuda para entender como um computador de sua empresa, isolado pelo Firewall + AV corporativo havia sido infectado por um Ransomware, o qual "sequestrou" todos seus documentos.

Todos os arquivos foram recuperados com sucesso e identificamos o modus operandi do Ransomware. Resolvi então escrever este relado visto que o número de pessoas/empresas sofrendo este tipo de ataque está aumentando.

### Informações disponíveis

Todos os arquivos de documentos com extensões comuns(*.doc, *.jpg, *.xls, *.avi...) haviam sido encriptados e junto deles haviam TXTs e HTMLs com detalhes do "sequestro".

```txt
 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
What happened to your files ?  
All of your files were protected by a strong encryption with RSA-2048.  
More information about the encryption keys using RSA-2048 can be found here: http://en.wikipedia.org/wiki/RSA_(cryptosystem)

What does this mean ?  
This means that the structure and data within your files have been irrevocably changed, you will not be able to work with them, read them or see them,  
it is the same thing as losing them forever, but with our help, you can restore them.

How did this happen ?  
Especially for you, on our server was generated the secret key pair RSA-2048 - public and private.  
All your files were encrypted with the public key, which has been transferred to your computer via the Internet.  
Decrypting of your files is only possible with the help of the private key and decrypt program, which is on our secret server.

What do I do ?  
Alas, if you do not take the necessary measures for the specified time then the conditions for obtaining the private key will be changed.  
If you really value your data, then we suggest you do not waste valuable time searching for other solutions because they do not exist.

For more specific instructions, please visit your personal home page, there are a few different addresses pointing to your page below:  
1. http://dfgd44.d555fdsss5.com/6478F78489F  
2. http://ytdffd3434.43.com/6478F78489F  
3. https://alcods33456f.onion.to/6478F78489F 

If for some reasons the addresses are not available, follow these steps:  
1. Download and install tor-browser: http://www.torproject.org/projects/torbrowser.html.en  
2. After a successful installation, run the browser and wait for initialization.  
3. Type in the address bar: alcov44uvcwkrend.onion/5F976F79B7133B47  
4. Follow the instructions on the site.

IMPORTANT INFORMATION:  
Your personal pages:  
1. http://dfgd44.d555fdsss5.com/6478F78489F  
2. http://ytdffd3434.43.com/6478F78489F  
3. https://alcods33456f.onion.to/6478F78489F  
Your personal page (using TOR): alcods33456f.onion/6478F78489F  
Your personal identification number (if you open the site (or TOR 's) directly): 6478F78489F
```

As instruções afirmavam que os arquivos haviam sido encriptados através de um `algoritmo de 2048bits`. Analisando os arquivos apenas era possível afirmar que haviam se tornado binários criptografados.

![](/content/images/2015/10/Selection_034.jpg)

Rodar algum tipo de `bruteforce` para tentar revelar a chave privada não era uma opção, pois o ransom com toda certeza estaria programado para usar uma `passphrase` gigantesca somada aos supostos 2048bits de criptografia.

### Sistema de resgate do CryptoWall

Os arquivos possuiam um link da **Deep Web** `http://alcods33456f.onion/6478F78489F` e também alguns mirrors que apontavam para um `Onion Router(onion.to)` o qual permitia a vítima acessar normalmente em seu browser na Surface sem a necessidade de instalar nada.

Acessando os endereços através da rede `Tor` a vítima é direcionada a um sistema automatizado nomeado de `CryptoWall` e já dava pra notar que se tratava de trabalho profissional.

![](/content/images/2015/10/photo_2015-10-20_14-41-57.jpg)
![](/content/images/2015/10/photo_2015-10-20_14-41-48.jpg)

#### Funções do site do CryptoWall

- Permite solicitar a descriptografia de um de seus arquivos como prova;
- Contém instruções de pagamento, orientando o usuário a acessar exchanges conhecidas para troca de sua moeda local por bitcoins;
- Exibe o valor do resgate, que é de 2.2BTC(2k BRL) e deveria ser depositado numa wallet gerada pelo ransom;
- Permite a vítima confirmar o depósito através do TXid da blockchain (o que indicava a necessidade de um humano para verificar o pagamento e enviar o Decrypter);
- Também havia um prazo(deadline) de 130horas p/ depósito.

Com uma breve pesquisa no Google encontrei poucas infos sobre o CryptoWall, que na época não era muito conhecido, mas alguns usuários haviam obtido sucesso recuperando seus arquivos através do `Shadow Files` do System Restore no Windows.

### Primeira tentativa de recuperação: Shadow Files

Aparentemente o ransom lista no disco por arquivos de documentos com extensões comuns(*.doc, *.jpg, *.xls, *.avi...) e cria uma cópia encriptada para cada, logo após excluí o arquivo original.

Em máquinas Windows com o `System Restore` ativo(por padrão todas mantém ativo), é possível listar as `Shadow Copies`, que são versões das alterações de TODOS documentos de seu computador e podem ser facilmente acessadas através das `Propriedades do arquivo`, na aba `Versões anteriores`.

![](/content/images/2015/10/Selection_035.jpg)

Porém, quando os arquivos são renomeados, o acesso direto através das propriedades não é mais possível e é necessário fazer através de um freeware chamado [Shadow Explorer](http://www.shadowexplorer.com/). O `Shadow Explorer` permite listar todo conteúdo de uma pasta, mesmo que eles já não existam mais.

Sim, o `Shadow Explorer` foi nossa primeira tentativa, mas para nosso azar, não conseguimos nada, não existia mais Shadow Copies no computador..

Em outra pesquisa descobri que minha versão do CryptoWall conseguia escalar privilégios e excluir todo o Shadow através do comando:

`"C:\Windows\SYsWOW64\cmd.exe" /C "C:\Windows\Sysnative\vssadmin.exe" Delete Shadows /All /Quiet`

Mas ainda havia uma esperança..

### Segunda tentativa e recuperação dos arquivos encriptados

Como sabemos, todo arquivo excluído continua no disco, eles são apenas marcados para serem substituídos conforme o disco vai sendo carregado. Teoricamente os arquivos ainda estariam lá, tudo que eu precisava era de um utilitário de disco decente p/ recuperação.

Então, bootei o computador através do meu [pendrive que possuia o Hirens](/grub2-multiboot-usb-linux-mint-tails-and-hirens-boot-cd-luks-encrypted-partition/) e usei um de seus utilitários de recuperação de arquivos. Neste caso usei o `DiskDigger`, mas poderia ter feito também com o `Recuva`, `Restoration` ou `Softperfect`, todos esses utilitários(inclusive o Shadow Explorer) estão inclusos na última versão do `Hirens`.

> Por sorte o ransom não deu Wipe(zerar o conteudo dos arquivos) antes de excluir, o que me permitiu recuperar absolutamente tudo.

Outra opção, para uma recuperação avançada(incluindo versões datadas de cada arquivo), caso seja possível destacar o HD e plugar numa case USB, seria o **Easus Data Recovery** (Ele pode ser baixado aqui: <https://mega.nz/#F!zMZjHSKT!lQmm1WukSpkw5lYY94XR5Q>).

### Como ocorreu a infecção?

A prioridade era recuperar os arquivos, mas ainda faltava responder como o computador havia sido infectado?

#### Detalhes da máquina

- Sistema operacional: Win7(SP1);
- Anti-virus: Symantec Endpoint Protection;
- O acesso a internet era feito através do browser, limitado por um proxy autenticado(RADIUS);
- O proxy permitia apenas conexões saintes para portas 80(http) e 443(https);
- As conexões estavam também sendo filtradas também pelo Endpoint;
- Browser: Chrome lastver;
- Histórico de navegação: Vários ads acessados, aparentemente o `usuário adorava clicar em anúncios`.
- Plugins/addons instalados? BAM! `Java 6`.

Sim, o ransom entrou através de um exploit do Java 6, o usuário simplemente acessou um ad malicioso, o qual identificou sua versão pré-histórica do Java e abriu uma shell em seu computador, escalou privilégios e executou sua rotina de encriptar arquivos.

Tudo isso invisível ao Anti-virus, pois o exploit não spawna nem faz upload de executáveis para a máquina, ele roda no processo existente do Java, dificilmente um AV detecta este tipo de ameaça.

#### Anti-virus? Destaque para o Hitman Pro Alert

Tempos atrás executei alguns testes em diversos AVs usando exploits p/ o Java, tal como o Rhino([famoso payloader que permite remote code execution no Java 7](https://www.rapid7.com/db/modules/exploit/multi/browser/java_rhino)), o único que interceptou a ameaça foi o [Hitman Pro Alert](http://www.surfright.nl/en/alert), pois ele é baseado num novo conceito de AV que consegue monitorar a execução de payloaders na memória alocada por cada processo. Desde então tenho recomendado este AV para usuários Windows.

### Conclusão e recomendações

Flash e Java atualmente são portas de entradas pra todo tipo de ameaça na internet, apenas de navegar num site você pode liberar acesso total a seu computador para um Malware/Hacker, o qual pode além de ter total controle de seu computador, sua WebCam, também explorar toda sua rede interna e infectar outros dispositivos, inclusive os mobiles.

> Esqueça a ideia de manter os plugins do Flash e Java atualizados. Isso é impossível! Cada momento surge um novo 0day, e até você atualizar, já foi infectado através de um ad ou vídeo, sim, até mesmo aqueles do Facebook.

Recomendação?

Anti-virus? apenas como um layer de segurança extra.. a principal recomendação seria...

**REMOVA OS PLUGINS JAVA E FLASH DE SEU NAVEGADOR!**

Hoje em dia a maioria dos sites já suportam HTML5, deixe de lado sistemas dependentes de java/flash, estes já estão obsoletos há muito tempo.
