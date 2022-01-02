import { error } from '$helpers/response';
import { CategoryModel } from '$models/CategoryModel';
import { CategoryType, ErrorCode } from '$types/enum';

interface ICreateCategory {
  name: string;
  type: CategoryType;
}
export async function createCategory(userId: string, params: ICreateCategory) {
  const category = await CategoryModel.findOne({ name: params.name });
  if (category) throw error(ErrorCode.Category_Name_Already_Exist);

  const newCategory = new CategoryModel({
    createdBy: userId,
    ...params,
  });

  return await newCategory.save();
}

interface IUpdateCategory {
  name: string;
  type: CategoryType;
}
export async function updateCategory(userId: string, categoryId: string, params: IUpdateCategory) {
  const category = await CategoryModel.findOne({ _id: categoryId });
  if (!category) throw error(ErrorCode.Category_Not_Found);

  const newcategory = await CategoryModel.findOne({ name: params.name });
  if (newcategory) throw error(ErrorCode.Category_Name_Already_Exist);

  Object.assign(category, { ...params });

  return await category.save();
}

interface IListCategory {
  keyword?: string;
  status?: string[];
}
export async function listCategory(params: IListCategory) {
  const condition = {};

  if (params.keyword) {
    Object.assign(condition, { name: { $regex: params.keyword } });
  }

  return await CategoryModel.find(condition);
}
