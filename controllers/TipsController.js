const Tips = require('../models/Tips')
const User = require('../models/User')


module.exports = class TipsController{
    static async showTips(req, res) {
        const tipsData = await Tips.findAll({
            include: User,
        })

        const tips = tipsData.map((result) => result.get({plain: true}))

        res.render('tips/home', {tips})
    }

    static async dashboard(req, res){
        const userId = req.session.userid

        const user = await User.findOne({where: {id: userId,}, include: Tips, plain:true, })

        if (!user) {
            res.redirect('/login')
        }

        const tips = user.Tips.map((result) => result.dataValues)

        let emptyTips = false

        if (tips.lenght === 0) {
             emptyTips = true;
        }

        console.log(tips)

        res.render('tips/dashboard', {tips})
    }

    static createTip(req, res){
        res.render('tips/create')
    }

    static async createTipSave(req, res){
        
        const tip = {
            title: req.body.title,
            tec: req.body.tec,
            content: req.body.content,
            UserId: req.session.userid
        }
        

        try {
            await Tips.create(tip)

            req.flash('message', 'Dica criada com sucesso!')
            
            req.session.save(() => {
                res.redirect('/tips/dashboard')
            })
    
        } catch (error) {
            console.log(error)
        }

    }

    static async removeTip(req, res){

        const id = req.body.id

        const userId = req.session.userid

    
        try {
            await Tips.destroy({where:{id: id}})


            req.flash('message', 'Dica removida com sucesso!')
            
            req.session.save(() => {
                res.redirect('/tips/dashboard')
            })

        } catch (error) {
            console.log(error)
        }

    }

    static async updateTip(req, res){
          
        const id = req.params.id

        const tips = await Tips.findOne({where: {id: id}, raw: true})


        res.render('tips/edit', tips)
    }

    static async updateTipSave(req, res){
        
        const id = req.body

        const tip = {
            title: req.body.title,
        }


        try {
            await Tips.update(tip, {where: {id: id}})

            req.flash('message', 'Dica atualizada com sucesso!')
                
            req.session.save(() => {
                res.redirect('/tips/dashboard')
            })
        } catch (error) {
            console.log(error)
        }

 
    }

}

