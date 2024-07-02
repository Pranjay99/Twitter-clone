import React, { useState } from 'react';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constants';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUser } from '../redux/userSlice';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(name, username, email, password);

        const toastId = toast.loading("Processing...");

        const loginOrSignup = isLogin
            ? axios.post(`${USER_API_END_POINT}/login`, { email, password }, {
                headers: { 'Content-Type': "application/json" },
                withCredentials: true
            })
            : axios.post(`${USER_API_END_POINT}/register`, { name, username, email, password }, {
                headers: { 'Content-Type': "application/json" },
                withCredentials: true
            });

        toast.promise(
            loginOrSignup,
            {
                loading: 'Processing...',
                success: (res) => {
                    if (isLogin) {
                        const { token } = res.data; // Assuming token is returned from backend
                        localStorage.setItem('authToken', token);
                        dispatch(getUser(res?.data?.user));
                        if (res.data.success) {
                            navigate("/");
                            return res.data.message;
                        }
                    } else {
                        if (res.data.success) {
                            setIsLogin(true);
                            return res.data.message;
                        }
                    }
                },
                error: 'An error occurred. Please try again.'
            }
        ).catch(console.log); // This is necessary to avoid unhandled promise rejection warnings
    };

    const loginHandler = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <div className='flex md:flex-row flex-col items-center justify-around md:w-full'>
                <div>
                    <img className="ml-4 w-24 md:w-48" src="https://img.freepik.com/free-vector/twitter-new-2023-x-logo-white-background-vector_1017-45422.jpg?size=338&ext=jpg&ga=GA1.1.1141335507.1718755200&semt=ais_user" alt="" />
                </div>
                <div>
                    <div>
                        <h1 className='font-bold md:text-7xl text-2xl mb-5'>Happening Now</h1>
                    </div>
                    <h1 className='font-bold text-3xl my-4'>{isLogin ? "Login" : "Sign up"}</h1>
                    <form onSubmit={submitHandler} action="" className='flex flex-col w-[85%] md:w-[60%]'>
                        {!isLogin && (
                            <>
                                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' className='outline-blue-500 border border-gray-500 px-4 py-2 rounded-full my-1' />
                                <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' className='outline-blue-500 border border-gray-500 px-4 py-2 rounded-full my-1' />
                            </>
                        )}
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='outline-blue-500 border border-gray-500 px-4 py-2 rounded-full my-1' />
                        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='outline-blue-500 border border-gray-500 px-4 py-2 rounded-full my-1' />
                        <button className='bg-blue-400 py-2 rounded-full border-none text-white font-bold cursor-pointer my-3'>{isLogin ? "Login" : "Create Account"}</button>
                        <h1>{isLogin ? "Don't have an account? " : "Already have an account? "} <span onClick={loginHandler} className='text-blue-400 cursor-pointer'>{isLogin ? "Sign up" : "Login"}</span></h1>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
