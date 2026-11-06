import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, CreditCard, Shield, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useStore();
  const total = cart.reduce((sum, item) => sum + item.course.price * item.quantity, 0);
  const totalOriginal = cart.reduce(
    (sum, item) => sum + (item.course.originalPrice || item.course.price) * item.quantity,
    0
  );
  const savings = totalOriginal - total;

  // 支付尚未接入：明确告知，不伪造下单或支付成功。
  const handleCheckout = () => {
    toast.error('支付尚未接入：当前为静态演示，无法下单，未产生任何扣款');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">购物车是空的</h2>
          <p className="text-gray-500 mb-6">浏览课程，添加你感兴趣的课程到购物车</p>
          <Link to="/courses">
            <Button variant="secondary">
              浏览课程 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          购物车 ({cart.length})
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.courseId}>
                <CardContent className="p-4 flex gap-4">
                  <img
                    src={item.course.image}
                    alt={item.course.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link to={`/courses/${item.courseId}`} className="font-semibold text-gray-900 hover:text-teal-600">
                      {item.course.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.course.instructor}</p>
                    <p className="text-sm text-gray-500">{item.course.lessons} 节课 · {item.course.duration / 60} 小时</p>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-lg text-gray-900">{formatPrice(item.course.price)}</div>
                      {item.course.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">{formatPrice(item.course.originalPrice)}</div>
                      )}
                    </div>
                    <button onClick={() => removeFromCart(item.courseId)} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                      <Trash2 className="h-4 w-4" /> 移除
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-500">清空购物车</button>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">订单摘要</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>课程小计</span>
                    <span>{formatPrice(totalOriginal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1"><Tag className="h-4 w-4" /> 折扣</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                    <span>合计</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <Button variant="primary" className="w-full" onClick={handleCheckout}>
                  <CreditCard className="mr-2 h-4 w-4" /> 去结算
                </Button>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>静态演示 · 支付尚未接入，不会产生扣款</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
