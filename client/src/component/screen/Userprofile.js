import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from 'react-router-dom';

const Profile = () => {
    const [mypics, setPics] = useState([]);
    const [UserProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showfollow, setShowFollow] = useState(state && state.following ? !state.following.includes(userid) : true);

    useEffect(() => {
        fetch(`http://localhost:5000/user/${userid}`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            setProfile(result);
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
    }, [userid]);

    const followUser = () => {
        fetch('http://localhost:5000/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        })
        .then(res => res.json())
        .then(data => {
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
            localStorage.setItem("user", JSON.stringify(data));
            console.log(data);
            setProfile(prevState => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id]
                    }
                };
            });
            setShowFollow(false); // Update showfollow state
        })
        .catch(error => {
            console.error('Error following user:', error);
        });
    };

    const unfollowUser = () => {
        fetch('http://localhost:5000/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    };

    return (
        <div style={{ maxWidth: "700px", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-evenly", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                <div>
                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
    src={UserProfile && UserProfile.user ? UserProfile.user.pic : 'loading'} alt="Profile Pic" />

                </div>
                <div>
                    {UserProfile && UserProfile.user ? (
                        <>
                            <h4>{UserProfile.user.name}</h4>
                            <h4>{UserProfile.user.email}</h4>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{UserProfile.user.posts ? UserProfile.user.posts.length : 0} posts</h6>
                                <h6>{UserProfile.user.followers ? UserProfile.user.followers.length : 0} followers</h6>
                                <h6>{UserProfile.user.following ? UserProfile.user.following.length : 0} following</h6>
                            </div>
                            {/* Follow/Unfollow button */}
                            {showfollow ? (
                                <button 
                                style={{
                                    margin:"10px"
                                }} className="btn waves-effect waves-light #2196f3 blue" onClick={() => followUser()}>
                                    Follow
                                </button>
                            ) : (
                                <button 
                                style={{
                                    margin:"10px"
                                }}className="btn waves-effect waves-light #2196f3 blue" onClick={() => unfollowUser()}>
                                    Unfollow
                                </button>
                            )}
                        </>
                    ) : (
                        <h4>Loading...</h4>
                    )}
                </div>
            </div>
            <div className="gallery">
                {UserProfile && UserProfile.posts ? (
                    UserProfile.posts.map(item => (
                        <img key={item._id} className="item" src={item.photo} alt={item.title} />
                    ))
                ) : (
                    <p>No posts found</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
