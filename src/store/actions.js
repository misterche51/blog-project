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
  AUTHENTIFICATION_FORM_FAILED,
  AUTHENTIFICATION_FORM_SUCCESS,
  LOG_OUT,
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

  USER_INFO_EDITING,
  USER_INFO_FETCHING,
  USER_INFO_FETCH_SUCCESS,
  USER_INFO_FETCH_ERRORED,

  ARTICLE_LIKE_FETCHING,
  ARTICLE_LIKE_FETCH_ERRORED,
  ARTICLE_LIKE_FETCH_SUCCESS,
  USER_INFO_FETCH_STATE_CLEARED,

} from './actionTypes.js';

import Api from '../Api/Api';

// экшены лайков

export function articleLikeFetching() {
  return {
    type: ARTICLE_LIKE_FETCHING,
  }
}

export function articleLikeFetchingErrored() {
  return {
    type: ARTICLE_LIKE_FETCH_ERRORED,
  }
}

export function articleLikedFetchingSuccess(payload) {
  return {
    type: ARTICLE_LIKE_FETCH_SUCCESS,
    payload,
  }
}

export function fetchingLike(slug, favorited, isSingle) {
  if (favorited) {
    return (dispatch) => {
      dispatch(articleLikeFetching());
      Api.deleteLike(slug)
        .then(res => {
          if (res.article) {
            const data = { ...res.article, isSingle: isSingle };
            dispatch(articleLikedFetchingSuccess(data));
            return res;
          }
        })
        .catch(() => dispatch(articleLikeFetchingErrored()));
    };
  } else {
    return (dispatch) => {
      dispatch(articleLikeFetching());
      Api.makeLike(slug)
        .then(res => {
          if (res.article) {
            const data = { ...res.article, isSingle: isSingle };
            dispatch(articleLikedFetchingSuccess(data));
            return res;
          }

        })
        .catch(() => dispatch(articleLikeFetchingErrored()));
    };
  }
}

// экшены обновления инфы о пользователе
export function userInfoEdit() {
  return {
    type: USER_INFO_EDITING
  }
}

export function userInfoFetching() {
  return {
    type: USER_INFO_FETCHING
  }
}

export function userInfoFetchingSuccess(payload) {
  return {
    type: USER_INFO_FETCH_SUCCESS,
    payload
  }
}

export function userInfoFetchingErrored(payload) {
  return {
    type: USER_INFO_FETCH_ERRORED,
    payload
  }
}

export function userInfoUpdatedStateClear() {
  return {
    type: USER_INFO_FETCH_STATE_CLEARED,
  }
}


export function fetchingUpdatedUserInfo(user) {
  return (dispatch) => {
    dispatch(userInfoFetching());
    Api.updateUserInfo(user)
      .then(res => {
        if (res.user) {
          dispatch(userInfoFetchingSuccess(res.user));
          return res;
        }
        if (res.errors) {
          dispatch(userInfoFetchingErrored(res.errors));
        }
      })
      .catch(() => dispatch(userInfoFetchingErrored()))
  };
}


//  экшены отправки статьи
export function articleNeedConfirmingToDelete() {
  return {
    type: ARTICLE_DELETE_CONFIRMING,
  }
}

export function articleDeletingSuccess() {
  return {
    type: ARTICLE_DELETE_SUCCESS,
  }
}

export function articleCancelConfirmingToDelete() {
  return {
    type: ARTICLE_DELETE_CONFIRMING_CANCEL,
  }
}

export function articleSending() {
  return {
    type: ARTICLE_SENDING,
  }
}

export function articleSendingSuccess(payload) {
  return {
    type: ARTICLE_SENDING_SUCCESS,
    payload
  }
}

export function articleStateClear() {
  return {
    type: ARTICLE_STATE_CLEAR,
  }
}

export function articleCreating() {
  return {
    type: ARTICLE_CREATING,
  }
}

export function articleEditing() {
  return {
    type: ARTICLE_EDITING,
  }
}

export function articleSendingFailed() {
  return {
    type: ARTICLE_SENDING_ERRORED,
  }
}

export function fetchingNewArticle(article) {
  return (dispatch) => {
    dispatch(articleSending());
    Api.createArticle({article})
    .then(res => {
      if (res.article) {
        const { slug } = res.article;
        dispatch(articleSendingSuccess(slug));
        dispatch(articleStateClear());
        return res;
      }
    })
      .catch(() => {
        console.log('error');
        dispatch(articleSendingFailed())
      });
  };
}

export function fetchingUpdatedArticle(article, slug) {
  return (dispatch) => {
    dispatch(articleSending());
    Api.updateArticle(article, slug)
    .then(res => {
      if (res.article) {
        const { slug } = res.article;
        dispatch(articleSendingSuccess(slug));
        dispatch(articleStateClear());
        return res;
      }
    })
    .catch(() => dispatch(articleSendingFailed()));
  };
}

export function deletingArticle(slug) {
  return (dispatch) => {
    dispatch(articleCancelConfirmingToDelete())
    dispatch(articleSending());
    Api.deleteArticle(slug)
    .then(res => {
        dispatch(articleDeletingSuccess());
        dispatch(articleStateClear());
        return res;
      })
    .catch(() => dispatch(articleSendingFailed()));
  };
}


//  экшены регистрации
export function registrationFormSending() {
  return {
    type: REGISTRATION_FORM_SENDING,
  }
}

export function registrationFailed(payload) {
  return {
    type: REGISTRATION_FAILED,
    payload
  }
}

export function registrationSuccess() {
  return {
    type: REGISTRATION_SUCCESS,
  }
}

export function sendingRegistration(user) {
  const { username, email, password } = user;

  return (dispatch) => {
    dispatch(registrationFormSending());
    Api.registration(username, email, password)
      .then((res) => {
        if (res.user) {
          dispatch(registrationSuccess());
        }
      })
      .catch((res) => dispatch(registrationFailed(res.errors)));
  };
}

// экшены авторизации
export function authentificationFormSending(payload = true) {
  return {
    type: AUTHENTIFICATION_FORM_SENDING,
    payload
  }
}

export function loggingOut() {
  Api.logOutUser();
  return {
    type: LOG_OUT,
  }
}

export function authentificationFormFailed(payload) {
  return {
    type: AUTHENTIFICATION_FORM_FAILED,
    payload,
  }
}

export function authentificationFormSuccess(payload) {
  return {
    type: AUTHENTIFICATION_FORM_SUCCESS,
    payload
  }
}

export function sendingAuthentificationForm(user) {
  return (dispatch) => {
    dispatch(authentificationFormSending());
    Api.authentication(user?.email, user?.password)
      .then(res => {
        if (res.user) {
          const { username, email, image } = res.user;
          dispatch(authentificationFormSuccess({ username, email, image }));
        } else {
          if (res === 'empty') {
            dispatch(loggingOut());
            dispatch(authentificationFormSending(false));
            return;
          }
          dispatch(authentificationFormFailed(res.errors));
        }
      })
      .catch((res) => dispatch(authentificationFormFailed(res.errors)));
  };
}



// экшены пагинации
export function setCurrentPage(payload) {
  return {
    type: SET_CURRENT_PAGE,
    payload
  }
}

export function setArticlesCount(payload) {
  return {
    type: SET_ARTICLES_COUNT,
    payload
  }
}

export function setArticlesPerPage(payload) {
  return {
    type: SET_ARTICLES_PER_PAGE,
    payload
  }
}


// экшен выбора одиночной статьи

export function articleLoading() {
  return {
    type: ARTICLE_IS_LOADING,
  }
}

export function articleErrored() {
  return {
    type: ARTICLE_HAS_ERRORED
  }
}

export function articleFetchSuccess(payload) {
  return {
    type: ARTICLE_FETCH_SUCCESS,
    payload
  }
}

export function fetchSingleArticle(slug) {
  return (dispatch) => {
    dispatch(articleLoading());
    Api.fetchSingleArticle(slug)
      .then(({ article }) => {
        dispatch(articleFetchSuccess(article));
      })
      .catch(() => dispatch(articleErrored()));
  };
}



// экшены загрузки ленты
export function postsLoading() {
  return {
    type: POSTS_IS_LOADING,
  }
}

export function postsErrored() {
  return {
    type: POSTS_HAS_ERRORED
  }
}

export function postsFetchSuccess(payload) {
  return {
    type: POSTS_FETCH_SUCCESS,
    payload
  }
}

export function fetchPosts(perPage, currentPage) {
  return (dispatch) => {
    dispatch(postsLoading());
    Api.fetchArticlesList(perPage, currentPage)
      .then(({ articles, articlesCount }) => {
        dispatch(setArticlesCount(articlesCount));
        dispatch(postsFetchSuccess(articles))
      })
      .catch(() => dispatch(postsErrored()));
  };
}
