const apiPortAuth = "http://localhost:8080/auth/admin";

exports.apiSign = {
  signIn: apiPortAuth + "/signin"
}

exports.postSign = function (url, body) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");

  const response = fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
    redirect: 'follow'
  });
  
  return response;
}