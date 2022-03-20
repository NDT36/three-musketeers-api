import { auth } from 'firebase-admin';

export function verifyIdToken(idToken: string) {
  return auth().verifyIdToken(idToken);
}
