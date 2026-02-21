import { Injectable } from "@nestjs/common";
import { Contact } from "src/domain/entities/contact";
import { ContactRepository, CreateContactData, UpdateContactData } from "src/domain/repositories/contact.repository";
import { PrismaService } from "../prisma.service";
import { Contacts as PrismaContact } from "generated/prisma/client";

@Injectable()
export class PrismaContactRepository implements ContactRepository {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async create(data: CreateContactData): Promise<Contact> {
        const result = await this.prismaService.contacts.create({
            data: {
                workspaceId: data.workspaceId,
                phoneNumber: data.phoneNumber,
                name: data.name,
                lastName: data.lastName ?? null,
                email: data.email ?? null,
            },
        });
        return this.toEntity(result);
    }

    async findByWorkspaceAndPhone(workspaceId: string, phoneNumber: string): Promise<Contact | null> {
        const result = await this.prismaService.contacts.findUnique({
            where: {
                workspaceId_phoneNumber: { workspaceId, phoneNumber },
            },
        });
        return result ? this.toEntity(result) : null;
    }

    async findById(id: string): Promise<Contact | null> {
        const result = await this.prismaService.contacts.findUnique({
            where: { id },
        });
        return result ? this.toEntity(result) : null;
    }

    async update(id: string, data: UpdateContactData): Promise<Contact> {
        const result = await this.prismaService.contacts.update({
            where: { id },
            data: {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
            },
        });
        return this.toEntity(result);
    }

    async delete(id: string): Promise<void> {
        await this.prismaService.contacts.delete({
            where: { id },
        });
    }

    async findByWorkspaceId(workspaceId: string): Promise<Contact[]> {
        const results = await this.prismaService.contacts.findMany({
            where: { workspaceId },
            orderBy: { name: 'asc' },
        });
        return results.map((r) => this.toEntity(r));
    }

    private toEntity(data: PrismaContact): Contact {
        return new Contact(
            data.id,
            data.workspaceId,
            data.phoneNumber,
            data.name,
            data.lastName,
            data.email,
            data.created_at,
            data.updated_at,
        );
    }
}
