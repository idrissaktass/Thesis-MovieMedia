import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';

export const getUser = async(req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);
        if(user){
            const {password, ...otherDetails} = user._doc;  // it will put the password to other details
            res.status(200).json(otherDetails);
        }
        else {
            res.status(404).json("No such user exists")
        }
    } catch (error) {
        res.status(500).json(error);
    }

    
};

// update a user

export const updateUser = async(req, res) => {
    const id = req.params.id;
    const {currentUserId, currentUserAdminStatus, password} = req.body;

    if(id === currentUserId || currentUserAdminStatus){
        try {
            if(password){               // if there is password in body to update
                const salt = await bcrypt.genSalt(10);  
                req.body.password = await bcrypt.hash(password, salt);      // kritpo şifreyi bodyde girilen şifreye göre değiştirme
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true}); // id, information that we want to change, for getting the new info
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    res.status(403).json("Access Denied");
};


// delete user

export const deleteUser = async(req, res) => {
    const id = req.params.id;

    const {currentUserId, currentUserAdminStatus} = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
        
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully");

        } catch (error) {
            res.status(500).json(error);
        }
    
    } else {
        res.status(403).json("Access Denied");
    }
}

// follow a user

export const followUser = async(req, res) => {
    const id = req.params.id;                   // who should be followed

    const {currentUserId} = req.body;           // who wants to follow

    if (currentUserId === id) {
        res.status(403).json("Action forbidden")
    }
    else {
        try {
            const followUser = await UserModel.findById(id);      // who should be followed
            const followingUser = await UserModel.findById(currentUserId);             // who wants to follow
            
            if(!followUser.followers.includes(currentUserId)){              // if current id is not in the users followers id
                await followUser.updateOne({$push : {followers: currentUserId}})    // push the id to followers
                await followingUser.updateOne({$push : {following: id}})        // push the following users id to followings
                res.status(200).json("User followed!");

            }
            else{
                res.status(403).json("User is already followed");
            }

        } catch (error) {
            res.status(500).json(error);
        }
    }
}

// unfollow user

export const UnFollowUser = async(req, res) => {
    const id = req.params.id;                   // who should be followed

    const {currentUserId} = req.body;           // who wants to follow

    if (currentUserId === id) {
        res.status(403).json("Action forbidden")
    }
    else {
        try {
            const followUser = await UserModel.findById(id);      // who should be followed
            const followingUser = await UserModel.findById(currentUserId);             // who wants to follow
            
            if(followUser.followers.includes(currentUserId)){              // if current id is in the users followers id
                await followUser.updateOne({$pull : {followers: currentUserId}})    // remove the id to followers
                await followingUser.updateOne({$pull : {following: id}})        // removw the following users id to followings
                res.status(200).json("User unfollowed!");

            }
            else{
                res.status(403).json("User is not followed");
            }

        } catch (error) {
            res.status(500).json(error);
        }
    }
}