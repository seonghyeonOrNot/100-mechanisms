'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, CircleGauge, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ThreeMechanism } from '@/components/three-mechanism';
import { createMotionProfile, normalizedDisplacement, radToDeg, solveSliderCrank } from '@/mechanics/sliderCrank';

const colors = { position: '#41d9ff', velocity: '#f6b94b', acceleration: '#ff667d' };
type ProfileKey = keyof typeof colors;

function Parameter({ label, value, unit, min, max, step = 1, onChange }: { label: string; value: number; unit: string; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return <label className="parameter">
    <span className="parameter-title"><span>{label}</span><output>{value.toFixed(step < 1 ? 1 : 0)} <small>{unit}</small></output></span>
    <Slider aria-label={label} value={[value]} min={min} max={max} step={step} onValueChange={(next) => onChange(typeof next === 'number' ? next : next[0])}/>
    <span className="parameter-range"><span>{min}</span><span>{max} {unit}</span></span>
  </label>;
}

function OrthographicView({ label, r, length, angle, rpm, mirrored = false, top = false }: { label: string; r: number; length: number; angle: number; rpm: number; mirrored?: boolean; top?: boolean }) {
  const state = solveSliderCrank(r, length, angle, rpm);
  const scale = 205 / (length + r + 20);
  const originX = mirrored ? 268 : 32;
  const direction = mirrored ? -1 : 1;
  const centerY = 76;
  const pinX = originX + direction * state.crankPin.x * scale;
  const pinY = centerY - state.crankPin.y * scale;
  const sliderX = originX + direction * state.slider.x * scale;
  const viewBox = top ? `0 0 300 132` : `0 0 300 132`;
  return <div className="ortho-view"><div className="ortho-label"><span>{label}</span><small>{top ? 'X–Z plane' : mirrored ? '−X view' : '+X view'}</small></div><svg viewBox={viewBox} aria-label={`${label} synchronized mechanism view`}>
    <path d="M0 0H300V132H0Z" className="ortho-bg"/>
    <line x1="16" x2="284" y1={centerY} y2={centerY} className="ortho-axis"/>
    <circle cx={originX} cy={centerY} r={r*scale} className="ortho-orbit"/>
    <line x1={originX} y1={centerY} x2={pinX} y2={pinY} className="ortho-crank"/>
    <line x1={pinX} y1={pinY} x2={sliderX} y2={centerY} className="ortho-rod"/>
    <circle cx={originX} cy={centerY} r="5" className="ortho-pivot"/><circle cx={pinX} cy={pinY} r="4" className="ortho-pin"/>
    <rect x={sliderX-10} y={centerY-10} width="20" height="20" rx="2" className="ortho-slider"/>
    {top && <><line x1={originX} x2={sliderX} y1={centerY-18} y2={centerY-18} className="dimension-line"/><text x={(originX+sliderX)/2} y={centerY-23} textAnchor="middle" className="ortho-dim">x = {state.position.toFixed(1)} mm</text></>}
  </svg></div>;
}

function Mechanism({ r, length, angle, rpm }: { r: number; length: number; angle: number; rpm: number }) {
  return <section className="panel mechanism-panel" aria-labelledby="mechanism-title">
    <div className="panel-heading"><div><p className="eyebrow">Interactive assembly</p><h2 id="mechanism-title">Three.js mechanism view</h2></div><div className="angle-readout"><span>θ</span>{angle.toFixed(1)}°</div></div>
    <ThreeMechanism r={r} length={length} angle={angle} rpm={rpm}/>
    <div className="multi-view-strip">
      <OrthographicView label="LEFT SIDE" r={r} length={length} angle={angle} rpm={rpm}/>
      <OrthographicView label="TOP" r={r} length={length} angle={angle} rpm={rpm} top/>
      <OrthographicView label="RIGHT SIDE" r={r} length={length} angle={angle} rpm={rpm} mirrored/>
    </div>
  </section>;
}

function MotionChart({ title, unit, data, dataKey, angle }: { title: string; unit: string; data: ReturnType<typeof createMotionProfile>; dataKey: ProfileKey; angle: number }) {
  const w=760,h=140,p={l:48,r:18,t:18,b:24};
  const values=data.map(d=>d[dataKey]); let min=Math.min(...values),max=Math.max(...values); const margin=(max-min||1)*.08; min-=margin;max+=margin;
  const x=(a:number)=>p.l+(a/360)*(w-p.l-p.r), y=(v:number)=>p.t+((max-v)/(max-min))*(h-p.t-p.b);
  const path=data.map((d,i)=>`${i?'L':'M'} ${x(d.angle).toFixed(2)} ${y(d[dataKey]).toFixed(2)}`).join(' ');
  const lo=Math.floor(angle/2),hi=Math.min(data.length-1,Math.ceil(angle/2)),f=angle/2-lo,current=data[lo][dataKey]+(data[hi][dataKey]-data[lo][dataKey])*f;
  return <div className="chart-row"><div className="chart-label"><strong>{title}</strong><span>{unit}</span></div><svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-label={`${title} versus crank angle`}>
    {[0,.5,1].map(q=><line key={q} x1={p.l} x2={w-p.r} y1={p.t+q*(h-p.t-p.b)} y2={p.t+q*(h-p.t-p.b)} className="chart-grid"/>)}
    {[0,90,180,270,360].map(t=><g key={t}><line x1={x(t)} x2={x(t)} y1={p.t} y2={h-p.b} className="chart-grid vertical"/><text x={x(t)} y={h-5} textAnchor="middle" className="chart-tick">{t}°</text></g>)}
    <path d={path} fill="none" stroke={colors[dataKey]} strokeWidth="2.5" vectorEffect="non-scaling-stroke"/><line x1={x(angle)} x2={x(angle)} y1={p.t} y2={h-p.b} className="angle-indicator"/><circle cx={x(angle)} cy={y(current)} r="4" fill={colors[dataKey]}/>
    <text x="3" y={p.t+5} className="chart-limit">{max.toFixed(dataKey==='position'?0:1)}</text><text x="3" y={h-p.b} className="chart-limit">{min.toFixed(dataKey==='position'?0:1)}</text>
  </svg></div>;
}

function RatioComparison({ r, angle }: { r: number; angle: number }) {
  const w=760,h=164,p={l:44,r:18,t:18,b:26},sx=(a:number)=>p.l+(a/360)*(w-p.l-p.r),sy=(v:number)=>p.t+(1-v)*(h-p.t-p.b);
  const ratios=[{ratio:2,color:colors.acceleration},{ratio:4,color:colors.velocity},{ratio:8,color:colors.position}];
  return <div className="comparison"><div className="comparison-heading"><div><p className="eyebrow">Geometry comparison</p><h3>L/r influence</h3></div><div className="legend">{ratios.map(({ratio,color})=><span key={ratio}><i style={{background:color}}/>L/r = {ratio}</span>)}</div></div><svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-label="Normalized displacement for L over r ratios 2, 4, and 8">
    {[0,.5,1].map(q=><line key={q} x1={p.l} x2={w-p.r} y1={sy(q)} y2={sy(q)} className="chart-grid"/>)}{[0,90,180,270,360].map(t=><g key={t}><line x1={sx(t)} x2={sx(t)} y1={p.t} y2={h-p.b} className="chart-grid vertical"/><text x={sx(t)} y={h-5} textAnchor="middle" className="chart-tick">{t}°</text></g>)}
    {ratios.map(({ratio,color})=><path key={ratio} d={Array.from({length:181},(_,i)=>{const a=i*2;return `${i?'L':'M'} ${sx(a).toFixed(1)} ${sy(normalizedDisplacement(r,ratio,a)).toFixed(1)}`}).join(' ')} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke"/>)}<line x1={sx(angle)} x2={sx(angle)} y1={p.t} y2={h-p.b} className="angle-indicator"/>
  </svg></div>;
}

export function SliderCrankPlayground() {
  const [r,setR]=useState(20),[length,setLength]=useState(80),[rpm,setRpm]=useState(30),[angle,setAngle]=useState(0),[playing,setPlaying]=useState(false); const last=useRef<number|null>(null);
  useEffect(()=>{if(!playing){last.current=null;return;}let frame=0;const tick=(time:number)=>{if(last.current!==null){const dt=(time-last.current)/1000;setAngle(a=>(a+dt*rpm*6)%360)}last.current=time;frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[playing,rpm]);
  const state=useMemo(()=>solveSliderCrank(r,length,angle,rpm),[r,length,angle,rpm]); const profile=useMemo(()=>createMotionProfile(r,length,rpm),[r,length,rpm]); const ratio=length/r;
  const insight=ratio<2.5?'낮은 L/r 비율로 인해 로드 각도가 커지고, 전·후반 스트로크의 운동 비대칭성이 뚜렷합니다.':ratio<5?'현재 L/r 비율은 실용적인 중간 범위입니다. 유한한 로드 길이로 인한 2차 조화 성분이 관찰됩니다.':'긴 커넥팅 로드 덕분에 슬라이더 변위가 단순 조화 운동에 가까워지고 비대칭성이 감소합니다.';
  const metrics:[string,number,string][]=[['Stroke',2*r,'mm'],['Position',state.position,'mm'],['Velocity',state.velocity,'mm/s'],['Acceleration',state.acceleration,'mm/s²'],['Crank angle',angle,'deg'],['Angular velocity',state.omega,'rad/s'],['Rod angle',radToDeg(state.rodAngle),'deg'],['L/r ratio',ratio,'—']];
  return <main className="lab-shell"><header className="topbar"><div className="brand"><Activity/><span>KINEMATICS <b>LAB</b></span></div><div className="mechanism-select"><span>MECHANISM /</span><strong>SLIDER–CRANK</strong><i>ACTIVE</i></div><div className="header-status"><span className="status-dot"/> REAL-TIME SOLVER</div></header>
    <div className="workspace"><div className="intro"><div><p className="eyebrow">Motion playground / 01</p><h1>Slider–Crank Analysis</h1></div><p>Geometry, metrics and plots share one exact kinematic model.</p></div>
      <div className="main-grid"><Mechanism r={r} length={length} angle={angle} rpm={rpm}/><section className="panel controls" aria-labelledby="controls-title"><div className="panel-heading"><div><p className="eyebrow">Input variables</p><h2 id="controls-title">Parameters</h2></div><CircleGauge/></div><div className="control-list">
        <Parameter label="Crank radius" value={r} unit="mm" min={5} max={Math.min(60,length-1)} onChange={setR}/><Parameter label="Connecting rod" value={length} unit="mm" min={Math.max(30,r+1)} max={180} onChange={setLength}/><Parameter label="Motor speed" value={rpm} unit="RPM" min={1} max={120} onChange={setRpm}/><Parameter label="Crank angle" value={angle} unit="deg" min={0} max={360} step={.5} onChange={v=>{setPlaying(false);setAngle(v===360?0:v)}}/>
      </div><div className="playback"><Button className="play-button" onClick={()=>setPlaying(v=>!v)}>{playing?<Pause/>:<Play/>}{playing?'Pause':'Play motion'}</Button><Button variant="outline" size="icon-lg" aria-label="Reset parameters" onClick={()=>{setPlaying(false);setR(20);setLength(80);setRpm(30);setAngle(0)}}><RotateCcw/></Button></div><div className="constraint"><span>CONSTRAINT</span><strong>L &gt; r</strong><small>Valid · margin {(length-r).toFixed(0)} mm</small></div></section></div>
      <section className="analysis"><div className="section-heading"><div><p className="eyebrow">Computed state</p><h2>Motion analysis</h2></div><span>θ = {angle.toFixed(1)}°</span></div><div className="metrics">{metrics.map(([label,value,unit])=><div className="metric" key={label}><span>{label}</span><strong>{value.toFixed(label==='L/r ratio'?2:1)}</strong><small>{unit}</small></div>)}</div>
        <div className="profiles panel"><div className="profile-heading"><div><p className="eyebrow">One revolution · analytic solution</p><h2>Motion profiles</h2></div><span className="live"><i/>LIVE</span></div><MotionChart title="Position" unit="mm" data={profile} dataKey="position" angle={angle}/><MotionChart title="Velocity" unit="mm/s" data={profile} dataKey="velocity" angle={angle}/><MotionChart title="Acceleration" unit="mm/s²" data={profile} dataKey="acceleration" angle={angle}/><RatioComparison r={r} angle={angle}/></div>
        <aside className="insight"><span>ENGINEERING INSIGHT</span><p>{insight}</p><strong>L/r = {ratio.toFixed(2)}</strong></aside>
      </section></div><footer><span>SLIDER–CRANK / EXACT GEOMETRY</span><span>x = r cos θ + √(L² − r² sin² θ)</span><span>v = dx/dθ · ω</span></footer></main>;
}
