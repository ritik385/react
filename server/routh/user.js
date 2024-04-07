const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

// Get user details by ID
router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name email")
                .then(posts => {
                    res.json({ user, posts });
                    console.log(user);
                })
                .catch(err => {
                    return res.status(422).json({ error: err });
                });
        })
        .catch(err => {
            return res.status(404).json({ error: "User not found" });
        });
});

// Follow a user
router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.user._id } }, { new: true })
        .select("-password")
        .then(result => {
            User.findByIdAndUpdate(req.user._id, { $push: { following: req.body.followId } }, { new: true })
                .select("-password")
                .then(updatedUser => {
                    res.json(updatedUser);
                })
                .catch(err => {
                    return res.status(422).json({ error: err });
                });
        })
        .catch(err => {
            return res.status(422).json({ error: err });
        });
});

// Unfollow a user
router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.user._id } }, { new: true })
        .select("-password")
        .then(result => {
            User.findByIdAndUpdate(req.user._id, { $pull: { following: req.body.unfollowId } }, { new: true })
                .select("-password")
                .then(updatedUser => {
                    res.json(updatedUser);
                })
                .catch(err => {
                    return res.status(422).json({ error: err });
                });
        })
        .catch(err => {
            return res.status(422).json({ error: err });
        });
});

// // Update user profile picture
router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true })
        .select("-password")
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            return res.status(422).json({ error: "Unable to update profile picture" });
        });
});

// // Search users by email 
router.post('/search-users', (req, res) => {
    let userPattern = new RegExp("^" + req.body.query);
    User.find({ email: { $regex: userPattern } })
        .select("_id email")
        .then(users => {
            res.json({ users });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        });
});

module.exports = router;
