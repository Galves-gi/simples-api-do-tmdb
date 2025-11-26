const TMDB_BASE = 'https://api.themoviedb.org/3'

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjM2ZjZDIwOTZmMGFjOTQzOWU2ODI2YmI1ZGQ4NGI4OCIsIm5iZiI6MTc2MjE3Njk0MC45MTgwMDAyLCJzdWIiOiI2OTA4YWZhYzIyZTgwODcyNmE1OTg2M2IiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LdXGLFT_U_qczlt2Uk5LvSGjUvqL-_5_EJ1gEKdpjoM'

 
const DEFAULT_HEADERS = {

  'Authorization': `Bearer ${TMDB_TOKEN}`,

  'Content-Type': 'application/json;charset=utf-8'
  //o Content-Type atua como um guia de instruções que diz ao recetor (servidor ou navegador) qual é a natureza exata dos dados transmitidos, garantindo que sejam lidos e processados corretamente. 
};


async function fetchWithTimeout(url, opts = {}, timeout = 8000) {

  const controller = new AbortController();

  //O AbortController é uma API nativa do JavaScript que serve para controlar e quando necessário cancelar uma ou múltiplas operações assíncronas em andamento, sendo essencial para otimização de memória

  const id = setTimeout(() => controller.abort(), timeout);
  // bloco de exceções
  try {

    const res = await fetch(url, { ...opts, signal: controller.signal });

    clearTimeout(id);
    
    return res;

  } catch (err) {

    clearTimeout(id);

    throw err;

  }

}


function montarUrl(path, params = {}) {

  const url = new URL(`${TMDB_BASE}${path}`); // cria um obj

  const defaults = { language: 'pt-BR', include_adult: false, ...params };

  Object.entries(defaults).forEach(([k, v]) => {

  // objeto em uma lista de pares [chave, valor].

    if (v !== undefined && v !== null) url.searchParams.append(k, String(v));

  });

  return url.toString(); // converte obj em string

}

async function apiGet(path, params = {}, timeout = 8000) {

  const url = montarUrl(path, params);

  const res = await fetchWithTimeout(url, { headers: DEFAULT_HEADERS }, timeout);

  if (!res.ok) {

    const text = await res.text().catch(() => '');

    throw new Error(`TMDB ${res.status} ${res.statusText} ${text}`);

  }

  return res.json();

}


async function searchMovies(query, page = 1) {

  if (!query) return { results: [] };

  return apiGet('/search/movie', { query, page, append_to_response: 'videos' });

}

 
async function discoverMovies({ genres = [], sortBy = 'popularity.desc', page = 1 } = {}) {

  const with_genres = genres.length ? genres.join(',') : undefined;

  return apiGet('/discover/movie', { with_genres, sort_by: sortBy, page });

}
 
async function getGenres() {

  const data = await apiGet('/genre/movie/list');

  return data.genres || [];

}

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
 
export { apiGet,searchMovies, discoverMovies, getGenres, TMDB_IMG };








/* 
Anotações:

AbortController();

Sua principal utilidade é fornecer um mecanismo para sinalizar que uma operação deve ser interrompida. Isso é especialmente importante para:

  - Otimização de Performance: Evitar que requisições HTTP continuem em execução quando não são mais necessárias, como quando um usuário navega para outra página ou fecha um componente de interface antes da resposta chegar.

  - Prevenção de Vazamentos de Memória: Em frameworks como React, Next.js, etc., o uso do AbortController em conjunto com useEffect ajuda a cancelar chamadas de API pendentes quando um componente é "desmontado" (unmounted), prevenindo vazamentos de memória e erros.

  - Controle de Fluxo Assíncrono: Permite gerenciar o cancelamento de múltiplas tarefas assíncronas de uma só vez. 

Como Funciona
  - Criação do Controlador: Você cria uma instância de AbortController.

  - Obtenção do Sinal: A instância possui uma propriedade signal que é passada para a operação assíncrona (por exemplo, na configuração do fetch).
  - Cancelamento: Quando você deseja abortar a operação, você chama o método abort() na instância do controlador. Isso faz com que o signal emita um evento "abort" e a operação vinculada a ele seja rejeitada com um erro (um AbortError). 

URL(`${TMDB_BASE}${path}`);

const url = new URL(`${TMDB_BASE}${path}`);
Essa linha cria uma nova instância do objeto URL, que serve para montar uma URL de forma estruturada, segura e sem erros de formatação.

A classe URL:

    valida e organiza automaticamente a URL,

    evita problemas como barras duplas (//),

    separa corretamente o domínio, caminho e parâmetros,

    permite adicionar query params com url.searchParams.append(...),

    garante que a URL final siga o padrão correto.



res.text() é um método do objeto Response (do fetch) que:

  Lê o corpo da resposta

  Converte para texto

  Retorna uma Promise


Ler .text() pode falhar quando:

  o body já foi lido antes (fluxo já consumido)

  a requisição foi abortada no meio

  o servidor fechou a conexão

  houve problema de rede


text() ler todo o corpo da resposta HTTP que recebeu e retornar uma mensagem (promise), se der certo, repassa para var, se não o catch retornar '' para a aplicação não quebrar

*/
 