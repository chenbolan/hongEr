export enum ActionType {
  login = "LOGIN",
  isShowLogin = "ShowLogin",
}
export type Actions = LoginAction | ShowLoginAction;

export interface LoginAction {
  type: ActionType,
  isLogin: boolean
}

export interface ShowLoginAction {
  type: ActionType,
  isShow: boolean
}