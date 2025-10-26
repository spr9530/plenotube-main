const User = require('./user.schema.js')

exports.getCurrentUserInfo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ success: false, message: 'Not user found' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Not user found' });
        }

        return res.status(200).json({success:true, message:'User Found', user});

    } catch (error) {
        console.log('Error while getting current userinfo fn:getCurrentUserInfo', error);
        return res.status(500).json('Server Error');
    }
}