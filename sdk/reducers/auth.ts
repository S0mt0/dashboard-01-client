import { AuthActions, TAuth, TAuthAction } from "../../sdk";

export const authReducer = (authState: TAuth, action: TAuthAction): TAuth => {
  const { type, payload } = action;

  switch (type) {
    case AuthActions.START_LOADING:
      return {
        ...authState,
        state: {
          ...authState.state,
          error: false,
          loading: true,
          success: false,
        },
      };

    case AuthActions.SET_TOKEN:
      if (!payload) alert("Provide an access token");

      return {
        ...authState,
        accessToken: payload,
        state: {
          ...authState.state,
          error: false,
          loading: false,
          success: true,
        },
      };

    case AuthActions.SET_AUTH_PROFILE:
      if (!payload) alert("Provide a valid auth data");

      return {
        ...authState,
        authProfile: payload,
        state: {
          ...authState.state,
          error: false,
          loading: false,
          success: true,
        },
      };

    case AuthActions.SET_AUTH:
      if (!payload || !payload.profile || !payload.token)
        alert("Provide 'profile' and 'token' data");

      return {
        ...authState,
        authProfile: payload.profile,
        accessToken: payload.token,
        state: {
          ...authState.state,
          error: false,
          loading: false,
          success: true,
        },
      };

    case AuthActions.SET_ERROR:
      return {
        ...authState,
        state: {
          ...authState.state,
          error: true,
          loading: false,
          success: false,
          errorMessage: payload,
        },
      };

    case AuthActions.END_LOADING:
      return {
        ...authState,
        state: {
          ...authState.state,
          loading: false,
        },
      };

    default:
      return authState;
  }
};
