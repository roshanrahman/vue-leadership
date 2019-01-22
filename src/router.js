import Vue from "vue";
import Router from "vue-router";
import AddStudents from "./components/pages/dashboard/add-student-page/AddStudentPage";
import AddCourses from "./components/pages/dashboard/add-course-page/AddCoursePage";
import Dashboard from "./components/pages/dashboard/Dashboard";
import LoginPage from "./components/pages/login-page/LoginPage";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/dashboard",
      component: Dashboard,
      children: [
        { path: "/add-students", component: AddStudents },
        { path: "/add-courses", component: AddCourses }
      ]
    },
    { path: "/", component: LoginPage }
  ]
});
