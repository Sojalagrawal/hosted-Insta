import React,{useEffect,useState} from 'react';
import "../css/Profile.css";
import PostDetail from '../components/PostDetail';
import ProfilePic from '../components/ProfilePic';

export default function Profile() {
  const userid=JSON.parse(localStorage.getItem("user"))._id
  const [pic,setPic]=useState([])
  const [show,setShow]=useState(false)
  const [posts,setPosts]=useState([])
  const [user,setUser]=useState("");
  const[changePic,setChangePic]=useState(false);
  useEffect(()=>{
      fetch(`/user/${userid}`,{
        headers:{
          Authorization:"Bearer "+localStorage.getItem("jwt")
        }
      })
      .then(res=>res.json())
      .then((result)=>{
        console.log(result)
        setPic(result.post)
        setUser(result.user)
      })
  },[])


  const toggleDetails=(posts)=>{
    if(show){
      setShow(false);
    }
    else{
      setPosts(posts);
      setShow(true);
    }
  }


  const changeProfile=()=>{
    if(changePic){
      setChangePic(false);
    }
    else{
      setChangePic(true);
    }
  }

  const profileLink="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  return (
    <div className='profile'>
      {/* profile-frame */}
       <div className="profile-frame">
        {/* profile-pic */}
          <div className="profile-pic">
             <img onClick={()=>{changeProfile()}} src={user.Photo?user.Photo:profileLink} alt=""/>
          </div>
          {/* profile-data */}
          <div className="profile-data">
              <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
              <div className="profile-info" style={{display:"flex"}}>
                <p>{pic?pic.length:"0"} posts</p>
                <p>{user.followers?user.followers.length:"0"} followers</p>
                <p>{user.following?user.following.length:"0"}  following</p>
              </div>
          </div>
          
       </div>  
       <hr style={{width:"90%",margin:"25px auto",opacty:0.8}}/>

        {/* Gallery */}
       <div className="gallery">
          {pic.map((pics)=>{
              return <img key={pic._id} src={pics.photo} onClick={()=>{toggleDetails(pics)}} className='item'></img>
          })}
       </div>
       {show && 
       <PostDetail item={posts} toggleDetails={toggleDetails}/>
       }
       {
        changePic && <ProfilePic changeProfile={changeProfile}/>
       }
    </div>

    
  )
}
