export abstract class ContactTagRepository {
    abstract addTagToContact(contactId: string, tagId: string): Promise<void>
    abstract removeTagFromContact(contactId: string, tagId: string): Promise<void>
    abstract existsByContactAndTag(contactId: string, tagId: string): Promise<boolean>
    abstract deleteByTagId(tagId: string): Promise<void>
}
