export interface SignupForm {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  acceptedTerms: boolean;
}



export interface SignupErrors {
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  acceptedTerms?: string;
  general?: string;
}