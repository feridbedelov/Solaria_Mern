const express = require("express")
const gravatar = require("gravatar")
const bcrypt =  require("bcryptjs")
const { check, validationResult } = require("express-validator/check")
const jwt = require("jsonwebtoken")
const config = require("config")

const router = express.Router()
const User = require("../../models/Users")


router.post("/",
    [
        // validation rules
        check("name", "Please enter a valid name").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a password with 6 characters or more").isLength({ min: 6 })

    ]
    , async (req, res) => {

        // validation checks
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body

        try {

            // checking if user exists if it does then throw an error

            let user = await User.findOne({ email })
            if (user) {
               return res.status(400).json({ errors: [{ msg: "Email already exists" }] })
            }

            // creating avatar for user 
            const avatar = gravatar.url(email, {
                s: "200",
                d: "mm",
                r: "pg"
            })

            // creating the user 
            user = new User({
                email,
                name,
                avatar,
                password
            })

            // encrypting the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt)

            // saving user to db
            await user.save()


            // returing a json web token
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,config.get("jwtSecret"),{expiresIn:360000}, (error , token ) => {
                if(error) throw error
                res.json({token})
            })

        } catch (error) {
            res.status(500).send("Server error")
        }

    })

module.exports = router