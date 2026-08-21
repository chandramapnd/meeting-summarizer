import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

function MeetingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/meetings/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Meeting not found");
                }
                return response.json();
            })
            .then((data) => {
                setMeeting(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Could not load meeting details.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="details-page">
                <div className="loading">
                    Loading meeting details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="details-page">
                <div className="error-box">
                    {error}
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    const formattedDate = meeting.createdAt
        ? new Date(meeting.createdAt).toLocaleString()
        : "Unknown date";

    return (
        <div className="details-page">

            {/* Header */}
            <div className="details-header">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <div className="meeting-heading">
                    <h1>{meeting.title}</h1>

                    <p>
                        {formattedDate}
                        {" • "}
                        {meeting.audioFileName}
                    </p>
                </div>

            </div>

            {/* Summary */}
            <section className="details-card">

                <div className="card-title">
                    <span className="title-icon summary-icon">
                        ✦
                    </span>

                    <h2>Summary</h2>
                </div>

                <p className="summary-text">
                    {meeting.summary || "No summary available."}
                </p>

            </section>

            {/* Key Decisions */}
            <section className="details-card">

                <div className="card-title">
                    <span className="title-icon decision-icon">
                        ✓
                    </span>

                    <h2>Key Decisions</h2>
                </div>

                {meeting.keyDecisions &&
                meeting.keyDecisions.length > 0 ? (
                    <div className="decision-list">

                        {meeting.keyDecisions.map(
                            (decision, index) => (
                                <div
                                    className="decision-item"
                                    key={index}
                                >
                                    <span className="check">
                                        ✓
                                    </span>

                                    <span>
                                        {decision}
                                    </span>
                                </div>
                            )
                        )}

                    </div>
                ) : (
                    <p className="empty-text">
                        No key decisions were identified.
                    </p>
                )}

            </section>

            {/* Action Items */}
            <section className="details-card">

                <div className="card-title">
                    <span className="title-icon action-icon">
                        ✓
                    </span>

                    <h2>Action Items</h2>
                </div>

                {meeting.actionItems &&
                meeting.actionItems.length > 0 ? (

                    <div className="action-list">

                        {meeting.actionItems.map(
                            (item, index) => (

                                <div
                                    className="action-item"
                                    key={index}
                                >

                                    <div className="action-check">
                                        ☐
                                    </div>

                                    <div className="action-content">

                                        <h3>
                                            {item.task ||
                                                "Task"}
                                        </h3>

                                        <div className="action-meta">

                                            <span>
                                                <strong>
                                                    Owner:
                                                </strong>{" "}
                                                {item.owner ||
                                                    "Unknown"}
                                            </span>

                                            <span>
                                                <strong>
                                                    Deadline:
                                                </strong>{" "}
                                                {item.deadline ||
                                                    "Unknown"}
                                            </span>

                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                ) : (

                    <p className="empty-text">
                        No action items were identified.
                    </p>

                )}

            </section>

            {/* Transcript */}
            <section className="details-card">

                <div className="card-title">
                    <span className="title-icon transcript-icon">
                        ≡
                    </span>

                    <h2>Transcript</h2>
                </div>

                <div className="transcript-box">
                    {meeting.transcript ||
                        "No transcript available."}
                </div>

            </section>

        </div>
    );
}

export default MeetingDetails;