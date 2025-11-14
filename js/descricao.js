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



// codigo da pagina

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500'
const URL_VIDEO = 'https://www.youtube.com/embed/'

const filmeImg = document.querySelector(".filme-img")
const filmeTitulo = document.querySelector(".filme-titulo")
const filmeAvaliacao = document.querySelector(".filme-avaliacao")
const filmeStatus = document.querySelector(".filme-status")
const filmeData = document.querySelector(".filme-data")
const filmeDuracao = document.querySelector(".filme-duracao")
const filmeBreveCitacao = document.querySelector(".filme-breveCitacao")
const filmeDescricao = document.querySelector(".filme-descricao")
const filmeGenero = document.querySelector(".filme-genero")
const filmeVideo = document.querySelector(".filme-video")


const urlParams = new URLSearchParams(window.location.search)
const valorMaisInfor = Number(urlParams.get("id"))


async function getMaisDetalhes(id){

    try {
        const resposta = await montarUrl(`/movie/${id}`,{ append_to_response: 'videos' })

        // imagem
        const imgApi = resposta.poster_path

        filmeImg.src = (`${TMDB_IMG}${imgApi}`)

       // titulo
        filmeTitulo.innerHTML = resposta.title
        // status
        //filmeStatus.innerHTML = resposta.status

        // data
        const data = new Date(resposta.release_date)
        const dataFormatada = data.toLocaleDateString('pt-BR')
        filmeData.innerHTML = dataFormatada
        
        // avaliacao
        filmeAvaliacao.innerHTML = resposta.vote_average.toFixed(2)
        
        // tempo de duracao
        const minutos = resposta.runtime;
        const horas = Math.floor(minutos / 60);
        const min = minutos % 60;

        const duracaoFormatado = `${horas}h ${min}m`;

        filmeDuracao.innerHTML = duracaoFormatado

        // descricao
        filmeBreveCitacao.innerHTML = resposta.tagline
        filmeDescricao.innerHTML = resposta.overview

        //genero
        const genero = resposta.genres
        cardSugestoes(genero)
        
        filmeGenero.innerHTML = genero.map(nomeFilme => nomeFilme.name).join(", ")


        // video
        const videoKey = resposta?.videos?.results?.[0]?.key

        if (videoKey) {
          filmeVideo.classList.remove("d-none")
          filmeVideo.src = (`${URL_VIDEO}${videoKey}`)
        }

        
       // console.log(resposta);

    } catch (error) {
        console.log(error);
    }
}


getMaisDetalhes(valorMaisInfor)

const containerDescricao = document.getElementById('containerCardCarrosselDescricao')

function criarCardCarrossel(filme) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <a href="./descricao.html?id=${filme.id}">
            <img src="${TMDB_IMG}${filme.poster_path}" alt="${filme.title}">
        </a>
    `
    return card
}

async function cardSugestoes(ids) {
  if (!ids) return
  
  //genero
  const idsGeneros = ids.map(idsFilme => idsFilme.id)

  try {

    const resposta = await montarUrl(`/discover/movie`,{
      with_genres: idsGeneros.join(','),
      sort_by: 'popularity.desc'
    })

    containerDescricao.innerHTML = '';

    resposta.results.forEach(filme => {

    const card = criarCardCarrossel(filme);
    containerDescricao.appendChild(card);
    });

    console.log(resposta);
    

  } catch (error) {
    console.log(error);
  }
}



/* pegar a lista de generos Api ok
depois pegar os IDs ok
depois repassar cada id para a url 
retornar 5 cards de cada id
retornar no card carrossel */