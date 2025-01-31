import React, { useState } from 'react';
import axios from 'axios';

const IndustryAnalysis = () => {
    const [industry, setIndustry] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!industry) {
            setError("Please enter an industry");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`http://localhost:8000/api/industry-analysis/?industry=${industry}`);
            // Clean symbols like '**' and '##' from the summary
            const cleanSummary = response.data.summary.replace(/[*#]/g, "").trim();
            setSummary(cleanSummary);
        } catch (err) {
            setError("An error occurred while fetching the industry analysis");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: ".5vh", backgroundColor: "#f0f0f0" }}>
            {/* Main Content */}
            <div className="card shadow" style={{ width: "100%", maxWidth: "600px" }}>
                <div className="card-body">
                    <h1 className="card-title text-center mb-4">Industry Analysis</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="industry">Industry</label>
                            <input
                                id="industry"
                                type="text"
                                className="form-control"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                placeholder="Enter an industry name"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3 w-100">
                            {loading ? "Loading..." : "Get Analysis"}
                        </button>
                    </form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {summary && (
                        <div className="mt-4">
                            <h2 className="h6 font-weight-bold">Summary</h2>
                            <div className="bg-light p-2 rounded">
                                {summary.split("\n").map((line, index) => (
                                    <p key={index} style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IndustryAnalysis;
