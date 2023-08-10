export default class buyerUserDto {
    constructor(user) {
        this.id = user._id
        this.role = user.role
    };
};