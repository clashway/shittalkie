import { CHANGE_GAME } from '../constants/action-types'

export const changeGame = game => (
  { type: CHANGE_GAME, payload: game }
);
