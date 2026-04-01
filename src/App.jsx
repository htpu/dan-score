import { useState, useEffect } from 'react'
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

const VERSION = '0.1.1'

const LEVELS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

const TEAM_PRESETS = [
  { a: '阿猫', b: '阿狗', iconA: Cat, iconB: Dog },
  { a: '蓝队', b: '红队', iconA: Shield, iconB: Swords },
  { a: '钢铁侠', b: '绿巨人', iconA: Zap, iconB: Dumbbell },
  { a: '男队', b: '女队', iconA: User, iconB: UserCircle }
]

const PokerBackground = ({ isDark }) => {
  const suits = [
    "M10 2C10 2 6.5 6 6.5 8.5C6.5 10.5 8 12 10 12S13.5 10.5 13.5 8.5C13.5 6 10 2 10 2Z",
    "M10 1L13.5 10L10 19L6.5 10Z",
    "M10 3C10 3 7 5 7 7.5C7 9.5 8 10 9 10.5C8 11 6.5 12 6.5 14C6.5 16 8 18 10 18S13.5 16 13.5 14C13.5 12 12 11 11 10.5C12 10 13 9.5 13 7.5C13 5 10 3 10 3Z",
    "M10 1C6 1 3 4 3 7.5C3 11.5 10 19 10 19S17 11.5 17 7.5C17 4 14 1 10 1Z"
  ]
  
  const [icons] = useState(() => 
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      path: suits[i % 4],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 60 + 50,
      rotate: Math.random() * 360
    }))
  )

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
            opacity: isDark ? 0.07 : 0.05
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

const VictoryConfetti = ({ count = 20 }) => {
  const [items] = useState(() => 
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotate: Math.random() * 360,
      delay: `${Math.random() * 2}s`,
      size: Math.random() * 40 + 20
    }))
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {items.map((item) => (
        <PartyPopper key={item.id} className="absolute animate-bounce" style={{
          top: item.top,
          left: item.left,
          transform: `rotate(${item.rotate}deg)`,
          animationDelay: item.delay
        }} size={item.size} />
      ))}
    </div>
  )
}

const GuandanGuide = ({ isDark }) => (
  <div className={`space-y-8 pb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
    <section>
      <h3 className={`text-xl font-black mb-4 flex items-center gap-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
        <span className="w-2 h-6 bg-current rounded-full" /> 一、 基础规则
      </h3>
      <div className="space-y-4 pl-4 border-l-2 border-slate-500/10">
        <div>
          <h4 className="font-bold text-sm mb-1 text-current opacity-80">1. 游戏准备</h4>
          <p className="text-sm leading-relaxed">4人结对比赛（A/C一组，B/D一组）。使用两副扑克牌共108张。目标是配合队友尽快出完手中牌。</p>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-1 text-current opacity-80">2. 牌级与主牌</h4>
          <p className="text-sm leading-relaxed">从打"2"开始逐级上升。当前等级为"级牌"。<span className="font-bold text-red-500">红心级牌</span>为"逢人配"，可代替除王外的任何牌。</p>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-1 text-current opacity-80">3. 牌序大小</h4>
          <p className="text-sm leading-relaxed italic">大王 {" > "} 小王 {" > "} 级牌(红心 {" > "} 其他) {" > "} A {" > "} K {" > "} Q {" > "} J {" > "} 10 {" > "} ... {" > "} 2。打A时，A为最大级牌。</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className={`text-xl font-black mb-4 flex items-center gap-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
        <span className="w-2 h-6 bg-current rounded-full" /> 二、 牌型说明
      </h3>
      <div className="space-y-4 pl-4 border-l-2 border-slate-500/10">
        <div>
          <h4 className="font-bold text-sm mb-1 text-current opacity-80">1. 普通牌型</h4>
          <ul className="text-sm list-disc list-inside space-y-1 opacity-90">
            <li>单张、对子、三张、三带二</li>
            <li>顺子：5张连续单张（最大到A）</li>
            <li>连对：3组连续对子；钢板：2个连续三张</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-1 text-current opacity-80">2. 炸弹（无视普通牌型）</h4>
          <p className="text-sm leading-relaxed mb-2">大小排序：天王炸(4王) {" > "} 8张炸 {" > "} ... {" > "} 同花顺(5张同花色顺子) {" > "} 5张炸 {" > "} 4张炸。</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className={`text-xl font-black mb-4 flex items-center gap-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
        <span className="w-2 h-6 bg-current rounded-full" /> 三、 游戏流程
      </h3>
      <div className="space-y-4 pl-4 border-l-2 border-slate-500/10">
        <div>
          <h4 className="font-bold text-sm mb-1 text-current opacity-80">1. 升级规则</h4>
          <p className="text-sm leading-relaxed">双上(1&2名)升3级；单上(1&3名)升2级；(1&4名)升1级。仅头游方升级。</p>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-1 text-current opacity-80">2. 进贡与还贡</h4>
          <p className="text-sm leading-relaxed">下一局末游向头游进贡最大牌，头游还贡一张小牌。抓到两个大王则抗贡。</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className={`text-xl font-black mb-4 flex items-center gap-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
        <span className="w-2 h-6 bg-current rounded-full" /> 四、 实战进阶技巧
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {[
          { t: '深度记牌', c: '记4张大王和3张非红心级牌。分析断张判断炸弹，关注5和10。' },
          { t: '进贡博弈', c: '进贡对A中的一张优于孤立K。还贡宜送5以下废牌。' },
          { t: '角色定位', c: '主攻手冲头游；助攻手消耗大牌，通过"跳牌"将牌权送回队友。' },
          { t: '牌路转换', c: '跨牌型切换强迫对手拆牌。利用"空门"判断弱点持续施压。' },
          { t: '非言语信号', c: '观察队友跳牌深意与对手犹豫时机，判断牌力分布。' },
          { t: '打A局战术', c: '防守重于进攻。红心A是控制最后单张的杀手锏。' }
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-slate-50 border-slate-100'}`}>
            <div className="font-black text-xs mb-1 opacity-80">{item.t}</div>
            <p className="text-xs leading-relaxed opacity-70">{item.c}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h3 className={`text-xl font-black mb-4 flex items-center gap-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
        <span className="w-2 h-6 bg-current rounded-full" /> 五、 金句与口诀
      </h3>
      <div className={`p-6 rounded-card italic font-medium text-sm leading-loose border-2 border-dashed ${isDark ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-indigo-100 bg-indigo-50/30 text-indigo-900/70'}`}>
        "记牌是基础，配合是灵魂，炸弹是核武，运气是点缀。"<br/>
        "上家不放，下家不追，对家不拦，自己不慌。"<br/>
        "队友要过莫要拦，对手要过重重关。"
      </div>
    </section>
  </div>
)

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
      history: [...prev.history, { winner, gain, ranks, prevLevelA: prev.levelA, prevLevelB: prev.levelB, prevFailA: prev.failA, prevFailB: prev.failB, time: Date.now() }]
    }))
    setCurrentRanks([null, null, null, null])
    setPendingResult(null)
  }

  const handleFullReset = () => {
    const preset = TEAM_PRESETS[settings.presetIndex]
    setGameState({ 
      teamA: preset.a, 
      teamB: preset.b, 
      levelA: 0, 
      levelB: 0, 
      failA: 0, 
      failB: 0, 
      history: [], 
      startTime: null 
    })
    setCurrentRanks([null, null, null, null])
    setPendingResult(null)
    setElapsedTime(0)
    setGameWinner(null)
    setShowResetConfirm(false)
  }

  const handleUndo = () => {
    if (gameState.history.length === 0) return
    const last = gameState.history[gameState.history.length - 1]
    setGameState(prev => ({
      ...prev,
      levelA: last.prevLevelA,
      levelB: last.prevLevelB,
      failA: last.prevFailA ?? prev.failA,
      failB: last.prevFailB ?? prev.failB,
      history: prev.history.slice(0, -1),
      startTime: prev.history.length === 1 ? null : prev.startTime
    }))
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 relative select-none overflow-hidden ${
      isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <PokerBackground isDark={isDark} />

      <main className="flex-1 flex flex-col max-w-screen-2xl mx-auto w-full relative z-10 lg:p-6 p-4 overflow-hidden">
        <header className="flex-shrink-0 z-20 mb-4 lg:mb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shadow-xl ring-1 ring-white/10 ${isDark ? 'bg-indigo-500/20' : 'bg-slate-900'}`}>
                  <Trophy size={20} className="text-yellow-400" />
                </div>
                <h1 className="text-xl lg:text-2xl font-black tracking-tighter italic">GUANDAN.</h1>
              </div>
              
              <div className={`hidden sm:flex px-4 py-2 rounded-full items-center gap-2 border transition-all duration-500 font-mono text-xs font-black tracking-widest ${
                gameState.startTime 
                  ? (isDark ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-indigo-600 shadow-md') 
                  : (isDark ? 'bg-slate-200/10 border-transparent text-slate-500' : 'bg-slate-200/50 border-transparent text-slate-400')
              }`}>
                <Timer size={16} className={gameState.startTime ? 'animate-pulse' : ''} />
                {formatDuration(elapsedTime)}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleUndo} aria-label="撤销" className={`p-2.5 lg:p-3 rounded-2xl border active:scale-90 transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-slate-400' : 'bg-white/70 border-slate-200 text-slate-400'}`}>
                <Undo2 size={20} />
              </button>
              <button onClick={() => setIsSettingsOpen(true)} aria-label="设置" className={`p-2.5 lg:p-3 rounded-2xl border active:scale-90 transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-indigo-400' : 'bg-white/70 border-slate-200 text-indigo-600'}`}>
                <Settings size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-3 sm:hidden">
            <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border transition-all duration-500 font-mono text-xs font-black tracking-widest ${
              gameState.startTime 
                ? (isDark ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-indigo-600 shadow-md') 
                : (isDark ? 'bg-slate-200/10 border-transparent text-slate-500' : 'bg-slate-200/50 border-transparent text-slate-400')
            }`}>
              <Timer size={14} className={gameState.startTime ? 'animate-pulse' : ''} />
              {formatDuration(elapsedTime)}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 overflow-hidden">
          {/* Left Side: Score and Entry */}
          <div className="lg:w-1/2 flex flex-col gap-4 lg:gap-5 overflow-y-auto scrollbar-hide pb-4">
            <div className={`rounded-modal shadow-2xl p-5 lg:p-6 relative overflow-hidden transition-all duration-500 border flex-shrink-0 ${
              isDark ? 'bg-slate-900/80 border-white/5 shadow-indigo-500/10' : 'bg-white/90 border-white/50 shadow-indigo-900/5'
            }`}>
              <div className="flex justify-between items-center relative z-10">
                <div className="text-center flex-1">
                  <IconA className={`mx-auto mb-2 w-6 h-6 lg:w-7 lg:h-7 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <div className={`text-[10px] font-black uppercase mb-1 opacity-60 tracking-wider`}>{gameState.teamA}</div>
                  <div className={`text-7xl font-black tracking-tighter leading-none ${LEVELS[gameState.levelA] === 'A' ? 'animate-pulse' : ''} ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{LEVELS[gameState.levelA]}</div>
                  {LEVELS[gameState.levelA] === 'A' && settings.tripleFailPenalty && (
                    <div className={`text-[10px] font-bold mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>冲A · 失败 {gameState.failA}/3</div>
                  )}
                </div>
                <div className="w-px h-14 lg:h-16 bg-slate-500/10 mx-2 lg:mx-4" />
                <div className="text-center flex-1">
                  <IconB className={`mx-auto mb-2 w-6 h-6 lg:w-7 lg:h-7 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
                  <div className={`text-[10px] font-black uppercase mb-1 opacity-60 tracking-wider`}>{gameState.teamB}</div>
                  <div className={`text-7xl font-black tracking-tighter leading-none ${LEVELS[gameState.levelB] === 'A' ? 'animate-pulse' : ''} ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>{LEVELS[gameState.levelB]}</div>
                  {LEVELS[gameState.levelB] === 'A' && settings.tripleFailPenalty && (
                    <div className={`text-[10px] font-bold mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>冲A · 失败 {gameState.failB}/3</div>
                  )}
                </div>
              </div>
            </div>

            <div className={`rounded-card p-4 lg:p-5 space-y-3 transition-all duration-500 border flex-shrink-0 ${
              isDark ? 'bg-indigo-950/30 border-indigo-800/50' : 'bg-white/70 border-white/40 shadow-sm'
            }`}>
              <div className="flex flex-col gap-3">
                {[0, 1, 2, 3].map((idx) => {
                  const isVisible = idx === 0 || (currentRanks[idx - 1] !== null && !pendingResult)
                  if (!isVisible) return null
                  return (
                    <div key={idx} className="animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black italic ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-500 border border-indigo-100'}`}>{idx+1}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">第 {idx + 1} 名归属</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleRankSelect(idx, 'A')} className={`py-3.5 lg:py-3 rounded-xl font-black transition-all border-2 text-xs flex items-center justify-center gap-2 ${currentRanks[idx] === 'A' ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30' : 'bg-indigo-600 border-indigo-600 text-white shadow-lg') : (isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-white/80 border-slate-100 opacity-60')}`}>
                          <IconA className="w-4 h-4" /> {gameState.teamA}
                        </button>
                        <button onClick={() => handleRankSelect(idx, 'B')} className={`py-3.5 lg:py-3 rounded-xl font-black transition-all border-2 text-xs flex items-center justify-center gap-2 ${currentRanks[idx] === 'B' ? (isDark ? 'bg-gradient-to-r from-rose-500 to-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/30' : 'bg-rose-600 border-rose-600 text-white shadow-lg') : (isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-white/80 border-slate-100 opacity-60')}`}>
                          <IconB className="w-4 h-4" /> {gameState.teamB}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              {pendingResult && (
                <div className={`text-center py-2 px-4 rounded-xl text-sm font-black animate-in fade-in duration-300 ${
                  isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {pendingResult.winner === 'A' ? gameState.teamA : gameState.teamB}
                  {' '}
                  {pendingResult.gain === 3 ? '双上' : pendingResult.gain === 2 ? '单上' : pendingResult.gain === 1 ? '险胜' : '未升级'}
                  {' +'}
                  {pendingResult.gain}级
                </div>
              )}
              {currentRanks[0] && (
                <button onClick={() => setCurrentRanks([null, null, null, null])} aria-label="重置选择" className="w-full py-2 text-xs font-black opacity-50 hover:opacity-100 transition-opacity uppercase tracking-widest">重置当前选择</button>
              )}
            </div>
          </div>

          {/* Right Side: History */}
          <div className="lg:w-1/2 flex flex-col overflow-hidden min-h-0">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] px-2 mb-4 opacity-50 flex-shrink-0">历史记录</h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide pb-20 lg:pb-4">
              {gameState.history.slice().reverse().map((h, i) => {
                const roundNum = gameState.history.length - i
                return (
                  <div key={roundNum} className={`p-4 px-6 rounded-card border animate-in slide-in-from-bottom-2 duration-300 ${isDark ? 'bg-indigo-950/20 border-indigo-800/30' : 'bg-white/60 border-white/50 shadow-sm'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black italic border shrink-0 ${
                          isDark 
                            ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                            : 'bg-indigo-50 border-indigo-100 text-indigo-400'
                        }`}>
                          R{roundNum}
                        </span>
                        <span className={`text-base font-black truncate ${h.winner === 'A' ? 'text-indigo-500' : 'text-rose-500'}`}>{h.winner === 'A' ? gameState.teamA : gameState.teamB} +{h.gain}级</span>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="flex gap-1.5 w-[60px] justify-center">
                          {h.ranks.map((r, idx) => (
                            <div key={idx} className={`w-2.5 h-2.5 rounded-full ${r === 'A' ? 'bg-indigo-500' : 'bg-rose-500'} shadow-inner opacity-80`} />
                          ))}
                        </div>
                        <div className="text-[10px] font-mono font-bold opacity-40 w-16 text-right">{formatTime(h.time)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {gameState.history.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-40 gap-4">
                  <Clock size={48} strokeWidth={1} />
                  <div className="text-sm font-black italic">尚无对局数据</div>
                  <div className="text-xs opacity-60">选择每局名次来记录比分</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className={`flex-shrink-0 py-6 px-6 mt-auto border-t lg:border-none backdrop-blur-2xl lg:backdrop-blur-0 transition-all duration-500 z-50 ${
          isDark ? 'lg:text-slate-500 border-white/5 text-indigo-300' : 'lg:text-slate-400 border-slate-200 text-slate-400'
        }`}>
          <div className="flex justify-between items-center w-full">
            <a href="https://www.htpu.net" target="_blank" rel="noopener noreferrer" className="text-xs font-black italic tracking-tighter hover:opacity-70 transition-opacity">David 为你加油！</a>
            <div className="text-[10px] font-mono font-bold opacity-40 uppercase tracking-tighter">Guandan Scorer v{VERSION}</div>
          </div>
        </footer>
      </main>

      {isSettingsOpen && (
        <div className={`fixed inset-0 z-[100] p-4 lg:p-12 animate-in fade-in duration-500 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm`}>
          <div className={`w-full max-w-2xl h-full lg:h-auto lg:max-h-[85vh] rounded-modal p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-500 flex flex-col shadow-2xl relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/10' : 'bg-white/98'}`}>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black italic tracking-tighter">设置</h2>
              <button onClick={() => setIsSettingsOpen(false)} aria-label="关闭" className={`p-3 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><X size={24}/></button>
            </div>
            <div className="space-y-10 flex-1 overflow-y-auto px-2 scrollbar-hide">
              <section>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-5">外观设置</label>
                <div className={`flex p-1.5 rounded-card ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                  {[
                    { id: 'auto', icon: Smartphone, label: '自动' },
                    { id: 'light', icon: Sun, label: '浅色' },
                    { id: 'dark', icon: Moon, label: '深色' }
                  ].map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => setSettings(s => ({...s, theme: t.id}))} 
                      className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs transition-all ${
                        settings.theme === t.id 
                          ? (isDark ? 'bg-slate-800 shadow-xl text-white' : 'bg-white shadow-md text-indigo-600 border border-slate-200') 
                          : 'opacity-40 hover:opacity-100'
                      }`}
                    >
                      <t.icon size={16} /> {t.label}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-5">队名方案</label>
                <div className="grid grid-cols-2 gap-4">
                  {TEAM_PRESETS.map((p, idx) => {
                    const isSelected = settings.presetIndex === idx
                    const PreIconA = p.iconA
                    const PreIconB = p.iconB
                    return (
                      <button 
                        key={idx} 
                        onClick={() => { setSettings(s => ({...s, presetIndex: idx})); setGameState(g => ({...g, teamA: p.a, teamB: p.b})); }} 
                        className={`p-6 rounded-modal border-2 text-left transition-all relative overflow-hidden group ${
                          isSelected 
                            ? (isDark ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300' : 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm') 
                            : (isDark ? 'border-slate-800 hover:border-slate-700 text-slate-400' : 'border-slate-200 hover:border-slate-300 text-slate-500 bg-white/50')
                        }`}
                      >
                        <div className="flex gap-2 mb-3">
                          <PreIconA size={16} className="opacity-40" />
                          <PreIconB size={16} className="opacity-40" />
                        </div>
                        <div className="font-black text-base">{p.a}</div>
                        <div className="text-[11px] font-bold opacity-50">vs {p.b}</div>
                        {isSelected && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-current animate-pulse" />}
                      </button>
                    )
                  })}
                </div>
              </section>
              <section className="pt-8 border-t border-slate-500/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setShowGuide(true)} className={`p-6 rounded-modal font-black border active:scale-95 transition-all flex items-center justify-center gap-3 ${
                  isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                }`}>
                  <Trophy size={22} /> 掼蛋宝典
                </button>
                <button onClick={() => setShowResetConfirm(true)} className={`p-6 rounded-modal font-black border active:scale-95 transition-all flex items-center justify-center gap-3 ${
                  isDark ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  <RotateCcw size={22} /> 彻底清除重置
                </button>
              </section>
            </div>
          </div>
        </div>
      )}

      {pendingResult && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`w-full max-w-sm rounded-modal p-10 shadow-2xl text-center animate-in zoom-in-95 duration-300 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <AlertCircle size={48} className="mx-auto mb-6 text-yellow-500" />
            <h2 className="text-3xl font-black mb-3 italic">确认结果？</h2>
            <div className={`rounded-card p-8 mb-8 border ${isDark ? 'bg-indigo-950/50 border-indigo-800' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`text-2xl font-black ${pendingResult.winner === 'A' ? 'text-indigo-500' : 'text-rose-500'}`}>
                {pendingResult.winner === 'A' ? gameState.teamA : gameState.teamB} +{pendingResult.gain}级
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={confirmResult} className={`w-full py-5 rounded-2xl text-white font-black shadow-lg text-lg transition-transform active:scale-95 ${isDark ? 'bg-indigo-600' : 'bg-slate-900'}`}>确定提交</button>
              <button onClick={() => { setPendingResult(null); setCurrentRanks([null, null, null, null]); }} className="py-2 text-xs font-bold opacity-50 uppercase tracking-[0.2em] hover:opacity-100 transition-opacity">取消修改</button>
            </div>
          </div>
        </div>
      )}

      {gameWinner && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-indigo-600/98 backdrop-blur-3xl text-white animate-in zoom-in-50 duration-700 text-center overflow-hidden">
          <VictoryConfetti />
          <div className="relative z-10">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl ring-8 ring-white/10 animate-pulse">
              <Trophy size={64} className="text-yellow-400" />
            </div>
            <h2 className="text-6xl lg:text-8xl font-black italic tracking-tighter mb-4 animate-in slide-in-from-bottom-4 duration-1000">VICTORY!</h2>
            <p className="text-2xl lg:text-3xl font-bold opacity-90 mb-12">{gameWinner === 'A' ? gameState.teamA : gameState.teamB} 成功过 A！</p>
            <button onClick={handleFullReset} className="px-16 py-6 bg-white text-indigo-600 rounded-modal font-black shadow-[0_20px_50px_rgba(255,255,255,0.3)] text-xl active:scale-95 transition-all">开启新征程</button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in">
          <div className={`w-full max-w-sm rounded-modal p-10 text-center animate-in zoom-in-95 duration-300 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCcw size={40} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-black mb-3">确定重置？</h2>
            <p className="text-sm opacity-40 mb-10 px-4">清空所有记录和计时，不可恢复。请谨慎操作。</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleFullReset} className="w-full py-5 rounded-2xl bg-red-600 text-white font-black text-lg shadow-lg active:scale-95 transition-all">确认重置</button>
              <button onClick={() => setShowResetConfirm(false)} className="py-2 text-xs font-bold opacity-50 uppercase tracking-[0.2em] hover:opacity-100 transition-opacity">点错了，返回</button>
            </div>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 lg:p-12 bg-black/90 backdrop-blur-2xl animate-in fade-in">
          <div className={`w-full max-w-3xl max-h-[85vh] rounded-modal p-8 lg:p-10 overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-500 ${isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Trophy size={28} className="text-yellow-400" />
                <h2 className={`text-2xl font-black italic tracking-tight ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>掼蛋宝典</h2>
              </div>
              <button onClick={() => setShowGuide(false)} aria-label="关闭" className={`p-3 rounded-full active:scale-90 transition-all ${isDark ? 'bg-indigo-950 text-indigo-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
              <GuandanGuide isDark={isDark} />
            </div>
            <button onClick={() => setShowGuide(false)} className={`mt-8 w-full py-5 rounded-card font-black text-lg active:scale-95 transition-all shadow-xl ${isDark ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
              掌握精髓，开局！
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
