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

    cardPadrao.innerHTML = `
        <a href="./pages/descricao.html?id=${filme.id}">
            <img src="${TMDB_IMG}${filme.poster_path}" alt="${filme.title}">
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

    return Array.from(checkboxes).map(checkbox => checkbox.value)

    // transforma checkboxes q é nodeList em um array (array.from), depois ele pode usar todos os metodos de array, como o map, que neste caso vai pegar cada valor de input marcado e enviar para return
}

// limpar os checkboxes selecionados
function limparCheckboxSelcionado() {
    const checkboxes = document.querySelectorAll('li[data-genero-checkbox] input[type="checkbox"]')
    
    return checkboxes.forEach(checkbox => checkbox.checked = false)
}

async function pesquisarGeneros() {
    const idsGeneros = pegarCheckboxSelecionado()

    console.log(idsGeneros);
    containerFilmes.innerHTML = ''

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
        valorBusca = input.value
        //console.log(valorBusca);

        pesquisarInput.forEach(todosInputs =>{
            if (todosInputs !== input) {
                todosInputs.value = valorBusca
            }
        })
    })
})

// pesquisa
pesquisaForm.forEach(form =>{ // cada form
    form.addEventListener('submit',  async (e)=>{
        e.preventDefault()

        // condicao de pesquisa
        const valorDigitado = valorBusca.trim().toLowerCase()
        const valorGeneros = pegarCheckboxSelecionado()

        console.log(valorGeneros);
        console.log(valorDigitado);

        if (valorDigitado.length < 0 && valorGeneros.length < 0) {
            console.log('Digita algo');
            
            return
        }

        
        pesquisarGeneros()
        limparCheckboxSelcionado()
        
        if (valorDigitado.length === 0) {
            alert("Digite algo no input")
            return
        }

        containerFilmes.innerHTML = "Carregando...."
        
        try {
            const resultados = await searchMovies(valorDigitado) 
            containerFilmes.innerHTML = ""

            resultados.results.forEach(cadaFilme => {
                containerFilmes.appendChild(criarCardPadrao(cadaFilme))
            });

            
        } catch (error) {
            containerFilmes.innerHTML = "Erro ao buscar o filme. Tente mais tarde."
            console.error(error);
        }  

    })

})
/* 
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

} */

exibirGeneros()


// funcao pesquisa por genero
// exibir na tela getGenres - ok
// pegar os selcionados
// pesquisar por selecionados 


// pesquisar por 2 
// if... else
// 


// localStorage
// funcao de aviso
