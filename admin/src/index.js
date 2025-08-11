import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createStore} from 'redux';
import {Provider} from 'react-redux';


let initialStore={employeesLoginData:{}}

let loginReducer=(latestStore=initialStore,dispatchObj)=>{
  console.log('inside login reducer')
  if(dispatchObj.type=='employeesLogData')
    return {...latestStore,employeesLoginData:dispatchObj.data};

  return latestStore;
}

let store = createStore(loginReducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
