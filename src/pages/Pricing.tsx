import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight, Gift, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  cta: string;
  ctaVariant: 'primary' | 'secondary' | 'outline';
  features: PlanFeature[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: '免费试听',
    price: 0,
    period: '永久免费',
    description: '体验平台功能，免费学习入门课程',
    icon: <Gift className="h-6 w-6" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    cta: '开始免费学习',
    ctaVariant: 'outline',
    features: [
      { text: '每门课程前3节免费', included: true },
      { text: '基础拼音练习', included: true },
      { text: 'HSK词汇卡（前50词）', included: true },
      { text: '学习进度追踪', included: true },
      { text: '社区问答', included: true },
      { text: '完整课程访问', included: false },
      { text: '1v1辅导', included: false },
      { text: '课程证书', included: false },
    ],
  },
  {
    name: '月度会员',
    price: 99,
    period: '/月',
    description: '无限学习所有课程，按月订阅灵活取消',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
    cta: '立即订阅',
    ctaVariant: 'secondary',
    features: [
      { text: '所有课程无限学习', included: true },
      { text: 'HSK全套备考资料', included: true },
      { text: '学习进度追踪', included: true },
      { text: '社区问答优先回复', included: true },
      { text: '每月2次小组辅导', included: true },
      { text: '课程完成证书', included: true },
      { text: '1v1私人辅导', included: false },
      { text: '定制化学习计划', included: false },
    ],
  },
  {
    name: '年度会员',
    price: 799,
    originalPrice: 1188,
    period: '/年',
    description: '全年无限学习 + 专属1v1辅导，立省¥389',
    icon: <Crown className="h-6 w-6" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    cta: '开通年度会员',
    ctaVariant: 'primary',
    popular: true,
    features: [
      { text: '所有课程无限学习', included: true },
      { text: 'HSK全套备考资料', included: true },
      { text: '学习进度追踪 + 报告', included: true },
      { text: '社区VIP优先回复', included: true },
      { text: '每月4次1v1辅导', included: true },
      { text: '课程完成证书', included: true },
      { text: '定制化学习计划', included: true },
      { text: '优先参与新课内测', included: true },
    ],
  },
];

const faqs = [
  {
    q: '免费试听课真的完全免费吗？',
    a: '是的！每门课程的前3节课完全免费，无需任何付费。我们希望通过试听让你了解课程质量后再决定是否付费。',
  },
  {
    q: '月度会员可以随时取消吗？',
    a: '可以。月度会员支持随时取消，取消后当前计费周期内仍可正常使用所有功能。不会产生任何额外费用。',
  },
  {
    q: '年度会员比月度会员划算多少？',
    a: '年度会员¥799/年，折合每月仅¥66.6，比月度会员¥99/月节省约33%。如果计划长期学习，年度会员是最佳选择。',
  },
  {
    q: '支持哪些支付方式？',
    a: '我们支持微信支付、支付宝、信用卡（Visa/Mastercard）和银联卡。所有支付信息都经过加密处理。',
  },
];

export const Pricing: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            选择适合你的学习计划
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            从免费试听到年度会员，灵活选择，随时升级
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.borderColor} ${
                  plan.popular ? 'ring-2 ring-amber-400 shadow-xl scale-105' : 'shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-500 text-white text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      最受欢迎
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className={`inline-flex p-3 rounded-lg ${plan.bgColor} ${plan.color} mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ¥{plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                    {plan.originalPrice && (
                      <span className="text-gray-400 line-through ml-2">
                        ¥{plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check
                          className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                            f.included ? 'text-green-500' : 'text-gray-300'
                          }`}
                        />
                        <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.ctaVariant} className="w-full">
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            功能对比表
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 px-6 text-gray-600 font-semibold">功能</th>
                  <th className="py-4 px-6 text-center text-gray-600 font-semibold">免费</th>
                  <th className="py-4 px-6 text-center text-teal-600 font-semibold">月度¥99</th>
                  <th className="py-4 px-6 text-center text-amber-600 font-semibold">年度¥799</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['免费课程', '前3节', '全部', '全部'],
                  ['HSK备考资料', '前50词', '全套', '全套'],
                  ['学习报告', '基础', '详细', '详细+定制'],
                  ['社区支持', '普通', '优先', 'VIP'],
                  ['1v1辅导', '无', '2次/月', '4次/月'],
                  ['课程证书', '无', '有', '有'],
                  ['学习计划', '无', '模板', '定制'],
                  ['新课内测', '无', '无', '优先'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">{row[0]}</td>
                    <td className="py-3 px-6 text-center text-gray-600">{row[1]}</td>
                    <td className="py-3 px-6 text-center text-gray-600">{row[2]}</td>
                    <td className="py-3 px-6 text-center text-gray-600">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            常见问题
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <span className="text-gray-400">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            还在犹豫？先免费试听吧
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            无需注册，无需信用卡，直接开始学习
          </p>
          <Link to="/courses">
            <Button variant="primary" className="bg-white text-teal-700 hover:bg-gray-100">
              浏览免费课程
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
