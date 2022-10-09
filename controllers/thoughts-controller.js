const { Users, Thoughts } = require('../models');
// const { populate } = require("../models/Users")

const thoughtsController = {

    createThoughts({params, body}, res) {
        Thoughts.create(body)
        .then(({_id}) => {
            return Users.findOneAndUpdate({_id: params.userID}, {$push: {thoughts: _id}}, {new: true});
})
        .then(dbThoughtsData => {
            if(!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts were found with this ID'});
                return;
            }
            res.json(dbThoughtsData)
        })

        .catch(err=> res.json(err));
    },


getAllThoughts(req, res) {
        Thoughts.find({})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

getThoughtsById({params}, res) {
    Thoughts.findOne({ _id: params.id })
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(400).json({message: 'No thoughts found with this ID'});
            return;
        }
        res.json(dbThoughtsData)
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
},

updateThoughts({params, body}, res) {
    Thoughts.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(400).json({message: 'No thoughts found with this ID'});
            return;
        }
        res.json(dbThoughtsData)
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
},


deleteThoughts({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id'});
                return;
            }

                res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
},

    //         User.findOneAndUpdate(
    //             { username: dbThoughtData.username },
    //             { $pull: { thoughts: params.id } }
    //         )
    //         .then(() => {
    //             res.json({message: 'Successfully deleted the thought'});
    //         })
    //         .catch(err => res.status(500).json(err));
    //     })
    //     .catch(err => res.status(500).json(err));
    // },

    addReaction({ params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },

    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json({message: 'Successfully deleted the reaction'});
        })
        .catch(err => res.status(500).json(err));
    },
}

module.exports = thoughtsController;