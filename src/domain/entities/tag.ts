export class Tag {
    constructor(
        public id: string,
        public workspaceId: string,
        public name: string,
        public color: string,
        public description: string | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}
