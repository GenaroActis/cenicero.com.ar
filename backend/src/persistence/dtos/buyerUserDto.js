export default class buyerUserDto {
    constructor(user) {
        this.fullName = `${user.firstName} ${user.lastName}`
        this.emailBuyer = user.email
    };
};