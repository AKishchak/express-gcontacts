export default {
    async getAllUsers(req, res){
        let users = await UserModel.find({}, []).select('-contacts');

        res.send({
            users: users.map(u => {
                return {
                    _id: u._id,
                    name: u.name,
                    email: u.email,
                    googleId: u.googleId,
                    image: u.image,
                }
            })
        });
    }
};