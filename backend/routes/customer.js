const express=require('express')
const router=express.Router()
const {addCustomer}=require('../controllers/customer')

router.route('/addCustomer').post(addCustomer)

module.exports=router