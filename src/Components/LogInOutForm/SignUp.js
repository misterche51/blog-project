import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import c from './LogInOutForm.module.scss';
// import Message from '../Message/Message';
import { connect } from 'react-redux';
import { sendingRegistration } from '../../store/actions';

const SignUp = ({
  submitFormHandler,
  registrationErrors,
  formSending,
  registration,
}) => {
  const onSubmit = (data) => { submitFormHandler(data)}
  const { register, handleSubmit, errors, watch } = useForm();
  // const redirect = <Link to='/sign-in'>Sign In</Link>



  const usernameField = <div className={c.form__field}>
  <label className={c.form__label} htmlFor="username">Username</label>
  <input
    className={c.form__input}
    name="username"
    id="username"
    placeholder="Username"
    ref={register({
      required: 'required',
      minLength: 3,
    })}
  />
  {registrationErrors.username && <p className={c.form__errorMessage}>{registrationErrors.username}</p>}
  {errors.username && errors.username.type === 'required' && <p className={c.form__errorMessage}>Username is required</p>}
  {errors.username && errors.username.type === 'minLength' && <p className={c.form__errorMessage}>At least 3 chars</p>}
  </div>;

  const emailField = <div className={c.form__field}>
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
    {registrationErrors.email && <p className={c.form__errorMessage}>{registrationErrors.email}</p>}
    {errors.email && errors.email.type === 'required' && <p className={c.form__errorMessage}>Email field is required</p>}
  </div>;

  const passwordField = <div className={c.form__field}>
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
    {registrationErrors.password && <p className={c.form__errorMessage}>{registrationErrors.password}</p>}
    {errors.password && errors.password.type === 'required' && <p className={c.form__errorMessage}>Password is required</p>}
    {errors.password && errors.password.type === 'minLength' && <p className={c.form__errorMessage}>At least 8 chars</p>}
    {errors.password && errors.password.type === 'pattern' && <p className={c.form__errorMessage}>Unexpected symbols</p>}

    {errors.password && errors.password.type === 'maxLength' && <p className={c.form__errorMessage}>Max length is 40 chars</p>}
  </div>;

  const repeatPassField = <div className={c.form__field}>
    <label className={c.form__label} htmlFor="repeat_password">Repeat password</label>
    <input
      className={c.form__input}
      name="repeat_password"
      id="repeat_password"
      type="password"
      placeholder="Repeat password"
      ref={register({
        validate: (value) => {
          return value === watch('password');
        }
      })}
    />
    {errors.repeat_password && errors.repeat_password.type === 'validate' && <p className={c.form__errorMessage}>Not equal to password</p>}
  </div>;
  return (
    <>
      { registration && <Link to='/sign-in'>Sign In</Link>}
      {!registration &&
        <form className={c.form} onSubmit={handleSubmit(onSubmit)}>
          <h6 className={c.form__title}>Create new account</h6>
          {usernameField}
          {emailField}
          {passwordField}
          {repeatPassField}
          <button className={c.form__submit} type="submit" disabled={formSending}>
            Create
          </button>
          <p className={c.form__info}>
            Already have an account?  <Link to="/sign-in">Sign In.</Link>
          </p>
        </form>
      }
    </>


  );
}
const mapStateToProps = (state) => {

  const { registrationErrors, formSending, registration } = state.registrationReducer;

  return {
    registrationErrors,
    formSending,
    registration
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitFormHandler: (data) => dispatch(sendingRegistration(data)),
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
