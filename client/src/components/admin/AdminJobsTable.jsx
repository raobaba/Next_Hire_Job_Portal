import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sampleJobs = [
    { id: 1, title: 'Software Engineer', company: { name: 'Company A' }, createdAt: '2024-09-01T12:00:00Z' },
    { id: 2, title: 'Product Manager', company: { name: 'Company B' }, createdAt: '2024-09-02T12:00:00Z' },
    { id: 3, title: 'Data Scientist', company: { name: 'Company C' }, createdAt: '2024-09-03T12:00:00Z' },
    // Add more sample jobs as needed
];

const AdminJobsTable = ({ searchJobByText }) => { 
    const [filterJobs, setFilterJobs] = useState(sampleJobs);
    const navigate = useNavigate();

    useEffect(() => { 
        const filteredJobs = sampleJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            }
            return job.title.toLowerCase().includes(searchJobByText.toLowerCase()) || 
                   job.company.name.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    }, [searchJobByText]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recently posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs.map((job) => (
                        <TableRow key={job.id}>
                            <TableCell>{job.company.name}</TableCell>
                            <TableCell>{job.title}</TableCell>
                            <TableCell>{job.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div onClick={() => navigate(`/admin/companies/${job.id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                            <Edit2 className='w-4' />
                                            <span>Edit</span>
                                        </div>
                                        <div onClick={() => navigate(`/admin/jobs/${job.id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                            <Eye className='w-4' />
                                            <span>Applicants</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default AdminJobsTable;
