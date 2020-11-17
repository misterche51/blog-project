import React from 'react';
import { Link } from 'react-router-dom';
import c from './Message.module.scss';

const MessageTitle = ({type}) => {
  if (type === 'error') {
   return <p className={c.message__title}>Error!</p>
  }

  if (type === 'success') {
    return <p className={c.message__title}>Success!</p>
  }

  if (type === 'warning') {
    return <p className={c.message__title}>Warning!</p>
   }
}

const Message = ({type, text, address, label}) => {
  const mainClass = type === 'error' ? c.messageError : c.messageSuccess;
  return <div className={mainClass}>
      <MessageTitle type={type} />
      <p className={c.message__content}>{text}</p>
      <p className={c.messsage__redirect}>
        Please, go to  <Link to={address}>{label}</Link>
      </p>
    </div>
}

export default Message;
