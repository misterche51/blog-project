import React from 'react';
import c from './App.module.scss';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Header from '../Header/Header';
import PostList from '../PostList/PostList';
import Post from '../Post/Post';
import SignIn from '../LogInOutForm/SignIn';
import SignUp from '../LogInOutForm/SignUp';
import ArticlePage from '../ArticlePage/ArticlePage';
import Profile from '../Profile/Profile';
import { connect } from 'react-redux';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={ props => auth ? <Component {...props} />: <Redirect to="/" /> }
  />
);

function App({ userIsLogged }) {

  return (
    <BrowserRouter>
      <div className={c.app}>
        <Header />
        <Route path="(/|/articles)" exact component={PostList} />
        <ErrorBoundary>
          <Switch>
            <Route
              path="/articles/:slug/edit"
              render={({ match }) => {
                const { slug } = match.params;
                return <ArticlePage editing slug={slug} />;
              }}
            />

            <Route
              path="/articles/:slug/"
              render={({ match }) => {
                const { slug } = match.params;
                return <Post isSingle slug={slug} />;
              }}
            />
          </Switch>
        </ErrorBoundary>
        <Route path="/sign-in" component={SignIn} exact />
        <Route path="/sign-up" component={SignUp} exact />

        <ErrorBoundary>
          <PrivateRoute
            auth={userIsLogged}
            path="/new-article" component={ArticlePage} />
        </ErrorBoundary>

        <ErrorBoundary>
          <PrivateRoute
              auth={userIsLogged}
              path="/profile"
              component={Profile} />
        </ErrorBoundary>

      </div>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {

  const { userIsLogged } = state.currentUserReducer;

  return {
    userIsLogged
  };
};



export default connect(mapStateToProps)(App);
