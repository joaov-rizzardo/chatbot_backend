import { Contact } from "../entities/contact";

export type CreateContactData = {
    workspaceId: string;
    phoneNumber: string;
    name: string;
    lastName?: string | null;
    email?: string | null;
}

export type UpdateContactData = {
    name?: string;
    lastName?: string | null;
    email?: string | null;
}

export abstract class ContactRepository {
    abstract create(data: CreateContactData): Promise<Contact>
    abstract findById(id: string): Promise<Contact | null>
    abstract findByWorkspaceAndPhone(workspaceId: string, phoneNumber: string): Promise<Contact | null>
    abstract findByWorkspaceId(workspaceId: string): Promise<Contact[]>
    abstract update(id: string, data: UpdateContactData): Promise<Contact>
    abstract delete(id: string): Promise<void>
}
