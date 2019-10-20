require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//allow cors
app.use(cors());

app.use(require('./service/notification'));

app.listen(process.env.PORT,()=>{
    console.log('Escuchando en el puerto', process.env.PORT)
});