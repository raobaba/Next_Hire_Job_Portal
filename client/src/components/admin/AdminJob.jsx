import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button'; 
import { useNavigate } from 'react-router-dom'; 
import AdminJobsTable from './AdminJobsTable';

const sampleJobs = [
    { id: 1, title: 'Software Engineer', company: 'Company A', location: 'Remote' },
    { id: 2, title: 'Product Manager', company: 'Company B', location: 'On-site' },
    { id: 3, title: 'Data Scientist', company: 'Company C', location: 'Hybrid' },
    // Add more sample jobs as needed
];

const AdminJobs = () => {
    const [input, setInput] = useState("");
    const [filteredJobs, setFilteredJobs] = useState(sampleJobs);
    const navigate = useNavigate();

    useEffect(() => {
        if (input) {
            setFilteredJobs(sampleJobs.filter(job =>
                job.title.toLowerCase().includes(input.toLowerCase()) || 
                job.company.toLowerCase().includes(input.toLowerCase())
            ));
        } else {
            setFilteredJobs(sampleJobs);
        }
    }, [input]);

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 mt-20'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name, role"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button onClick={() => navigate("/admin/jobs/create")}>New Job</Button>
                </div>
                <AdminJobsTable jobs={filteredJobs} />
            </div>
        </div>
    );
}

export default AdminJobs;
