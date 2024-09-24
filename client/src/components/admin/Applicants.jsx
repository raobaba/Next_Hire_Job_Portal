import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';

const Applicants = () => {
    const params = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                setApplicants(res.data.job.applicants); // Assuming the response structure
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllApplicants();
    }, [params.id]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto p-4'>
                <h1 className='font-bold text-xl my-5'>Applicants {loading ? '...' : applicants.length}</h1>
                <ApplicantsTable applicants={applicants} loading={loading} />
            </div>
        </div>
    );
}

export default Applicants;
