import { error } from '$helpers/response';
import { CategoryModel } from '$models/CategoryModel';
import { CategoryType, CommonStatus, ErrorCode } from '$types/enum';
import { Types } from 'mongoose';

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
  const category = await CategoryModel.findOne({
    _id: categoryId,
    createdBy: new Types.ObjectId(userId),
  });
  if (!category) throw error(ErrorCode.Category_Not_Found);

  const oldCategory = await CategoryModel.findOne({ name: params.name });
  if (oldCategory) throw error(ErrorCode.Category_Name_Already_Exist);

  Object.assign(category, { ...params });

  return await category.save();
}

interface IListCategory {
  keyword?: string;
  status?: string[];
}
export async function listCategory(userId: string, params: IListCategory) {
  const condition = {
    $or: [
      {
        type: CategoryType.COMMON,
        status: CommonStatus.ACTIVE,
        createdBy: new Types.ObjectId(userId),
      },
      { type: CategoryType.SYSTEM, status: CommonStatus.ACTIVE },
    ],
  };

  if (params.keyword) {
    condition.$or = condition.$or.map((item) => ({ ...item, name: { $regex: params.keyword } }));
  }

  return await CategoryModel.find(condition);
}
