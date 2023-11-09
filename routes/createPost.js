const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST=mongoose.model("POST");




//route
router.get("/allposts",requireLogin,(req,res)=>{
    POST.find()
    .populate("postedBy","_id name Photo")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt") //sort post in descending order
    .then(posts=>res.json(posts))
    .catch(err=>console.log(err));
})

router.post("/createPost",requireLogin,(req,res)=>{
    const {body,pic}=req.body;
    if(!pic || !body){
        return res.status(422).json({error:"Please ad all the fields"});
    }
    // console.log(pic);
    const post=new POST({
        body,
        photo:pic,
        postedBy:req.user,

    })
    post.save().then((result)=>{
        return res.json({post:result});
    }).catch(err=>console.log(err))

});

router.get("/myposts",requireLogin,(req,res)=>{
    POST.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(myposts=>{
        res.json(myposts);
        // console.log(myposts)
    })
})


router.put("/like",requireLogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
        
    },{
        new:true
    })
    .populate("postedBy","_id name Photo")
    .then((result,err)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name Photo")
    .then((result,err)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment={
        comment:req.body.text,
        postedBy:req.user._id
    }
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name Photo")
    .then((result,err)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })

})

//api to delete post
router.delete("/deletePost/:postId",requireLogin,(req,res)=>{
    // console.log(req.params.postId);
    POST.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .then((post,err)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            // console.log(req.params.postId);
            POST.deleteOne({_id:req.params.postId})
            .then(()=>{
                console.log("deleted");
                return res.json({message:"Success"})
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        
    })
})

//to show following posts
router.get("/myfollowingpost",requireLogin,(req,res)=>{
    POST.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>res.json(posts))
    .catch(err=>console.log(err));
})



module.exports=router;