const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator/check")
const request = require("request")
const config = require("config")

const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile")
const User = require("../../models/Users")


// @route /api/profile/me => get My Profile Data

router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: 'there is no profile for this  user' })
        }

        res.json(profile)


    } catch (error) {
        res.status(500).send("Server error")
    }

})



// /api/profile => Create or Update Profile

router.post("/", [auth, [
    check("status", "The Status field is required").not().isEmpty(),
    check("skills", "The Skills field is required").not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, linkedin, instagram } = req.body

    let profileFields = {}
    profileFields.user = req.user.id;
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) profileFields.skills = skills.split(",").map(skill => skill.trim())

    profileFields.social = {};

    if (linkedin) profileFields.social.linkedin = linkedin
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (instagram) profileFields.social.instagram = instagram
    if (youtube) profileFields.social.youtube = youtube

    try {
        profile = await Profile.findOne({ user: req.user.id })

        if (profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
            return res.json(profile)
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile)

    } catch (error) {
        res.status(500).send("Server Error")
    }
})


// api/profile => Get all profiles 

router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"])
        res.json(profiles)

    } catch (error) {
        res.status(500).send("Server Error")
    }
})



// api/profile/user/:user_id => Get one profile

router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"]);

        if (!profile) return res.status(400).json({ msg: "Profile not found" })

        res.json(profile);

    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(400).json({ msg: "Profile not found" })
        }

        res.status(500).send("Server Error")
    }
})




// /api/profile => Delete user/profile/posts

router.delete("/", auth, async (req, res) => {

    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "Profile is removed" })


    } catch (error) {
        return res.status(500).send("Server Error")
    }

})


// api/profile/experince  => Add experiennce to profile

router.put("/experience", [auth, [
    check("title", "Title Field is required").not().isEmpty(),
    check("company", "Company Field is required").not().isEmpty(),
    check("from", "From Field is required").not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { title, company, location, from, to, current, description } = req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {

        const profile = await Profile.findOne({ user: req.user.id });

        profile.experiences.unshift(newExp);

        await profile.save();

        return res.json(profile);



    } catch (error) {
        return res.status(500).send("Server Error")
    }
})


// /api/profile/experience/:exp_id  => Delete profile experience 

router.delete("/experience/:exp_id", auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const selectedExpId = profile.experiences.map(item => item.id).indexOf(req.params.exp_id);

        profile.experiences.splice(selectedExpId, 1);

        await profile.save()
        return res.json(profile)



    } catch (error) {
        return res.status(500).send("Server Error")
    }

})


// api/profile/education  => Add education to profile

router.put("/education", [auth, [
    check("school", "School Field is required").not().isEmpty(),
    check("degree", "Degree Field is required").not().isEmpty(),
    check("fieldofstudy", "Field of study is required").not().isEmpty(),
    check("from", "From Date is required").not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { school, degree, fieldofstudy, from, to, current, description } = req.body;

    const newEdu = { school, degree, fieldofstudy, from, to, current, description };

    try {

        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(newEdu);

        await profile.save();

        return res.json(profile);



    } catch (error) {
        return res.status(500).send("Server Error")
    }
})


// /api/profile/education/:exp_id  => Delete profile education

router.delete("/education/:edu_id", auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const selectedEduId = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(selectedEduId, 1);

        await profile.save()
        return res.json(profile)



    } catch (error) {
        return res.status(500).send("Server Error")
    }

})


// /api/profile/github/username => get github user of Profile

router.get("/github/:username", (req,res) => {

    try {
        
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("clientSecret")}`,
            method:"GET",
            headers: {'user-agent':'node.js'}
        }

        request(options, (error,response,body) => {
            if(error) console.log(error)

            if(response.statusCode !== 200 ){
                return res.status(404).json({msg: "No github user found"})
            }

            res.json(JSON.parse(body));

        })


    } catch (error) {
        res.status(500).send("Server Error")
    }

})






module.exports = router