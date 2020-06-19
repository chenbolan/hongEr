import {Actions, ActionType} from './action';
interface State {
  // [key: string]: any;
  isLogin?: boolean;
  isShow?: boolean
}
export function reducer(state: State, action: Actions | any): State{
  console.log(action)
  switch(action.type){
    case ActionType.login:
      return {isLogin: action?.isLogin};
    case ActionType.isShowLogin:
      return {isShow: action?.isShow};
    default:
      return {};
  }
}