let cart = []; // esse é o array do nosso carrinho
let modalQt = 1; // aqui fizemos uma variavel para adicionar a quantidade de itens que tem no modelo
let modalKey = 0; // aqui me diz qual pizza esta clicada

//________________________________________________________________________________________________________________
// atalhos

const c = (el)=>{  // uma função para pegar um elemento document.querySelector() no singular
    return document.querySelector(el)
}
const cs = (el)=>{ // uma função para pegar um elemento document.querySelector() no plural
    return document.querySelectorAll(el)
}

//________________________________________________________________________________________________________________

//listagem das pizzas
// 1° vamos mapear nossa lista json
pizzaJson.map((item, index)=>{  // aqui vamos receber dois parametros o item e o numero do array daquele item 
    
    let pizzaItem = c('.models .pizza-item').cloneNode(true)  // vamos fazer um clone do elemento .models .pizza-item, com a função .cloneNode(), com o true como parametro ele não só clona o item mas como tudo que está dentro     

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;  // aqui vamos colocar as fotos das pizzas, o nome foi pegado da requisição (item.img)    
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;  // aqui vamos colocar os nomes das pizzas, o nome foi pegado da requisição    
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;  // aqui vamos colocar as descrições das pizzas, o nome foi pegado da requisição    
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.', ',')}`;  // aqui vamos colocar os preços das pizzas, o nome foi pegado da requisição    

    //________________________________________________________________________________________________________
    // esses codigos são da area onde é clicada e aparece a pizza escolhida
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{  // aqui vamos criar um codigo para bloquear determinada ação

        e.preventDefault(); // essa função .preventDefault bloqueia a ação padrão

        let key = e.target.closest('.pizza-item').getAttribute('data-key');//esse codigo diz, pegue oque está em parentese que esteja proximo de a( a, porque é o elemento que estamos agora), vamos pegar a informação do id da pizza
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;  // aqui vamos preencher as informações no modelo
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.', ',')}`;
        c('.pizzaInfo--size.selected').classList.remove('selected')// aqui vamos pegar o item que esta selecionado, vai acessar a lista de classes e vai remover a classe de seleção


        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ //para cada um dos itens vai rodar uma função, essa função mostra a gramagem das pizzas, e vai com dois parametros o item(que vou chamar de size) , o index (que vou chamar de sizeIndex)
            
            if(sizeIndex === 2){ // se o index for igual a 2, 
               size.classList.add('selected');  //então add a lista de classes o selected
            }            
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex] // aqui estamos adicionando os tamanhos das pizzas

        }) 
        
        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0 // aqui vai diminuir a opacidade 
        c('.pizzaWindowArea').style.display = 'flex' // aqui vamos mudar o display para aparecer o elemento

        setTimeout(()=>{ 
            c('.pizzaWindowArea').style.opacity = 1 // aqui vai aumentar a opacidade
        }, 200)

    })    
    c('.pizza-area').append(pizzaItem)  // vamos pegar o conteudo de pizza area e depois adicionar mais conteúdo e dentro colocamos o elemento que queremos adicionar o pizzaItem
});

//________________________________________________________________________________________________________________________

//Eventos do modelo
function closeModal(){

    // primeiro vamos mudar a opacidade
    c('.pizzaWindowArea').style.opacity = 0

    // depois vamos dar um setTimeout para sumir devagar
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 1000)
    
}

// com o forEach percoremos os dois itens
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{ // para cada um deles eu vou executar essa função
    item.addEventListener('click', () => {
        closeModal()
    })
})

//_______________________________________________________________________________________________________________

// vamos mecher com os botões

// botão de menos 
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;

    }
})

// botão de mais
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
})

//________________________________________________________________________________________________________
// vamos selecionar os tamanhos

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    // vamos selecionar uma opção e desmarcar a que estava marcada
    size.addEventListener('click', (e) => {
        // primeiro vamos desmarcar o selected
        c('.pizzaInfo--size.selected').classList.remove('selected')
        // agora vamos selecionar
        size.classList.add('selected');
    })
})

//__________________________________________________________________________________________________________
// vamos mecher no adicionar

c('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')) // aqui usamos o .getAttribute('data-key') para saber qual é o tamanho que esta selecionado

    // aqui nós vamos juntar as infomações para criar o identificador
    let identfier = pizzaJson[modalKey].id+'@'+size;

    //aqui vamos verificar se no carrinho temos o mesmo identificador
    let key = cart.findIndex((item) => {
        return item.identfier === identfier
    })

    if(key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identfier,
            id:pizzaJson[modalKey].id,
            nome:pizzaJson[modalKey].name,
            size,
            qt: modalQt
        })
    }  
    updateCart()
    closeModal()  
    
})

c('.menu-openner').addEventListener('click', () => { 
    if(cart.length > 0){
        updateCart()
    c('aside').style.left = '0px';
    }     
})
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
})

// _______________________________________________________________________________________________________
// agora vamos fazer com que o carrinho de compras apareça 

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length
    if(cart.length > 0) { // se no meu carrinho tiver mais que 0 itens faça
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in cart){ // vamos mapear nosso carrinho
            // primeiro nós precisamos identificar qual é a pizza
            // e baseado nesse id nós pegamos as informações dela
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            // avos preencher os itens do nosso carrinho
            let cartItem = c('.models .cart--item').cloneNode(true)
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName= 'P'
                break;
                case 1:
                    pizzaSizeName= 'M'
                break;
                case 2:
                    pizzaSizeName= 'G'
                break;

            }
            

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1){
                    cart[i].qt--
                } else {
                    cart.splice(i, 1);
                    c('aside').style.left = '100vw';
                }
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })
            c('.cart').append(cartItem);
        }

        desconto += (subtotal*10)/100
        total += subtotal - desconto
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace('.', ',')} `
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace('.', ',')} `
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace('.', ',')} `

    } else { // se não tiver nada no carrinho
        c('aside').classList.remove('show')
    }
}

