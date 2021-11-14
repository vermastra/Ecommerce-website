const mongoose = require('mongoose');

const connectDataBase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true, useUnifiedTopology: true,
        // useCreateIndex: true
    }).then((data) => {
        console.log(`mongodb connected with server ${data.connection.host}`);
    })

    // unhandled promise in server.js will handle this part*********
    // .catch((err) => {   
    //     console.log(err);
    // })
}

module.exports=connectDataBase;

