export class Instance {
    constructor(
        public id: string,
        public workspaceId: string,
        public name: string,
        public instanceName: string,
        public instanceId: string,
        public status: string,
        public phoneNumber: string | null,
        public qrCode: string | null,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}
