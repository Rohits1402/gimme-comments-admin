import React from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../Contexts/StoreContext';

import Header from '../Layout/Header';
import Menu from '../Layout//Menu';
import Footer from '../Layout//Footer';

import SignIn from '../Pages/SignIn/SignIn';
import Dashboard from '../Pages/Dashboard/Dashboard';
import AppBanner from '../Pages/App/Banner';
import AppEvent from '../Pages/App/Event';
import AppFeedback from '../Pages/App/Feedback';
import AppWelcomeScreen from '../Pages/App/WelcomeScreen';
import Profile from '../Pages/Profile/Profile';
import Customers from '../Pages/Customers/Customers';
import CustomerProfile from '../Pages/Customers/CustomerProfile';
import CourseCategory from '../Pages/CourseCategory/CourseCategory';
import Course from '../Pages/Course/Course';
import CourseSeries from '../Pages/Course/CourseSeries';
import CourseSeriesPlan from '../Pages/Course/CourseSeriesPlan';
import Quiz from '../Pages/Quiz/Quiz';
import QuizSection from '../Pages/Quiz/QuizSection';
import QuizSectionQuestion from '../Pages/Quiz/QuizSectionQuestion';

export default function Routing() {
  const { isLoading, setIsLoading } = useStore();

  return (
    <div
      className="wrapper"
      style={{ overflowX: 'hidden', position: 'relative' }}
    >
      <div
        style={{
          display: isLoading ? 'grid' : 'none',
          position: 'fixed',
          zIndex: 1060,
          height: '100vh',
          width: '100vw',
          placeItems: 'center',
          background: 'rgba(0,0,0,0.4)',
        }}
      >
        <div className="spinner-border" role="status">
          <div className="visually-hidden">Loading...</div>
        </div>
      </div>
      <div
        style={{
          display: isLoading ? 'flex' : 'none',
          position: 'fixed',
          zIndex: 1000,
          height: '100vh',
          width: '100vw',
          justifyContent: 'center',
          alignItems: 'end',
          padding: '20px',
        }}
      >
        <button className="btn btn-dark" onClick={() => setIsLoading(false)}>
          Close
        </button>
      </div>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/app">
            <Route path="banner" element={<AppBanner />} />
            <Route path="event" element={<AppEvent />} />
            <Route path="feedback" element={<AppFeedback />} />
            <Route path="welcome-screen" element={<AppWelcomeScreen />} />
          </Route>
          <Route path="/profile" element={<Profile />} />

          {/* Customers */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:userId" element={<CustomerProfile />} />

          {/* Course */}
          <Route path="/course-categories" element={<CourseCategory />} />
          {/* will manage all course categories */}
          <Route path="/courses" element={<Course />} />
          {/* will manage all courses (can be filtered by course-categories) and option to manage course series and manage quiz */}
          <Route path="/courses/:courseId" element={<CourseSeries />} />
          {/* will manage all course series in particular course */}
          <Route
            path="/courses/:courseId/:courseSeriesId"
            element={<CourseSeriesPlan />}
          />
          {/* will manage all course series plan in particular course series */}

          {/* Quiz */}
          <Route path="/quiz/:courseId/:courseSeriesId" element={<Quiz />} />
          {/* will manage all quiz inside one course  */}
          <Route
            path="/quiz/:courseId/:courseSeriesId/:quizId"
            element={<QuizSection />}
          />
          {/* will manage all sections inside one quiz  */}
          <Route
            path="/quiz/:courseId/:courseSeriesId/:quizId/:sectionId"
            element={<QuizSectionQuestion />}
          />
          {/* will manage all questions inside one quiz section */}
        </Route>
        <Route path="/*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  );
}

const ProtectedRoute = () => {
  const access_token = localStorage.getItem('access_token');

  if (access_token) {
    return (
      <>
        <Header />
        <Menu />
        <Outlet />
        <Footer />
      </>
    );
  } else {
    return <Navigate to="/sign-in" />;
  }
};
