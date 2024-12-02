import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UrlDocument = HydratedDocument<Url>;

@Schema()
export class Url {
  @Prop()
  name: string;

  @Prop({ unique: true, index: true })
  longUrl: string;

  @Prop({ unique: true, index: true })
  shortId: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);

UrlSchema.index({ shortId: 1, longUrl: 1 });
