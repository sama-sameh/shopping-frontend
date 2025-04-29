export class contact_messages {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    constructor(
        id: number,
        name: string,
        email: string,
        phone: string,
        message: string
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.message = message;
    }
}