export abstract class ContactTagRepository {
    abstract deleteByTagId(tagId: string): Promise<void>
}
