import type { SignupForm, SignupErrors } from "../types.ts";


export function validateSignup(
  form: SignupForm
): SignupErrors {

  const errors: SignupErrors = {};



  // First name

  if (!form.firstname.trim()) {

    errors.firstname =
      "First name is required";

  } 
  else if (form.firstname.length < 2) {

    errors.firstname =
      "First name must contain at least 2 characters";

  }




  // Last name

  if (!form.lastname.trim()) {

    errors.lastname =
      "Last name is required";

  } 
  else if (form.lastname.length < 2) {

    errors.lastname =
      "Last name must contain at least 2 characters";

  }




  // Username

  if (!form.username.trim()) {

    errors.username =
      "Username is required";

  } 
  else if (form.username.length < 3) {

    errors.username =
      "Username must be at least 3 characters";

  }
  else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {

    errors.username =
      "Username can contain only letters, numbers and _";

  }




  // Password

  const password = form.password;


  if (!password) {

    errors.password =
      "Password is required";

  }

  else if (password.length < 8) {

    errors.password =
      "Password must be at least 8 characters";

  }

  else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {

    errors.password =
      "Password must contain both a letter and a number";

  }




  // Terms

  if (!form.acceptedTerms) {

    errors.acceptedTerms =
      "You must accept terms and privacy policy";

  }




  return errors;

}
