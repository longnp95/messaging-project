// const express = require('express');
// const FormData = require('form-data');
const apiPort = "http://localhost:8080/admin";

exports.apiUrlAdmins = {
  allAdmin: apiPort
};

exports.apiUrlUsers = {
  allUser: apiPort + '/user',
  anUser: apiPort + '/user/show',
  activate: apiPort + '/user/activate',
  deactivate: apiPort + '/user/deactivate',
};

// get
exports.getAll = function (url, token) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("token", token);

  const response = fetch(url, {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  });

  return response;
};

exports.get = function (url, token, params) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("token", token);

  const response = fetch(url + "?" + new URLSearchParams(params), {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  });

  return response;
};

// post
exports.post = function (url, token, body) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("token", token);

  const response = fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
    redirect: 'follow'
  });

  return response;
};

exports.postOne = function (url, token, body, params) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("token", token);

  const response = fetch(url + "?" + new URLSearchParams(params), {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
    redirect: 'follow'
  });

  return response;
};

exports.postSingleFile = function (url, token, feildName, fileField) {
  var headers = new Headers();
  headers.append("token", token);

  const formData = new FormData();
  formData.append(feildName, fileField.files[0]);

  const response = fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
    redirect: 'follow'
  });

  return response;
};