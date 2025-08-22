const {Router} = require("express");
const User = require('../models/user');
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });


const router = Router();

router.get('/signin',(req,res) => {
    return res.render("signin");
})

router.get('/signup',(req,res) => {
    return res.render("signup");
})

router.post('/signin',async (req,res) => {
    const {email,password} = req.body;
    try {
        const token = await User.matchPasswordAndGenToken(email,password);
        return res.cookie("token",token).redirect("/");
    } catch (error) {
        return res.render('signin', {
            error: "Incorrect Email or Password",
        });
    }

})

router.get('/logout',(req,res) => {
    res.clearCookie("token").redirect("/");
})

router.post('/signup', upload.single('profileImage'), async (req,res) => {
    const {fullName,email,password} = req.body;
    let profileImageURL = req.file ? `/uploads/${req.file.filename}` : undefined;
    await User.create({
        fullName,
        email,
        password,
        profileImageURL,
    });
    return res.redirect('/');
})

module.exports = router;