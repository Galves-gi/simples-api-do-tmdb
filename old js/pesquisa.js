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

// função para pegar os dados na api
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
// criar card 
function criarCardPadrao(filme) {
    const cardPadrao = document.createElement('div');
    cardPadrao.classList.add('col');

    const caminhoImg = filme.poster_path ? `${TMDB_IMG}${filme.poster_path}` : "/assets/favicon.png"

    cardPadrao.innerHTML = `
        <a href="./pages/descricao.html?id=${filme.id}">
            <img src="${caminhoImg}" alt="${filme.title}">
        </a>
    `
    return cardPadrao
}


const FormularioPesquisar = document.getElementById('pesquisa-form');
const pesquisarInput = document.getElementById('pesquisar-input');

const containerCardPesquisa = document.getElementById('containerCardPesquisa');

let valorDigitado

// valor do input
function pegarValorInput() {

  FormularioPesquisar.addEventListener("submit", async (event) => {
    event.preventDefault();

    containerCardPesquisa.innerHTML = '<p class="aviso">Carregando...</p>';

    valorDigitado = pesquisarInput.value.trim();

    if (!valorDigitado) {
      containerCardPesquisa.innerHTML = '<p class="aviso">Digite o nome de um filme</p>';
      return;
    }

    const tempoLimite = setTimeout(() => {
      containerCardPesquisa.innerHTML = `<p class="aviso">Tempo de busca excedido (30s).</p>`;
    }, 3000);

    try {
      const resultadoPesquisa = await getPesquisar(valorDigitado);

      clearTimeout(tempoLimite);

      if (!resultadoPesquisa || resultadoPesquisa.length === 0) {
        containerCardPesquisa.innerHTML = `<p class="aviso">Nenhum filme encontrado!</p>`;
        return;
      }

      containerCardPadrao.classList.add("esconder");

      containerCardPesquisa.innerHTML = '';

      btnVoltar.classList.remove("d-none")
      btnVoltar.classList.add("d-flex")

      resultadoPesquisa.forEach(filme => {
        const card = criarCardPadrao(filme);
        containerCardPesquisa.appendChild(card);
      });

    } catch (error) {
      clearTimeout(tempoLimite);
      containerCardPesquisa.innerHTML = `<p class="aviso">Erro ao buscar filmes.</p>`;
      console.error(error);
    }
  });
}
pegarValorInput()

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


// funcao de marcar e desmarcar os checkboxes
function pegarIdsGeneros() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const qtddGeneros = document.querySelector('.qtdd-generos')
    
    checkboxes.forEach(checkbox => {

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Adiciona ao array se estiver marcado
                adicionarGenero(this.value);
            } else {
                // Remove do array se estiver desmarcado
                removerGenero(this.value);
            }
            console.log("filtro carregado");
            
            qtddGeneros.innerHTML = generosSelecionados.length
            qtddGeneros.style.display = 'inline'
            exibirFilmes();
        });
    });
}

// Função para adicionar gênero ao array
function adicionarGenero(generoId) {
    if (!generosSelecionados.includes(generoId)) {
        generosSelecionados.push(generoId);
        console.log(`Gênero adicionado: ${generoId}`);
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

function exibirFilmes() {
    FormularioPesquisar.addEventListener('submit', (event)=>{

      event.preventDefault();

      console.log('Gêneros selecionados:', generosSelecionados);
      console.log('Valor input:', valorDigitado);

      if (generosSelecionados.length > 0 && !valorDigitado) {
          exibirGeneros(generosSelecionados);

      } else if (valorDigitado && generosSelecionados.length === 0) {
          pegarValorInput();

      } else if (valorDigitado && generosSelecionados.length > 0) {
          exibirGenerosComPesquisa(generosSelecionados, valorDigitado);

      } else {
          containerCardPesquisa.innerHTML = '<p class="aviso">Selecione gêneros ou pesquise um filme</p>';
      }
      })

}


async function exibirGeneros(idsGeneros) {
  if (!idsGeneros) return

  try {

    const resposta = await montarUrl(`/discover/movie`,{
      with_genres: idsGeneros.join(','),
      sort_by: 'popularity.desc'
    })

    containerCardPadrao.classList.add("esconder");

    containerCardPesquisa.innerHTML = '';

    btnVoltar.classList.remove("d-none")
        btnVoltar.classList.add("d-flex")

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

async function exibirGenerosComPesquisa(idsGeneros, input) {
  containerCardPesquisa.innerHTML = '<p class="aviso">Carregando...</p>';

  try {
    const resposta = await getPesquisar(input)
    
    const dados = resposta;
    //console.log(dados);
    

    if (!dados || dados.length === 0) {
      containerCardPesquisa.innerHTML = `<p class="aviso">(fliter cruzado)Nenhum filme encontrado!</p>`;
      return;
    }

    //filtragem
    const resultadosFiltrados = dados.filter(filme =>
      idsGeneros.every(id => filme.genre_ids.includes(Number(id)))
    );

    if (resultadosFiltrados.length === 0) {
      containerCardPesquisa.innerHTML =
        '<p class="aviso">Nenhum filme encontrado com os gêneros selecionados!</p>';
      return;
    }
    containerCardPadrao.classList.add("esconder");
    containerCardPesquisa.innerHTML = '';

    btnVoltar.classList.remove("d-none")
    btnVoltar.classList.add("d-flex")

    resultadosFiltrados.forEach(filme => {
      const card = criarCardPadrao(filme);
      containerCardPesquisa.appendChild(card);
    });

  } catch (error) {
    console.log(error);
  }
}




exibirGenerosFrontend();


/* cards filmes mais avaliados */
const containerCardPadrao = document.getElementById('containerCardPadrao');

async function getMaisAvaliados(page = 1){
    return montarUrl('/movie/top_rated', { page })
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


renderizarLista({
  container: containerCardPadrao,
  chamarRota: getMaisAvaliados,
  createCardFunction: criarCardPadrao,
});





const btnVoltar = document.querySelector(".btn-voltar");

btnVoltar.addEventListener("click", () => {
  containerCardPadrao.classList.remove("esconder"); 
  containerCardPesquisa.innerHTML = '';
});

