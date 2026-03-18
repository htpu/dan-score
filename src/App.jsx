import { useState, useEffect, useMemo } from 'react'
import { 
  Settings, 
  RotateCcw, 
  Trophy, 
  Undo2, 
  X,
  AlertCircle,
  Clock, 
  Timer,
  Cat,
  Dog,
  Zap,
  Dumbbell,
  User,
  UserCircle,
  Shield,
  Swords,
  Moon,
  Sun,
  PartyPopper,
  Smartphone
} from 'lucide-react'

const VERSION = '0.0.3'

const LEVELS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

const TEAM_PRESETS = [
  { a: '阿猫', b: '阿狗', iconA: Cat, iconB: Dog },
  { a: '蓝队', b: '红队', iconA: Shield, iconB: Swords },
  { a: '钢铁侠', b: '绿巨人', iconA: Zap, iconB: Dumbbell },
  { a: '男队', b: '女队', iconA: User, iconB: UserCircle }
]

const PokerBackground = ({ isDark }) => {
  const icons = useMemo(() => {
    const suits = [
      "M10 2c-2.2 0-4 1.8-4 4 0 3 4 7 4 7s4-4 4-7c0-2.2-1.8-4-4-4z",
      "M10 0l-5 8-5-8 5-8z",
      "M10 12c2 0 3-1.5 3-3.5S11 5 10 5s-3 1.5-3 3.5 1 3.5 3 3.5z",
      "M10 4l5 10-5 10-5-10z"
    ]
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      path: suits[i % 4],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 60 + 50,
      rotate: Math.random() * 360,
      opacity: isDark ? 0.07 : 0.05
    }))
  }, [isDark])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute transition-opacity duration-1000"
          style={{
            top: icon.top,
            left: icon.left,
            transform: `rotate(${icon.rotate}deg)`,
            opacity: icon.opacity
          }}
        >
          <svg width={icon.size} height={icon.size} viewBox="0 0 20 20">
            <path 
              d={icon.path} 
              fill={isDark ? "#818cf8" : "#6366f1"} 
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

function App() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('guandan_game_state_v8')
    return saved ? JSON.parse(saved) : {
      teamA: '阿猫', teamB: '阿狗',
      levelA: 0, levelB: 0,
      failA: 0, failB: 0,
      history: [], startTime: null
    }
  })

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('guandan_settings_v8')
    return saved ? JSON.parse(saved) : {
      presetIndex: 0, smallWinUpgrade: true, tripleFailPenalty: true, theme: 'auto'
    }
  })

  const [systemDark, setSystemDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSystemDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const isDark = settings.theme === 'dark' || (settings.theme === 'auto' && systemDark)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [currentRanks, setCurrentRanks] = useState([null, null, null, null])
  const [pendingResult, setPendingResult] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [gameWinner, setGameWinner] = useState(null)
  const [showGuide, setShowGuide] = useState(false)

  const GUANDAN_TIPS = [
    { title: '记牌', content: '记住已出的关键牌（大小王、A、2），判断对手剩余牌力，决定是否要冒险' },
    { title: '配合', content: '队友第一名时主动送牌帮助走完；队友最后一名时要接应，别让对手封顶' },
    { title: '领头', content: '先出小牌试探，观察对手反应判断其牌型后再决定是否加码' },
    { title: '封顶', content: '炸弹留到最后关键时机使用，一击制胜；防守时炸弹可逼对手拆牌消耗' },
    { title: '诱骗', content: '可故意拆顺子、对子等诱骗对手出炸弹，等他炸弹用完再反击' },
    { title: '留力', content: '最后几轮慎重出牌，保留变化应对突发情况，别过早暴露实力' },
    { title: '对子', content: '对子可拆开逼对手出炸弹，或组成三带二增加牌力，出其不意' },
    { title: '传牌', content: '根据队友位置和手牌传相应牌型，队友需要对子传对子，需要单张传单张' },
    { title: '控牌', content: '非必要不出大牌，控制牌权在自己手里，避免对手掌握主动权' },
    { title: '读牌', content: '观察对手出牌习惯和表情，判断其牌型和心理状态，做出相应应对' },
    { title: '止损', content: '明显劣势时及时调整策略，减少失分，能保级就不冲分' },
    { title: '心态', content: '保持平稳心态，不要急于求成，稳扎稳打，越慌越容易出错' },
  ]

  useEffect(() => {
    localStorage.setItem('guandan_game_state_v8', JSON.stringify(gameState))
    localStorage.setItem('guandan_settings_v8', JSON.stringify(settings))
  }, [gameState, settings])

  useEffect(() => {
    if (!gameState.startTime) return
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameState.startTime) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [gameState.startTime])

  const formatDuration = (s) => `${Math.floor(s/3600).toString().padStart(2,'0')}:${Math.floor((s%3600)/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`
  const formatTime = (ts) => new Date(ts).toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  
  const IconA = TEAM_PRESETS[settings.presetIndex].iconA
  const IconB = TEAM_PRESETS[settings.presetIndex].iconB

  const handleRankSelect = (idx, team) => {
    const next = [...currentRanks]
    for (let i = idx; i < 4; i++) next[i] = null
    if (next.filter(r => r === team).length >= 2) return
    next[idx] = team
    setCurrentRanks(next)

    const selectedCount = next.filter(r => r !== null).length
    let shouldTrigger = false
    let finalRanks = [...next]

    if (next[0] && next[0] === next[1]) {
      const other = next[0] === 'A' ? 'B' : 'A'
      finalRanks = [next[0], next[0], other, other]
      shouldTrigger = true
    } else if (selectedCount === 3) {
      const lastIdx = next.findIndex(r => r === null)
      finalRanks[lastIdx] = next.filter(r => r === 'A').length === 1 ? 'A' : 'B'
      shouldTrigger = true
    }

    if (shouldTrigger) {
      let gain = 0; let winner = null
      if (finalRanks[0] === finalRanks[1]) { gain = 3; winner = finalRanks[0] }
      else if (finalRanks[0] === finalRanks[2]) { gain = 2; winner = finalRanks[0] }
      else if (finalRanks[0] === finalRanks[3]) { gain = settings.smallWinUpgrade ? 1 : 0; winner = finalRanks[0] }
      setPendingResult({ winner, gain, ranks: finalRanks })
    }
  }

  const confirmResult = () => {
    if (!pendingResult) return
    const { winner, gain, ranks } = pendingResult
    let newA = gameState.levelA; let newB = gameState.levelB
    let newFailA = gameState.failA; let newFailB = gameState.failB

    if (winner === 'A') {
      if (LEVELS[newA] === 'A') {
        if (gain > 0) { setGameWinner('A'); return }
        newFailA++
        if (settings.tripleFailPenalty && newFailA >= 3) { newA = 0; newFailA = 0 }
      } else newA = Math.min(newA + gain, LEVELS.length - 1)
    } else if (winner === 'B') {
      if (LEVELS[newB] === 'A') {
        if (gain > 0) { setGameWinner('B'); return }
        newFailB++
        if (settings.tripleFailPenalty && newFailB >= 3) { newB = 0; newFailB = 0 }
      } else newB = Math.min(newB + gain, LEVELS.length - 1)
    }

    setGameState(prev => ({
      ...prev, levelA: newA, levelB: newB, failA: newFailA, failB: newFailB,
      startTime: prev.startTime || Date.now(),
      history: [...prev.history, { winner, gain, ranks, prevLevelA: prev.levelA, prevLevelB: prev.levelB, time: Date.now() }]
    }))
    setCurrentRanks([null, null, null, null])
    setPendingResult(null)
  }

  const handleFullReset = () => {
    const preset = TEAM_PRESETS[settings.presetIndex]
    setGameState({ teamA: preset.a, teamB: preset.b, levelA: 0, levelB: 0, failA: 0, failB: 0, history: [], startTime: null })
    setCurrentRanks([null, null, null, null])
    setShowResetConfirm(false); setGameWinner(null)
  }

  const handleUndo = () => {
    if (gameState.history.length === 0) return
    const last = gameState.history[gameState.history.length - 1]
    setGameState(prev => ({
      ...prev,
      levelA: last.prevLevelA,
      levelB: last.prevLevelB,
      history: prev.history.slice(0, -1),
      startTime: prev.history.length === 1 ? null : prev.startTime
    }))
  }

  return (
    <div className={`h-[100dvh] flex flex-col transition-all duration-700 max-w-md mx-auto relative select-none overflow-hidden ${
      isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <PokerBackground isDark={isDark} />

      <header className="flex-shrink-0 z-20 p-4 pb-2 bg-transparent backdrop-blur-sm border-b border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xl ring-1 ring-white/10 ${isDark ? 'bg-indigo-500/20' : 'bg-slate-900'}`}>
              <Trophy size={18} className="text-yellow-400" />
            </div>
            <h1 className="text-lg font-black tracking-tighter italic">GUANDAN.</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={handleUndo} className={`p-2.5 rounded-2xl border active:scale-90 transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-slate-400' : 'bg-white/70 border-slate-200 text-slate-400'}`}>
              <Undo2 size={20} />
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className={`p-2.5 rounded-2xl border active:scale-90 transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-indigo-400' : 'bg-white/70 border-slate-200 text-indigo-600'}`}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border transition-all duration-500 font-mono text-xs font-black tracking-widest ${
            gameState.startTime ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105' : 'bg-slate-200/50 border-transparent text-slate-400'
          }`}>
            <Timer size={14} className={gameState.startTime ? 'animate-pulse' : ''} />
            {formatDuration(elapsedTime)}
          </div>
        </div>

        <div className={`rounded-[2.5rem] shadow-2xl p-6 relative overflow-hidden transition-all duration-500 border ${
          isDark ? 'bg-slate-900/80 border-white/5 shadow-indigo-500/10' : 'bg-white/90 border-white/50 shadow-indigo-900/5'
        }`}>
          <div className="flex justify-between items-center relative z-10">
            <div className="text-center flex-1">
              <IconA className={`mx-auto mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} size={24} />
              <div className={`text-[10px] font-black uppercase mb-1 opacity-60`}>{gameState.teamA}</div>
              <div className={`text-7xl font-black tracking-tighter leading-none ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{LEVELS[gameState.levelA]}</div>
            </div>
            <div className="w-px h-16 bg-slate-500/10 mx-2" />
            <div className="text-center flex-1">
              <IconB className={`mx-auto mb-2 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} size={24} />
              <div className={`text-[10px] font-black uppercase mb-1 opacity-60`}>{gameState.teamB}</div>
              <div className={`text-7xl font-black tracking-tighter leading-none ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>{LEVELS[gameState.levelB]}</div>
            </div>
          </div>
        </div>

        <div className={`mt-4 rounded-[2rem] p-4 space-y-3 transition-all duration-500 border ${
          isDark ? 'bg-indigo-950/30 border-indigo-800/50' : 'bg-white/70 border-white/40 shadow-sm'
        }`}>
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((idx) => {
              const isVisible = idx === 0 || (currentRanks[idx - 1] !== null && !pendingResult)
              if (!isVisible) return null
              return (
                <div key={idx} className="animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black italic ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-500 border border-indigo-100'}`}>{idx+1}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">第 {idx + 1} 名归属</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleRankSelect(idx, 'A')} className={`py-3 rounded-2xl font-black transition-all border-2 text-xs flex items-center justify-center gap-2 ${currentRanks[idx] === 'A' ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30' : 'bg-indigo-600 border-indigo-600 text-white shadow-lg') : (isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-white/80 border-slate-100 opacity-60')}`}>
                      <IconA size={14} /> {gameState.teamA}
                    </button>
                    <button onClick={() => handleRankSelect(idx, 'B')} className={`py-3 rounded-2xl font-black transition-all border-2 text-xs flex items-center justify-center gap-2 ${currentRanks[idx] === 'B' ? (isDark ? 'bg-gradient-to-r from-rose-500 to-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/30' : 'bg-rose-600 border-rose-600 text-white shadow-lg') : (isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-white/80 border-slate-100 opacity-60')}`}>
                      <IconB size={14} /> {gameState.teamB}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          {currentRanks[0] && (
            <button onClick={() => setCurrentRanks([null, null, null, null])} className="w-full text-[9px] font-black opacity-20 hover:opacity-100 transition-opacity uppercase tracking-widest">重置当前选择</button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide z-10">
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] px-2 opacity-30">历史记录</h3>
          <div className="space-y-3">
            {gameState.history.slice().reverse().map((h, i) => {
              const roundNum = gameState.history.length - i
              return (
                <div key={roundNum} className={`p-3 px-4 rounded-2xl border animate-in slide-in-from-bottom-2 duration-300 ${isDark ? 'bg-indigo-950/20 border-indigo-800/30' : 'bg-white/60 border-white/50 shadow-sm'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black italic border shrink-0 ${
                        isDark 
                          ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                          : 'bg-indigo-50 border-indigo-100 text-indigo-400'
                      }`}>
                        R{roundNum}
                      </span>
                      <span className={`text-sm font-black truncate ${h.winner === 'A' ? 'text-indigo-500' : 'text-rose-500'}`}>{h.winner === 'A' ? gameState.teamA : gameState.teamB} +{h.gain}级</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex gap-1">
                        {h.ranks.map((r, idx) => (
                          <div key={idx} className={`w-2 h-2 rounded-full ${r === 'A' ? 'bg-indigo-500' : 'bg-rose-500'} shadow-inner opacity-80`} />
                        ))}
                      </div>
                      <div className="text-[9px] font-bold opacity-30">{formatTime(h.time)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
            {gameState.history.length === 0 && (
              <div className="py-10 text-center opacity-20 text-xs font-black italic">尚无对局数据</div>
            )}
          </div>
        </div>
      </main>

      <footer className={`flex-shrink-0 py-4 px-6 border-t backdrop-blur-2xl transition-all duration-500 z-50 ${
        isDark ? 'bg-gradient-to-t from-indigo-900/80 to-slate-900/80 border-white/5 text-indigo-300 shadow-[0_-20px_40px_rgba(99,102,241,0.1)]' : 'bg-white/80 border-slate-200 text-slate-400'
      }`}>
        <div className="flex justify-between items-center max-w-md mx-auto">
          <a href="https://www.htpu.net" target="_blank" rel="noopener noreferrer" className="text-xs font-black italic tracking-tighter hover:opacity-70 transition-opacity">David 为你加油！</a>
          <div className="text-[10px] font-mono font-bold opacity-30">v{VERSION}</div>
        </div>
      </footer>

      {isSettingsOpen && (
        <div className={`fixed inset-0 z-[100] p-8 animate-in slide-in-from-bottom duration-500 flex flex-col ${isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 backdrop-blur-2xl' : 'bg-white/98 backdrop-blur-2xl'}`}>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black italic tracking-tighter">SETTINGS</h2>
            <button onClick={() => setIsSettingsOpen(false)} className="p-3 bg-slate-100 rounded-full text-slate-500"><X size={24}/></button>
          </div>
          <div className="space-y-8 flex-1 overflow-y-auto px-2 scrollbar-hide">
            <section>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-4">外观设置</label>
              <div className={`flex p-1 rounded-[1.5rem] ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                <button onClick={() => setSettings(s => ({...s, theme: 'auto'}))} className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-xs ${settings.theme === 'auto' ? 'bg-white shadow-md' : 'opacity-40'}`}>
                  <Smartphone size={14} /> 自动
                </button>
                <button onClick={() => setSettings(s => ({...s, theme: 'light'}))} className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-xs ${settings.theme === 'light' ? 'bg-white shadow-md' : 'opacity-40'}`}>
                  <Sun size={14} /> 浅色
                </button>
                <button onClick={() => setSettings(s => ({...s, theme: 'dark'}))} className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-xs ${settings.theme === 'dark' ? 'bg-slate-800 shadow-md text-white' : 'opacity-40'}`}>
                  <Moon size={14} /> 深色
                </button>
              </div>
            </section>
            <section>
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-4">队名方案</label>
              <div className="grid grid-cols-2 gap-3">
                {TEAM_PRESETS.map((p, idx) => {
                  const isSelected = settings.presetIndex === idx
                  const PreIconA = p.iconA
                  const PreIconB = p.iconB
                  return (
                    <button key={idx} onClick={() => { setSettings(s => ({...s, presetIndex: idx})); setGameState(g => ({...g, teamA: p.a, teamB: p.b})); }} className={`p-5 rounded-3xl border-2 text-left transition-all ${isSelected ? (isDark ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300' : 'border-indigo-500 bg-indigo-50 text-indigo-600') : (isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600')}`}>
                      <div className="flex gap-2 mb-2">
                        <PreIconA size={14} className="opacity-50" />
                        <PreIconB size={14} className="opacity-50" />
                      </div>
                      <div className="font-black text-sm">{p.a}</div>
                      <div className="text-[10px] font-bold opacity-30">vs {p.b}</div>
                    </button>
                  )
                })}
              </div>
            </section>
            <section className="pt-6 border-t border-slate-800">
              <button onClick={() => setShowGuide(true)} className="w-full p-5 bg-indigo-500/10 text-indigo-400 rounded-[2rem] font-black border border-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mb-3">
                <Trophy size={20} /> 掼蛋宝典
              </button>
              <button onClick={() => setShowResetConfirm(true)} className="w-full p-5 bg-red-500/10 text-red-500 rounded-[2rem] font-black border border-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                <RotateCcw size={20} /> 彻底清除重置
              </button>
            </section>
          </div>
        </div>
      )}

      {pendingResult && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`w-full max-w-xs rounded-[3.5rem] p-8 shadow-2xl text-center ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <AlertCircle size={32} className="mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-black mb-2 italic">确认结果？</h2>
            <div className={`rounded-3xl p-5 mb-6 border ${isDark ? 'bg-indigo-950/50 border-indigo-800' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`text-xl font-black ${pendingResult.winner === 'A' ? 'text-indigo-500' : 'text-rose-500'}`}>
                {pendingResult.winner === 'A' ? gameState.teamA : gameState.teamB} +{pendingResult.gain}级
              </div>
            </div>
            <button onClick={confirmResult} className={`w-full py-4 rounded-2xl text-white font-black shadow-lg mb-3 ${isDark ? 'bg-indigo-600' : 'bg-slate-900'}`}>确定提交</button>
            <button onClick={() => { setPendingResult(null); setCurrentRanks([null, null, null, null]); }} className="text-xs font-bold opacity-30 uppercase tracking-widest">取消修改</button>
          </div>
        </div>
      )}

      {gameWinner && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-indigo-600/98 backdrop-blur-3xl text-white animate-in zoom-in-50 duration-500 text-center">
          <div>
            <PartyPopper size={64} className="mx-auto mb-6 animate-bounce" />
            <h2 className="text-5xl font-black italic tracking-tighter mb-2">VICTORY!</h2>
            <p className="text-xl font-bold opacity-80 mb-10">{gameWinner === 'A' ? gameState.teamA : gameState.teamB} 成功过 A！</p>
            <button onClick={handleFullReset} className="px-10 py-5 bg-white text-indigo-600 rounded-full font-black shadow-2xl">开启新征程</button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in">
          <div className={`w-full max-w-xs rounded-[3rem] p-8 text-center ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <RotateCcw size={32} className="mx-auto mb-4 text-red-500" />
            <h3 className="text-2xl font-black mb-2">确定重置？</h3>
            <p className="text-xs opacity-40 mb-8">清空所有记录和计时，不可恢复。</p>
            <button onClick={handleFullReset} className="w-full py-4 rounded-2xl bg-red-600 text-white font-black mb-3">确认重置</button>
            <button onClick={() => setShowResetConfirm(false)} className="text-xs font-bold opacity-30 uppercase tracking-widest">取消</button>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in">
          <div className={`w-full max-w-md max-h-[80vh] rounded-[2rem] p-6 overflow-hidden flex flex-col ${isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-black italic ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>掼蛋宝典</h2>
              <button onClick={() => setShowGuide(false)} className={`p-2 rounded-full active:scale-90 transition-all ${isDark ? 'bg-indigo-950 text-indigo-400' : 'bg-slate-100 text-slate-500'}`}>
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {GUANDAN_TIPS.map((tip, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${isDark ? 'bg-indigo-950/30 border-indigo-800/50' : 'bg-slate-50 border-slate-100'}`}>
                  <div className={`text-sm font-black mb-1 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{tip.title}</div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tip.content}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowGuide(false)} className={`mt-4 w-full py-3 rounded-2xl font-black active:scale-95 transition-all ${isDark ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
