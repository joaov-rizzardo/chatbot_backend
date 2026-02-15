export class Instance {
    constructor(
        public id: string,
        public workspaceId: string,
        public instanceName: string,
        public instanceId: string,
        public status: string,
        public qrCode: string | null,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}
