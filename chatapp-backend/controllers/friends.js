const httpStatus = require('http-status-codes');

const User = require('../models/userModels');

module.exports = {
    followUser(req, res) {
        const followUser = async () => {
            await User.update({
                _id: req.user._id,
                'following.userFollowed': {$ne: req.body.userFollowed}
            }, {
                $push: {
                    following: {
                        userFollowed: req.body.userFollowed
                    }
                }
            });

            await User.update({
                _id: req.body.userFollowed,
                'followers.follower': {$ne: req.user._id}
            }, {
                $push: {
                    followers: {
                        follower: req.user._id
                    },
                    notifications: {
                        senderId: req.user._id,
                        message: `${req.user.username} is now following you.`,
                        created: new Date(),
                        viewProfile: false
                    }
                }
        }); 
    };

        followUser()
        .then(() => {
            res.status(httpStatus.OK).json({message: 'Following user now'});
        })
        .catch(err =>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        })
    },

    unfollowUser(req, res) {
        const unfollowUser = async () => {
            await User.update({
                _id: req.user._id,
            }, {
                $pull: {
                    following: {
                        userFollowed: req.body.userFollowed
                    }
                }
            });

            await User.update({
                _id: req.body.userFollowed,
            }, {
                $pull: {
                    followers: {
                        follower: req.user._id
                    }
                }
        }); }

        unfollowUser()
        .then(() => {
            res.status(httpStatus.OK).json({message: 'Unfollowing user now'});
        })
        .catch(err =>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        })
    },

    async markNotification(req, res) {
        if (!req.body.deleteVal) {
            await User.updateOne({
                _id: req.user._id,
                "notifications._id": req.params.id
            }, {
                $set: {'notifications.$.read': true}
            }).then(() => {
                res.status(httpStatus.OK).json({message: 'Marked as read'});
            }).catch(err => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
            })
        } else {
            await User.update({
                _id: req.user._id,
                "notifications._id": req.params.id

            }, {
                $pull: {
                    notifications: {_id: req.params.id}
                }
            }
            ).then(() => {
                res.status(httpStatus.OK).json({message: 'Deleted successfully'});
            }).catch(err => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
            })
        }
    },
    async markAllNotifications(req, res) {
        // console.log(req.body);
        await User.update(
        {
            _id: req.user._id
        }, 
        { $set: { 'notifications.$[elem].read': true }},
        { arrayFilters: [{'elem.read': false}], multi: true}
        ).then(() => {
            res.status(httpStatus.OK).json({message: 'Marked all successfully'});
        }).catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        })
    }
}
