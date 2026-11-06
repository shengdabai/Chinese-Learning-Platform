import { create } from 'zustand';
import course1Cover from '@/assets/covers/course-1.svg';
import course2Cover from '@/assets/covers/course-2.svg';
import course3Cover from '@/assets/covers/course-3.svg';
import course4Cover from '@/assets/covers/course-4.svg';
import course5Cover from '@/assets/covers/course-5.svg';
import course6Cover from '@/assets/covers/course-6.svg';

// 课程数据类型定义
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number; // 分钟
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  lessons: number;
  language: string;
  status: 'published' | 'draft' | 'coming_soon';
  featured?: boolean;
  popular?: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 用户数据类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  purchasedCourses: string[];
  learningProgress: Record<string, number>;
}

// 购物车项目类型定义
export interface CartItem {
  courseId: string;
  course: Course;
  quantity: number;
}

// 应用状态接口定义
interface AppState {
  // 用户相关状态
  user: User | null;
  isLoggedIn: boolean;
  
  // 课程相关状态
  courses: Course[];
  featuredCourses: Course[];
  categories: string[];
  
  // 购物车状态
  cart: CartItem[];
  
  // UI状态
  showNewUserModal: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  setCourses: (courses: Course[]) => void;
  setFeaturedCourses: (courses: Course[]) => void;
  
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  updateCartQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
  
  setShowNewUserModal: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

// 创建Zustand store
export const useStore = create<AppState>((set, get) => ({
  // 初始状态
  user: null,
  isLoggedIn: false,
  courses: [],
  featuredCourses: [],
  categories: ['初学入门', '考试备考', '商务中文', '日常对话', '文化课程'],
  cart: [],
  showNewUserModal: false,
  isLoading: false,
  
  // 用户相关actions
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  
  // 账号后端尚未接入。此前这里忽略密码、把任意输入登录为固定的示例用户并返回成功，
  // 属于虚假成功状态。接入真实认证前一律失败关闭：不创建会话、不返回 true。
  login: async () => {
    set({ user: null, isLoggedIn: false, isLoading: false });
    return false;
  },
  
  logout: () => set({ user: null, isLoggedIn: false, cart: [] }),
  
  // 课程相关actions
  setCourses: (courses) => set({ courses }),
  setFeaturedCourses: (courses) => set({ featuredCourses: courses }),
  
  // 购物车相关actions
  addToCart: (course) => {
    const { cart } = get();
    // 数字课程只需一份；重复点击不增加隐藏数量或合计。
    if (course.status !== 'published' || cart.some(item => item.courseId === course.id)) return;
    set({ cart: [...cart, { courseId: course.id, course, quantity: 1 }] });
  },
  
  removeFromCart: (courseId) => {
    const { cart } = get();
    set({ cart: cart.filter(item => item.courseId !== courseId) });
  },
  
  updateCartQuantity: (courseId, quantity) => {
    const { cart } = get();
    if (!Number.isFinite(quantity)) return;
    if (quantity <= 0) {
      get().removeFromCart(courseId);
      return;
    }
    
    set({
      cart: cart.map(item =>
        item.courseId === courseId
          ? { ...item, quantity: 1 }
          : item
      )
    });
  },
  
  clearCart: () => set({ cart: [] }),
  
  // UI状态actions
  setShowNewUserModal: (show) => set({ showNewUserModal: show }),
  setIsLoading: (loading) => set({ isLoading: loading })
}));

// 模拟课程数据
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'HSK 1-2 零基础中文入门',
    description: '专为零基础学习者设计的中文入门课程，涵盖基础汉字、拼音、日常对话等内容。',
    instructor: '李老师',
    duration: 1200, // 20小时 = 1200分钟
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 156,
    image: course1Cover,
    category: '初学入门',
    level: 'beginner',
    tags: ['HSK', '零基础', '拼音', '汉字'],
    lessons: 20,
    language: 'zh-CN',
    status: 'published',
    featured: true,
    popular: true,
    isNew: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: '商务中文实战课程',
    description: '针对职场人士的商务中文课程，学习商务谈判、邮件写作、会议交流等实用技能。',
    instructor: '王老师',
    duration: 2100, // 35小时 = 2100分钟
    price: 599,
    rating: 4.9,
    reviewCount: 89,
    image: course2Cover,
    category: '商务中文',
    level: 'intermediate',
    tags: ['商务', '职场', '谈判', '邮件'],
    lessons: 35,
    language: 'zh-CN',
    status: 'published',
    featured: true,
    popular: true,
    isNew: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-15'
  },
  {
    id: '3',
    title: 'HSK 6级冲刺班',
    description: '高级中文水平考试冲刺课程，系统复习语法、词汇，提供真题练习和应试技巧。',
    instructor: '张老师',
    duration: 3000, // 50小时 = 3000分钟
    price: 899,
    rating: 4.7,
    reviewCount: 234,
    image: course3Cover,
    category: '考试备考',
    level: 'advanced',
    tags: ['HSK6', '考试', '冲刺', '真题'],
    lessons: 50,
    language: 'zh-CN',
    status: 'published',
    featured: true,
    popular: false,
    isNew: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-02-01'
  },
  {
    id: '4',
    title: '中国文化与传统节日',
    description: '深入了解中国传统文化、节日习俗、历史背景，提升文化素养和语言理解能力。',
    instructor: '陈老师',
    duration: 1500, // 25小时 = 1500分钟
    price: 399,
    rating: 4.6,
    reviewCount: 67,
    image: course4Cover,
    category: '文化课程',
    level: 'intermediate',
    tags: ['文化', '传统', '节日', '历史'],
    lessons: 25,
    language: 'zh-CN',
    status: 'published',
    featured: false,
    popular: true,
    isNew: false,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25'
  },
  {
    id: '5',
    title: '日常生活中文对话',
    description: '学习日常生活中的实用中文对话，包括购物、餐厅、交通、医院等场景。',
    instructor: '刘老师',
    duration: 900, // 15小时 = 900分钟
    price: 199,
    rating: 4.5,
    reviewCount: 123,
    image: course5Cover,
    category: '日常对话',
    level: 'beginner',
    tags: ['日常', '对话', '生活', '实用'],
    lessons: 15,
    language: 'zh-CN',
    status: 'published',
    featured: false,
    popular: true,
    isNew: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-25'
  },
  {
    id: '6',
    title: '高级中文写作技巧',
    description: '提升中文写作水平，学习议论文、说明文、记叙文等不同文体的写作技巧。',
    instructor: '赵老师',
    duration: 2400, // 40小时 = 2400分钟
    price: 699,
    rating: 4.8,
    reviewCount: 45,
    image: course6Cover,
    category: '考试备考',
    level: 'advanced',
    tags: ['写作', '文体', '技巧', '高级'],
    lessons: 40,
    language: 'zh-CN',
    status: 'coming_soon',
    featured: false,
    popular: false,
    isNew: true,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15'
  }
];
