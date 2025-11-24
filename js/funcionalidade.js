const carrosseis = document.querySelectorAll(".carousel-container")

carrosseis.forEach(container =>{
    const carouselCard = container.querySelector(".carousel-card")
    const botaoVoltar = container.querySelector(".botao-voltar")
    const botaoProx = container.querySelector(".botao-prox")

    botaoVoltar.addEventListener('click', ()=>{
        carouselCard.scrollLeft -= 300
    })

    botaoProx.addEventListener('click', ()=>{
        carouselCard.scrollLeft += 300
    })

})



/* modal 
const modalBody = document.querySelector(".modal-body")
const btnSuspenso = document.querySelector(".botao-suspenso")

btnSuspenso.addEventListener('click', ()=>{
    if (!modalBody.classList.contains('expanded')) {
            modalBody.classList.toggle('expanded');
            btnSuspenso.classList.toggle('expanded');
    }else{
        modalBody.classList.remove('expanded');
        btnSuspenso.classList.remove('expanded');
    }

})*/