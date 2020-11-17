import {
  POSTS_IS_LOADING,
  POSTS_HAS_ERRORED,
  POSTS_FETCH_SUCCESS,

  ARTICLE_IS_LOADING,
  ARTICLE_HAS_ERRORED,
  ARTICLE_FETCH_SUCCESS,

  SET_CURRENT_PAGE,
  SET_ARTICLES_COUNT,
  SET_ARTICLES_PER_PAGE,

  AUTHENTIFICATION_FORM_SENDING,
  AUTHENTIFICATION_FORM_SUCCESS,
  AUTHENTIFICATION_FORM_FAILED,
  LOG_OUT,
  USER_INFO_EDITING,
  USER_INFO_FETCHING,
  USER_INFO_FETCH_SUCCESS,
  USER_INFO_FETCH_ERRORED,
  USER_INFO_FETCH_STATE_CLEARED,

  REGISTRATION_SUCCESS,
  REGISTRATION_FORM_SENDING,
  REGISTRATION_FAILED,

  ARTICLE_SENDING,
  ARTICLE_SENDING_SUCCESS,
  ARTICLE_SENDING_ERRORED,
  ARTICLE_STATE_CLEAR,
  ARTICLE_EDITING,
  ARTICLE_CREATING,
  ARTICLE_DELETE_CONFIRMING,
  ARTICLE_DELETE_CONFIRMING_CANCEL,
  ARTICLE_DELETE_SUCCESS,

  ARTICLE_LIKE_FETCHING,
  ARTICLE_LIKE_FETCH_ERRORED,
  ARTICLE_LIKE_FETCH_SUCCESS
} from './actionTypes';


const initialArticlesState = {
  isLoading: false,
  hasError: false,
  posts: [],
  articleData: {},
  articleId: null,
  articleLoading: false,
  articleError: false,
  articleLikeFetching: false,
  articleLikeFetchingErrored: false,
};

export function articlesReducer(state = initialArticlesState, {type, payload}) {
  switch (type) {
    case ARTICLE_LIKE_FETCHING:
      return {
        ...state,
        articleLikeFetching: true,
      }
    case ARTICLE_LIKE_FETCH_ERRORED:
      return {
        ...state,
        articleLikeFetching: false,
        articleLikeFetchingErrored: true,
      }
    case ARTICLE_LIKE_FETCH_SUCCESS:
      const { isSingle } = payload;
      const copy = [...state.posts];
      const liked = copy.findIndex(item => item.slug === payload.slug);
      copy[liked] = payload;
      if (isSingle) return {
          ...state,
          articleLikeFetching: false,
          posts: copy,
          articleData: payload,
      }
        return {
          ...state,
          articleLikeFetching: false,
          posts: copy,
        }
    case POSTS_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        hasError: false,
        posts: [],
        articleId: null,
        articleData: {},
      };
    case POSTS_FETCH_SUCCESS:
      return {
        ...state,
        posts: payload,
        isLoading: false,
        hasError: false,
      };
    case POSTS_HAS_ERRORED:
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    case ARTICLE_IS_LOADING:
      return {
        ...state,
        articleLoading: true,
        posts: [],
      };
    case ARTICLE_HAS_ERRORED:
      return {
        ...state,
        articleLoading: false,
        articleError: true,
      };
    case ARTICLE_FETCH_SUCCESS:
        return {
          ...state,
          articleLoading: false,
          articleError: false,
          articleData: payload,
        };
    default:
      return state;
  }
}

const initialPaginationState = {
  currentPage: 1,
  articlesCount: 0,
  articlesPerPage: 10,
};

export function paginationReducer(state = initialPaginationState, {type, payload}) {
  switch (type) {
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: payload,
      };
    case SET_ARTICLES_COUNT:
      return {
        ...state,
        articlesCount: payload,
      };
    case SET_ARTICLES_PER_PAGE:
      return {
        ...state,
        articlesPerPage: payload,
      }
      default:
        return state;
    }
  }

const initialCurrentUserState = {
  authentificationFormSending: false,
  currentUser: null,
  userIsLogged: false,
  userInfoEditing: false,
  userUpdatedInfoFetching: false,
  userInfoFetchingError: false,
  userInfoUpdatedSuccessfully: false,
  authErrors: null,
  currentEditingErrors: {
    username: null,
    email: null,
    password: null,
    image: null,
  }
}

export function currentUserReducer(state = initialCurrentUserState, {type, payload}) {
  switch (type) {
    case AUTHENTIFICATION_FORM_SENDING:
      return {
        ...state,
        authentificationFormSending: payload,
        authErrors: null,
      };
    case LOG_OUT:
      return initialCurrentUserState;
    case AUTHENTIFICATION_FORM_FAILED:
      return {
        ...state,
        userIsLogged: false,
        authentificationFormSending: false,
        authErrors: payload
      };
    case AUTHENTIFICATION_FORM_SUCCESS:
      return {
        ...state,
        authentificationFormSending: false,
        userIsLogged: true,
        currentUser: payload,
        currentEditingErrors: initialCurrentUserState.currentEditingErrors,
      }
    case USER_INFO_EDITING:
      return {
        ...state,
        userInfoEditing: true,
      }
    case USER_INFO_FETCHING:
      return {
        ...state,
        userInfoFetchingError: false,
        userUpdatedInfoFetching: true,
        currentEditingErrors: initialCurrentUserState.currentEditingErrors,
      }
      case USER_INFO_FETCH_SUCCESS:
        return {
          ...state,
          currentUser: payload,
          userInfoEditing: false,
          userUpdatedInfoFetching: false,
          userInfoUpdatedSuccessfully: true,
        }
      case USER_INFO_FETCH_ERRORED:
        return {
          ...state,
          userUpdatedInfoFetching: false,
          userInfoFetchingError: true,
          currentEditingErrors: payload,
        }
      case USER_INFO_FETCH_STATE_CLEARED:
        return {
          ...state,
          userInfoUpdatedSuccessfully: false,
        }
      default:
        return state;
    }
  }

  const initialRegistrationFormState = {
    registrationFormSending: false,
    registration: null,
    registrationErrors: {
      username: null,
      email: null,
      password: null,
    },
  }

  export function registrationReducer(state = initialRegistrationFormState, {type, payload}) {
    switch (type) {
      case REGISTRATION_FORM_SENDING:
        return {
          ...state,
          registrationFormSending: true,
          registrationErrors: {
            username: null,
            email: null,
            password: null,
          },
        };
      case REGISTRATION_FAILED:
        return {
          ...state,
          registration: false,
          registrationFormSending: false,
          registrationErrors: payload,
        };
      case REGISTRATION_SUCCESS:
        return {
          ...state,
          registration: true,
          registrationFormSending: false,
        }
        default:
          return state;
      }
    }

  const initialArticleState = {
    creating: false,
    editing: false,
    fetching: false,
    deleteConfirming: false,
    deletedSuccesfully: false,
    fetchError: false,
    fetchSuccess: false,
    slug: null,
  }

  export function articleStateReducer(state = initialArticleState, {type, payload}) {
    switch (type) {
      case ARTICLE_DELETE_CONFIRMING_CANCEL:
        return {
          ...state,
          deleteConfirming: false,
        }
      case ARTICLE_DELETE_CONFIRMING:
        return {
          ...state,
          deleteConfirming: true,
        }
      case ARTICLE_DELETE_SUCCESS:
        return {
          ...state,
          fetching: false,
          deletedSuccesfully: true,
        }
      case ARTICLE_CREATING:
        return {
          ...state,
          creating: true,
        };
        case ARTICLE_EDITING:
          return {
            ...state,
            editing: true,
          };
      case ARTICLE_SENDING:
        return {
          ...state,
          fetching: true,
          editing: false,
          creating: false,
        };
      case ARTICLE_STATE_CLEAR:
        return initialArticleState;
      case ARTICLE_SENDING_SUCCESS:
        return {
          ...state,
          fetchSuccess: true,
          fetching: false,
          slug: payload,
        };
      case ARTICLE_SENDING_ERRORED:
        return {
          ...state,
          fetching: false,
          fetchError: true,
        };
        default:
          return state;
      }
    }