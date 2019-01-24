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
import About from "./components/pages/dashboard/AboutPage";
import Home from "./components/pages/dashboard/HomePage";
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
        { path: "/about", component: About }
      ]
    },
    { path: "/", component: LoginPage }
  ]
});
