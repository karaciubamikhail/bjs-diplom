let log = new LogoutButton();
log.action = () => {
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

let curs = new RatesBoard();

function cursset (){
    ApiConnector.getStocks(data=>{
        if(data.success){
            curs.clearTable();
            curs.fillTable(data.data);
        }
    })
}
cursset ();
setInterval(cursset, 60000);


let man = new MoneyManager();

man.addMoneyCallback = (data) =>{
    ApiConnector.addMoney(data, (response) => {
        if(response.success){
            ProfileWidget.showProfile(response.data);
            man.setMessage(response.success, 'Счёт успешно пополнен на ${data.amount} ${data.currency}');
        }
    });
}
man.conversionMoneyCallback = (data)=>{
    ApiConnector.convertMoney(data, (response)=>{
        if(response.success){
            ProfileWidget.showProfile(response.data)
        }
        else {
            man.setMessage(response.success, response.error);
        }
    })
}
man.sendMoneyCallback = (data) =>{
    ApiConnector.transferMoney(data,  (response) =>{
        if(response.success){
            ProfileWidget.showProfile(response.data);
            man.setMessage(response.success, `Перевод завершен ${data.amount} ${data.currency}`);
        }
        else {
            man.setMessage(response.success, response.error);
        }
    })
}

let Favorites = new FavoritesWidget();



ApiConnector.getFavorites (response =>{
    if(response.success){
        console.log(response);
        Favorites.clearTable();
        Favorites.fillTable(response.data);
        man.updateUsersList(response.data);
    }
});
Favorites.addUserCallback = (data) =>{
    ApiConnector.addUserToFavorites(data,(response)=>{
        if(response.success){
            Favorites.clearTable();
            Favorites.fillTable(response.data);
            man.updateUsersList(response.data);
        }
        else {
            man.setMessage(response.success, response.error);
        }
    })
}

Favorites.removeUserCallback = (data) =>{
    ApiConnector.removeUserFromFavorites(data, (response)=>{
        if(response.success){
            Favorites.clearTable();
            Favorites.fillTable(response.data);
            man.updateUsersList(response.data);
        }
        else {
            man.setMessage(response.success, response.error);
        }
    })
}