export class user_roles {
    user_id: number;
    role_id: number;
    constructor(
        user_id: number,
        role_id: number
    ) {
        this.user_id = user_id;
        this.role_id = role_id;
    }
}