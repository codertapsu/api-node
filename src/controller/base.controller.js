export default (Model) => {
    let BaseController = {};

    BaseController.findAll = (req, res) => {
        Model.find().then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Network Error.'
            })
        })
    }
    BaseController.findOne = (req, res) => {
        Model.findById(req.params.id).then(data => {
            if (!data) {
                return res.status(404).send({
                    message: 'Data not found with id ' + req.params.id
                })
            }
            res.send(data)
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: 'User not found with id ' + req.params.id
                })
            }
            return res.status(500).send({
                message: 'Something wrong retrieving with id ' + req.params.id
            })
        })
    }
    BaseController.delete = (req, res) => {
        Model.findOneAndDelete(req.params.id).then(data => {
            if (!data) {
                return res.status(404).send({
                    message: 'User not found with id ' + req.params.id
                })
            }
            res.send({
                message: 'User deleted successfully!'
            })
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: 'User not found with id ' + req.params.id
                })
            }
            return res.status(500).send({
                message: 'Could not delete user with id ' + req.params.id
            })
        })
    }

    function jarThemPickles(pickle, jar) {
        // This will be NOT available 'outside'.
        // Pickling stuff...

        return pickleJar;
    };

    return BaseController;
};