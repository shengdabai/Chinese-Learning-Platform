import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { CourseDetail } from "@/pages/CourseDetail";
import { CourseList } from "@/pages/CourseList";
import { Pricing } from "@/pages/Pricing";
import { Cart } from "@/pages/Cart";
import { About } from "@/pages/About";

function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">页面未找到</h1>
        <p className="text-gray-600">该页面不存在或尚未提供。</p>
        <Link to="/courses" className="text-teal-600 hover:underline">浏览全部课程</Link>
      </div>
    </main>
  );
}

function CategoryCourses() {
  const { '*': slug } = useParams();
  const categories: Record<string, string> = {
    beginner: '初学入门',
    hsk: '考试备考',
    business: '商务中文',
    conversation: '日常对话',
    culture: '文化课程',
  };
  if (!slug) return <Navigate to="/courses" replace />;
  if (!Object.prototype.hasOwnProperty.call(categories, slug)) return <NotFound />;
  const params = new URLSearchParams({ category: categories[slug] });
  return <Navigate to={`/courses?${params}`} replace />;
}

export default function App() {
  return (
    <Router>
      <div className="App">
        <p role="note" className="bg-gray-50 text-gray-600 text-sm text-center p-4">
          演示平台：课程、价格和学员数据为示例。登录、支付与学习服务尚未接入。请勿输入真实账号或密码。
        </p>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories/*" element={<CategoryCourses />} />
          <Route path="/profile" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><h1 className="text-3xl font-bold text-gray-900 mb-4">个人中心</h1><p className="text-gray-600">敬请期待</p></div></div>} />
          <Route path="/my-courses" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><h1 className="text-3xl font-bold text-gray-900 mb-4">我的课程</h1><p className="text-gray-600">敬请期待</p></div></div>} />
          <Route path="/orders" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><h1 className="text-3xl font-bold text-gray-900 mb-4">订单记录</h1><p className="text-gray-600">敬请期待</p></div></div>} />
          <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><h1 className="text-3xl font-bold text-gray-900 mb-4">联系我们</h1><p className="text-gray-600">敬请期待</p></div></div>} />
          <Route path="*" element={<NotFound />} />
         </Routes>
         <Footer />
       </div>
    </Router>
  );
}
