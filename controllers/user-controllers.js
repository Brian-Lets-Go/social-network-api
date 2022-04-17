const { User, Thought } = require('../models');

const userController = {

    getAllUsers(req, res) {
        User.find({})
          .populate({
            path: 'thoughts',
            select: '-__v'
          })
          .populate({
            path: 'friends',
            select: '-__v'
          })
          .sort({ _id: -1 })
          .then(dbUserData => res.json(dbUserData))
          .catch(err => { console.log(err), res.sendStatus(400) });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
          .populate({
            path: 'thoughts',
            select: '-__v'
          })
          .populate({
            path: 'friends',
            select: '-__v'
          })
          .then(dbUserData => { res.json(dbUserData) })
          .catch(err => { console.log(err), res.sendStatus(400) });
    },

    createUser({ body }, res) {
        User.create(body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No User found with that id' });
              return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
          .then(dbPizzaData => res.json(dbPizzaData))
          .catch(err => res.json(err));
    },

    addFriend ({ params, body }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { friends: params.friendId }},
          { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with that id' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId }},
          { new: true, runValidators: true }
        )
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with that id' });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => res.status(400).json(err));
    }
}

module.exports = userController
