import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import c from './LogInOutForm.module.scss';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { sendingAuthentificationForm } from '../../store/actions';

const SignIn = ({
  submitFormHandler,
  authentificationFormSending,
  userIsLogged,
  history,
  authErrors, }) => {
  const onSubmit = (...data) => {submitFormHandler(...data)}
  const {register, handleSubmit, errors} = useForm();

  useEffect(() => {
    if (userIsLogged) history.push('/');
  }, [userIsLogged, history]);

  return (

    <form className={c.form} onSubmit={handleSubmit(onSubmit)}>
      <h6 className={c.form__title}>Sign In</h6>
      <div className={c.form__field}>
        <label className={c.form__label} htmlFor="email">Email address</label>
        <input
          className={c.form__input}
          name="email"
          id="email"
          placeholder="Email address"
          ref={register({
            required: 'required',
            pattern: {
              value: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim,
            },
          })}
        />
        {errors.email && errors.email.type === 'required' && <p className={c.form__errorMessage}>Email field is required</p>}
      </div>

      <div className={c.form__field}>
        <label className={c.form__label} htmlFor="password">Password</label>
        <input
          className={c.form__input}
          name="password"
          id="password"
          type="password"
          placeholder="Password"
            ref={register({
              required: 'required',
              minLength: 8,
              pattern: {
                value: /^[A-Z0-9._%+-]{8,40}/i,
              },
            })}
        />
        {errors.password && errors.password.type === 'required' && <p className={c.form__errorMessage}>Password is required</p>}
        {errors.password && errors.password.type === 'minLength' && <p className={c.form__errorMessage}>At least 8 chars</p>}
        {authErrors && <p className={c.form__errorMessage}>Wrong email or password</p>}
      </div>


      <button className={c.form__submit} type="submit" disabled={authentificationFormSending}>
        Login
      </button>
      <p className={c.form__info}>
        Don’t have an account? <Link to="/sign-up">Sign Up.</Link>
      </p>
    </form>
  );
}

const mapStateToProps = (state) => {

  const { authentificationFormSending, userIsLogged, authErrors, } = state.currentUserReducer;

  return {
    authentificationFormSending,
    userIsLogged,
    authErrors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitFormHandler: (data) => dispatch(sendingAuthentificationForm(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));

