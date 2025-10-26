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

    return res.status(200).json({ success: true, message: 'User Found', user });

  } catch (error) {
    console.log('Error while getting current userinfo fn:getCurrentUserInfo', error);
    return res.status(500).json('Server Error');
  }
}

exports.getUserGeneral = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    const userInfo = await User.findById(user.userid);

    if (!userInfo) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    return res.status(200).json({
      message: 'User found successfully',
      user: userInfo,
      success: true,
    });

  } catch (error) {
    console.error('Error occurred while fetching user info (getUserGeneral):', error);
    return res.status(500).json({ message: 'Server Error', success: false });
  }
};

exports.updateUserGeneral = async (req, res) => {
  try {
    const user = req.user;
    const { full_name, email, phone, bio } = req.body;
    if (!user) {
      return res.status(400).json({ message: 'User not authenticated', success: false });
    }

    const updatedUser = await User.findByIdAndUpdate(user.userid, { full_name, email, phone, bio }, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    return res.status(200).json({
      message: 'Updated successfully!',
      user: updatedUser,
      success: true
    });

  } catch (error) {
    console.error('Error in updateUserGeneral:', error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message
    });
  }
}