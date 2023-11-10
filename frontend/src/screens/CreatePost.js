import React,{useState,useEffect} from 'react';
import "../css/CreatePost.css";
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

export default function CreatePost() {
   const navigate=useNavigate();

    const [body,setBody]=useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");


     //Toast functions
   const notifyA=(msg)=>toast.error(msg);
   const notifyB=(msg)=>toast.success(msg);

    useEffect(()=>{
        //saving post
        //rendering ke tym comp mount hota h to useEffect chlta h aur jb url hoga ni err aajayega
        if(url){
            fetch("/createPost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    body,pic:url
                })
            }).then(res => res.json())
            .then((data)=>{
                if(data.error){
                    notifyA(data.error)
                }
                else{
                    notifyB("Successfully Posted");
                    navigate("/");
                }
            }).catch(err=>console.log(err));
        }
        // eslint-disable-next-line 
    },[url]);

    const postDetails=()=>{
        //posting image to cloudinary
        // console.log(body,image);
        const data=new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone");
        data.append("cloud_name","sojalcloud");
        fetch("https://api.cloudinary.com/v1_1/sojalcloud/image/upload",{
            method:"POST",
            body:data,
        }).then(res=>res.json())
        .then(data=>setUrl(data.url))
        .catch(err=>console.log(err));

        // when you try fetch data from a server, it will send you a RESPONSE which contains tons of irrelevant information. To target only the BODY part of the response and to convert it from JSON to javascript, you use res. json().
       
    }


    const loadfile=(event)=>{
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
             URL.revokeObjectURL(output.src) // free memory
        };
    };
  return (
    <div className='createPost'>
        {/* header */}
        <div className="post-header">
            <h4 style={{margin:"3px auto"}}>Create New Post</h4>
            <button id="post-btn" onClick={()=>{postDetails()}}>Post</button>
        </div>
        {/* image preview */}
        <div className="main-div">
            <img id="output" alt="preview" src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"/>
            <input type="file" accept="image/*" onChange={(event)=>{
                loadfile(event);
                setImage(event.target.files[0])}}/>
        </div>
        {/* details */}
        <div className="details">
            <div className="card-header">
                <div className="card-pic">
                    <img src={JSON.parse(localStorage.getItem("user")).Photo?JSON.parse(localStorage.getItem("user")).Photo:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt=""/>
                </div>
                <h5>{JSON.parse(localStorage.getItem("user")).userName}</h5>
            </div>
            <textarea type="text" placeholder="Write a caption" value={body} onChange={(e)=>{setBody(e.target.value)}}/>
        </div>

    </div>
  )
}
