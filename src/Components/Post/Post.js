import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import c from './Post.module.scss';
import { withRouter } from 'react-router-dom';
import { getFormattedDate } from './helpers';
import {
  fetchSingleArticle,
  articleEditing,
  fetchingLike,
  articleNeedConfirmingToDelete,
  articleCancelConfirmingToDelete,
  deletingArticle,
  articleStateClear,
} from '../../store/actions';
import LoaderIndicator from '../LoaderIndicator/LoaderIndicator';



const Loader = ({
  isSingle,
  articleLoading,
  articleError,
  fetching
}) => isSingle && (articleLoading||fetching) && !articleError
    ? <LoaderIndicator />
    : null;


const LikeBox = ({
  userIsLogged,
  favorited,
  onChangeHandler,
  slug,
  likes,
  isSingle
}) =>
  <div className={c.likes}>
    <input
      type="checkbox"
      id={slug}
      className={c.likes__input}
      checked={favorited && userIsLogged}
      onChange={
        (e) => {
          if (!userIsLogged) return;
          e.preventDefault();
          onChangeHandler(slug, favorited, isSingle);
        }
      }
    />
    <label className={c.likes__label} htmlFor={slug}>{likes}</label>
  </div>;


const Post = ({
  data,
  articleEditingHandler,
  articleDeleteButtonClickHandler,
  history,
  match,
  slug,
  articleData,
  isSingle,
  fetchArticle,
  articleLoading,
  articleError,
  currentUser,
  userIsLogged,
  likeClickHandler,
  deleteConfirming,
  articleCancelDeleteButtonClickHandler,
  articleDeleteHandler,
  deletedSuccesfully,
  fetching,
}) => {

  useEffect(() => {
    if (isSingle) fetchArticle(slug);
  }, [isSingle, slug, fetchArticle]);

  useEffect(() => {
    if (isSingle && deletedSuccesfully) {
      history.push('/');
    }
  }, [isSingle, deletedSuccesfully, history]);

  const {
    title,
    body,
    description,
    tagList,
    createdAt,
    author,
    favorited,
    favoritesCount: likes,
  } = isSingle ? articleData : data;


  const tags = tagList?.length ? tagList.map((tag, idx) => <li key={idx} className={c.content__tagItem}>{tag}</li>) : null;

  const goToSingle = (id) => {
    if (isSingle) return;
    history.push(`/articles/${id}`);
  };


  const EditorBar = ({ isSingle, userIsLogged, currentUser, articleDeleteButtonClickHandler }) =>
    isSingle && userIsLogged && (author?.username === currentUser.username)
      ? <div className={ c.editorBox}>
          <button className={c.buttonDelete} onClick={articleDeleteButtonClickHandler} type="button">
            Delete
          </button>
          <button
            className={c.buttonEdit}
            onClick={() => {
              history.push(`${match.url}/edit`);
              articleEditingHandler();}
            }
            type="button"
          >
            Edit
          </button>
        </div>
      : null;

  const ConfirmBlock = ({ slug, deleteConfirming, onCancel, onSubmit }) =>
    deleteConfirming ?
      <div className={c.confirm}>
        <p className={c.confirm__title}>Are u really want to delete this post?</p>
        <div className={c.confirm__buttonsBlock}>
          <button className={c.confirm__deleteButton} onClick={() => onSubmit(slug)}>Yes, delete</button>
          <button className={c.confirm__resetButton} onClick={onCancel}>No</button>
        </div>
      </div> : null;


  const content = isSingle && <div className={c.content__description}>{body}</div>;

  return (
    <>
      <Loader isSingle={isSingle} fetching={fetching} articleError={articleError} articleLoading={articleLoading}/>
      {!!title && !fetching && !articleLoading &&
        <div className={c.post}>
          <div className={c.post__content}>
            <p className={c.content__title} onClick={() => goToSingle(slug)}>{title}</p>
            <LikeBox
              favorited={favorited}
              onChangeHandler={likeClickHandler}
              slug={slug}
              likes={likes}
              isSingle={isSingle}
              userIsLogged={userIsLogged}/>
            <ul className={c.content__tagList}>
              {tags}
            </ul>
            <p className={c.content__description}>{description}</p>
            {content}
          </div>
        <div className={c.info}>
          <div className={c.info__bar}>
            <div className={c.info__text}>
                <p className={c.info__userName}>{author?.username}</p>
                <p className={c.info__date}>{getFormattedDate(createdAt)}</p>
              </div>
              <div className={c.info__userPhoto}>
                <img src={author?.image} alt={`avatar of ${author?.username}`} width="46" height="46"/>
              </div>
          </div>
          <EditorBar
              isSingle={isSingle}
              userIsLogged={userIsLogged}
              username={author?.username}
              currentUser={currentUser}
              articleDeleteButtonClickHandler={articleDeleteButtonClickHandler}
          />
        </div>
        <ConfirmBlock
          slug={slug}
          deleteConfirming={deleteConfirming}
          onCancel={articleCancelDeleteButtonClickHandler}
          onSubmit={articleDeleteHandler}
        />
        </div>
      }
    </>

  );
}

const mapStateToProps = (state) => {
  const { articleId, articleData, articleLoading, articleError} = state.articlesReducer;
  const { currentUser, userIsLogged } = state.currentUserReducer;
  const { deleteConfirming, deletedSuccesfully, fetching } = state.articleStateReducer;

  return {
    articleId,
    articleData,
    articleLoading,
    articleError,
    currentUser,
    userIsLogged,
    deleteConfirming,
    deletedSuccesfully,
    fetching
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchArticle: (id) => dispatch(fetchSingleArticle(id)),
    articleEditingHandler: () => dispatch(articleEditing()),
    likeClickHandler: (id, checked, isSingle) => dispatch(fetchingLike(id, checked, isSingle)),
    articleDeleteButtonClickHandler: () => dispatch(articleNeedConfirmingToDelete()),
    articleCancelDeleteButtonClickHandler: () => dispatch(articleCancelConfirmingToDelete()),
    articleDeleteHandler: (id) => dispatch(deletingArticle(id)),
    articleStateClear: () => dispatch(articleStateClear()),
  };
};

function compare(prevProps, nextProps) {
  return prevProps.articleData.favorited !== nextProps.articleData.favorited && !nextProps.isSingle;
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(React.memo(Post, compare)));
