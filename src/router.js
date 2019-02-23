import Vue from "vue";
import Router from "vue-router";
import AddStudents from "./components/pages/dashboard/add-student-page/AddStudentPage";
import AddCourses from "./components/pages/dashboard/add-course-page/AddCoursePage";
import Dashboard from "./components/pages/dashboard/Dashboard";
import LoginPage from "./components/pages/login-page/LoginPage";
import AddMarkEntry from "./components/pages/dashboard/add-marks/AddMarkEntry";
import AddFaculty from "./components/pages/dashboard/add-faculty/AddFacultyPage";
import ViewCourses from "./components/pages/dashboard/view-courses/ViewCourses";
import ViewFaculty from "./components/pages/dashboard/view-faculty/ViewFaculty";
import ViewStudents from "./components/pages/dashboard/view-students/ViewStudents";
import ViewEntries from "./components/pages/dashboard/view-marks/ViewEntries";
import ViewAllEntries from "./components/pages/dashboard/view-all-marks/ViewAllEntries";
import About from "./components/pages/dashboard/AboutPage";
import Home from "./components/pages/dashboard/HomePage";
import AddImagePage from "./components/pages/dashboard/add-image/AddImagePage";
import StarOfTheWeek from "./components/pages/dashboard/star-of-the-week/StarOfTheWeek";
import ViewTotalMarks from "./components/pages/dashboard/view-total-marks/ViewTotalMarks";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/dashboard",
      component: Dashboard,
      redirect: { path: "/home" },
      children: [
        { path: "/home", component: Home, name: "home" },
        { path: "/add-students", component: AddStudents },
        { path: "/add-courses", component: AddCourses },
        { path: "/add-mark-entry", component: AddMarkEntry },
        { path: "/add-faculty", component: AddFaculty },
        { path: "/view-courses", component: ViewCourses },
        { path: "/view-students", component: ViewStudents },
        { path: "/view-faculty", component: ViewFaculty },
        { path: "/view-entries", component: ViewEntries },
        { path: "/view-all-entries", component: ViewAllEntries },
        { path: "/view-total-marks", component: ViewTotalMarks},
        { path: "/star-of-the-week", component: StarOfTheWeek },
        { path: "/add-image", component: AddImagePage },
        { path: "/about", component: About }
      ]
    },
    { path: "/", component: LoginPage }
  ]
});
