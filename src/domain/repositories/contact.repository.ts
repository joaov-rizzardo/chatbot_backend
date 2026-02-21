import { Contact } from "../entities/contact";

export type CreateContactData = {
    workspaceId: string;
    phoneNumber: string;
    name: string;
    lastName?: string | null;
    email?: string | null;
}

export abstract class ContactRepository {
    abstract create(data: CreateContactData): Promise<Contact>
    abstract findByWorkspaceAndPhone(workspaceId: string, phoneNumber: string): Promise<Contact | null>
}
