import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [input, setInput] = useState({ email: "", password: "", role: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <Navbar />
            <div className="bg-white rounded-lg shadow-lg mt-[100px] p-8 w-1/3">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="patel@gmail.com"
                            className="mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Your password"
                            className="mt-1"
                        />
                    </div>
                    <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                            <Input
                                type="radio"
                                name="role"
                                value="student"
                                onChange={changeEventHandler}
                                className="mr-2"
                            />
                            <Label>Student</Label>
                        </div>
                        <div className="flex items-center">
                            <Input
                                type="radio"
                                name="role"
                                value="recruiter"
                                onChange={changeEventHandler}
                                className="mr-2"
                            />
                            <Label>Recruiter</Label>
                        </div>
                    </div>
                    {loading ? (
                        <Button className="w-full">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full">Login</Button>
                    )}
                    <div className="text-center mt-4">
                        <span>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
