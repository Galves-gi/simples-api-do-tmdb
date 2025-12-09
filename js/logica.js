import { searchMovies, discoverMovies, getGenres, TMDB_IMG } from "./conectApi.js";

const pesquisaForm = document.querySelectorAll('[data-search-form]')
const pesquisarInput = document.querySelectorAll('[data-search]')
const containerGeneros = document.querySelectorAll('.menu-generos')
//const qtddGeneros = document.querySelectorAll('.qtdd-generos')
const containerFilmes = document.getElementById('container-filmes')

let valorBusca = ''

// função gerar card
function criarCardPadrao(filme) {
    const cardPadrao = document.createElement('div')
    cardPadrao.classList.add('col')

    const caminhoImg = filme.poster_path ? `${TMDB_IMG}${filme.poster_path}` : "/assets/favicon.png"

    cardPadrao.innerHTML = `
        <a href="descricao.html?id=${filme.id}">
            <img src="${caminhoImg}" alt="${filme.title}">
        </a>
    `
    return cardPadrao
}


// Exibir os generos
async function exibirGeneros() {
    const listaGeneros = await getGenres() // retorna um array

    containerGeneros.forEach(cadaContainer =>{ // pegando cada ul

        listaGeneros.forEach(genero =>{ // cada genero

            const li = document.createElement('li')
            li.classList.add('dropdown-item')
            li.dataset.generoCheckbox = ''
            /* 
            No JavaScript, você usa camelCase → dataset.generoCheckbox. No HTML, ele converte automaticamente para kebab-case → data-genero-checkbox
            */

            li.innerHTML = `
                <input class="form-check-input me-1" type="checkbox" name="generos" value="${genero.id}" id="genero-${genero.id}">
                <label class="form-check-label" for="genero-${genero.id}">${genero.name}</label>
            `
            cadaContainer.appendChild(li)
        })
    })
}

// pegar os checkbox selecionados de todos os container generos
function pegarCheckboxSelecionado() {
    const checkboxes = document.querySelectorAll('li[data-genero-checkbox] input[type="checkbox"]:checked')
    //qtddGeneros.forEach(cada => cada.textContent = checkboxes.length)

    const listaCheckboxes = Array.from(checkboxes).map(checkbox => checkbox.value)

    localStorage.setItem("listaCheckboxes", JSON.stringify(listaCheckboxes));

    // transforma checkboxes q é nodeList em um array (array.from), depois ele pode usar todos os métodos de array, como o map, que neste caso vai pegar cada valor de input marcado e enviar para return
}


// pesquisar os filmes por generos
async function pesquisarGeneros() {

    const idsGeneros = JSON.parse(localStorage.getItem("listaCheckboxes"))//pegarCheckboxSelecionado()

    console.log(idsGeneros);
    containerFilmes.innerHTML = ''

    if (idsGeneros.length === 0) {
        return
    }

    try {
        const dados = await discoverMovies(idsGeneros)
        console.log(dados);
        
        dados.results.forEach(filme =>{
            containerFilmes.appendChild(criarCardPadrao(filme))
        }) 
        
    } catch (error) {
        console.log(error);
    }
    
}

// pegar os inputs de todos os forms
pesquisarInput.forEach(input =>{

    input.addEventListener('input', ()=>{
        valorBusca = input.value.trim().toLowerCase()

        localStorage.setItem("valorBusca", valorBusca)
        //console.log(valorBusca);

        pesquisarInput.forEach(todosInputs =>{
            if (todosInputs !== input) {
                todosInputs.value = valorBusca
            }
        })
    })
})

pesquisaForm.forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();

        if (window.location.pathname !== "/pages/pesquisa.html") {
            window.location.href = "/pages/pesquisa.html";
            return;
        }

        TipoDeFiltro();
    });
});

if (window.location.pathname === "/pages/pesquisa.html") {
    TipoDeFiltro();
}


// pesquisa
async function TipoDeFiltro(){

        pegarCheckboxSelecionado()

        const valorDigitado = localStorage.getItem("valorBusca") || ""

        const valorGeneros = JSON.parse(localStorage.getItem("listaCheckboxes")) || []

        containerFilmes.innerHTML = ""

        if (valorDigitado.length === 0 && valorGeneros.length === 0) {
            alert('Digite ou seleciona gênero')
            return
        }

        try {
            //filtro por nome
            if (valorDigitado.length > 0 && valorGeneros.length === 0) {

                const resultados = await searchMovies(valorDigitado) 

                resultados.results.forEach(cadaFilme => {
                    containerFilmes.appendChild(criarCardPadrao(cadaFilme))
                });

            // filtro somente por generos
            }else if(valorDigitado.length === 0 && valorGeneros.length > 0) {
                pesquisarGeneros()

            //filtro cruzado
            }else if (valorDigitado.length > 0 && valorGeneros.length > 0) {
            
                const resultados = await searchMovies(valorDigitado) 

                const generos = new Set(valorGeneros.map(Number))

                const resultadoFiltroCruzado = resultados.results.filter(filme => filme.genre_ids.some(idGenero => generos.has(idGenero)))

                resultadoFiltroCruzado.forEach(cadaFilme => {
                    containerFilmes.appendChild(criarCardPadrao(cadaFilme))
                });
                //console.log(resultadoFiltroCruzado);
            }
            
        } catch (error) {
            containerFilmes.innerHTML = "Erro ao buscar o filme. Tente mais tarde."
            console.error(error);
        }
        // limpar inputs e localStorage
        //e.target.reset()
        localStorage.clear()
}

exibirGeneros()