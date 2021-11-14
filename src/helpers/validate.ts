import AJV from 'ajv';
import log from '$helpers/log';
import { ErrorCode } from '$types/enum';
import { error } from './response';
const logger = log('Validate');
import addFormats from 'ajv-formats';

const dateTimeRegex = new RegExp(
  '^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9].[0-9][0-9][0-9])Z$'
);
const AjvInstance = new AJV();
addFormats(AjvInstance);
AjvInstance.addFormat('ISOString', {
  validate: (dateTimeString: string) => dateTimeRegex.test(dateTimeString),
});

/**
 *
 * @param schemaKeyRef Schema JSON validate.
 * @param data Object validate
 */
export function validate(schemaKeyRef: object | string | boolean, data: any) {
  const validate = AjvInstance.validate(schemaKeyRef, data);
  if (!validate) {
    logger.error(AjvInstance.errors);
    throw error(ErrorCode.Invalid_Input, 422, { payload: AjvInstance.errors }); // 422 Unprocessable Entity
  }
  return;
}
