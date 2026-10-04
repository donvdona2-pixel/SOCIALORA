import { useEffect, useMemo, useState } from 'react'

import { supabase } from './supabase'



const NAV = [

  ['dashboard','◈','Dashboard'],

  ['growth','↗','Growth Center'],

  ['studio','✦','AI Studio'],

  ['content','▦','Content Planner'],

  ['inbox','✉','Inbox'],

  ['analytics','⌁','Analytics'],

  ['points','◆','SOCIALORA Points'],

  ['accounts','◎','Accounts'],

  ['settings','⚙','Settings'],

]



function App() {

  const [page, setPage] = useState('dashboard')

  const [session, setSession] = useState(null)

  const [ready, setReady] = useState(false)

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [authMessage, setAuthMessage] = useState('')

  const [region, setRegion] = useState('IL')

  const [metaMessage, setMetaMessage] = useState('')

  const [metaConnection, setMetaConnection] = useState(null)

  const [metaLoading, setMetaLoading] = useState(false)



  useEffect(() => {

    supabase.auth.getSession().then(({ data }) => {

      setSession(data.session)

      setReady(true)

    })



    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {

      setSession(next)

      setReady(true)

    })



    return () => subscription.unsubscribe()

  }, [])



  useEffect(() => {

    if (!session?.user?.id) {

      setMetaConnection(null)

      return

    }



    let cancelled = false

    const storageKey = `socialora_meta_connected:${session.user.id}`



    const loadMetaConnection = async () => {

      setMetaLoading(true)



      const params = new URLSearchParams(window.location.search)

      const oauthStatus = params.get('meta')

      const oauthReason = params.get('reason')

      const rememberedConnected = window.localStorage.getItem(storageKey) === '1'



      if (oauthStatus === 'connected') {

        setPage('accounts')

        setMetaMessage('Meta התחבר בהצלחה ✅')

        window.localStorage.setItem(storageKey, '1')

      } else if (oauthStatus === 'error') {

        setPage('accounts')

        setMetaMessage(`חיבור Meta נכשל${oauthReason ? `: ${oauthReason}` : ''}`)

      }



      const { data, error } = await supabase.functions.invoke(
        'meta-status',
        { method: 'GET' }
      )

      if (cancelled) return

      if (!error && data?.ok) {
        if (data.connected && data.connection) {
          setMetaConnection(data.connection)
          window.localStorage.setItem(storageKey, '1')
        } else {
          setMetaConnection(null)
          window.localStorage.removeItem(storageKey)
        }
      } else if (oauthStatus === 'connected' || rememberedConnected) {
        setMetaConnection({
          meta_name: 'Meta account',
          meta_user_id: null,
          connected_at: null,
          localFallback: true,
        })
      } else {
        setMetaConnection(null)

        console.error(
          'SOCIALORA meta-status failed:',
          error || data
        )
      }

      setMetaLoading(false)



      if (oauthStatus) {

        params.delete('meta')

        params.delete('reason')

        const query = params.toString()

        const cleanUrl =

          window.location.pathname +

          (query ? `?${query}` : '') +

          window.location.hash



        window.history.replaceState({}, '', cleanUrl)

      }

    }



    loadMetaConnection()



    return () => {

      cancelled = true

    }

  }, [session?.user?.id])



  const title = useMemo(() => NAV.find(([id]) => id === page)?.[2] || 'Dashboard', [page])



  const signIn = async (e) => {

    e.preventDefault()

    setAuthMessage('מתחבר...')

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    setAuthMessage(error ? error.message : 'התחברת בהצלחה')

  }



  const connectMeta = async () => {

    setMetaMessage('פותח חיבור מאובטח ל-Meta...')

    const { data, error } = await supabase.functions.invoke('meta-oauth-start', { method: 'POST' })

    if (error) return setMetaMessage(error.message)

    const url = data?.authorizationUrl || data?.authUrl || data?.url

    if (url) window.location.assign(url)

    else setMetaMessage('השרת ענה, אבל צריך להתאים את תשובת meta-oauth-start ל-URL.')

  }



  if (!ready) return <div className="loading"><div>S</div><b>SOCIALORA</b><span>Loading...</span></div>



  if (!session) {

    return (

      <main className="login">

        <section className="login-brand">

          <div className="logo">S</div>

          <p className="eyebrow">SOCIAL MEDIA COMMAND CENTER</p>

          <h1>Turn attention into <span>real growth.</span></h1>

          <p>AI, תוכן, אנליטיקה, הודעות ותוכנית צמיחה — במקום אחד.</p>

          <div className="features">

            <div><b>01</b> AI Growth Plan</div><div><b>02</b> Unified Inbox</div>

            <div><b>03</b> Content Engine</div><div><b>04</b> Smart Analytics</div>

          </div>

        </section>

        <form className="login-card card" onSubmit={signIn}>

          <p className="eyebrow">WELCOME BACK</p>

          <h2>כניסה ל-SOCIALORA</h2>

          <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>

          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>

          <button className="primary">כניסה למערכת</button>

          {authMessage && <div className="message">{authMessage}</div>}

        </form>

      </main>

    )

  }



  const Dashboard = () => (

    <>

      <section className="hero card">

        <div>

          <div className="demo">{metaConnection ? 'META CONNECTED · נתוני הביצועים עדיין DEMO' : 'DEMO DATA · עד חיבור הרשתות'}</div>

          <p className="eyebrow">TODAY'S GROWTH MISSION</p>

          <h2>לא מעלים סתם תוכן. <span>בונים מומנטום.</span></h2>

          <p>המערכת מרכזת מה כדאי לעשות היום כדי לשפר חשיפה, מעורבות, שיחות ולידים.</p>

          <div className="actions">

            <button className="primary" onClick={()=>setPage('growth')}>פתח תוכנית צמיחה</button>

            <button className="secondary" onClick={()=>setPage('studio')}>✦ צור תוכן עם AI</button>

          </div>

        </div>

        <div className="score"><b>82</b><small>/100<br/>Growth Score</small></div>

      </section>



      <section className="stats">

        {[

          ['◉','12,480','Total Followers','+8.4%'],

          ['♡','6.8%','Engagement','+1.2%'],

          ['✉','184','New Conversations','+14%'],

          ['◆','1,280','SOCIALORA Points','+240'],

        ].map(([i,v,l,d])=><article className="card stat" key={l}><div><span>{i}</span><em>{d}</em></div><b>{v}</b><small>{l}</small></article>)}

      </section>



      <section className="two">

        <article className="card panel">

          <header><div><p className="eyebrow">AI PRIORITIES</p><h3>3 פעולות שכדאי לבצע עכשיו</h3></div><i>AI READY</i></header>

          <div className="tasks">

            <button onClick={()=>setPage('studio')}><span>01</span><div><b>צור Reel קצר לערב</b><small>Hook חזק + מסר אחד + CTA</small></div><em>+80 pts</em></button>

            <button onClick={()=>setPage('inbox')}><span>02</span><div><b>ענה לשיחות פתוחות</b><small>כל ההודעות במקום אחד</small></div><em>+45 pts</em></button>

            <button onClick={()=>setPage('analytics')}><span>03</span><div><b>זהה את הפורמט המוביל</b><small>שמירות, שיתופים, צפייה ותגובות</small></div><em>+60 pts</em></button>

          </div>

        </article>

        <article className="card panel">

          <header><div><p className="eyebrow">MOMENTUM</p><h3>7 ימים אחרונים</h3></div><strong>+23.6%</strong></header>

          <div className="bars">{[34,48,39,62,58,78,91].map((h,i)=><div key={i}><span style={{height:`${h}%`}} /></div>)}</div>

        </article>

      </section>

    </>

  )



  const Growth = () => (

    <section className="stack">

      <div className="intro"><p className="eyebrow">GROWTH CENTER</p><h2>נתונים שהופכים ל-<span>פעולות.</span></h2><p>יעדים, ניסויים ושגרת עבודה שמכוונים לצמיחה אמיתית.</p></div>

      <div className="three">

        <article className="card panel"><h3>יעד 90 יום</h3><b className="huge">25,000 Followers</b><div className="progress"><span style={{width:'42%'}} /></div><small>42% מהיעד</small></article>

        <article className="card panel"><p className="eyebrow">NEXT EXPERIMENT</p><h3>Hook A/B Test</h3><p>השווה שתי פתיחות לאותו Reel.</p><button className="primary small">צור ניסוי</button></article>

        <article className="card panel"><p className="eyebrow">COMMUNITY SIGNAL</p><h3>תגובות עולות ↑</h3><p>נזהה מה גורם לקהל האמיתי להגיב ולשתף.</p><b className="green">+31%</b></article>

      </div>

    </section>

  )



  const Studio = () => (

    <section className="studio">

      <article className="card panel">

        <p className="eyebrow">SOCIALORA AI STUDIO</p><h2>מרעיון לפוסט מוכן.</h2>

        <p>כאן נחבר AI אמיתי ל-Hooks, Reels, Captions, Carousels ו-A/B tests.</p>

        <textarea placeholder="תאר את העסק או התוכן שאתה רוצה ליצור..." />

        <div className="chips">{['Reel Script','Caption','Carousel','Story','Ad Copy'].map(x=><button key={x}>{x}</button>)}</div>

        <button className="primary">✦ Generate with SOCIALORA AI</button>

      </article>

      <aside className="card panel brief"><p className="eyebrow">SMART BRIEF</p><div><span>Market</span><b>{region==='IL'?'Israel 🇮🇱':'Global 🌍'}</b></div><div><span>Goal</span><b>Growth</b></div><div><span>Language</span><b>Hebrew</b></div></aside>

    </section>

  )



  const Content = () => (

    <section className="stack">

      <div className="intro"><p className="eyebrow">CONTENT PLANNER</p><h2>שבוע שלם. <span>במבט אחד.</span></h2></div>

      <div className="calendar card">{['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'].map((d,i)=><div key={d}><b>{d}</b><strong>{12+i}</strong>{i===0&&<span>19:30 · Reel</span>}{i===2&&<span>12:15 · Carousel</span>}{i===4&&<span>18:45 · Story</span>}</div>)}</div>

    </section>

  )



  const Inbox = () => (

    <section className="inbox card"><aside><div className="search">⌕ חיפוש שיחה</div><div className="empty"><b>✉</b><strong>{metaConnection ? 'Meta מחובר' : 'אין עדיין שיחות Live'}</strong><p>{metaConnection ? 'החיבור פעיל. השלב הבא הוא סנכרון הודעות ו-Webhooks.' : 'שיחות אמיתיות יופיעו לאחר חיבור Meta.'}</p></div></aside><main><div className="empty"><b>💬</b><h3>Unified Inbox</h3><p>Facebook ו-Instagram במקום אחד.</p>{metaConnection ? <b className="green">● META CONNECTED</b> : <button className="primary" onClick={()=>setPage('accounts')}>חבר חשבון</button>}</div></main></section>

  )



  const Analytics = () => (

    <section className="stack">

      <div className="demo">DEMO DATA · יחובר לנתונים אמיתיים</div>

      <section className="stats">

        {[

          ['↗','84.2K','Reach','+18%'],['◉','9,304','Profile visits','+11%'],['♡','5,680','Interactions','+24%'],['✦','91','Content score','+7']

        ].map(([i,v,l,d])=><article className="card stat" key={l}><div><span>{i}</span><em>{d}</em></div><b>{v}</b><small>{l}</small></article>)}

      </section>

      <article className="card panel"><p className="eyebrow">PERFORMANCE</p><h3>Reach & engagement</h3><div className="bars large">{[22,28,24,36,31,44,52,48,61,56,73,68,82,76,91].map((h,i)=><div key={i}><span style={{height:`${h}%`}} /></div>)}</div></article>

    </section>

  )



  const Points = () => (

    <section className="stack">

      <article className="points card"><div><p className="eyebrow">SOCIALORA POINTS</p><h2>1,280 <span>◆</span></h2><p>צוברים נקודות על פעולות אמיתיות ומשתמשים בהן ל-AI, תבניות ואנליטיקה.</p></div><div className="level"><small>LEVEL</small><b>07</b><span>Creator Pro</span></div></article>

      <div className="rewards">{[['✦','100 AI Credits','600 pts'],['▦','Premium Templates','450 pts'],['⌁','Analytics Week','800 pts'],['◎','Creator Match','950 pts']].map(([i,t,c])=><article className="card reward" key={t}><b>{i}</b><h3>{t}</h3><button>{c}</button></article>)}</div>

    </section>

  )



  const Accounts = () => (

    <section className="stack">

      <article className="connect card"><div className="meta">∞</div><div><p className="eyebrow">META CONNECTION</p><h2>Facebook + Instagram</h2><p>OAuth מאובטח — בלי לבקש ממך סיסמת Facebook.</p></div><button className="primary" onClick={connectMeta}>{metaConnection ? 'Reconnect Meta' : 'Connect Meta'}</button></article>

      {metaMessage && <div className="message">{metaMessage}</div>}

      {metaLoading ? (

        <article className="card panel empty"><b>◎</b><h3>בודק את חיבור Meta...</h3></article>

      ) : metaConnection ? (

        <article className="card panel">

          <p className="eyebrow">LIVE CONNECTION</p>

          <h2>{metaConnection.meta_name || 'Meta account'}</h2>

          <b className="green">● CONNECTED</b>

          {metaConnection.meta_user_id && <p>Meta ID: {metaConnection.meta_user_id}</p>}

          {metaConnection.connected_at && <small>Connected: {new Date(metaConnection.connected_at).toLocaleString()}</small>}

          {metaConnection.localFallback && <p>OAuth אושר ונשמר. פרטי החשבון המלאים יופיעו אחרי שנאפשר קריאת סטטוס מאובטחת מהשרת.</p>}

        </article>

      ) : (

        <article className="card panel empty"><b>◎</b><h3>עדיין אין חשבון מחובר</h3><p>לאחר OAuth מוצלח יוצגו כאן החשבונות האמיתיים.</p></article>

      )}

    </section>

  )



  const Settings = () => (

    <section className="three">

      <article className="card panel"><p className="eyebrow">ACCOUNT</p><h3>{session.user.email}</h3><button className="secondary" onClick={()=>supabase.auth.signOut()}>Sign out</button></article>

      <article className="card panel"><p className="eyebrow">REGION</p><h3>Target market</h3><div className="segmented"><button className={region==='IL'?'active':''} onClick={()=>setRegion('IL')}>🇮🇱 Israel</button><button className={region==='GLOBAL'?'active':''} onClick={()=>setRegion('GLOBAL')}>🌍 Global</button></div></article>

      <article className="card panel"><p className="eyebrow">SECURITY</p><h3>Supabase Session</h3><b className="green">● Authenticated</b></article>

    </section>

  )



  const render = () => ({dashboard:<Dashboard/>,growth:<Growth/>,studio:<Studio/>,content:<Content/>,inbox:<Inbox/>,analytics:<Analytics/>,points:<Points/>,accounts:<Accounts/>,settings:<Settings/>}[page])



  return (

    <div className="shell">

      <aside className="sidebar">

        <div className="brand"><div>S</div><span><b>SOCIALORA</b><small>COMMAND CENTER</small></span></div>

        <nav>{NAV.map(([id,icon,label])=><button className={page===id?'active':''} key={id} onClick={()=>setPage(id)}><span>{icon}</span><b>{label}</b></button>)}</nav>

        <div className="user"><div>{session.user.email?.[0]?.toUpperCase()}</div><span><b>{session.user.email}</b><small>Founder workspace</small></span></div>

      </aside>

      <main className="main">

        <header className="topbar"><div><p className="eyebrow">SOCIALORA CONTROL CENTER</p><h1>{title}</h1></div><div className="top-actions"><div className="segmented"><button className={region==='IL'?'active':''} onClick={()=>setRegion('IL')}>IL</button><button className={region==='GLOBAL'?'active':''} onClick={()=>setRegion('GLOBAL')}>GLOBAL</button></div><button className="ai" onClick={()=>setPage('studio')}>✦ Ask SOCIALORA AI</button></div></header>

        <div className="page">{render()}</div>

      </main>

    </div>

  )

}



export default App


