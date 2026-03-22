'use client';

import { Shield, Award, Lock, CheckCircle, Zap, Heart } from 'lucide-react';

interface TrustBadgesProps {
  layout?: 'horizontal' | 'vertical' | 'grid';
  compact?: boolean;
}

export default function TrustBadges({ layout = 'horizontal', compact = false }: TrustBadgesProps) {
  const badges = [
    {
      icon: Lock,
      label: 'SSL Secure',
      description: 'Bank-level encryption',
      color: 'emerald'
    },
    {
      icon: Award,
      label: '100% Verified',
      description: 'Authentic products',
      color: 'blue'
    },
    {
      icon: Shield,
      label: 'Money Back',
      description: '30-day guarantee',
      color: 'purple'
    },
    {
      icon: Zap,
      label: 'Instant Delivery',
      description: 'Products delivered instantly',
      color: 'amber'
    },
    {
      icon: CheckCircle,
      label: 'Customer Verified',
      description: '10,000+ satisfied buyers',
      color: 'cyan'
    },
    {
      icon: Heart,
      label: 'Trusted Brand',
      description: 'Industry leader since 2020',
      color: 'rose'
    }
  ];

  const colorClasses = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
  };

  if (layout === 'horizontal') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-3 ${compact ? 'py-4' : 'py-8'}`}>
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colorClasses[badge.color as keyof typeof colorClasses]} transition hover:shadow-lg`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!compact && <span className="text-xs font-medium">{badge.label}</span>}
            </div>
          );
        })}
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-8">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border text-center ${colorClasses[badge.color as keyof typeof colorClasses]} transition hover:shadow-lg`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs font-semibold mb-1">{badge.label}</p>
              <p className="text-xs opacity-75">{badge.description}</p>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical layout
  return (
    <div className="space-y-3 py-8">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div
            key={idx}
            className={`flex items-start gap-3 p-4 rounded-lg border ${colorClasses[badge.color as keyof typeof colorClasses]} transition hover:shadow-lg`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">{badge.label}</p>
              <p className="text-xs opacity-75">{badge.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
