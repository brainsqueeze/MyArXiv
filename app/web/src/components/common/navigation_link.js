import React from 'react';
import { Link } from 'react-router-dom';
import history from '../../middleware/history';

const NavigationLink = (props) => {
  let className = "";
  if(props.className)
    className = props.className;

  if(history.location.pathname.indexOf(props.to)>=0)
    className += " active"

  return (
    <li>
      {
        props.external ? 
        <a className={className} href={props.to} target="_blank">{props.text}</a>
        : <Link className={className} to={props.to}>{props.text}</Link>
      }
    </li>
  );
}

export default NavigationLink;