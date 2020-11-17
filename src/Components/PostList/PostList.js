import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Post from '../Post/Post';
import { fetchPosts, setArticlesPerPage, setCurrentPage } from '../../store/actions';
import LoaderIndicator from '../LoaderIndicator/LoaderIndicator';
import { Pagination } from 'antd';
import c from './PostList.module.scss'

const Loader = ({isLoading, hasError}) => {
  return isLoading && !hasError ? <LoaderIndicator /> : null;
}

const List = ({ articles }) => {
  const list = articles.map(({ slug, ...data }) =>
    <li className={c.list__item} key={data.createdAt + slug}>
      <Post data={data} slug={slug}/>
    </li>
  );
  if (!articles.length) return null;
  return <ul className={c.list}>{list}</ul>
}



const PostList = ({
  fetchPostsHandler,
  posts,
  isLoading,
  hasError,
  currentPage,
  articlesCount,
  articlesPerPage,
  setArticlesPerPageHandler,
  setCurrentPageHandler,
}) => {

  const fetchPosts = useCallback(
    () => fetchPostsHandler(articlesPerPage, currentPage),
    [fetchPostsHandler, articlesPerPage, currentPage]
  )

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const hasResults = !!posts.length && !isLoading && !hasError;

  return (
    <>
      <Loader hasError={hasError} isLoading={isLoading} />
      <List articles={posts} />
      {hasResults ? <Pagination
        className={c.pagination}
        current={currentPage}
        pageSize={articlesPerPage}
        total={articlesCount}
        pageSizeOptions={[5, 10, 20, 50]}
        onChange={(page) => setCurrentPageHandler(page)}
        onShowSizeChange={(current, size) => setArticlesPerPageHandler(size)}
      /> : null}
    </>
  );
}

const mapStateToProps = (state) => {

  const { posts, isLoading, hasError } = state.articlesReducer;
  const { currentPage, articlesCount, articlesPerPage } = state.paginationReducer;
  const { userIsLogged } = state.currentUserReducer;

  return {
    posts,
    isLoading,
    hasError,
    currentPage,
    articlesCount,
    articlesPerPage,
    userIsLogged,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPostsHandler: (perPage, currentPage) => dispatch(fetchPosts( perPage, currentPage )),
    setArticlesPerPageHandler: (size) => dispatch(setArticlesPerPage(size)),
    setCurrentPageHandler: (page) => dispatch(setCurrentPage(page)) ,
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PostList));
