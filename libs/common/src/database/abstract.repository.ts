import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export class AbstractRepository<TDocument extends AbstractDocument> {
  protected readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn('Dcoument was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    updateData: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, updateData, { new: true })
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn('Dcoument was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }
  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    const document = await this.model.find(filterQuery).lean<TDocument[]>(true);
    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }
  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndDelete(filterQuery)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }
}
