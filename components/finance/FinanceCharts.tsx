'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts'

interface FinanceChartsProps {
  entries: any[]
}

export function FinanceCharts({ entries }: FinanceChartsProps) {
  // Aggregate data for daily trend (last 7 days/entries)
  const lastEntries = [...entries]
    .sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime())
    .slice(-10)

  // Aggregate by category for Pie Chart
  const categoryData = entries.reduce((acc: any, entry) => {
    if (entry.type === 'expense') {
      const existing = acc.find((d: any) => d.name === entry.category)
      if (existing) {
        existing.value += Number(entry.amount)
      } else {
        acc.push({ name: entry.category, value: Number(entry.amount) })
      }
    }
    return acc
  }, [])

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Trend Chart */}
      <div className="bg-surface rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-focus/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-focus/10 transition-colors" />
        
        <div className="mb-6">
            <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-1">Tendencia de Gastos</h3>
            <p className="text-xs text-muted/50">Tus últimos 10 movimientos</p>
        </div>
        
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lastEntries}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="transaction_date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#a1a1a1', fontSize: 10 }}
                dy={10}
              />
              <YAxis 
                hide 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="bg-surface rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-finance/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-finance/10 transition-colors" />
        
        <div className="mb-6">
            <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-1">Distribución por Categoría</h3>
            <p className="text-xs text-muted/50">¿En qué estás gastando?</p>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                animationDuration={1500}
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', color: '#a1a1a1', paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
