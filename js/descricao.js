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
const descricaoTitulo = document.querySelector(".filme-titulo")
const filmeAvaliacao = document.querySelector(".filme-avaliacao")
const filmeData = document.querySelector(".filme-data")
const descricao = document.querySelector(".filme-descricao")
const FilmeVideo = document.querySelector(".filme-video")


const urlParams = new URLSearchParams(window.location.search)
const valorMaisInfor = Number(urlParams.get("id"))


async function getMaisDetalhes(id){

    try {
        const resposta = await montarUrl(`/movie/${id}`,{ append_to_response: 'videos' })

        const imgApi = resposta.poster_path

        filmeImg.src = (`${TMDB_IMG}${imgApi}`)
       
        descricaoTitulo.innerHTML = resposta.title

        const data = new Date(resposta.release_date)
        const dataFormatada = data.toLocaleDateString('pt-BR')
        filmeData.innerHTML = dataFormatada
        

        filmeAvaliacao.innerHTML = resposta.popularity
        descricao.innerHTML = resposta.overview

        
        const videoKey = resposta.videos.results[0].key 

        if (videoKey) {
          FilmeVideo.src = (`${URL_VIDEO}${videoKey}`)
          FilmeVideo.style.display = "block"
        } else {
          console.log("passou aqui");
          
          FilmeVideo.style.display = "none"
        }

        
        console.log(resposta);

    } catch (error) {
        console.log(error);
    }
}


getMaisDetalhes(valorMaisInfor)
