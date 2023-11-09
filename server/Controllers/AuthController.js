import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";                            // use that for encrypt the password in database
import jwt from 'jsonwebtoken';
// Registering a new user

export const registerUser = async(req, res) => {

    const salt = await bcrypt.genSalt(10);          
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
    const newUser = new UserModel(req.body);
    const {username} = req.body;
    try {
        const oldUser = await UserModel.findOne({username});
        if(oldUser){
            return res.status(400).json("username is already registered")
        }

        const user = await newUser.save()

        const token = jwt.sign({
            username: user.username, id:user._id
        }, process.env.jwt_key)

        res.status(200).json({user, token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// login user

export const loginUser = async(req,res) => {
    const {username, password} = req.body               // username and password taking from body

    try {
        const user = await UserModel.findOne({username: username})      // find the username
        
        if(user) {                                                      // if there is an user
            const validity = await bcrypt.compare(password, user.password)    // comparing the password and crypted password
            
            if (!validity) {
                res.status(400).json("Wrong password");
            }
            else {
                const token = jwt.sign({
                    username: user.username, id:user._id
                }, process.env.jwt_key)
                res.status(200).json({user, token})
            }    //  if the password is same then send the user, else..
        }
        else {
            res.status(404).json("User does not exist")
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}