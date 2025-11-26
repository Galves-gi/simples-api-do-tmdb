import { searchMovies, discoverMovies, getGenres, TMDB_IMG } from "./conectApi.js";

const pesquisaForm = document.getElementById('pesquisa-form')
const pesquisarInput = document.getElementById('pesquisar-input')
const containerFilmes = document.getElementById('container-filmes')

pesquisaForm.addEventListener('submit',  async (e)=>{
    e.preventDefault()

    const valorDigitado = pesquisarInput.value.toLowerCase().trim()
    
    if (valorDigitado.length === 0) {
        alert("Digite algo no input")
        return
    }

    containerFilmes.innerHTML = "Carregando...."
    
    try {
        const resultados = await searchMovies(valorDigitado) 
        containerFilmes.innerHTML = ""

        resultados.results.forEach(cadaFilme => {

            containerFilmes.innerHTML += `
                <div class="col">
                        <img src="${TMDB_IMG}${cadaFilme.poster_path} alt="${cadaFilme.title}">
                </div>
            `
        });
        
    } catch (error) {
        console.error(error);
        containerFilmes.innerHTML = "Erro ao buscar o filme. Tente mais tarde."
    }
})



// tratar infors => html 
// pesquisa por nome  - foca aquiii
/* 
- submit
- pegar o input
- tratar o input
- enviar o input
- try... catch

*/













// pesquisa por genero
// pesquisar por 2 