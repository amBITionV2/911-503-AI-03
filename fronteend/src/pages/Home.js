import "../css/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

  return (
    <div className="home-page">
      

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Learn a <span>New Skill</span> <br />
            Everyday, Anytime, <br />
            and Anywhere.
          </h1>
          <p className="hero-subtext">
            <strong>1000+ Courses</strong> covering all tech domains for you to
            learn and explore new opportunities. Learn from Industry Experts and
            land your Dream Job.
          </p>

          <div className="hero-btns">
            <button className="start-btn">Start Trial</button>
            <button className="outline-btn">How it Works</button>
          </div>

          <div className="hero-stats">
            <div>
              <h3>1000+</h3>
              <p>Courses to choose from</p>
            </div>
            <div>
              <h3>5000+</h3>
              <p>Students Trained</p>
            </div>
            <div>
              <h3>200+</h3>
              <p>Professional Trainers</p>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://pngimg.com/uploads/woman/woman_PNG105.png"
            alt="Person"
            className="person-img"
          />
          <img
            src="https://pngimg.com/uploads/rocket/rocket_PNG13258.png"
            alt="Rocket"
            className="rocket-img"
          />
          <img
            src="https://pngimg.com/uploads/trophy/trophy_PNG80.png"
            alt="Trophy"
            className="trophy-img"
          />
        </div>
      </section>

      <section>

        <div className="features-page">
      <section className="intro-section">
        <h1>
          Explore Fair<span>Hire</span> AI Tools
        </h1>
        <p>
          Unlock your potential with FairHire’s AI-powered solutions — analyze your resume,
          discover personalized learning paths, and empower recruiters to find their next great hire.
        </p>
      </section>

      <div className="features-grid">
        {/* ====== Resume Analyzer ====== */}
        <div className="feature-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            alt="Resume Analyzer"
            className="feature-icon"
          />
          <h2>Resume Analyzer</h2>
          <p>
            Upload your resume and job description to get instant insights on your ATS compatibility,
            keyword optimization, and formatting suggestions. Optimize your resume to stand out.
          </p>
          <button onClick={() => navigate("/resume")} className="feature-btn">
            Try Resume Analyzer
          </button>
        </div>

        {/* ====== Find Your Next Hire ====== */}
        <div className="feature-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135679.png"
            alt="Find Your Next Hire"
            className="feature-icon"
          />
          <h2>Find Your Next Hire</h2>
          <p>
            Empower recruiters with AI tools to discover top candidates fast.  
            Compare ATS scores, match candidate profiles with job descriptions,  
            and streamline the hiring process with intelligent recommendations.
          </p>
          <button onClick={() => navigate("/dashboard")} className="feature-btn">
            Find Candidates
          </button>
        </div>

        {/* ====== Course Recommendation ====== */}
        <div className="feature-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3176/3176369.png"
            alt="Course Recommender"
            className="feature-icon"
          />
          <h2>Course Recommendation</h2>
          <p>
            Get AI-powered course recommendations based on your resume’s skills  
            and career goals. Upskill faster and stay ahead in your professional journey.
          </p>
          <button onClick={() => navigate("/courses")} className="feature-btn">
            Explore Courses
          </button>
        </div>
      </div>
    </div>
      </section>
    </div>
  );
}

export default Home;
