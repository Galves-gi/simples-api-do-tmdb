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


async function getPesquisar(valorDigitado, page = 1) {
    try {
        const resposta = await montarUrl(`/search/movie?query=${valorDigitado}`, {page });

        return resposta.results

    } catch (error) {
        console.log(error);
        
        return { results: [] };
    }

}

//console.log(getPesquisar("batman")); // aq retorna promise

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500/'

function criarCardPadrao(filme) {
    const cardPadrao = document.createElement('div');
    cardPadrao.classList.add('col');

    const caminhoImg = filme.poster_path ? `${TMDB_IMG}${filme.poster_path}` : "/assets/favicon.png"

    cardPadrao.innerHTML = `
        <a href="./descricao.html?id=${filme.id}">
            <img src="${caminhoImg}" alt="${filme.title}">
        </a>
    `
    return cardPadrao
}


const FormularioPesquisar = document.getElementById('pesquisa-form');
const pesquisarInput = document.getElementById('pesquisar-input');

const containerCardPesquisa = document.getElementById('containerCardPesquisa');

  const urlParams = new URLSearchParams(window.location.search)
  const valorUrl = urlParams.get("search")

// valor da url
async function pesquisarComUrl() {

  if (!valorUrl) {
  containerCardPesquisa.innerHTML = '<p class="aviso">Digite o nome de um filme</p>';
  return;
  }

  containerCardPesquisa.innerHTML = '<p class="aviso">Carregando...</p>';

  const tempoLimite = setTimeout(() => {
  containerCardPesquisa.innerHTML = `<p class="aviso">Tempo de busca excedido (30s).</p>`;
  }, 3000);

  try {
    const resultadoPesquisa = await getPesquisar(valorUrl);

    clearTimeout(tempoLimite);

    if (!resultadoPesquisa || resultadoPesquisa.length === 0) {
    containerCardPesquisa.innerHTML = `<p class="aviso">Nenhum filme encontrado!</p>`;
    return;
    }

    // 🧱 Exibe os cards normalmente
    containerCardPesquisa.innerHTML = '';
    resultadoPesquisa.forEach(filme => {
    const card = criarCardPadrao(filme);
    containerCardPesquisa.appendChild(card);
    });


  } catch (error) {
    console.log(error);
    
  }
  
}
pesquisarComUrl()


/* 
botão suspenso

busca por palavra chave ok

busca por gênero
- listar os gêneros no html ok
- pegar os ids dos selecionados ok
- repassar os ids selecionados para url de busca da api 
- retornar na tela


busca dupla
- pegar a lista de gêneros selecionados
- comparar em cada retorno do input
*/

/* chamar a api de lista de generos */
let generosSelecionados = [];

async function getGeneros() {
    try {
        const resposta = await montarUrl(`/genre/movie/list`);
        return resposta.genres;
    } catch (error) {
        console.log(error);
    }
}

/* exibir no frontend */
const containerGeneros = document.querySelector(".menu-generos");

async function exibirGenerosFrontend(){
    const listaGeneros = await getGeneros();

    listaGeneros.forEach(cadaGenero => {
        const checkboxesGenero = document.createElement('li');
        checkboxesGenero.classList.add("dropdown-item");
        
        checkboxesGenero.innerHTML = `
            <input class="form-check-input me-1" type="checkbox" value="${cadaGenero.id}" id="genero-${cadaGenero.id}">
            <label class="form-check-label" for="genero-${cadaGenero.id}">${cadaGenero.name}</label>
        `;
        
        containerGeneros.appendChild(checkboxesGenero);
    });

    // Inicializar os event listeners após criar os checkboxes
    inicializarEventListeners();
}

// funcao de marcar e desmarcar os checkboxes
function inicializarEventListeners() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Adiciona ao array se estiver marcado
                adicionarGenero(this.value);
            } else {
                // Remove do array se estiver desmarcado
                removerGenero(this.value);
            }
            
            exibirFilmes();
        });
    });
}

// Função para adicionar gênero ao array
function adicionarGenero(generoId) {
    if (!generosSelecionados.includes(generoId)) {
        generosSelecionados.push(generoId);
        //console.log(`Gênero adicionado: ${generoId}`);
    }
}

// Função para remover gênero do array
function removerGenero(generoId) {
    const index = generosSelecionados.indexOf(generoId);
    if (index !== -1) {
        generosSelecionados.splice(index, 1);
        //console.log(`Gênero removido: ${generoId}`);
    }
}

// mostrar os filmes de acordo com os gêneros selecionados
function exibirFilmes() {
/*     const urlParams = new URLSearchParams(window.location.search);
    const valorUrl = urlParams.get("search") || ''; */
    
    console.log('Gêneros selecionados:', generosSelecionados);
    console.log('Valor URL:', valorUrl);

    if (generosSelecionados.length > 0 && !valorUrl) {
        exibirGeneros(generosSelecionados);

    } else if (valorUrl && generosSelecionados.length === 0) {
        pesquisarComUrl();

    } else if (valorUrl && generosSelecionados.length > 0) {
        exibirGenerosComPesquisa(valorUrl, generosSelecionados);

    } else {
        containerCardPesquisa.innerHTML = '<p class="aviso">Selecione gêneros ou pesquise um filme</p>';
    }
}



async function exibirGeneros(idsGeneros) {
  if (!idsGeneros) return

  try {

    const resposta = await montarUrl(`/discover/movie`,{
      with_genres: idsGeneros.join(','),
      sort_by: 'popularity.desc'
    })

    containerCardPesquisa.innerHTML = '';

    resposta.results.forEach(filme => {

    const card = criarCardPadrao(filme);
    containerCardPesquisa.appendChild(card);
    });

    console.log(resposta);
    

  } catch (error) {
    console.log(error);
  }
}

/* 
realizar pesquisa
pegar cada resultado de pesquisa, passar no filter e comparar o idsGeneros
retornar somente filter true
*/

async function exibirGenerosComPesquisa(input,idsGeneros) {
  containerCardPesquisa.innerHTML = '<p class="aviso">Carregando...</p>';

  try {
    const resposta = await montarUrl(`/search/movie?query=${input}`, {
      with_genres: idsGeneros.join(','),
      sort_by: 'popularity.desc'
    })

    const dados = resposta.results

    if (!dados || dados.length === 0) {
      containerCardPesquisa.innerHTML = `<p class="aviso">Nenhum filme encontrado!</p>`;
      return;
    }

    const resultadosFiltrados = dados.filter(filme => {
        return idsGeneros.every(idsGeneros => 
                filme.genre_ids.includes(Number(idsGeneros))
            );
        });
        
        if (resultadosFiltrados.length === 0) {
            containerCardPesquisa.innerHTML = '<p class="aviso">Nenhum filme encontrado com os gêneros selecionados!</p>';
            return;
        }
        
        containerCardPesquisa.innerHTML = '';
        resultadosFiltrados.forEach(filme => {
            const card = criarCardPadrao(filme);
            containerCardPesquisa.appendChild(card);
      });

  } catch (error) {
    console.log(error);
    
  }
}



await exibirGenerosFrontend();
