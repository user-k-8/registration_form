const express = require('express');
const cors = require('cors');
const bodyParser =require('body-parser');
const db = require('./db')

const app = express();

app.use(cors({
    origin: process.env.url
})); // Enable CORS with custom options//

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.url);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
  });

app.set("view engine", "ejs");
app.use(express.static('public'));

const PORT = 4000

db.connect(()=>{
    console.log('db connected')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const usersRoute = require('./routes/users')

app.use('/api', usersRoute)

app.listen(PORT, () => {
    console.log(`Server running on localhost: ${PORT}`)
})

