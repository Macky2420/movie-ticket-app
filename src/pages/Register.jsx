import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { notification } from 'antd';
import classNames from 'classnames';
import Error from '../components/Error';
import Background from '../assets/background.jpg';
import register_logo from '../assets/register.png';
import MovieLogo from '../assets/logo.png';
import Loading from '../components/Loading';

const Register = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    privacy: false,
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const validateForm = () => {
    const { username, email, password, privacy } = formData;
    let formIsValid = true;
    const newErrors = { username: '', email: '', password: '', privacy: '' };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      formIsValid = false;
    } else if (!/\d/.test(username)) {
      newErrors.username = 'Username must contain at least one number';
      formIsValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
      formIsValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      formIsValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      formIsValid = false;
    }

    if (!privacy) {
      newErrors.privacy = 'You must agree to the Privacy Policy';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const SIGN_UP = gql`
    mutation RegisterUser($username: String!, $email: String!, $password: String!, $privacy: Boolean!) {
      insert_users(objects: { username: $username, email: $email, password: $password, privacy: $privacy }) {
        affected_rows
      }
    }
  `;

  const [registerUser, { loading, error }] = useMutation(SIGN_UP);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await registerUser({
          variables: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            privacy: formData.privacy,
          },
        });
        // Show Ant Design notification for success
        notification.success({
          message: 'Registration Successful',
          description: 'You have successfully registered. Please login to continue.',
        });

        // Redirect to login page after successful registration
        navigate('/login');

      } catch (error) {

        notification.error({
          message: 'Registration Error',
          description: ('Error registering user:', error.message),
        });
        
      }
    }
  };

  // Connection error
  if (error) {
    return (
      <Error/>
    );
  }

  const handleInputFocus = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
    if (fieldName === 'privacy') {
      setErrors((prevErrors) => ({ ...prevErrors, privacy: '' }));
    }
  };
  



  return (

    <>
      {/* Loading spinner */}
      {loading && (
        <div className="fixed -translate-x-2/4 -translate-y-2/4 z-[9999] left-2/4 top-2/4">
          <Loading />
        </div>
      )}

      {/* Register Form */}
      <div className={classNames('', { 'blur-sm pointer-events-none': loading })}>
        <section style={{backgroundImage: `url(${Background})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <div className='inline-flex'>
                <img className='object-contain h-15 w-15 ' src={MovieLogo} />
                <p className='font-bold text-blue-950 text-3xl pl-3 pt-4 duration-200 hover:underline decoration-sky-500 hover:font-semibold'>FilmFare</p>
              </div>  
            </div>
              <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className='inline-flex'>
                      <img className='w-10 h-10 mr-2' src={register_logo} />
                        <p className="mt-2 font-bold text-blue-950 md:text-xl dark:text-white">
                            Create an Account
                        </p>
                    </div>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} >
                      <div className="relative">
                          <input 
                          type="text" 
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('username')}
                          className={classNames(
                            "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
                            { 'border-red-500': errors.username }
                          )} 
                          placeholder=" " 
                            />
                          <label htmlFor="username" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Username</label>
                          <p className="text-red-500 text-xs mt-2">{errors.username}</p>  
                      </div>
                      
                      <div className="relative">
                          <input 
                          type="text"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('email')}
                          className={classNames(
                            "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
                            { 'border-red-500': errors.email }
                          )} 
                          placeholder=" "
                          />
                          <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email</label>
                          <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                      </div>
                      
                      <div className="relative">
                          <input 
                          type="text"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('password')}
                          className={classNames(
                            "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
                            { 'border-red-500': errors.password }
                          )} 
                          placeholder=" "
                          autoComplete="current-password"
                          />
                          <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>
                          <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                          <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input 
                                id="privacy"
                                name="privacy"
                                type="checkbox"  
                                checked={formData.privacy}
                                onChange={handleChange}
                                onFocus={() => handleInputFocus('privacy')}
                                className=
                                  "w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="privacy" className={classNames("text-gray-500 dark:text-gray-300", {'text-red-500' : errors.privacy})}>I agree to the Privacy Policy</label>
                              </div>
                            
                          </div>
                      </div>
                      
                      <button type="submit" className="w-full text-white bg-primary-700 hover:bg-primary-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign up</button>
                    </form>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Already have an account? <Link to='/login'><span className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</span></Link>
                    </p>
                    </div>
              </div>
          </div>
        </section> 
      </div>
      
    </>
    
  )
}

export default Register;