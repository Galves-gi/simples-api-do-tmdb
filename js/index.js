const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjM2ZjZDIwOTZmMGFjOTQzOWU2ODI2YmI1ZGQ4NGI4OCIsIm5iZiI6MTc2MjE3Njk0MC45MTgwMDAyLCJzdWIiOiI2OTA4YWZhYzIyZTgwODcyNmE1OTg2M2IiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LdXGLFT_U_qczlt2Uk5LvSGjUvqL-_5_EJ1gEKdpjoM'


/* montar a url das rotas */
const cabecalho ={
    'Authorization': `Bearer ${TMDB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8'
}

async function montarUrl(caminho, params = {}) {

  const parametrosCompletos = {
    language: "pt-BR",
    include_adult: false,
    append_to_response: 'videos',
    ...params
  };

  const url = new URL(`${TMDB_BASE_URL}${caminho}`);

  Object.entries(parametrosCompletos).forEach(([k, v]) =>
    url.searchParams.append(k, v)
  );

  const resultado = await fetch(url.toString(), { headers: cabecalho });

  if (!resultado.ok) {
    throw new Error(`TMDB Error ${resultado.status} ${resultado.statusText}`);
  }

  return resultado.json();
}

const data = new Date()
const dataAtual = (`${data.getDate()}${data.getMonth() + 1}${data.getFullYear()}`)

console.log(dataAtual);



/* rotas */
/* url lançamentos em cartaz */
async function getLancamentoCartaz(page = 1){
    return montarUrl('/movie/now_playing' , { page, region: "BR" })
}

/* url futuro lançamentos */
async function getFuturoLancamento(page = 1){
    return montarUrl('/movie/upcoming', { page, 'primary_release_date.gte': '', region: "BR" })
}

/* url mais avaliado*/
async function getMaisAvaliados(page = 1){
    return montarUrl('/movie/top_rated', { page })
}

async function getGeneros() {
  return montarUrl('/genre/movie/list')
}


/* url pesquisar */
/* async function getPesquisar(valorDigitado, page = 1) {
    try {
        const resposta = await montarUrl(`/search/movie?query=${valorDigitado}`, {page });

        return resposta.results

    } catch (error) {
        console.log(error);
        
        return { results: [] };
    }

} */

/* url Mais detalhes */
/* async function getMaisDetalhes(id){
    return montarUrl('/movie/${id}',{ append_to_response: 'videos' })
} */


/* pagina index */
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500/'

const containerLancamentoCartaz = document.getElementById('containerCardCarrosselLancamentoCartaz');

const containerFuturoLancamento = document.getElementById('containerCardCarrosselFuturoLancamento');

const containerCardPadrao = document.getElementById('containerCardPadrao');


function criarCardCarrossel(filme) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <a href="./pages/descricao.html?id=${filme.id}">
            <img src="${TMDB_IMG}${filme.poster_path}" alt="${filme.title}">
        </a>
    `
    return card
}

function criarCardPadrao(filme) {
    const cardPadrao = document.createElement('div');
    cardPadrao.classList.add('col');

    cardPadrao.innerHTML = `
        <a href="./pages/descricao.html?id=${filme.id}">
            <img src="${TMDB_IMG}${filme.poster_path}" alt="${filme.title}">
        </a>
    `
    return cardPadrao
}
// funcão reutilizada
async function renderizarLista({
  container,
  chamarRota,
  createCardFunction = criarCardPadrao,
  //limit = 12
}) {
  container.innerHTML = '<p>Carregando...</p>';

  try {
    const dados = await chamarRota();
    const lista = dados.results;

    container.innerHTML = '';

    if (!lista.length) {
      container.innerHTML = '<p>Nenhum filme encontrado.</p>';
      return;
    }

    lista.forEach(filme => {
      container.appendChild(createCardFunction(filme));
    });

  } catch (err) {
    container.innerHTML = `<p>Erro ao carregar: ${err.message}</p>`;
    console.error(err);
  }
}
//lancamento em cartaz
renderizarLista({
  container: containerLancamentoCartaz,
  chamarRota: getLancamentoCartaz,
  createCardFunction: criarCardCarrossel,
});
//futuro lancamento
renderizarLista({
  container: containerFuturoLancamento,
  chamarRota: getFuturoLancamento,
  createCardFunction: criarCardCarrossel,
});
//mais avaliado
renderizarLista({
  container: containerCardPadrao,
  chamarRota: getMaisAvaliados,
  createCardFunction: criarCardPadrao,
});






async function getGeneros() {
    try {
        const resposta = await montarUrl(`/genre/movie/list`);
        return resposta.genres;
    } catch (error) {
        console.log(error);
    }
}

const containerGeneros = document.querySelectorAll(".menu-generos"); // ul onde vai aparecer as opções

async function exibirGenerosFrontend(){
    const listaGeneros = await getGeneros();

    containerGeneros.forEach((container, indexLista) =>{

          listaGeneros.forEach(cadaGenero => {
              const li = document.createElement('li');
              
              li.classList.add("dropdown-item");
              
              li.innerHTML = `
                  <input class="form-check-input me-1" type="checkbox" name="generos" value="${cadaGenero.id}" id="genero-${cadaGenero.id}">
                  <label class="form-check-label" for="genero-${cadaGenero.id}">${cadaGenero.name}</label>
              `;
              
              container.appendChild(li);
          });

    })

    // Inicializar os event listeners/opções do botão após criar os checkboxes
    pegarIdsGeneros();
}
