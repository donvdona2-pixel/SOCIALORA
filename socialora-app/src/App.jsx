import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
const [session, setSession] = useState(null)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [authMessage, setAuthMessage] = useState('')

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session)
  })

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, newSession) => {
    setSession(newSession)
  })

  return () => subscription.unsubscribe()
}, [])
const signIn = async () => {
  setAuthMessage('מתחבר...')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    setAuthMessage(error.message)
    return
  }

  setAuthMessage('התחברת בהצלחה')
}
  setAuthMessage('מתחבר...')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    setAuthMessage('התחברת בהצלחה')
}
    setAuthMessage(error.message)
    return
  }

  setAuthMessage('התחברת בהצלחה')
}
  const navItem = (id, icon, label) => (
    <button
      onClick={() => setActivePage(id)}
      style={{
        width: '100%',
        padding: '14px 16px',
        marginBottom: '8px',
        borderRadius: '14px',
        border:
          activePage === id
            ? '1px solid #158cff'
            : '1px solid transparent',
        background:
          activePage === id
            ? 'linear-gradient(135deg,#092f61,#075da8)'
            : 'transparent',
        color: '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '15px',
        fontWeight: '700',
      }}
    >
      {icon} &nbsp; {label}
    </button>
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top right,#07366d 0%,#020b19 35%,#000 85%)',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
      }}
    >
      <aside
        style={{
          width: '240px',
          padding: '26px 20px',
          background: 'rgba(2,9,20,.92)',
          borderRight: '1px solid rgba(0,140,255,.2)',
        }}
      >
        <div
          style={{
            fontSize: '28px',
            fontWeight: '900',
            letterSpacing: '2px',
            color: '#19a7ff',
            marginBottom: '8px',
          }}
        >
          SOCIALORA
        </div>

        <div
          style={{
            fontSize: '12px',
            color: '#6383a7',
            marginBottom: '34px',
          }}
        >
          SOCIAL MEDIA COMMAND CENTER
        </div>

        {navItem('dashboard', '◈', 'Dashboard')}
        {navItem('inbox', '✉', 'Inbox')}
        {navItem('accounts', '◎', 'Accounts')}
        {navItem('settings', '⚙', 'Settings')}
      </aside>

      <main
        style={{
          flex: 1,
          padding: '34px',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '34px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '13px',
                color: '#6584a9',
              }}
            >
              SOCIALORA CONTROL CENTER
            </div>

            <h1
              style={{
                margin: '6px 0 0',
                fontSize: '36px',
              }}
            >
              {activePage === 'dashboard' && 'Dashboard'}
              {activePage === 'inbox' && 'Inbox'}
              {activePage === 'accounts' && 'Connected Accounts'}
              {activePage === 'settings' && 'Settings'}
            </h1>
          </div>

          <div
            style={{
              padding: '8px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(0,160,255,.35)',
              background: 'rgba(0,120,255,.1)',
              color: '#51b8ff',
              fontSize: '13px',
            }}
          >
            ● Meta Integration
          </div>
        </header>

        {activePage === 'dashboard' && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(220px,1fr))',
                gap: '18px',
              }}
            >
              {[
                ['Connected Accounts', '0'],
                ['Active Conversations', '0'],
                ['Messages Today', '0'],
                ['Response Rate', '—'],
              ].map(([title, value]) => (
                <div
                  key={title}
                  style={{
                    background:
                      'linear-gradient(145deg,#0a1b35,#041020)',
                    border: '1px solid rgba(50,150,255,.18)',
                    borderRadius: '22px',
                    padding: '22px',
                    boxShadow: '0 20px 60px rgba(0,0,0,.35)',
                  }}
                >
                  <div
                    style={{
                      color: '#7492b7',
                      fontSize: '14px',
                    }}
                  >
                    {title}
                  </div>

                  <div
                    style={{
                      fontSize: '38px',
                      fontWeight: '900',
                      marginTop: '10px',
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '22px',
                background:
                  'linear-gradient(145deg,#091a33,#030d1c)',
                border: '1px solid rgba(50,150,255,.2)',
                borderRadius: '24px',
                padding: '28px',
              }}
            >
              <div
                style={{
                  color: '#23a9ff',
                  fontWeight: '800',
                  marginBottom: '8px',
                }}
              >
                FACEBOOK CONNECTION
              </div>

              <h2 style={{ marginTop: 0 }}>
                Connect your Facebook Page
              </h2>

              <p
                style={{
                  color: '#7892b2',
                  maxWidth: '650px',
                  lineHeight: '1.7',
                }}
              >
                Connect an authorized Facebook Page to bring customer
                conversations into the SOCIALORA inbox.
              </p>

              <button
              onClick={() => {
  window.location.href =
    'https://avtninmjzlyllttwwuwl.supabase.co/functions/v1/meta-oauth-start'
}}
                style={{
                  marginTop: '10px',
                  padding: '14px 20px',
                  border: 0,
                  borderRadius: '14px',
                  color: '#fff',
                  fontWeight: '800',
                  cursor: 'pointer',
                  background:
                    'linear-gradient(135deg,#087cf0,#21b7ff)',
                  boxShadow:
                    '0 10px 35px rgba(0,130,255,.3)',
                }}
              >
                Connect Facebook Page
              </button>
            </div>
          </>
        )}

        {activePage === 'inbox' && (
          <div
            style={{
              background:
                'linear-gradient(145deg,#091a33,#030d1c)',
              border: '1px solid rgba(50,150,255,.2)',
              borderRadius: '24px',
              padding: '36px',
            }}
          >
            <div style={{ fontSize: '50px' }}>💬</div>
            <h2>Your inbox is ready</h2>
            <p style={{ color: '#7892b2' }}>
              Conversations from connected Facebook Pages will appear
              here.
            </p>
          </div>
        )}

        {activePage === 'accounts' && (
          <div
            style={{
              background: '#061426',
              border: '1px solid rgba(50,150,255,.2)',
              borderRadius: '24px',
              padding: '30px',
            }}
          >
            <h2>Connected Accounts</h2>
            <p style={{ color: '#7892b2' }}>
              No Facebook Pages connected yet.
            </p>
          </div>
        )}

        {activePage === 'settings' && (
          <div
            style={{
              background: '#061426',
              border: '1px solid rgba(50,150,255,.2)',
              borderRadius: '24px',
              padding: '30px',
            }}
          >
            <h2>Settings</h2>
            <p style={{ color: '#7892b2' }}>
              SOCIALORA configuration will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App