import React, { useEffect, useState } from 'react'
import "../css/Home.css";
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-toastify';



export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [key, setKey] = useState("");
  const [show,setShow]=useState(false);
  const [item ,setItem]=useState([]);
   
  const profileLink="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

  //Toast functions
  // const notifyA=(msg)=>toast.error(msg);
  const notifyB=(msg)=>toast.success(msg);


  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    }


    // Fetching all posts
    fetch("/allposts", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        setData(result);
        console.log(result)
      })
      .catch(err => console.log(err));
      // eslint-disable-next-line
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result
          }
          else {
            return posts
          }
        })
        setData(newData)
        console.log(result)
      })
  }

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result
          }
          else {
            return posts
          }
        })
        setData(newData)
        console.log(result)
      })
  }

  //function to comment on post
  const makeComment = (text, id) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text: text,
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result
          }
          else {
            return posts
          }
        })
        setData(newData)
        setComment("")
        notifyB("Comment Posted")
        console.log(result)
      })
  }

  //to show and hide comments
  const toggleComment=(posts)=>{
    if(show){
      setShow(false);
    }
    else{
      setItem(posts);
      setShow(true);
    }
  }

  return (
    <div className='home'>
      {/* card */}
      {data.map((posts) => {
        return (
          <div className="card">
            {/* card-header */}
            <div className="card-header">
              <div className="card-pic">
                <img src={posts.postedBy.Photo?posts.postedBy.Photo:profileLink} alt="card-pic" />
              </div>
              <h5>
                <Link to={`/profile/${posts.postedBy._id}`}>
                   {(posts.postedBy) ? (posts.postedBy.name) : "unknown"}
                </Link>
              </h5>
            </div>

            {/* card image */}
            <div className="card-image">
              <img src={posts.photo} alt="" />
            </div>

            {/* card-content */}
            <div className="card-content">
              {
                posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ?
                  (<span className="material-symbols-outlined material-symbols-outlined-red" onClick={() => { unlikePost(posts._id) }}>
                    favorite
                  </span>) :
                  (<span className="material-symbols-outlined" onClick={() => { likePost(posts._id) }}>
                    favorite
                  </span>)
              }
              <p>{posts.likes.length} Likes</p>
              <p>{posts.body}</p>
              <p style={{fontWeight:"bold",cursor:"pointer"}} onClick={()=>{toggleComment(posts)}}>View all comments</p>
            </div>

            {/* add comment */}
            <div className="add-comment">
              <span className="material-symbols-outlined">
                mood
              </span>
              <input type="text" placeholder='Add a comment' value={key === posts._id ? comment : ""} onChange={(e) => {
                setComment(e.target.value)
                setKey(posts._id)
              }} />
              <button className='comment' onClick={() => { makeComment(comment, posts._id) }}>Post</button>
            </div>
          </div>
        )
      })}

      {/* show comments */}
      { show &&
           <div className="showComment">
           <div className="container">
             <div className="postPic">
               <img src={item.photo} alt=""></img>
             </div>
             <div className="details">
               {/* card-header */}
               <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                 <div className="card-pic">
                   <img src={item.photo} alt="card-pic" />
                 </div>
                 <h5>{item.postedBy.name}</h5>
               </div>
   
   
               {/* commentSection */}
               <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                 {item.comments.map((comment)=>{
                   return(
                     <p className='comm'>
                       <span className='commenter' style={{ fontWeight: "bolder" }}>{comment.postedBy.name}   </span>
                       <span className='commentText'>{comment.comment}</span>
                     </p>
                   )
                 })}
                 
               </div>
   
   
               {/* card-content */}
               <div className="card-content">
                 <p>{item.likes.length} Likes</p>
                 <p>{item.body}</p>
               </div>
               {/* add comment */}
               <div className="add-comment">
                 <span className="material-symbols-outlined">
                   mood
                 </span>
                 <input type="text" placeholder='Add a comment' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                 <button className='comment' onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                    }}
                    >Post</button>
               </div>
             </div>
           </div>
           <div className='close-comment'>
             <span class="material-symbols-outlined material-symbols-outlined-comment" onClick={()=>{toggleComment()}}>
               close
             </span>
           </div>
           </div>  
      }   
    </div>
  )
}

