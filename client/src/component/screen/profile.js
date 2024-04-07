import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../app';

const Profile  = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
       fetch('http://localhost:5000/mypost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setPics(result.mypost)
       })
    },[])
    useEffect(()=>{
       if(image){
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","cnq")
        fetch('https://api.cloudinary.com/v1_1/dwdcrmv57/image/upload',{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
    
       
           fetch('http://localhost:5000/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               //window.location.reload()
           })
       
        })
        .catch(err=>{
            console.log(err)
        })
       }
    },[image])
    const updatePhoto = (file)=>{
        setImage(file)
    }

    // Other useEffect for updating photo...

    return (
        <div style={{ maxWidth: '550px', margin: '0px auto' }}>
            {/* Profile info */}
            <div style={{ margin: '18px 0px', borderBottom: '1px solid grey' }}>

                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div>
                        <img
                            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                            src={state && state.pic ? state.pic : "https://via.placeholder.com/160"}
                            alt="Profile Pic"
                        />


                    </div>
                    <div>
                        <div>

                            <h4>{state ? state.name : 'loading'}</h4>
                            <h5>{state ? state.email : 'loading'}</h5>

                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                                {/* Null/Undefined checks for length */}
                                <h6>{mypics ? mypics.length : 0} posts</h6>
                                <h6>{state && state.followers ? state.followers.length : 0} followers</h6>
                                <h6>{state && state.following ? state.following.length : 0} following</h6>

                            </div>
                        </div>

                    </div>

                </div>

                

                <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update pic</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>


                {/* Gallery section */}
            </div>
            <div className='gallery'>
                {mypics && mypics.length > 0 ? (
                    mypics.map(item => (
                        <img key={item._id} className='item' src={item.photo} alt={item.title} />
                    ))
                ) : (
                    <p>No posts found</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
