import { searchMovies, discoverMovies, getGenres, TMDB_IMG } from "./conectApi.js";

const pesquisaForm = document.querySelectorAll('[data-search-form]')
const pesquisarInput = document.querySelectorAll('[data-search]')
const containerFilmes = document.getElementById('container-filmes')

let valorBusca = ''

pesquisarInput.forEach(input =>{
    input.addEventListener('input', ()=>{
        valorBusca = input.value
        console.log(valorBusca);

        pesquisarInput.forEach(todosInputs =>{
            if (todosInputs !== input) {
                todosInputs.value = valorBusca
            }
        })
    })
})

pesquisaForm.forEach(form =>{
    form.addEventListener('submit',  async (e)=>{
        e.preventDefault()
        const valorDigitado = valorBusca.trim().toLowerCase()

        console.log(valorDigitado);
        
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
            containerFilmes.innerHTML = "Erro ao buscar o filme. Tente mais tarde."
            console.error(error);
        } 

    })

})







// pesquisa por genero
// pesquisar por 2 