const  User =  require('../models/User')

const bcrypt = require('bcryptjs')
const { use } = require('../routes/authRoutes')

module.exports = class AuthController {
    
    static login(req, res){
        res.render('auth/login')
    }


    static async loginPost(req, res) {
        
        const {email, password} = req.body

        //find user
        const user = await User.findOne({where: {email: email}})

        if (!user) {
            req.flash('error', 'Usuário ou senha incorreto!')
            res.render('auth/login')
            return
        }

        //check password
        const passwordCheck = bcrypt.compareSync(password, user.password)

        if (!passwordCheck) {
            req.flash('error', 'Usuário ou senha incorreto')
            res.render('auth/login')
            return
        }

        const createdUser = await User.create(user)

        //Initialaze Session
        req.session.userId = user.id

        req.flash('message', 'Login realizado com sucesso!')
        

        req.session.save(()=> {
            res.redirect('/')
        })
        
    }

    static logout(req, res){
        req.session.destroy()
        res.redirect('/')
    }

    static register(req, res){
        res.render('auth/register')
    }

    static async registerPost(req, res){

        const {name, email, password, confirmpassword } = req.body

        // password match validation
        if (password != confirmpassword) {
            req.flash('error', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')
            return
        }

        // check user exists
        const checkIfUserExists = await User.findOne({where: {email: email}})

        if (checkIfUserExists) {
            req.flash('error', 'O e-mail já está em uso!')
            res.render('auth/register')
            return
        }

        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        // create a user
        const user = {
            name, 
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user)

            //Initialaze Session
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(()=> {
                res.redirect('/')
            })
            
        } catch (error) {
            console.log(error)
        }
    }

}