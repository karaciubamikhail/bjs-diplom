let logoutbtn = new LogoutButton();
logoutbtn.action = () => {
    ApiConnector.logout(callback => {
        if (callback.success) {
            location.reload();
        }
    })
};

ApiConnector.current(response=>{
    if(response.success){
        ProfileWidget.showProfile(response.data);
    }
})

let rateboard = new RatesBoard();

function cursset (){
    ApiConnector.getStocks(data=>{
        if(data.success){
            rateboard.clearTable();
            rateboard.fillTable(data.data);
        }
    })
}
cursset ();
setInterval(cursset, 60000);


let moneymanagers = new MoneyManager();

moneymanagers.addMoneyCallback = (data) =>{
    ApiConnector.addMoney(data, (response) => {
        if(response.success){
            ProfileWidget.showProfile(response.data);
            moneymanagers.setMessage(response.success, `Счёт успешно пополнен на ${data.amount} ${data.currency}`);
        }
        else{
            moneymanagers.setMessage(response.success, response.error);
        }
    });
}
moneymanagers.conversionMoneyCallback = (data)=>{
    ApiConnector.convertMoney(data, (response)=>{
        if(response.success){
            ProfileWidget.showProfile(response.data);
            moneymanagers.setMessage(response.success, `Конвертирована валюта`);
        }
        else {
            moneymanagers.setMessage(response.success, response.error);
        }
    })
}
moneymanagers.sendMoneyCallback = (data) =>{
    ApiConnector.transferMoney(data,  (response) =>{
        if(response.success){
            ProfileWidget.showProfile(response.data);
            moneymanagers.setMessage(response.success, `Перевод завершен ${data.amount} ${data.currency}`);
        }
        else {
            moneymanagers.setMessage(response.success, response.error);
        }
    })
}

let favorites = new FavoritesWidget();



ApiConnector.getFavorites (response =>{
    if(response.success){
        console.log(response);
        favorites.clearTable();
        favorites.fillTable(response.data);
        moneymanagers.updateUsersList(response.data);
    }
});
favorites.addUserCallback = (data) =>{
    ApiConnector.addUserToFavorites(data,(response)=>{
        if(response.success){
            favorites.clearTable();
            favorites.fillTable(response.data);
            moneymanagers.updateUsersList(response.data);
            favorites.setMessage(response.success, `Пользователь ${data.name} добавлен в избранные`);
        }
        else {
            moneymanagers.setMessage(response.success, response.error);
        }
    })
}

favorites.removeUserCallback = (data) =>{
    ApiConnector.removeUserFromFavorites(data, (response)=>{
        if(response.success){
            favorites.clearTable();
            favorites.fillTable(response.data);
            moneymanagers.updateUsersList(response.data);
            favorites.setMessage(response.success, `Пользователь c ID ${data} удален из избранных`);
            console.log(data);
        }
        else {
            moneymanagers.setMessage(response.success, response.error);
        }
    })
}