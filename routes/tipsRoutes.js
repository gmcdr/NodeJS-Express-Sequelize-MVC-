const express = require('express')
const router = express.Router()

const TipsController = require('../controllers/TipsController')

const checkAuth =require('../helpers/auth').checkAuth

router.get('/', TipsController.showTips)
router.get('/dashboard', checkAuth ,TipsController.dashboard)
router.get('/add', checkAuth ,TipsController.createTip)
router.post('/add', checkAuth ,TipsController.createTipSave)
router.post('/remove', checkAuth, TipsController.removeTip)


module.exports =  router  