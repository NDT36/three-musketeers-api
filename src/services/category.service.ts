import { CategoryModel, ICategory } from '$models/Category';
import { CommonStatus } from '$types/enum';

export async function createCategory(params: ICategory) {
  const Category = new CategoryModel({
    ...params,
  });

  const result = await Category.save();
  return result.toObject();
}

export async function listCategory(params) {
  const query = CategoryModel.find({ status: CommonStatus.ACTIVE });

  if (params.name) {
    query.where('name').regex(new RegExp(params.name, 'i'));
  }

  if (params.status && params.status.length) {
    query.where('status').in(params.status);
  }

  const result = query.lean().exec();
  return result;
}

export async function updateCategory(categoryId: string, params: ICategory) {
  const Category = await CategoryModel.findOne({ _id: categoryId });
  if (params.hasOwnProperty('name')) Category.name = params.name;
  if (params.hasOwnProperty('status')) Category.status = params.status;
  const result = await Category.save();
  return result.toObject();
}
