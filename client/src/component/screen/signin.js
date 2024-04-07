import React, { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../../app";
import M from "materialize-css";
const Signin = () => {
    // const  history = useHistory();  
    // const [name, setName] = useState("");
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email", classes: "#c62828 red darken-3" });
            return;
        }

        // Fetch or handle form data submission here
        fetch("http://localhost:5000/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                password,
                email
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" });
                } else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "signedin succesfully", classes: "#4caf50 green" });
                    // history.push('/home');
                    console.log("signed in succesfuly")
                    navigate('/profile');
                }
            })
            .catch(err => {
                console.log("Error:", err);
            });
    };

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #2196f3 blue"
                    onClick={() => PostData()}>Login</button>
                <Link to="/signup"><h5>Dont have an account ?</h5></Link>
            </div>
        </div>
    );
};

export default Signin;
