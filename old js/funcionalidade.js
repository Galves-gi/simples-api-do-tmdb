<<<<<<< HEAD
<<<<<<<< HEAD:old js/funcionalidade.js
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

========
=======
>>>>>>> 79291354032fd9697a07956186fe026b1c6d7087
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

<<<<<<< HEAD
>>>>>>>> 79291354032fd9697a07956186fe026b1c6d7087:js/funcionalidade.js
=======
>>>>>>> 79291354032fd9697a07956186fe026b1c6d7087
})*/