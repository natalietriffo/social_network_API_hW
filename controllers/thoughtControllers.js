const { Thought, User } = require('../models');


thoughtController = {
    //get all thoughts
    getThoughts(req, res) {
        Thought.find()
        .then((thoughtDB) => {
            res.json(thoughtDB);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
    //get single thought by id
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then(async (thoughtDB) =>
                !thoughtDB
                    ? res.status(404).json({ message: 'No thought found' })
                    : res.json({ thoughtDB })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // create thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thoughtDB) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thoughtDB._id } },
                    { runValidators: true, new: true }
                )
            })
            
            .then((userDataB) =>
                !userDataB
                    ? res
                        .status(404)
                        .json({ message: 'No user found' })
                    : res.json(userDataB)
            )
            .catch((err) => res.status(400).json(err));
    },
    // Update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true,
            new: true }
        )
            .then((thoughtDB) =>
                !thoughtDB
                    ? res.status(404).json({ message: 'Can not find thought' })
                    : res.json(thoughtDB)
            )
            .catch((err) => res.status(500).json(err));
    },
    // deleting a thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thoughtDB) =>
                !thoughtDB
                    ? res.status(404).json({ message: 'Thought does not exist' })
                    : User.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
            )
            .then((userDataB) =>
                !userDataB
                    ? res.status(404).json({
                        message: 'User not found',
                    })
                    : res.json({ message: 'This thought was deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    //add reaction to thought
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thoughtDB) =>
                !thoughtDB
                    ? res
                        .status(404)
                        .json({ message: 'Thought not found' })
                    : res.json(thoughtDB)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Remove reaction from thought
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactions: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thoughtDB) =>
                !thoughtDB
                    ? res
                        .status(404)
                        .json({ message: 'Thought not found' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },


};
module.exports = thoughtController;