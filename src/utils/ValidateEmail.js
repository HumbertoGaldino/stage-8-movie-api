function ValidateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

module.exports = ValidateEmail
