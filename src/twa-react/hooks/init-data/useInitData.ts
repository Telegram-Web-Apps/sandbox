import {InitData} from '../../../twa';

type PickedProps = 'authDate' | 'canSendAfter' | 'chat' | 'hash' | 'queryId'
  | 'receiver' | 'raw' | 'startParam' | 'user' | 'unsafe';
type Result = Pick<typeof InitData, PickedProps>;

/**
 * Hooks which allows usage of InitData functionality.
 */
export function useInitData(): Result {
  const {
    raw, unsafe, user, authDate, startParam, chat, queryId, hash, canSendAfter,
    receiver,
  } = InitData;

  return {
    authDate, canSendAfter, chat, hash, queryId, receiver, raw, startParam,
    user, unsafe,
  };
}