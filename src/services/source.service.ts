import { SourceModel } from '$models/SourceModel';
import { CommonStatus } from '$types/enum';

export async function listSource(userId: string) {
  const sources = await SourceModel.find({ userId, status: CommonStatus.ACTIVE });

  return sources;
}

export async function detailsSource(userId: string, sourceId: string) {
  return await SourceModel.findOne({ _id: sourceId, userId, status: CommonStatus.ACTIVE });
}

interface ICreateSource {
  name: string;
  balance: number;
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
}
export async function updateSource(userId: string, sourceId: string, params: IUpdateSource) {
  const Source = await SourceModel.findOne({ _id: sourceId, userId });
  if (Source) {
    Object.assign(Source, params);
    await Source.save();
  }
}
