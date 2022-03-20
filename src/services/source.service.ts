import { SourceModel } from '$models/SourceModel';

export async function listSource(userId: string) {
  const sources = await SourceModel.find({ userId });

  return sources;
}

interface ICreateSource {
  name: string;
  balance: number;
  description: string;
  color: string;
}
export async function createSource(userId: string, params: ICreateSource) {
  const Source = new SourceModel({
    userId,
    ...params,
  });
  const source = await Source.save();

  return source.toObject();
}

interface IUpdateSource {
  name: string;
  description: string;
  color: string;
}
export async function updateSource(userId: string, sourceId: string, params: IUpdateSource) {
  const Source = await SourceModel.findOne({ _id: sourceId, userId });
  if (Source) {
    Object.assign(Source, params);
    await Source.save();
  }
}
