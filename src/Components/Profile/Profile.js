import React, {useEffect} from 'react';
import c from './Profile.module.scss';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { fetchingUpdatedUserInfo, userInfoEdit, userInfoUpdatedStateClear } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import Message from '../Message/Message';

const Profile = ({
  currentUser,
  updateUserInfoFormSubmitHandler,
  currentEditingErrors,
  userUpdatedInfoFetching,
  userInfoUpdatedSuccessfully,

  userInfoEditing,
  userInfoEditingHandler,
  userInfoStateClear,
  history,
}) => {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = userInfo => handleSubmit(updateUserInfoFormSubmitHandler(userInfo));

  const { username, email, image } = currentUser;

  useEffect(() => {
    userInfoEditingHandler();
  }, [userInfoEditingHandler]);

  useEffect(() => {
    if (userInfoUpdatedSuccessfully && !userInfoEditing) {
      const timer = setTimeout(() => {
        history.push('/');
        userInfoStateClear();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userInfoUpdatedSuccessfully, history, userInfoEditing, userInfoStateClear]);





  // eslint-disable-next-line no-useless-escape
  const regExpURL = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

  return (
    (userInfoUpdatedSuccessfully && !userInfoEditing) ?
      <Message
      type='success'
      text='profile updated'
      address='/articles'
      label='Home page' /> :
      <form className={c.profileForm} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username" className={c.label}>
          Username
        </label>
        <input
          className={c.input}
          id="username"
          name="username"
          type="name"
          placeholder="Username"
          defaultValue={username}
          ref={register({
            required: 'required',
            minLength: 3,
          })}
        />
        <div className={c['error-message']}>
          {currentEditingErrors.username || (errors.username && errors.username.message)}
        </div>

        <label htmlFor="email" className={c.label}>
          Email address
        </label>
        <input
          className={c.input}
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          defaultValue={email}
          ref={register({
            required: 'required',
            pattern: {
              value: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim,
              message: 'invalid email address',
            },
          })}
        />
        <div className={c['error-message']}>
          {currentEditingErrors.email || (errors.email && errors.email.message)}
        </div>

        <label htmlFor="password" className={c.label}>
          New password
        </label>
        <input
          className={c.input}
          id="password"
          name="password"
          type="password"
          placeholder="New password"
          ref={register({
            pattern: {
              value: /^[A-Z0-9._%+-]{8,40}/i,
              message: 'At least 8 chars',
            },
          })}
        />
        <div className={c['error-message']}>
         {errors.password && errors.password.message}
        </div>

        <label htmlFor="image" className={c.label}>
          Avatar image (url)
        </label>
        <input
          className={c.input}
          id="image"
          name="image"
          placeholder="Avatar image"
          defaultValue={image || ''}
          ref={register({
            pattern: {
              value: regExpURL,
              message: 'Invalid URL',
            },
          })}
        />
        <div className={c['error-message']}>
          {currentEditingErrors.image || (errors.image && errors.image.message)}
        </div>
        <button className={c.profileForm__submit} type="submit" disabled={userUpdatedInfoFetching}>
          Save
        </button>
      </form>
  );
}

const mapStateToProps = (state) => {
  const {
    currentUser,
    currentEditingErrors,
    userUpdatedInfoFetching,
    userInfoUpdatedSuccessfully,
    userInfoEditing,

  } = state.currentUserReducer;

  return {
    currentUser,
    currentEditingErrors,
    userUpdatedInfoFetching,
    userInfoUpdatedSuccessfully,
    userInfoEditing,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserInfoFormSubmitHandler: (data) => dispatch(fetchingUpdatedUserInfo(data)),
    userInfoEditingHandler: () => dispatch(userInfoEdit()),
    userInfoStateClear: () => dispatch(userInfoUpdatedStateClear()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));
