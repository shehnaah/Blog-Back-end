const asyncErrorWrapper = require("express-async-handler")
const User = require("../Models/user");
const Story = require("../Models/story");
const CustomError = require("../Helpers/error/CustomError");
const { comparePassword, validateUserInput } = require("../Helpers/input/inputHelpers");

const profile = asyncErrorWrapper(async (req, res, next) => {

    return res.status(200).json({
        success: true,
        data: req.user
    })

})


const editProfile = asyncErrorWrapper(async (req, res, next) => {

    const { email, username } = req.body

    const user = await User.findByIdAndUpdate(req.user.id, {
        email, username,
        photo: req.savedUserPhoto
    },
        {
            new: true,
            runValidators: true
        })

    return res.status(200).json({
        success: true,
        data: user

    })

})


const changePassword = asyncErrorWrapper(async (req, res, next) => {

    const { newPassword, oldPassword } = req.body

    if (!validateUserInput(newPassword, oldPassword)) {

        return next(new CustomError("Please check your inputs ", 400))

    }

    const user = await User.findById(req.user.id).select("+password")

    if (!comparePassword(oldPassword, user.password)) {
        return next(new CustomError('Old password is incorrect ', 400))
    }

    user.password = newPassword

    await user.save();


    return res.status(200).json({
        success: true,
        message: "Change Password  Successfully",
        user: user

    })

})


const addStoryToReadList = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params
    const { activeUser } = req.body;

    const story = await Story.findOne({ slug })

    const user = await User.findById(activeUser._id)

    if (!user.readList.includes(story.id)) {

        user.readList.push(story.id)
        user.readListLength = user.readList.length
        await user.save();
    }

    else {
        const index = user.readList.indexOf(story.id)
        user.readList.splice(index, 1)
        user.readListLength = user.readList.length
        await user.save();
    }

    const status = user.readList.includes(story.id)

    return res.status(200).json({
        success: true,
        story: story,
        user: user,
        status: status
    })

})

const readListPage = asyncErrorWrapper(async (req, res, next) => {
    try {
        console.log("User ID from request:", req.user.id); 

        const user = await User.findById(req.user.id).populate({
            path: "readList",
            populate: { path: "author" }
        });

        console.log("User data:", user);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("Full ReadList before filtering:", user.readList); 

        const filteredReadList = user.readList.filter(story => story !== null);
        
        console.log("Filtered ReadList:", filteredReadList); 

        return res.status(200).json({
            success: true,
            data: filteredReadList
        });
    } catch (error) {
        console.error("Error fetching reading list:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = {
    profile,
    editProfile,
    changePassword,
    addStoryToReadList,
    readListPage
}
