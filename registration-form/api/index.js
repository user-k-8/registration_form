const express = require('express');
const cors = require('cors');
const bodyParser =require('body-parser');
const db = require('./db')

db.connect(()=>{
    console.log('db connected')
})

const app = express();

app.use(cors()); // Enable CORS with custom options

app.set("view engine", "ejs");
app.use(express.static('public'));

const PORT = 4000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const usersRoute = require('./routes/users')

app.use('/api', usersRoute)

app.listen(PORT, () => {
    console.log(`Server running on localhost: ${PORT}`)
})

