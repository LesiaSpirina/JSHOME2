"use strict";

const basketCircleCountEl = document.querySelector('.cartIconWrap span');//найдем  элемент  
//кружок, в котором отражается количество товара в корзине
const basketEl = document.querySelector('.basket');//Найдем элемент выпадающая корзина
//В ней будет отражаться инфа о товаре, цене,кол-ве и итоговой сумме(меню корзины)
const cartBasketEl = document.querySelector('.cartIconWrap');//найдем саму корзину на которую будем 
//кликать мышкой, чтоб открывать ее и закрывать.Здесь по клику будет выпадать меню корзины
const totalSumOfShoppingEl = document.querySelector('.basketTotalValue');//найдем элемент,  
//в который будем вычислять(выводить) итоговую сумму покупки в выпадающем меню корзины
const rowInBasketEl = document.querySelector('.basketTotal'); // в выпадающей корзине найдем div(строку),
//для того, чтобы перед этим  div(строкой) в дальнейшем добавить новый div с товаром , который
//будем покупать.Перед basketTotal будет новый div(строка), в нем будет отражаться наименование,цена
// количество и итоговая сумма по какому-то выбранному товару или товарам

//На элемент со значком корзины  повесим событие - что при клике на эту корзину у нас будет 
// появляться  выпадающее меню корзины, либо  убираться с помощью classList.toggle

cartBasketEl.addEventListener('click', () => {
    basketEl.classList.toggle('hidden');
});

//Создадим пустой объект, в котором в дальнейшем будет храниться инфа об id, названии и цене товара,
//который будем выбирать по кнопке Add To Cart(добавить в корзину)
 const productInBasketObj = {};

 //все товары находятся в одной общей коробке <div class="featuredItems">.
 //сделаем делегирование.мы не знаем сколько у нас в дальнейшем будет товаров, и чтоб
 //каждый раз не прописывать все заново в новый товар делегируем все на общего родителя featuredItems.
 //На этот общий div повесим событие - что !при проверке определенного условия! при клике 
 // на кнопку Add To Cart (при выборе товара) будут выполняться следующие действия: при клике 
 //мы будем брать(получать) инфу из карточки товара с классом featuredItem
 //(т.е инфа будет включать id, наименование(name),цена(price) и все это будет отображаться 
 //в выпадающем меню корзины при помощи функции addToCart

 const itemContainerBoxEl = document.querySelector('.featuredItems');//найду общего родителя с нужным классом
 itemContainerBoxEl.addEventListener('click', (event) => { //вешаем событие и делаем проверку
        if(!event.target.closest ('.addToCart')) {   //если при клике по нашему целевому элементу 
            return;         //НИ ОН,НИ один из его  родителей не содержат класс.addToCart,то
        }                   // проигнорировать и ничего не делать.
        
        //Если же содержит - то у нашего  целевого элемента найти ближайший элемент с 
        //классом featuredItem(это карточка нашего товара и это элемент,в котором в html прописано 
        //в data атрибутах:- id, name, price), 
        //сохранить в переменной itemCard и из него вытянуть  id,name,price с помощью dataset
        //Функция addToCart отобразит все в меню корзины
        

        const itemCard = event.target.closest('.featuredItem');
        const id = Number(itemCard.dataset.id); //сделаем результат числом
        const name = itemCard.dataset.name;
        const price = Number(itemCard.dataset.price); //сделаем результат числом

        addToCart(id, name, price);    
    });

    
    function addToCart (id, name, price) { //принимает параметры,которые получили ранее 
        if(!(id in productInBasketObj)) { // проверка - если такого id еще нет в корзине, 
            productInBasketObj[id] = { //то положи туда объект,в котором продублируем id(для того чтобы
                id: id,                 //легче было работать и искать).В объект запишишем свойства
                name: name,             //id,name,price, а значения возмем из id,name,
                price: price,          //price,полученные из data-атрибута товара и добавим
                count: 0,                   //count(количество конкретного товара,пока поставим 0)
            }                              //Если же такой  id уже есть в корзине, то просто к count будем 
        }                               //прибавлять 1 после каждого клика по кнопке Add To Cart
        productInBasketObj[id].count++;

        basketCircleCountEl.textContent = getSumOfAllCount();//отобразится количество товара в кружочке
        totalSumOfShoppingEl.textContent = getTotalSumOfShopping().toFixed(2); // отобразим общую сумму покупки 
        renderNewProductinBasket(id); //отобразит в корзине наименование, цену,кол-во товара и общую
    };                        //сумму по каждой позиции товар + кол-во

    function getSumOfAllCount() {                                //создадим переменную для перебора с помощью
        const allProductArr = Object.values(productInBasketObj); //цикла for.У объекта у родительского       
                                                    //конструктора Object используем метод values
        let count = 0;                            // В переменной сохраним массив всех данных(Object.values)
                                               //объекта productInBasketObj, в переменную count 
        for(const el of allProductArr) {       //положим значение количества товаров(изначально = 0)
            count += el.count;              //переберем все элементы(el-один товар в нашей корзине allProductArr)
        }                                  //и пересохраним count, прибавив к его значению + значениеe еl.count
           return count;                 //(кол-во выбранного товара)так будет переберать пока товар в корзине
    }                            //имеется и вернем общее количество товара

    function getTotalSumOfShopping() {
        const allProductArr = Object.values(productInBasketObj); //сделаем все по аналогии с предыдущей функцией
        let price = 0;                                          //в price сохраним результат вычисления. 
        for ( const product of allProductArr) {                // изначально возьмем цену за 0. К 0 прибавим 
            price += (product.count * product.price);         //(кол-во товара умножим на цену единицы товара )
        }                                                  //теперь в price лежит результат первого вычисления
        return price;                                     //дальше  цикл for будет перебирать и цену ставить
    }    //не 0, а ту которая получилась при вычислении и уже к ней прибавлять (product.count * product.price)
         // до тех пор , пока в корзине есть товар. Все переберет и вернет общую сумму покупок


    function renderNewProductinBasket(id) {   //поищем в корзине- нет ли уже определнного товара в ней 
        const basketRowEl = basketEl          // ${id} отвечает как раз за то на какой товар мы кликнули
        .querySelector(`.basketRow[data-productId ="${id}"]`);
        if(!basketRowEl) {                     // и определит есть такая id(товар по id) в корзине или нет
            renderNewProductRowInBasket(id);   //если нет - то в корзине отобразиться productNewRow новый товар
            return;                            //и после этого произойдет return
        }                                     //если есть, то сделаем следующее: у нового div(разметка)
        // найдем .productCount - это ячейка с количеством в выпадающей корзине и изменим кол-во, положим
        // новое значение равное тому сколько раз мы кликнули на кнопку Add To Cart по товару с определенной id
        //нужно изменить и итоговую сумму по конкретному товару, для этого найдем productTotalRow - ячейка
        // с итоговой суммой по одному виду товара - в нее положим новое значение = цена * кол-во и
        // используем toFixed(2), чтобы оставалось 2 знака после запятой

        basketRowEl.querySelector('.productCount').innerText = productInBasketObj[id].count;
        basketRowEl.querySelector('.productTotalRow')
        .innerText = (productInBasketObj[id].price * productInBasketObj[id].count).toFixed(2);

    
    }                                        
    //функция вставит новую (строку)разметку в выпадающее меню корзины того товара по которому был клик
    // по кнопке add to cart  и которого еще нет в корзине.Разметка содержит наименование, кол-во, цену
    // товара и итоговую сумму по конкретной позиции. Перед rowInBasketEl(строка с итоговой суммой всех
    //покупок) вставим вот эту разметку
    function renderNewProductRowInBasket(productId) {
        const  productNewRow = `
            <div class="basketRow" data-productId ="${productId}">
              <div>${productInBasketObj[productId].name}</div> 
              <div> 
                <span class="productCount">${productInBasketObj[productId].count}</span> шт.
              </div>
              <div>${productInBasketObj[productId].price}</div>
              <div>
                $<span class="productTotalRow">
                  ${(productInBasketObj[productId].price * productInBasketObj[productId].count)}
                </span>
              </div>
            </div>`;

        rowInBasketEl.insertAdjacentHTML('beforebegin', productNewRow);
         }

        
        


    

 
