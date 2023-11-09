const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST=mongoose.model("POST");
const USER = mongoose.model("USER");

//to get user profile 
router.get("/user/:id",(req,res)=>{
    USER.findOne({_id:req.params.id})
    .select("-password") //select me jo cheez ni chahiye hoti vo likhte h
    .then(user=>{
        POST.find({postedBy:req.params.id})
        .populate("postedBy","_id")
        .then((post)=>{
            return res.json({user,post})
        })
        .catch((err)=>{
            return res.status(422).json({error:err});

        })
    })
    .catch((err)=>{
        return res.status(422).json({error:"User not found"});
    })
})



//to follow user
router.put("/follow",requireLogin,(req,res)=>{
    USER.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true //By default, findOneAndUpdate() returns the document as it was before update was applied. You should set the new option to true to return the document after update was applied.
    }).then((result)=>{
        USER.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        }).then((result=>res.json(result)))
        .catch(err=>{return res.status(422).json({error:err})})
    })
    .catch((err)=>{
        return res.status(422).json({error:err})
    })
})




//to unfollow user
router.put("/unfollow",requireLogin,(req,res)=>{
    USER.findByIdAndUpdate(req.body.followId,{
        $pull:{followers:req.user._id}
    },{
        new:true //By default, findOneAndUpdate() returns the document as it was before update was applied. You should set the new option to true to return the document after update was applied.
    }).then((result)=>{
        USER.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.followId}
        },{
            new:true
        }).then((result=>res.json(result)))
        .catch(err=>{return res.status(422).json({error:err})})
    })
    .catch((err)=>{
        return res.status(422).json({error:err})
    })
})

//to upload profile pic
router.put("/uploadProfilePic",requireLogin,(req,res)=>{
    USER.findByIdAndUpdate(req.user._id,{
        $set:{Photo:req.body.pic}
    },{
        new:true
    }).then((result)=>{
        res.json(result)
    }).catch((err)=>{return res.status(422).json({error:err})})
})




module.exports=router;