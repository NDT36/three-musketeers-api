import AJV from 'ajv';
import log from '$helpers/log';
import { ErrorCode } from '$types/enum';
import { error } from './response';
const logger = log('Validate');
import addFormats from 'ajv-formats';
// import { PublicKey } from '@solana/web3.js';

const AjvInstance = new AJV();
// AjvInstance.addFormat('wallet-address', {
//   validate: (address: string) => PublicKey.isOnCurve(address),
// });

/* -------------------------------------------------------------------------- */
/*                            Add additional format                           */
/* -------------------------------------------------------------------------- */
addFormats(AjvInstance);

export function validate(schemaKeyRef: AjvSchema, data: any) {
  const validate = AjvInstance.validate(schemaKeyRef as any, data);
  /* -------------------------------------------------------------------------- */
  /*                              Validate success                              */
  /* -------------------------------------------------------------------------- */
  if (validate) return;

  /* -------------------------------------------------------------------------- */
  /*                               Validate failed                              */
  /* -------------------------------------------------------------------------- */
  logger.error(AjvInstance.errors);
  throw error(ErrorCode.Invalid_Input, 422, { payload: AjvInstance.errors }); // 422 Unprocessable Entity
}
