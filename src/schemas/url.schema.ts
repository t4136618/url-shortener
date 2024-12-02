import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UrlDocument = HydratedDocument<Url>;

@Schema()
export class Url {
  @Prop({ unique: true, index: true })
  longUrl: string;

  @Prop({ unique: true, index: true })
  shortId: string;

  @Prop({ type: Date })
  expirationDate?: Date;

  @Prop({ default: 0 })
  accessCount: number;

  @Prop({ type: [Date], default: [] })
  accessTimestamps: Date[];
}

export const UrlSchema = SchemaFactory.createForClass(Url);

UrlSchema.index({ shortId: 1, longUrl: 1 });
UrlSchema.index({ expirationDate: 1 });
UrlSchema.index({ accessCount: 1 });
