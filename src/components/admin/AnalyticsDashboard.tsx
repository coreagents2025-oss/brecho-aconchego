import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, MessageCircle, TrendingUp, Globe } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--primary))", "#a78b6a", "#8aa37b", "#c79477"];

export function AnalyticsDashboard() {
  const [days, setDays] = useState(30);
  const { top, daily, sources, conv, loading } = useAnalytics(days);

  const rate = conv.total_views > 0 ? ((conv.total_clicks / conv.total_views) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl">Visão geral</h2>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl"><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-xl"><Eye className="w-5 h-5 text-accent" /></div>
              <div><div className="text-xs text-muted-foreground">Views de produto</div><div className="text-2xl font-medium">{conv.total_views}</div></div>
            </CardContent></Card>
            <Card className="rounded-2xl"><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-xl"><MessageCircle className="w-5 h-5 text-secondary" /></div>
              <div><div className="text-xs text-muted-foreground">Cliques WhatsApp</div><div className="text-2xl font-medium">{conv.total_clicks}</div></div>
            </CardContent></Card>
            <Card className="rounded-2xl"><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl"><TrendingUp className="w-5 h-5 text-primary" /></div>
              <div><div className="text-xs text-muted-foreground">Taxa de conversão</div><div className="text-2xl font-medium">{rate}%</div></div>
            </CardContent></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="rounded-2xl lg:col-span-2">
              <CardHeader><CardTitle className="font-display text-lg">Visitas por dia</CardTitle></CardHeader>
              <CardContent className="h-72">
                {daily.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
                ) : (
                  <ResponsiveContainer>
                    <LineChart data={daily}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="dia" tickFormatter={(d) => d.slice(5)} fontSize={11} />
                      <YAxis fontSize={11} allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" name="Total" stroke="hsl(var(--accent))" strokeWidth={2} />
                      <Line type="monotone" dataKey="unicos" name="Únicos" stroke="hsl(var(--secondary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Globe className="w-4 h-4" /> Origem do tráfego</CardTitle></CardHeader>
              <CardContent className="h-72">
                {sources.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
                ) : (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={sources} dataKey="total" nameKey="source" outerRadius={80} label>
                        {sources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="font-display text-lg">Top 10 produtos mais visitados</CardTitle></CardHeader>
            <CardContent>
              {top.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem visualizações registradas no período.</p>
              ) : (
                <div className="divide-y">
                  {top.map((p, i) => {
                    const taxa = p.views > 0 ? ((p.wa_clicks / p.views) * 100).toFixed(0) : "0";
                    return (
                      <div key={p.product_codigo} className="flex items-center gap-3 py-2">
                        <div className="w-6 text-center font-medium text-muted-foreground">{i + 1}</div>
                        {p.url_capa ? <img src={p.url_capa} className="w-12 h-12 object-cover rounded-lg" alt={p.nome} /> : <div className="w-12 h-12 bg-muted rounded-lg" />}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{p.nome}</div>
                          <div className="text-xs text-muted-foreground font-mono">{p.product_codigo}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div><span className="font-medium">{p.views}</span> <span className="text-muted-foreground">views</span></div>
                          <div><span className="font-medium">{p.wa_clicks}</span> <span className="text-muted-foreground">WA · {taxa}%</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
