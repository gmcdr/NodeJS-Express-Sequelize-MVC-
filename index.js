//Importando pacotes
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

//Iniciando o express
const app = express()

//Models
const Tips = require('./models/Tips')
const User = require('./models/User')


//Import Routes
 const tipsRoutes = require('./routes/tipsRoutes')
 const authRoutes = require('./routes/authRoutes')

//Require da conexção com o banco
const conn = require('./db/conn')

//Import Controller
const TipsController = require('./controllers/TipsController')


//Template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//receber resposta do body

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// session middleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// public path
app.use(express.static('public'))

// set session to res
app.use((req, res, next) =>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})

// flash messages
app.use(flash())


//Routes
app.use('/tips', tipsRoutes)
app.use('/', authRoutes)

app.get('/', TipsController.showTips)

//Criar conexção
conn
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))