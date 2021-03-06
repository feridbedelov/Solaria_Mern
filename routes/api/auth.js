const express = require("express")
const bcrypt = require("bcryptjs")
const { check, validationResult } = require("express-validator/check")
const jwt = require("jsonwebtoken")
const config = require("config")
const router = express.Router()
const auth = require("../../middleware/auth")
const User = require("../../models/Users")




router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.json(user)

    } catch (error) {
        res.status(500).send("server error")
    }
})




router.post("/", [
    check("email","Please include a valid email").isEmail(),
    check("password","Please enter a valid password").exists()
]
    , async (req, res) => {

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array() })
        }
        
        const {email , password } = req.body

        try {
            const user = await User.findOne({email})
            if(!user){
                return res.status(400).json({msg: "Invalid Credentials" })
            }

            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(400).json({msg : "Invalid Credentials"})
            }

            const payload = {
                user: {
                    id : user.id 
                }
            }

            jwt.sign(payload,config.get("jwtSecret"), {expiresIn: 360000}, (err,token) =>{
                if(err) {
                    throw  err
                }
                res.json({token})
            })


        } catch (error) {
            res.status(500).send("Server error")
        }

    })


module.exports = router