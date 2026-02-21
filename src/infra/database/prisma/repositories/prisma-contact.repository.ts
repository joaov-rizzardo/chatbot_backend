import { Injectable } from "@nestjs/common";
import { Contact } from "src/domain/entities/contact";
import { ContactRepository, CreateContactData } from "src/domain/repositories/contact.repository";
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
