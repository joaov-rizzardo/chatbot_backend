export class Session {
    constructor(
        public id: string,
        public userId: string,
        public workspaceId: string | null,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}