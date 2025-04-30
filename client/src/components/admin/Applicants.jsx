import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import { useParams } from "react-router-dom";
import ReactHelmet from "../shared/ReactHelmet";
import { getApplicants } from "@/redux/slices/application.slice";
import { useDispatch } from "react-redux";
import Loader from "../shared/Loader";

const Applicants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await dispatch(getApplicants(id));
        if (res?.payload?.status === 200) {
          setApplicants(res?.payload?.applicants ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [dispatch, id]);

  return (
    <div>
      <Navbar />
      <ReactHelmet
        title="Applicants - Next_Hire"
        description="Manage and review job applicants for your open positions. Access resumes, cover letters, and application statuses to streamline your hiring process."
        canonicalUrl="http://mysite.com/applicants"
      />

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="font-bold text-xl my-5">
          Applicants {loading ? "..." : applicants?.length}
        </h1>
        {loading ? <Loader /> : <ApplicantsTable applicants={applicants} />}
      </div>
    </div>
  );
};

export default Applicants;
