const asyncHandler = require("express-async-handler")
const validator = require("validator") //check krun sagte email password kiva other key nasel tr error
const Admin = require("../models/Admin")
const { checkEmpty } = require("../utils/checkEmpty")
const bcrypt = require("bcryptjs")
const sendEmail = require("../utils/email")
// const { OAuth2Client } = require("google-auth-library")
const jwt = require("jsonwebtoken")
const { nanoid } = require("nanoid")




exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = await req.body
    const { isError, error } = checkEmpty({ name, email, password })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isEmail(email)) {

        return res.status(400).json({ messsage: "Invalid Imail", error })
    }
    // if (!validator.isStrongPassword(password)) {

    //     return res.status(400).json({ messsage: "Create Strong Password" })
    // }
    const isFound = await Admin.findOne({ email })
    if (isFound) {
        return res.status(404).json({ message: "email already registered with us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })
    res.json({ message: "Register Success" })
})

exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Feild Require", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }
    const result = await Admin.findOne({ email })
    if (!result) {
        console.log(req.body);
        console.log(result);
        return res.status(401).json({
            message: process.env.NODE_ENV === "devolopment" ?
                "Invalid Email" : "Invalid Credientials"
        })
    }
    const isVerify = await bcrypt.compare(password, result.password)
    if (!isVerify) {
        return res.status(401).json({
            message: process.env.NODE_ENV === "devolopment" ?
                "Invalid Password" : "Invalid Credientials"
        })
    }
    // send OTP
    const otp = Math.floor(10000 + Math.random() * 900000)   //pakage:nanoid

    await Admin.findByIdAndUpdate(result._id, { otp })
    await sendEmail({
        to: email, subject: `Login otp`, message: `
        <h1> Do Not Share Your Account OTP</h1>
        <P>Your login  ${otp} </P>
        `})
    res.json({ message: "Creditials Verify Success.OTP Send to Your Register email " })

})


exports.verifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ email, otp })
    if (isError) {
        return res.status(401).json({ message: "All Feild Require", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "Invalid Email" : "Invalid Creditials" })

    }
    if (otp !== result.otp) {
        return res.status(401).json({ message: "Invalid OTP" })
    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    //JWT
    res.cookie('admin', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({
        message: "OTP Verify Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })
})