import { CHANGE_GAME } from '../constants/action-types'

const initialState = {
  game: 'fortnite'
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_GAME:
      return {...state, game: action.payload};
    default:
      return state;
  }
};

export default rootReducer;
