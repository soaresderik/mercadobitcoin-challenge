## Mercado Bitcoin - Média Móvel Simples

#### Instruções Iniciais

É necessário ter o docker e o docker-compose instalados para rodar o projeto. Estando eles presente na máquina, na raiz do projeto, digite o commando `docker-compose up` e aguarde os serviços carregarem. O terminal mostrará algo como:

> backend_1 | Debugger listening on ws://127.0.0.1:9229/4e54e6d9-5530-4028-a473-e3b113b872a4 \
> backend_1 | For help, see: https://nodejs.org/en/docs/inspector \
> backend_1 | Server started on port 3002! \

Uma vez inicializado é necessário também popular a tabela principal. Para isso, atravéz de um novo terminal, entre no serviço da api com o comando `docker-compose exec backend sh` e então execute `npm run db:populate`. Aguarde até a mensagem `Completed!` ser exibida.

Para fazer a primeira consulta e saber se os dados carregaram corretamente, tente executar a chamada abaixo:
```sh
 curl --location --request GET 'http://localhost:3002/BRLBTC/mms' \
 --header 'Content-Type: application/json' \
 --data-raw '{
 "from": "2020-01-31T18:51:45.600Z",
 "range": "20"
 }' 
 ```

Também é possível checar os dados inseridos banco de dados acessando a rota http://localhost:8080 e entrar com as credenciais que estão no arquivo docker-compose.yml

#### Comportamento do scheduler

O arquivo responsável por executar rotinas é o `src/scheduler.ts`. Até o momento ele executa duas tarefas: Popula a tabela `daily_price` se houver pendências na tabela `system_notifications`; Faz a inserção diária na tabela principal (`daily_price`) com os dados obtidos na chamada da api mercadobitcoin.

A tabela `system_notifications` funciona como uma espécie de fila. Nela é armazenado, por exemplo, possíveis erros que possam ocorrer na api terceira. O scheduler faz uma consulta nela para saber se existem ações pendentes ou que precisam ser re-executadas.

Algumas das ações que podem interagir com a tabela `system_notifications` é quando o método `populateDailyPrice` é executado. Se o service que consulta a api terceira informar que há datas inconsistentes (`INCONSISTENT_INTERVAL`), então a tabela guarda o intervalo dessas datas para o scheduler tentar executar em uma próxima rodada. Quando a api tem alguma falha de indisponibilidade, por exemplo, a tabela também guarda os parâmetros para serem executados em uma próxima rodada (`CALL_API_DAILY_PRICE`).

Em resumo, o scheduler verifica na `system_notifications` se existem erros com os códigos `INCONSISTENT_INTERVAL` ou `CALL_API_DAILY_PRICE`, se sim ele re-executa o comportamento com os parâmetros do campo `metadata`. Se tudo ocorrer como esperado, o campo `fixed` é setado para true e essa rotina não será mais executada, caso contrário ela continua pendente.
