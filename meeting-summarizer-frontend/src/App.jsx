import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  Mic,
  Home,
  Files,
  UploadCloud,
  Settings,
  Plus,
  Eye,
  Trash2,
  CheckCircle2,
  Clock3,
  CalendarDays,
  FileText,
  X,
  LoaderCircle,
  ArrowLeft,
  ChevronDown,
  Check,
  ListChecks,
  AlignLeft
} from "lucide-react";

const API = "http://localhost:8080/api/meetings";

function App() {

  const [page, setPage] = useState("dashboard");
  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState("");

  const loadMeetings = async () => {
    try {
      setError("");

      const res = await axios.get(API);

      setMeetings(res.data);

    } catch (e) {

      console.error(e);

      setError(
        "Could not connect to the Spring Boot backend."
      );
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  /*
   * Open a particular meeting.
   *
   * Example:
   * GET http://localhost:8080/api/meetings/4
   */
  const openMeeting = async (id) => {

    try {

      setError("");

      const res = await axios.get(`${API}/${id}`);

      setSelected(res.data);

      setPage("details");

    } catch (e) {

      console.error(e);

      setError(
        "Could not load this meeting."
      );
    }
  };

  const deleteMeeting = async (id) => {

    if (!window.confirm("Delete this meeting?")) {
      return;
    }

    try {

      await axios.delete(`${API}/${id}`);

      if (selected?.id === id) {

        setSelected(null);

        setPage("dashboard");
      }

      await loadMeetings();

    } catch (e) {

      console.error(e);

      setError(
        "Could not delete the meeting."
      );
    }
  };

  const processed = meetings.length;

  const thisWeek = meetings.length;

  return (
    <div className="app-shell">

      {/* ================= TOP BAR ================= */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-icon">
            <Mic size={24} />
          </div>

          <span>
            Meeting Summarizer
          </span>

        </div>

        <div className="top-actions">

          <button
            className="upload-top"
            onClick={() => setShowUpload(true)}
          >
            <Plus size={18} />
            Upload Meeting
          </button>

          <div className="profile">

            <div className="avatar">
              C
            </div>

            <span>
              Chandrama
            </span>

            <ChevronDown size={16} />

          </div>

        </div>

      </header>


      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <nav>

          <NavItem
            icon={<Home size={20} />}
            label="Dashboard"
            active={page === "dashboard"}
            onClick={() => {
              setSelected(null);
              setPage("dashboard");
            }}
          />

          <NavItem
            icon={<Files size={20} />}
            label="All Meetings"
            active={page === "meetings"}
            onClick={() => {
              setSelected(null);
              setPage("meetings");
            }}
          />

          <NavItem
            icon={<UploadCloud size={20} />}
            label="Upload Meeting"
            active={false}
            onClick={() => setShowUpload(true)}
          />

          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={page === "settings"}
            onClick={() => {
              setSelected(null);
              setPage("settings");
            }}
          />

        </nav>

        <div className="sidebar-footer">

          © 2026 Meeting Summarizer
          <br />

          All rights reserved.

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="content">

        {error && (

          <div className="error-banner">

            <span>
              {error}
            </span>

            <button
              onClick={() => setError("")}
            >
              <X size={17} />
            </button>

          </div>

        )}


        {/* ================= DASHBOARD ================= */}

        {page === "dashboard" && (

          <Dashboard

            meetings={meetings}

            processed={processed}

            thisWeek={thisWeek}

            onUpload={() =>
              setShowUpload(true)
            }

            onView={openMeeting}

            onDelete={deleteMeeting}

            onViewAll={() =>
              setPage("meetings")
            }

          />

        )}


        {/* ================= ALL MEETINGS ================= */}

        {page === "meetings" && (

          <MeetingsPage

            meetings={meetings}

            onBack={() =>
              setPage("dashboard")
            }

            onView={openMeeting}

            onDelete={deleteMeeting}

            onUpload={() =>
              setShowUpload(true)
            }

          />

        )}


        {/* ================= MEETING DETAILS ================= */}

        {page === "details" && selected && (

          <MeetingDetails

            meeting={selected}

            onBack={() => {

              setSelected(null);

              setPage("dashboard");

            }}

          />

        )}


        {/* ================= SETTINGS ================= */}

        {page === "settings" && (

          <SettingsPage />

        )}

      </main>


      {/* ================= UPLOAD MODAL ================= */}

      {showUpload && (

        <UploadModal

          onClose={() =>
            setShowUpload(false)
          }

          onSuccess={async (meeting) => {

            setShowUpload(false);

            await loadMeetings();

            setSelected(meeting);

            setPage("details");

          }}

        />

      )}

    </div>
  );
}


/* =========================================================
   NAV ITEM
========================================================= */

function NavItem({
  icon,
  label,
  active,
  onClick
}) {

  return (

    <button
      className={`nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >

      {icon}

      <span>
        {label}
      </span>

    </button>

  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  meetings,
  processed,
  thisWeek,
  onUpload,
  onView,
  onDelete,
  onViewAll
}) {

  return (

    <div>

      <div className="page-heading">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Welcome back! Here's your meeting overview.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={onUpload}
        >

          <Plus size={18} />

          Upload Meeting

        </button>

      </div>


      {/* STATS */}

      <div className="stats-grid">

        <Stat
          icon={<FileText />}
          value={meetings.length}
          label="Total Meetings"
          type="purple"
        />

        <Stat
          icon={<CheckCircle2 />}
          value={processed}
          label="Processed"
          type="green"
        />

        <Stat
          icon={<Clock3 />}
          value={0}
          label="Processing"
          type="orange"
        />

        <Stat
          icon={<CalendarDays />}
          value={thisWeek}
          label="This Week"
          type="blue"
        />

      </div>


      {/* RECENT MEETINGS */}

      <section className="panel">

        <div className="panel-header">

          <h2>
            Recent Meetings
          </h2>

          <button
            className="outline-btn"
            onClick={onViewAll}
          >
            View All
          </button>

        </div>

        <MeetingTable

          meetings={meetings
            .slice()
            .reverse()
            .slice(0, 6)}

          onView={onView}

          onDelete={onDelete}

        />

      </section>


      <FeatureCards />

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function Stat({
  icon,
  value,
  label,
  type
}) {

  return (

    <div className="stat-card">

      <div
        className={`stat-icon ${type}`}
      >
        {icon}
      </div>

      <div>

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   MEETING TABLE
========================================================= */

function MeetingTable({
  meetings,
  onView,
  onDelete
}) {

  if (!meetings.length) {

    return (

      <div className="empty-state">

        <Files size={34} />

        <h3>
          No meetings yet
        </h3>

        <p>
          Upload your first meeting to see it here.
        </p>

      </div>
    );
  }


  return (

    <div className="table-wrap">

      <table>

        <thead>

          <tr>

            <th>
              Title
            </th>

            <th>
              Date
            </th>

            <th>
              Duration
            </th>

            <th>
              Status
            </th>

            <th>
              Actions
            </th>

          </tr>

        </thead>


        <tbody>

          {meetings.map((m) => (

            <tr key={m.id}>

              <td className="title-cell">
                {m.title}
              </td>

              <td>
                {formatDate(m.createdAt)}
              </td>

              <td>
                —
              </td>

              <td>

                <span className="status">
                  Completed
                </span>

              </td>

              <td>

                <div className="row-actions">

                  {/* VIEW */}

                  <button

                    className="icon-btn view"

                    title="View meeting"

                    onClick={() =>
                      onView(m.id)
                    }

                  >

                    <Eye size={18} />

                  </button>


                  {/* DELETE */}

                  <button

                    className="icon-btn delete"

                    title="Delete meeting"

                    onClick={() =>
                      onDelete(m.id)
                    }

                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


/* =========================================================
   FEATURE CARDS
========================================================= */

function FeatureCards() {

  return (

    <div className="feature-grid">

      <Feature

        icon={<Mic />}

        title="Upload Audio"

        text="Upload your meeting audio in MP3, WAV, AAC, OGG or FLAC formats."

        type="purple"

      />

      <Feature

        icon={<FileText />}

        title="AI Processing"

        text="Our AI transcribes the audio and generates intelligent meeting summaries."

        type="green"

      />

      <Feature

        icon={<CalendarDays />}

        title="Get Insights"

        text="View summaries, key decisions and action items instantly."

        type="blue"

      />

    </div>
  );
}


function Feature({
  icon,
  title,
  text,
  type
}) {

  return (

    <div className="feature-card">

      <div
        className={`feature-icon ${type}`}
      >
        {icon}
      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   ALL MEETINGS PAGE
========================================================= */

function MeetingsPage({
  meetings,
  onBack,
  onView,
  onDelete,
  onUpload
}) {

  return (

    <div>

      <div className="page-heading">

        <div>

          <button
            className="back-btn"
            onClick={onBack}
          >

            <ArrowLeft size={17} />

            Dashboard

          </button>

          <h1>
            All Meetings
          </h1>

          <p>
            Browse and manage your processed meetings.
          </p>

        </div>


        <button
          className="primary-btn"
          onClick={onUpload}
        >

          <Plus size={18} />

          Upload Meeting

        </button>

      </div>


      <section className="panel">

        <MeetingTable

          meetings={meetings
            .slice()
            .reverse()}

          onView={onView}

          onDelete={onDelete}

        />

      </section>

    </div>
  );
}


/* =========================================================
   MEETING DETAILS
========================================================= */

function MeetingDetails({
  meeting,
  onBack
}) {

  const [showTranscript, setShowTranscript] =
    useState(true);


  return (

    <div>

      {/* BACK */}

      <button
        className="back-btn"
        onClick={onBack}
      >

        <ArrowLeft size={17} />

        Back to Dashboard

      </button>


      {/* HEADER */}

      <div className="details-heading">

        <div>

          <div className="details-title-row">

            <div className="details-main-icon">
              <FileText size={25} />
            </div>

            <div>

              <h1>
                {meeting.title}
              </h1>

              <p>
                {meeting.audioFileName}
                {" · "}
                {formatDate(
                  meeting.createdAt
                )}
              </p>

            </div>

          </div>

        </div>


        <span className="status large">

          <CheckCircle2 size={16} />

          Completed

        </span>

      </div>


      {/* ================= SUMMARY ================= */}

      <section className="detail-card summary-detail">

        <div className="detail-section-heading">

          <div className="detail-heading-icon summary-heading-icon">

            <FileText size={21} />

          </div>

          <div>

            <h2>
              Summary
            </h2>

            <p>
              AI-generated overview of the meeting
            </p>

          </div>

        </div>


        <p className="summary-large">

          {meeting.summary ||
            "No summary available."}

        </p>

      </section>


      {/* ================= TWO COLUMNS ================= */}

      <div className="detail-two-column">


        {/* KEY DECISIONS */}

        <section className="detail-card">

          <div className="detail-section-heading">

            <div className="detail-heading-icon decision-heading-icon">

              <Check size={21} />

            </div>

            <div>

              <h2>
                Key Decisions
              </h2>

              <p>
                Important decisions made
              </p>

            </div>

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

                    <span className="decision-check">

                      <Check size={15} />

                    </span>

                    <span>
                      {decision}
                    </span>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="empty-detail">

              No key decisions identified.

            </div>

          )}

        </section>


        {/* ACTION ITEMS */}

        <section className="detail-card">

          <div className="detail-section-heading">

            <div className="detail-heading-icon action-heading-icon">

              <ListChecks size={21} />

            </div>

            <div>

              <h2>
                Action Items
              </h2>

              <p>
                Tasks identified from the meeting
              </p>

            </div>

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

                      <strong>
                        {item.task ||
                          "Task"}
                      </strong>


                      <div className="action-meta">

                        <span>

                          <b>
                            Owner
                          </b>

                          <br />

                          {item.owner ||
                            "Unknown"}

                        </span>


                        <span>

                          <b>
                            Deadline
                          </b>

                          <br />

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

            <div className="empty-detail">

              No action items identified.

            </div>

          )}

        </section>

      </div>


      {/* ================= TRANSCRIPT ================= */}

      <section className="detail-card transcript-card">

        <div className="transcript-heading">

          <div className="detail-section-heading">

            <div className="detail-heading-icon transcript-heading-icon">

              <AlignLeft size={21} />

            </div>

            <div>

              <h2>
                Transcript
              </h2>

              <p>
                Full AI-generated transcription
              </p>

            </div>

          </div>


          <button

            className="transcript-toggle"

            onClick={() =>
              setShowTranscript(
                !showTranscript
              )
            }

          >

            {showTranscript
              ? "Hide Transcript"
              : "Show Transcript"}

          </button>

        </div>


        {showTranscript && (

          <div className="transcript">

            {meeting.transcript ||
              "No transcript available."}

          </div>

        )}

      </section>

    </div>
  );
}


/* =========================================================
   UPLOAD MODAL
========================================================= */

function UploadModal({
  onClose,
  onSuccess
}) {

  const [title, setTitle] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [dragging, setDragging] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const inputRef =
    useRef(null);


  const choose = (f) => {

    if (!f) return;


    const allowed = [

      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/aac",
      "audio/ogg",
      "audio/flac"

    ];


    if (
      !allowed.includes(f.type) &&
      !/\.(mp3|wav|aac|ogg|flac)$/i.test(
        f.name
      )
    ) {

      setError(
        "Please choose a supported audio file."
      );

      return;
    }


    setError("");

    setFile(f);


    if (!title) {

      setTitle(

        f.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")

      );

    }

  };


  const submit = async (e) => {

    e.preventDefault();


    if (!title.trim() || !file) {

      setError(
        "Enter a title and select an audio file."
      );

      return;
    }


    const form =
      new FormData();


    form.append(
      "title",
      title
    );

    form.append(
      "file",
      file
    );


    try {

      setSubmitting(true);

      setError("");


      const res =
        await axios.post(
          `${API}/process`,
          form
        );


      onSuccess(res.data);


    } catch (e) {

      console.error(e);

      setError(

        e.response?.data?.message ||

        "Processing failed. Check that Spring Boot and FastAPI are running."

      );

    } finally {

      setSubmitting(false);

    }

  };


  return (

    <div

      className="modal-backdrop"

      onMouseDown={(e) => {

        if (
          e.target === e.currentTarget
        ) {

          onClose();

        }

      }}

    >

      <div className="modal">


        <div className="modal-header">

          <div>

            <h2>
              Upload Meeting
            </h2>

            <p>
              Upload audio and let AI process the meeting.
            </p>

          </div>


          <button

            className="close-btn"

            onClick={onClose}

          >

            <X />

          </button>

        </div>


        <form onSubmit={submit}>


          <label>
            Meeting Title
          </label>


          <input

            value={title}

            onChange={(e) =>
              setTitle(e.target.value)
            }

            placeholder="e.g. Weekly Team Meeting"

          />


          <label>
            Meeting Audio
          </label>


          <div

            className={`drop-zone ${
              dragging
                ? "dragging"
                : ""
            }`}

            onClick={() =>
              inputRef.current?.click()
            }

            onDragOver={(e) => {

              e.preventDefault();

              setDragging(true);

            }}

            onDragLeave={() =>
              setDragging(false)
            }

            onDrop={(e) => {

              e.preventDefault();

              setDragging(false);

              choose(
                e.dataTransfer.files?.[0]
              );

            }}

          >

            <UploadCloud size={38} />


            {file ? (

              <>

                <strong>
                  {file.name}
                </strong>

                <span>

                  {(
                    file.size /
                    (1024 * 1024)
                  ).toFixed(1)} MB

                </span>

              </>

            ) : (

              <>

                <strong>
                  Drop your audio here
                </strong>

                <span>
                  or click to browse · MP3, WAV, AAC, OGG, FLAC
                </span>

              </>

            )}


            <input

              ref={inputRef}

              type="file"

              accept="audio/*"

              hidden

              onChange={(e) =>
                choose(
                  e.target.files?.[0]
                )
              }

            />

          </div>


          {error && (

            <div className="form-error">
              {error}
            </div>

          )}


          <div className="modal-actions">

            <button

              type="button"

              className="cancel-btn"

              onClick={onClose}

            >

              Cancel

            </button>


            <button

              className="primary-btn"

              disabled={submitting}

            >

              {submitting ? (

                <>

                  <LoaderCircle
                    className="spin"
                    size={18}
                  />

                  Processing...

                </>

              ) : (

                <>

                  <UploadCloud
                    size={18}
                  />

                  Process Meeting

                </>

              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {

  return (

    <div>

      <div className="page-heading">

        <div>

          <h1>
            Settings
          </h1>

          <p>
            Basic application settings.
          </p>

        </div>

      </div>


      <section className="panel settings-panel">


        <div className="setting-row">

          <div>

            <strong>
              AI Service
            </strong>

            <p>
              Gemini-powered transcription and summarization.
            </p>

          </div>

          <span className="status">
            Connected
          </span>

        </div>


        <div className="setting-row">

          <div>

            <strong>
              Backend API
            </strong>

            <p>
              Spring Boot meeting management API.
            </p>

          </div>

          <span className="status">
            Connected
          </span>

        </div>


      </section>

    </div>
  );
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(value) {

  if (!value) return "—";


  return new Date(value)
    .toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
}


export default App;