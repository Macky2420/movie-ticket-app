  import React, {useState} from 'react';
  import { useLazyQuery, gql } from '@apollo/client';
  import { Link, useNavigate } from 'react-router-dom';
  import { notification } from 'antd';
  import classNames from 'classnames';
  import Loading from '../components/Loading';
  import Error from '../components/Error';
  import Background from '../assets/background.jpg';
  import MovieLogo from '../assets/logo.png'
  import login_logo from '../assets/login.png';

  const Login = () => {

    // State to store form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // State to store error message
  const [errorMessage, setErrorMessage] = useState('');
  

  // History object to handle redirects after successful login
  const navigate = useNavigate();

  // GraphQL query to verify login credentials
  const LOGIN_QUERY = gql`
    query LoginUser($username: String!, $password: String!) {
      users(where: { username: { _eq: $username }, password: { _eq: $password } }) {
        id
      }
    }
  `;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate if email and password are not empty
    if (formData.username.trim() === '' || formData.password.trim() === '') {
      setErrorMessage('Please enter both username and password.');
      return;
    }
  
    try {
      const { data } = await loginQuery({
        variables: formData,
      });
  
      if (data.users.length === 1) {
        // Login successful, redirect to movielist page with user ID in the URL
        const userId = data.users[0].id;
        notification.success({
          message: 'Login Successfully',
          description: 'You can now view movies and add tickets.',
        });
        // Navigate to the dashboard
        navigate(`/movielist/${userId}`);
      } else {

        notification.error({
          message: 'Login Error',
          description: `Please check your credentials`,
        });  
        // Display error message when credentials don't match
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      // Handle errors here (e.g., show an error message)
      notification.error({
        message: 'Login Error',
        description: `Something went wrong while logging you in`,
      });
    }
  };

  // Apollo Client query hook
  const [loginQuery, { loading, error }] = useLazyQuery(LOGIN_QUERY); // Changed useLazyQuery to useQuery

  // Function to handle form input changes for email and password
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    // Clear error message when user starts typing
    setErrorMessage('');
  };  

  // Connection error
  if (error) {
    return (
      <Error/>
    );
  }

    return (
      <>
        {/* Loading spinner */}
        {loading && (
          <div className="fixed -translate-x-2/4 -translate-y-2/4 z-[9999] left-2/4 top-2/4">
            <Loading />
          </div>
        )}

        {/* Login form */}
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
                        <img className='w-10 h-10 mr-2' src={login_logo} />
                          <p className="mt-2 font-bold text-blue-950 md:text-xl dark:text-white">
                              Sign in your Account
                          </p>  
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" >
                        <div className="relative">
                            <input 
                            type="text" 
                            name='username'
                            id='username'
                            onChange={handleChange}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                            placeholder=" " />
                            <label htmlFor="username" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Username</label>
                        </div>
                        <div className="relative">
                            <input 
                            type="password" 
                            name='password'
                            id='password'
                            onChange={handleChange}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                            <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>
                        </div>
                        { errorMessage && (
                          <p className='text-red-500 text-xs'>{errorMessage}</p>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                        </div>
                        <button type="submit" className="w-full text-white bg-primary-700 hover:bg-primary-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                      </form>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                          Don’t have an account yet? <Link to='/register'><span className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</span></Link>
                      </p>
                    </div>
                </div>
            </div>
          </section> 
        </div>
        
      </>
    )
  }

  export default Login;