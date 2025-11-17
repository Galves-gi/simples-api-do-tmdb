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

