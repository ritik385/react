import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';
import {URI} from "../../route.js"

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        const postData = async () => {
            try {
                const response = await fetch(`${URI}/createpost`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                    },
                    body: JSON.stringify({
                        title,
                        body,
                        pic: url,
                    }),
                });
                const data = await response.json();
                console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: '#c62828 red darken-3' });
                } else {
                    M.toast({ html: 'created post successfully', classes: '#4caf50 green' });
                    navigate('/profile');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (url) {
            postData();
        }
    }, [url, title, body, navigate]);

    const PostDetails = async () => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'instra-clone');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dwdcrmv57/image/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log('data: ', data);
            setUrl(data.url);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="card inpute-filed" style={{ margin: '40px auto', maxWidth: '500px', padding: '20px', textAlign: 'center' }}>
            <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="body" value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #2196f3 blue">
                    <span>upload image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #2196f3 blue" onClick={() => PostDetails()}>
                Submit Post
            </button>
        </div>
    );
};

export default CreatePost;
