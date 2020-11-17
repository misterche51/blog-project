import React, { useEffect } from 'react';
import { Link, withRouter } from "react-router-dom";
import c from './Header.module.scss';
import defaultAvatar from './defaultAvatar.png';
import { connect } from 'react-redux';
import {
  loggingOut,
  articleCreating,
  sendingAuthentificationForm,
} from '../../store/actions'

const RegistrationBar = () =>
  <>
    <Link to="/sign-in" className={c.button} type="button">Sign in</Link>
    <Link to="/sign-up" className={c.button} type="button">Sign up</Link>
  </>
;

const UserInfoBar = ({info, loggingOutHandler, creatingArticleHandler, history}) => {
  const { username, image } = info;
  const avatar = image || defaultAvatar;
  const logOutAndRedirect = () => {
    loggingOutHandler();
    history.push('/');
  };

  return (
    <>
      <Link to="/new-article" className={c.button} onClick={creatingArticleHandler}>Create article</Link>
      <Link to="/profile" className={c.button}>
        {username}
        <img className={c.avatar} src={avatar} alt="logo"/>
      </Link>
      <button type="button" className={c.button} onClick={logOutAndRedirect}>
        Log Out
      </button>
    </>
  );
}

const Header = ({userIsLogged, currentUser, loggingOutHandler, loggingInHandler, creatingArticleHandler, history}) => {
  useEffect(() => {
    loggingInHandler();
  }, [loggingInHandler]);
  return (
    <header className={c.header}>
      <Link to="/articles/" className={c.logo}>Realworld Blog</Link>
      {userIsLogged
        ? <UserInfoBar
            info={currentUser}
            loggingOutHandler={loggingOutHandler}
            creatingArticleHandler={creatingArticleHandler}
            history={history} />
        : <RegistrationBar />}
    </header>
  );
}

const mapStateToProps = (state) => {

  const { userIsLogged, currentUser } = state.currentUserReducer;

  return {
        userIsLogged,
        currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loggingOutHandler: () => dispatch(loggingOut()),
    creatingArticleHandler: () => dispatch(articleCreating()),
    loggingInHandler: () => dispatch(sendingAuthentificationForm())
  };
};

function compare(prevProps, nextProps) {
  return prevProps.currentUser === nextProps.currentUser
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(React.memo(Header, compare)));


