let page = 1
let postsContainer = document.querySelector('#posts-container')
const loaderContainer = document.querySelector('.loader')
const filterInput = document.querySelector('#filter')

/* const url = `http://jsonplaceholder.typicode.com/posts?_limit=5&_page=` */

/* await pausa a funçao até que que resposta da invocação do fetch seja obtida
assim que obtida, invocação resulta uma promisse, await atribui para response só valores resolvidos da promisse
assim, as linhas abaixos de response serao executadas... Toda função async retorna uma promisse */
const getPosts = async() => {
   const response= await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`)
   return response.json()
}

window.addEventListener("DOMContentLoaded", function(){
    addPostsIntoDOM()
})


//join retira as virgulas que separam as divs geradas na iteração
const addPostsIntoDOM = async () =>{
    const posts = await getPosts()
    const postsTemplate = posts.map(function(item){return `
        <div class="post">
            <div class="number">${item.id}</div>
            <div class="post-info">
                <h2 class="post-title">${item.title}</h2>
                <p class="post-body">${item.body}</p>
            </div>
        </div>
    `})
    let joinedPostsTemplate = postsTemplate.join('')
    postsContainer.innerHTML += joinedPostsTemplate
}

/* envia um valor de page acrescido, e chama a função addPostsIntoDOM para adicionar os novos posts consumidos da API ao posts container */
const getNextPosts = () =>{
    setTimeout(() =>{
        page++
        addPostsIntoDOM()
    }, 300)
}


/* a função remove loader, além de setar um tempo com setTimeout para a animação de loading permanecer na tela, invoca a função getNextsPosts, que 
carregara mais posts na tela */
const removeLoader = () =>{
    setTimeout(()=>{
        loaderContainer.classList.remove('show')
        getNextPosts()
    },1000)
}

/* a função showLoader é chamada quando a condiçao de evento de scroll é satisfeita */
const showLoader = () =>{
    loaderContainer.classList.add('show')
    removeLoader()
}

//caso uma condição seja feita atravez do evento scroll, invoca a função showLoader
//### função de scroll infinito ###
window.addEventListener('scroll', ()=>{
    const {clientHeight, scrollHeight, scrollTop } = document.documentElement
    const isPageBottomAlmostReached = scrollTop + clientHeight >= scrollHeight-10
    if(isPageBottomAlmostReached){
        showLoader()
    }
})

//event contem informações sobre o evento que aconteceu (neste caso, input)
filterInput.addEventListener('input', event =>{
    //console.log(event.target.value)... armazena o valor escrito no input
    const inputValue = event.target.value.toLowerCase()
    //obtem e armazena referências dos posts que estão na tela
    const posts = document.querySelectorAll('.post')
    posts.forEach(post=>{
        /* itera sobre os elementos .post e retira o texto do title/body, transforma em lower case e verifica se o texto
        contem o digitado no input... A seguir, filtra */
        const postTitle = post.querySelector('.post-title').textContent.toLowerCase()
        const postBody = post.querySelector('.post-body').textContent.toLowerCase()
        if(postTitle.includes(inputValue) || postBody.includes(inputValue)){
            post.style.display = 'flex'
            return
        }
        post.style.display = 'none'
    })
})

// /\ da pra melhorar a pesquisa