class User {
    constructor(
       clientId = 0,
       username = '',
       password = '',
       name = '',
       lastname = '',
       email = '',
       age = 0,
       height = 0,
       weight = 0,
       imc = 0,
       geb = 0,
       eta = 0,
       creationDate = new Date(),
       updateDate = new Date(), 
    ) {
        this.clientId = clientId;
        this.username = username;
        this.password = password;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.age = age;
        this.height = height;
        this.weight = weight;
        this.imc = imc;
        this.geb = geb;
        this.eta = eta;
        this.creationDate = creationDate;
        this.updateDate = updateDate; 

    }
}

module.exports = {
    User,
}


