export class Contact {
    constructor(
        public id: string,
        public workspaceId: string,
        public phoneNumber: string,
        public name: string,
        public lastName: string | null,
        public email: string | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}
