import { useState, useMemo, useCallback } from "react"

// ═══════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════

const CLASSES = ['1A','1B','2A','2B','3A','3B','4A','4B','5A','5B','6A','6B']

const TEACHER_DATA = [
  { id:'T01', name:'Ust. Syukron', role:'Wali Kelas 4A', initial:'US', color:'#3B82F6', bg:'#DBEAFE' },
  { id:'T02', name:'Ust. Fatih', role:'Guru Tahfidz', initial:'UF', color:'#059669', bg:'#D1FAE5' },
  { id:'T03', name:'Ust. Salman', role:'Guru Matematika', initial:'US', color:'#D97706', bg:'#FEF3C7' },
  { id:'T04', name:'Ust. Mukhlis', role:'Wali Kelas 6B', initial:'UM', color:'#7C3AED', bg:'#EDE9FE' },
  { id:'T05', name:'Ustz. Maryam', role:'Wali Kelas 1A', initial:'UM', color:'#DB2777', bg:'#FCE7F3' },
  { id:'T06', name:'Ustz. Aisyah', role:'Guru B. Indonesia', initial:'UA', color:'#0891B2', bg:'#CFFAFE' },
  { id:'T07', name:'Ust. Hasan', role:'Guru IPA', initial:'UH', color:'#059669', bg:'#D1FAE5' },
  { id:'T08', name:'Ust. Ikhwan', role:'Guru PJOK', initial:'UI', color:'#EA580C', bg:'#FFEDD5' },
  { id:'T09', name:'Ustz. Fatimah', role:'Wali Kelas 2A', initial:'UF', color:'#7C3AED', bg:'#EDE9FE' },
  { id:'T10', name:'Ust. Ridwan', role:'Guru B. Inggris', initial:'UR', color:'#3B82F6', bg:'#DBEAFE' },
]

const STUDENT_NAMES = [
  'Zaki Ramadhan','Naila Fitri','Faiz Maulana','Syifa Aulia','Bilal Hakim',
  'Aqila Zahra','Ahmad Fariz','Khadijah Putri','Dzaky Pratama','Hafizah Nur',
  'Rafi Alfarizi','Nabila Husna','Umar Hadi','Salma Azzahra','Arkan Naufal',
  'Dina Khairani','Yusuf Ibrahim','Layla Hanifah','Khalid Zain','Maryam Safitri',
  'Fathan Akbar','Shafira Amira','Hasan Abdullah','Aisyah Rahma','Rizki Putra',
]

function seed(s) { return () => { s=(s*16807)%2147483647; return (s-1)/2147483646 } }

function buildStudents() {
  const r = seed(42); const out = []
  let id = 1
  CLASSES.forEach(cls => {
    const n = 22 + Math.floor(r() * 6)
    for (let i = 0; i < n; i++) {
      const name = STUDENT_NAMES[(id-1) % STUDENT_NAMES.length]
      const g = ['Zaki','Faiz','Bilal','Ahmad','Dzaky','Rafi','Umar','Arkan','Yusuf','Khalid','Fathan','Hasan','Rizki'].some(x=>name.startsWith(x))?'L':'P'
      out.push({ id:`S${String(id).padStart(3,'0')}`, nis:`2024${String(id).padStart(4,'0')}`, name, gender:g, class:cls, parent:`Bp/Ibu ${name.split(' ').pop()}`, phone:`0812${String(Math.floor(10000000+r()*89999999))}` })
      id++
    }
  })
  return out
}

function buildGrades(students) {
  const r = seed(99); const g = {}
  students.forEach(s => {
    g[s.id] = { harian: 60+Math.floor(r()*40), pts: 55+Math.floor(r()*45), pas: 55+Math.floor(r()*45), projek: 65+Math.floor(r()*35) }
  })
  return g
}

function buildAttendance(students) {
  const r = seed(77); const a = {}
  const opts = ['H','H','H','H','H','H','H','H','H','H','S','I','A']
  students.forEach(s => {
    a[s.id] = {}
    for (let d=1;d<=25;d++) a[s.id][d] = opts[Math.floor(r()*opts.length)]
  })
  return a
}

function buildTeacherAttendance() {
  return TEACHER_DATA.map((t,i) => ({
    ...t,
    checkIn: i===2?null:(`0${6+Math.floor(i/4)}:${String(40+i*5).padStart(2,'0')}`),
    checkOut: i===2?null:'14:30',
    status: i===2?'Izin':i===1?'Terlambat':'Hadir',
    late: i===1?4:i===6?2:i===7?1:0,
  }))
}

function buildHafalan(students) {
  const r = seed(55); const h = {}
  students.forEach(s => {
    h[s.id] = {
      juz30: Math.min(100, 50+Math.floor(r()*55)),
      juz29: Math.floor(r()*70),
      juz28: Math.floor(r()*30),
    }
  })
  return h
}

function buildIbadah(students) {
  const r = seed(66); const out = {}
  students.forEach(s => {
    out[s.id] = {
      dhuha: Math.floor(3+r()*3),
      shalat5: Math.floor(r()*10) > 2,
      puasa: Math.floor(r()*10) > 4,
      tilawah: Math.floor(1+r()*4),
    }
  })
  return out
}

function buildFinance(students) {
  const r = seed(88); const f = {}
  students.forEach(s => {
    const paid = Math.floor(r()*10) > 2
    f[s.id] = {
      sppStatus: paid ? 'Lunas' : 'Tunggakan',
      sppAmount: paid ? 0 : (1+Math.floor(r()*3)) * 300000,
      sppMonths: paid ? 0 : 1+Math.floor(r()*3),
    }
  })
  return f
}

const INIT_STUDENTS = buildStudents()
const INIT_GRADES = buildGrades(INIT_STUDENTS)
const INIT_ATTENDANCE = buildAttendance(INIT_STUDENTS)
const INIT_TEACHER_ATT = buildTeacherAttendance()
const INIT_HAFALAN = buildHafalan(INIT_STUDENTS)
const INIT_IBADAH = buildIbadah(INIT_STUDENTS)
const INIT_FINANCE = buildFinance(INIT_STUDENTS)

const BUKU_MSG = [
  { from:'Ust. Syukron', to:'Bpk. Ahmad (Kelas 4A)', msg:'Zaki hari ini sangat aktif di kelas. Mohon dimotivasi untuk murojaah di rumah.', time:'Hari ini, 09:15', read:true, type:'catatan', init:'US', bg:'#DBEAFE', color:'#3B82F6' },
  { from:'Ibu Ainun', to:'Ust. Fatih (Tahfidz)', msg:'Anak saya sakit kemarin, mohon maaf tidak bisa setoran. Besok sudah sehat insya Allah.', time:'Kemarin, 20:30', read:false, type:'catatan', init:'IA', bg:'#D1FAE5', color:'#059669' },
  { from:'Ust. Mukhlis', to:'Wali Kelas 6B (Umum)', msg:'Pengumuman: Ujian akhir semester dimulai 15 Juni. Mohon persiapkan anak-anak.', time:'Kemarin, 13:00', read:true, type:'pengumuman', init:'UM', bg:'#EDE9FE', color:'#7C3AED' },
  { from:'Ustz. Maryam', to:'Wali Murid Kelas 1A', msg:'Besok kelas 1A ada kegiatan outdoor. Mohon bawa bekal dan topi.', time:'8 Jun, 15:00', read:true, type:'pengumuman', init:'UM', bg:'#FCE7F3', color:'#DB2777' },
  { from:'Bpk. Hendra', to:'Ustz. Aisyah (B. Indo)', msg:'Terima kasih bu, nilai Nabila sudah membaik. Kami akan terus dampingi di rumah.', time:'7 Jun, 21:10', read:true, type:'catatan', init:'BH', bg:'#FEF3C7', color:'#D97706' },
]

// ═══════════════════════════════════════
// THEME & STYLES
// ═══════════════════════════════════════

const C = {
  bg:'#F8FAFC', white:'#FFFFFF', border:'#E2E8F0', borderLight:'#F1F5F9',
  text:'#0F172A', textSec:'#64748B', textMute:'#94A3B8',
  green:'#059669', greenBg:'#DCFCE7', greenTx:'#15803D',
  blue:'#3B82F6', blueBg:'#DBEAFE', blueTx:'#1D4ED8',
  amber:'#D97706', amberBg:'#FEF3C7', amberTx:'#92400E',
  red:'#DC2626', redBg:'#FEE2E2', redTx:'#991B1B',
  purple:'#7C3AED', purpleBg:'#EDE9FE', purpleTx:'#5B21B6',
  teal:'#0D9488', tealBg:'#CCFBF1', tealTx:'#134E4A',
  emerald:'#064E3B',
}

const Badge = ({children, type='green'}) => {
  const map = { green:[C.greenBg,C.greenTx], amber:[C.amberBg,C.amberTx], red:[C.redBg,C.redTx], blue:[C.blueBg,C.blueTx], purple:[C.purpleBg,C.purpleTx], teal:[C.tealBg,C.tealTx] }
  const [bg,tx] = map[type]||map.green
  return <span style={{ display:'inline-flex',alignItems:'center',gap:3,padding:'2px 9px',borderRadius:20,fontSize:11,fontWeight:600,background:bg,color:tx }}>{children}</span>
}

const Avatar = ({init,bg,color,size=32}) => (
  <div style={{ width:size,height:size,borderRadius:'50%',background:bg||C.blueBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.37,fontWeight:600,color:color||C.blueTx,flexShrink:0 }}>{init}</div>
)

const Card = ({children, style}) => (
  <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:'14px 16px', marginBottom:12, ...style }}>{children}</div>
)

const CardTitle = ({children, right}) => (
  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10 }}>
    <span style={{ fontSize:14,fontWeight:600,color:C.text }}>{children}</span>
    {right && <span style={{ fontSize:12,color:C.blue,cursor:'pointer' }}>{right}</span>}
  </div>
)

const StatCard = ({icon, label, value, sub, badgeType, badgeText}) => (
  <div style={{ background:C.white,borderRadius:12,border:`1px solid ${C.border}`,padding:'14px 16px' }}>
    <div style={{ fontSize:12,color:C.textSec,marginBottom:5,display:'flex',alignItems:'center',gap:4 }}>{icon} {label}</div>
    <div style={{ fontSize:24,fontWeight:600,color:C.text }}>{value}</div>
    {sub && <div style={{ fontSize:11,color:C.textMute,marginTop:3 }}>{sub}</div>}
    {badgeText && <div style={{ marginTop:4 }}><Badge type={badgeType}>{badgeText}</Badge></div>}
  </div>
)

const ProgressBar = ({label, pct, color, right}) => (
  <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:7 }}>
    <span style={{ minWidth:70,fontSize:12,color:C.textSec }}>{label}</span>
    <div style={{ flex:1,height:6,background:C.borderLight,borderRadius:3,overflow:'hidden' }}>
      <div style={{ width:`${pct}%`,height:'100%',borderRadius:3,background:color||C.blue,transition:'width .3s' }} />
    </div>
    <span style={{ minWidth:36,textAlign:'right',fontSize:12,fontWeight:600,color:C.text }}>{right||`${pct}%`}</span>
  </div>
)

const Chip = ({active, children, onClick}) => (
  <button onClick={onClick} style={{
    display:'inline-flex',alignItems:'center',gap:4,padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:active?600:400,cursor:'pointer',border:'none',
    background:active?C.blueBg:'#F1F5F9', color:active?C.blueTx:C.textSec,transition:'all .15s'
  }}>{children}</button>
)

const PageHeader = ({title,sub}) => (
  <div style={{ marginBottom:16 }}>
    <h1 style={{ fontSize:18,fontWeight:600,color:C.text,margin:0 }}>{title}</h1>
    <p style={{ fontSize:12,color:C.textMute,margin:'3px 0 0' }}>{sub}</p>
  </div>
)

const BottomSheet = ({open, onClose, title, children}) => {
  if(!open) return null
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(15,23,42,0.4)',zIndex:100,display:'flex',alignItems:'flex-end',justifyContent:'center' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.white,borderRadius:'20px 20px 0 0',padding:'6px 20px 28px',width:'100%',maxWidth:480,maxHeight:'85vh',overflowY:'auto' }}>
        <div style={{ width:36,height:4,borderRadius:2,background:'#CBD5E1',margin:'8px auto 16px' }} />
        {title && <h2 style={{ fontSize:16,fontWeight:600,color:C.text,margin:'0 0 14px' }}>{title}</h2>}
        {children}
      </div>
    </div>
  )
}

const Empty = ({msg}) => <div style={{ padding:40,textAlign:'center',color:C.textMute,fontSize:13 }}>{msg}</div>

// ═══════════════════════════════════════
// PAGES
// ═══════════════════════════════════════

function DashboardPage({students, grades, attendance, finance}) {
  const totalStudents = students.length
  const todayPresent = useMemo(() => {
    let h = 0
    students.forEach(s => { if(attendance[s.id]?.[10]==='H') h++ })
    return h
  }, [students, attendance])

  const tunggakan = useMemo(() => {
    return students.filter(s => finance[s.id]?.sppStatus === 'Tunggakan')
  }, [students, finance])

  const classAtt = useMemo(() => {
    return [1,2,3,4,5,6].map(level => {
      const cls = students.filter(s => s.class.startsWith(String(level)))
      let h = 0, total = 0
      cls.forEach(s => { Object.values(attendance[s.id]||{}).forEach(v => { total++; if(v==='H') h++ }) })
      return { label:`Kelas ${level}`, pct: total?Math.round(h/total*100):0 }
    })
  }, [students, attendance])

  const sppPct = useMemo(() => {
    const paid = students.filter(s => finance[s.id]?.sppStatus==='Lunas').length
    return Math.round(paid/students.length*100)
  }, [students, finance])

  return (
    <div>
      <PageHeader title="Dashboard Kepala Sekolah" sub="Rabu, 10 Juni 2026 · Semester Genap 2025/2026" />

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:16 }}>
        <StatCard icon="👨‍🎓" label="Total Siswa" value={totalStudents} badgeType="green" badgeText={`↑ 8 dari tahun lalu`} />
        <StatCard icon="✅" label="Hadir Hari Ini" value={todayPresent} badgeType="amber" badgeText={`${totalStudents-todayPresent} tidak hadir`} />
        <StatCard icon="👨‍🏫" label="Guru Hadir" value={<>{INIT_TEACHER_ATT.filter(t=>t.status==='Hadir').length}<span style={{fontSize:14,color:C.textSec}}>/{TEACHER_DATA.length}</span></>} badgeType="amber" badgeText={`${INIT_TEACHER_ATT.filter(t=>t.status!=='Hadir').length} izin/terlambat`} />
        <StatCard icon="💰" label="SPP Bulan Ini" value={`${sppPct}%`} badgeType={tunggakan.length>30?'red':'amber'} badgeText={`${tunggakan.length} tunggakan`} />
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12 }}>
        <Card>
          <CardTitle right="Lihat semua">Kehadiran per kelas</CardTitle>
          {classAtt.map(c => <ProgressBar key={c.label} label={c.label} pct={c.pct} color={c.pct>=90?C.blue:c.pct>=80?C.amber:C.red} />)}
        </Card>
        <Card>
          <CardTitle right="Detail">SPP & Tunggakan</CardTitle>
          <div style={{ display:'flex',alignItems:'flex-end',gap:5,height:56,marginBottom:12 }}>
            {[68,75,87,60,82].map((h,i) => (
              <div key={i} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3 }}>
                <div style={{ width:'100%',height:h*0.6,borderRadius:'3px 3px 0 0',background:i===2?C.blue:C.blueBg }} />
                <span style={{ fontSize:9,color:C.textMute }}>{['Sen','Sel','Rab','Kam','Jum'][i]}</span>
              </div>
            ))}
          </div>
          {tunggakan.slice(0,3).map(s => (
            <div key={s.id} style={{ display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:`1px solid ${C.borderLight}`,fontSize:12 }}>
              <div style={{ width:6,height:6,borderRadius:'50%',background:finance[s.id].sppMonths>=3?C.red:C.amber }} />
              <span style={{ flex:1,color:C.text }}>{s.name} – {finance[s.id].sppMonths} bulan</span>
              <Badge type={finance[s.id].sppMonths>=3?'red':'amber'}>Rp{(finance[s.id].sppAmount/1000).toFixed(0)}rb</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

function PresensiPage({students, attendance, setAttendance}) {
  const [tab, setTab] = useState('guru')
  const [filterClass, setFilterClass] = useState('4A')
  const [selDate, setSelDate] = useState(10)

  const toggleAtt = (sid) => {
    const order = ['H','S','I','A']
    setAttendance(prev => {
      const cur = prev[sid]?.[selDate]||'H'
      return {...prev, [sid]:{...prev[sid], [selDate]: order[(order.indexOf(cur)+1)%4]}}
    })
  }

  const statusBadge = (st) => {
    const m = { Hadir:'green', Terlambat:'amber', Izin:'red', H:'green', S:'blue', I:'amber', A:'red' }
    return <Badge type={m[st]||'green'}>{st}</Badge>
  }

  const clsStudents = students.filter(s => s.class===filterClass)

  return (
    <div>
      <PageHeader title="Presensi Guru & Siswa" sub="Check in/out · Rekap bulanan · Keterlambatan" />
      <div style={{ display:'flex',gap:6,marginBottom:14,flexWrap:'wrap' }}>
        <Chip active={tab==='guru'} onClick={()=>setTab('guru')}>Guru & Karyawan</Chip>
        <Chip active={tab==='siswa'} onClick={()=>setTab('siswa')}>Siswa</Chip>
        <Chip active={tab==='rekap'} onClick={()=>setTab('rekap')}>Rekap</Chip>
      </div>

      {tab==='guru' && (
        <>
          <Card>
            <CardTitle right="07:00 – 14:30">Kehadiran hari ini — Guru</CardTitle>
            {INIT_TEACHER_ATT.map(t => (
              <div key={t.id} style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:`1px solid ${C.borderLight}`,fontSize:13 }}>
                <Avatar init={t.initial} bg={t.bg} color={t.color} size={34} />
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:500,color:C.text }}>{t.name}</div>
                  <div style={{ fontSize:11,color:C.textMute }}>{t.role}</div>
                </div>
                <div style={{ textAlign:'right',fontSize:12,color:C.textSec,minWidth:70 }}>
                  <div>{t.checkIn||'—'}</div>
                  <div style={{ fontSize:10,color:C.textMute }}>{t.checkOut||'—'}</div>
                </div>
                {statusBadge(t.status)}
              </div>
            ))}
          </Card>
          <Card>
            <CardTitle>Rekap keterlambatan — Juni 2026</CardTitle>
            {INIT_TEACHER_ATT.filter(t=>t.late>0).sort((a,b)=>b.late-a.late).map(t => (
              <ProgressBar key={t.id} label={t.name.split(' ').slice(0,2).join(' ')} pct={t.late*10} color={C.amber} right={`${t.late}x`} />
            ))}
          </Card>
        </>
      )}

      {tab==='siswa' && (
        <>
          <div style={{ display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center' }}>
            {['3A','4A','4B','5A','6A'].map(c => (
              <Chip key={c} active={filterClass===c} onClick={()=>setFilterClass(c)}>{c}</Chip>
            ))}
            <select value={selDate} onChange={e=>setSelDate(Number(e.target.value))}
              style={{ marginLeft:'auto',padding:'6px 10px',borderRadius:8,border:`1px solid ${C.border}`,fontSize:12,color:C.text }}>
              {Array.from({length:25},(_,i)=><option key={i+1} value={i+1}>Tgl {i+1}</option>)}
            </select>
          </div>
          <Card>
            <CardTitle right={`${clsStudents.length} siswa`}>Kelas {filterClass} — Tanggal {selDate}</CardTitle>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:8 }}>
              {clsStudents.map(s => {
                const st = attendance[s.id]?.[selDate]||'H'
                const cm = { H:[C.greenBg,C.greenTx], S:[C.blueBg,C.blueTx], I:[C.amberBg,C.amberTx], A:[C.redBg,C.redTx] }
                const [bg,tx] = cm[st]||cm.H
                return (
                  <div key={s.id} onClick={()=>toggleAtt(s.id)} style={{ display:'flex',alignItems:'center',gap:9,padding:'9px 12px',borderRadius:10,border:`1px solid ${C.border}`,cursor:'pointer',background:C.white }}>
                    <div style={{ width:34,height:34,borderRadius:8,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,color:tx }}>{st}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:13,fontWeight:500,color:C.text,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{s.name}</div>
                      <div style={{ fontSize:10,color:C.textMute }}>{s.nis}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </>
      )}

      {tab==='rekap' && (
        <Card>
          <CardTitle>Rekap kehadiran siswa — Kelas {filterClass}</CardTitle>
          <div style={{ display:'flex',gap:6,marginBottom:12,flexWrap:'wrap' }}>
            {['3A','4A','4B','5A','6A'].map(c => (
              <Chip key={c} active={filterClass===c} onClick={()=>setFilterClass(c)}>{c}</Chip>
            ))}
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%',borderCollapse:'collapse',fontSize:12 }}>
              <thead>
                <tr>{['Nama','H','S','I','A','%'].map(h=><th key={h} style={{ padding:'8px',textAlign:'left',color:C.textMute,fontWeight:600,borderBottom:`2px solid ${C.border}`,fontSize:11 }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {students.filter(s=>s.class===filterClass).map(s => {
                  const d = attendance[s.id]||{}
                  let h=0,sk=0,iz=0,a=0
                  Object.values(d).forEach(v=>{if(v==='H')h++;else if(v==='S')sk++;else if(v==='I')iz++;else a++})
                  const tot=h+sk+iz+a; const pct=tot?Math.round(h/tot*100):0
                  return (
                    <tr key={s.id}>
                      <td style={{ padding:'7px 8px',fontWeight:500,color:C.text,borderBottom:`1px solid ${C.borderLight}` }}>{s.name}</td>
                      <td style={{ padding:'7px 8px',borderBottom:`1px solid ${C.borderLight}` }}><Badge type="green">{h}</Badge></td>
                      <td style={{ padding:'7px 8px',borderBottom:`1px solid ${C.borderLight}` }}><Badge type="blue">{sk}</Badge></td>
                      <td style={{ padding:'7px 8px',borderBottom:`1px solid ${C.borderLight}` }}><Badge type="amber">{iz}</Badge></td>
                      <td style={{ padding:'7px 8px',borderBottom:`1px solid ${C.borderLight}` }}><Badge type="red">{a}</Badge></td>
                      <td style={{ padding:'7px 8px',borderBottom:`1px solid ${C.borderLight}`,fontWeight:600,color:pct>=90?C.green:pct>=75?C.amber:C.red }}>{pct}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

function BukuPage() {
  const [sheet, setSheet] = useState(null)
  const [newMsg, setNewMsg] = useState('')

  return (
    <div>
      <PageHeader title="Buku Penghubung Digital" sub="Komunikasi guru dan orang tua secara tertulis" />
      <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:12 }}>
        <button onClick={()=>setSheet('new')} style={{ padding:'8px 16px',borderRadius:8,border:'none',background:C.emerald,color:'white',fontSize:13,fontWeight:500,cursor:'pointer' }}>+ Tulis catatan</button>
      </div>
      <Card>
        <CardTitle>Catatan terbaru</CardTitle>
        {BUKU_MSG.map((m,i) => (
          <div key={i} style={{ display:'flex',gap:10,padding:'10px 0',borderBottom:i<BUKU_MSG.length-1?`1px solid ${C.borderLight}`:'none' }}>
            <Avatar init={m.init} bg={m.bg} color={m.color} size={36} />
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:13,fontWeight:500,color:C.text }}>{m.from} → {m.to}</div>
              <div style={{ fontSize:12,color:C.textSec,marginTop:3,lineHeight:1.5 }}>{m.msg}</div>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginTop:5 }}>
                <span style={{ fontSize:11,color:C.textMute }}>{m.time}</span>
                <Badge type={m.read?'green':m.type==='pengumuman'?'blue':'amber'}>
                  {m.read?'Dibaca':m.type==='pengumuman'?'Pengumuman':'Belum dibaca'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </Card>

      <BottomSheet open={sheet==='new'} onClose={()=>setSheet(null)} title="Tulis catatan baru">
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:13,fontWeight:500,color:C.text,display:'block',marginBottom:4 }}>Kepada</label>
          <select style={{ width:'100%',padding:'10px 12px',borderRadius:8,border:`1px solid ${C.border}`,fontSize:13 }}>
            <option>Pilih penerima...</option>
            <option>Bpk. Ahmad (Zaki Ramadhan, 4A)</option>
            <option>Ibu Ainun (Naila Fitri, 4A)</option>
            <option>Wali Kelas 4A (Umum)</option>
          </select>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:13,fontWeight:500,color:C.text,display:'block',marginBottom:4 }}>Isi pesan</label>
          <textarea value={newMsg} onChange={e=>setNewMsg(e.target.value)} rows={4} placeholder="Tulis catatan di sini..."
            style={{ width:'100%',padding:'10px 12px',borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,resize:'vertical',boxSizing:'border-box' }} />
        </div>
        <button onClick={()=>setSheet(null)} style={{ width:'100%',padding:'12px',borderRadius:10,border:'none',background:C.emerald,color:'white',fontSize:14,fontWeight:600,cursor:'pointer' }}>Kirim catatan</button>
      </BottomSheet>
    </div>
  )
}

function NilaiPage({students, grades, setGrades}) {
  const [filterClass, setFilterClass] = useState('4A')
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({})
  const cls = students.filter(s => s.class===filterClass)

  const openEdit = (s) => {
    setForm({...(grades[s.id]||{harian:0,pts:0,pas:0,projek:0})})
    setEdit(s)
  }

  const save = () => {
    setGrades(prev => ({...prev, [edit.id]: {...form}}))
    setEdit(null)
  }

  return (
    <div>
      <PageHeader title="Penilaian Siswa" sub="Harian · PTS · PAS · Projek · Rapor" />
      <div style={{ display:'flex',gap:6,marginBottom:14,flexWrap:'wrap' }}>
        {['1A','2A','3A','4A','4B','5A','5B','6A','6B'].map(c => (
          <Chip key={c} active={filterClass===c} onClick={()=>setFilterClass(c)}>{c}</Chip>
        ))}
      </div>
      <Card>
        <CardTitle right="Cetak rapor">Rekap nilai — Kelas {filterClass}</CardTitle>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%',borderCollapse:'collapse',fontSize:12 }}>
            <thead>
              <tr>{['Nama Siswa','Harian','PTS','PAS','Projek','Rata-rata'].map(h=><th key={h} style={{ padding:'8px',textAlign:'left',color:C.textMute,fontWeight:600,borderBottom:`2px solid ${C.border}`,fontSize:11 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {cls.map(s => {
                const g = grades[s.id]||{harian:0,pts:0,pas:0,projek:0}
                const avg = Math.round((g.harian+g.pts+g.pas+g.projek)/4)
                return (
                  <tr key={s.id} onClick={()=>openEdit(s)} style={{ cursor:'pointer' }}>
                    <td style={{ padding:'8px',fontWeight:500,color:C.text,borderBottom:`1px solid ${C.borderLight}` }}>{s.name}</td>
                    <td style={{ padding:'8px',borderBottom:`1px solid ${C.borderLight}` }}>{g.harian}</td>
                    <td style={{ padding:'8px',borderBottom:`1px solid ${C.borderLight}` }}>{g.pts}</td>
                    <td style={{ padding:'8px',borderBottom:`1px solid ${C.borderLight}` }}>{g.pas||'—'}</td>
                    <td style={{ padding:'8px',borderBottom:`1px solid ${C.borderLight}` }}>{g.projek}</td>
                    <td style={{ padding:'8px',borderBottom:`1px solid ${C.borderLight}` }}>
                      <Badge type={avg>=80?'green':avg>=65?'amber':'red'}>{avg}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <BottomSheet open={!!edit} onClose={()=>setEdit(null)} title={edit?`Edit nilai — ${edit.name}`:''}>
        {edit && (
          <div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16 }}>
              {['harian','pts','pas','projek'].map(k => (
                <div key={k}>
                  <label style={{ fontSize:12,fontWeight:500,color:C.textSec,display:'block',marginBottom:4,textTransform:'uppercase' }}>{k}</label>
                  <input type="number" min={0} max={100} value={form[k]||0} onChange={e=>setForm(p=>({...p,[k]:Math.min(100,Math.max(0,Number(e.target.value)||0))}))}
                    style={{ width:'100%',padding:'10px 12px',borderRadius:8,border:`1px solid ${C.border}`,fontSize:15,fontWeight:600,textAlign:'center',boxSizing:'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ display:'flex',gap:8 }}>
              <button onClick={()=>setEdit(null)} style={{ flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.white,color:C.textSec,fontSize:14,cursor:'pointer' }}>Batal</button>
              <button onClick={save} style={{ flex:2,padding:'12px',borderRadius:10,border:'none',background:C.emerald,color:'white',fontSize:14,fontWeight:600,cursor:'pointer' }}>Simpan</button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}

function TahfidzPage({students, hafalan, ibadah}) {
  const [filterClass, setFilterClass] = useState('4A')
  const [selStudent, setSelStudent] = useState(null)
  const cls = students.filter(s => s.class===filterClass)
  const st = selStudent || cls[0]
  const h = st ? hafalan[st.id] : null
  const ib = st ? ibadah[st.id] : null

  return (
    <div>
      <PageHeader title="Tahfidz & Mutaba'ah Ibadah" sub="Target hafalan 3 juz · Tahsin · Ibadah yaumiyah" />
      <div style={{ display:'flex',gap:6,marginBottom:14,flexWrap:'wrap',alignItems:'center' }}>
        {['3A','4A','5A','6A'].map(c => <Chip key={c} active={filterClass===c} onClick={()=>{setFilterClass(c);setSelStudent(null)}}>{c}</Chip>)}
        <select value={st?.id||''} onChange={e=>{const s=cls.find(x=>x.id===e.target.value);setSelStudent(s||null)}}
          style={{ marginLeft:'auto',padding:'7px 12px',borderRadius:8,border:`1px solid ${C.border}`,fontSize:12 }}>
          {cls.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {st && h && (
        <>
          <Card>
            <CardTitle right={st.class}>Progress hafalan — {st.name}</CardTitle>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:12 }}>
              {[
                { label:'Juz 30', sub:'Al-Mulk – An-Nas', pct:h.juz30 },
                { label:'Juz 29', sub:'Al-Mulk – Al-Mursalat', pct:h.juz29 },
                { label:'Juz 28', sub:'Al-Mujadilah – At-Tahrim', pct:h.juz28 },
              ].map(j => (
                <div key={j.label} style={{ background:'#F8FAFC',borderRadius:10,padding:'12px 14px',textAlign:'center' }}>
                  <div style={{ fontSize:20,fontWeight:600,color:C.text }}>{j.label}</div>
                  <div style={{ fontSize:10,color:C.textMute,marginTop:2 }}>{j.sub}</div>
                  <div style={{ height:5,background:C.borderLight,borderRadius:3,margin:'8px 0 4px',overflow:'hidden' }}>
                    <div style={{ width:`${j.pct}%`,height:'100%',borderRadius:3,background:j.pct>=100?C.green:j.pct>50?C.blue:'#CBD5E1' }} />
                  </div>
                  <div style={{ fontSize:12,fontWeight:600,color:j.pct>=100?C.green:j.pct>50?C.blue:C.textMute }}>{j.pct>=100?'Selesai ✓':`${j.pct}%`}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex',gap:8 }}>
              <button style={{ padding:'8px 16px',borderRadius:8,border:'none',background:C.emerald,color:'white',fontSize:12,fontWeight:500,cursor:'pointer' }}>+ Setoran baru</button>
              <button style={{ padding:'8px 16px',borderRadius:8,border:`1px solid ${C.border}`,background:C.white,color:C.textSec,fontSize:12,cursor:'pointer' }}>Jadwal murojaah</button>
            </div>
          </Card>

          <Card>
            <CardTitle>Mutaba'ah yaumiyah — Minggu ini</CardTitle>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:8 }}>
              {[
                { icon:'☀️', label:'Shalat Dhuha', val:`${ib.dhuha}/5 hari`, ok:ib.dhuha>=5, bg:C.blueBg },
                { icon:'🌙', label:'Shalat 5 Waktu', val:ib.shalat5?'Terjaga ✓':'Perlu perbaikan', ok:ib.shalat5, bg:C.greenBg },
                { icon:'💧', label:'Puasa Sunnah', val:ib.puasa?'Senin-Kamis':'Belum', ok:ib.puasa, bg:C.amberBg },
                { icon:'📖', label:'Tilawah', val:`${ib.tilawah} halaman/hari`, ok:ib.tilawah>=3, bg:C.purpleBg },
              ].map(item => (
                <div key={item.label} style={{ display:'flex',alignItems:'center',gap:10,padding:'12px 14px',borderRadius:10,background:'#F8FAFC' }}>
                  <div style={{ width:36,height:36,borderRadius:8,background:item.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:500,color:C.text }}>{item.label}</div>
                    <div style={{ fontSize:11,color:item.ok?C.green:C.textMute }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <Card>
        <CardTitle>Ranking hafalan — Kelas {filterClass}</CardTitle>
        {cls.sort((a,b)=>{
          const ha=hafalan[a.id],hb=hafalan[b.id]
          return ((hb?.juz30||0)+(hb?.juz29||0)+(hb?.juz28||0)) - ((ha?.juz30||0)+(ha?.juz29||0)+(ha?.juz28||0))
        }).slice(0,8).map((s,i) => {
          const hf = hafalan[s.id]
          const total = Math.round(((hf?.juz30||0)+(hf?.juz29||0)+(hf?.juz28||0))/3)
          return (
            <div key={s.id} onClick={()=>setSelStudent(s)} style={{ display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:`1px solid ${C.borderLight}`,cursor:'pointer' }}>
              <div style={{ width:22,height:22,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,
                background:i<3?C.amberBg:'#F1F5F9', color:i<3?C.amberTx:C.textMute }}>{i+1}</div>
              <span style={{ flex:1,fontSize:13,fontWeight:500,color:C.text }}>{s.name}</span>
              <Badge type={total>=70?'green':total>=40?'blue':'amber'}>{total}%</Badge>
            </div>
          )
        })}
      </Card>
    </div>
  )
}

function KeuanganPage({students, finance}) {
  const tunggakan = useMemo(() => students.filter(s => finance[s.id]?.sppStatus==='Tunggakan'), [students, finance])
  const totalTunggakan = tunggakan.reduce((a,s)=>a+(finance[s.id]?.sppAmount||0),0)
  const lunas = students.length - tunggakan.length
  const pct = Math.round(lunas/students.length*100)

  return (
    <div>
      <PageHeader title="Keuangan Sekolah" sub="SPP · Uang kegiatan · Tunggakan · Laporan" />
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:16 }}>
        <StatCard icon="💰" label="Pemasukan Bulan Ini" value={`Rp ${Math.round(lunas*300000/1000000)}jt`} badgeType="green" badgeText={`${pct}% terkumpul`} />
        <StatCard icon="⚠️" label="Tunggakan SPP" value={<span style={{color:C.red}}>Rp {Math.round(totalTunggakan/1000000)}jt</span>} sub={`${tunggakan.length} siswa belum bayar`} />
        <StatCard icon="📋" label="Uang Kegiatan" value="Rp 18,5jt" sub="Terkumpul dari 6 kelas" />
      </div>
      <Card>
        <CardTitle right="Kirim notifikasi semua">Daftar tunggakan</CardTitle>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%',borderCollapse:'collapse',fontSize:12 }}>
            <thead>
              <tr>{['Nama Siswa','Kelas','Bulan','Jumlah','Aksi'].map(h=><th key={h} style={{ padding:'8px',textAlign:'left',color:C.textMute,fontWeight:600,borderBottom:`2px solid ${C.border}`,fontSize:11 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {tunggakan.slice(0,15).map(s => {
                const f = finance[s.id]
                return (
                  <tr key={s.id}>
                    <td style={{ padding:'8px',fontWeight:500,color:C.text,borderBottom:`1px solid ${C.borderLight}` }}>{s.name}</td>
                    <td style={{ padding:'8px',color:C.textSec,borderBottom:`1px solid ${C.borderLight}` }}>{s.class}</td>
                    <td style={{ padding:'8px',borderBottom:`1px solid ${C.borderLight}` }}>{f.sppMonths} bulan</td>
                    <td style={{ padding:'8px',fontWeight:600,color:f.sppMonths>=3?C.red:C.amber,borderBottom:`1px solid ${C.borderLight}` }}>Rp{(f.sppAmount/1000).toFixed(0)}rb</td>
                    <td style={{ padding:'8px',borderBottom:`1px solid ${C.borderLight}` }}>
                      <Badge type={f.sppMonths>=3?'red':'blue'}>{f.sppMonths>=3?'Prioritas':'Ingatkan'}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {tunggakan.length>15 && <div style={{ padding:8,textAlign:'center',fontSize:11,color:C.textMute }}>+{tunggakan.length-15} siswa lainnya</div>}
      </Card>
    </div>
  )
}

function OrtuPage({students, grades, attendance, hafalan, ibadah, finance}) {
  const student = students.find(s=>s.name==='Zaki Ramadhan'&&s.class==='4A') || students[0]
  const g = grades[student.id]||{}
  const h = hafalan[student.id]||{}
  const ib = ibadah[student.id]||{}
  const f = finance[student.id]||{}
  const att = attendance[student.id]||{}
  let hCount=0,total=0
  Object.values(att).forEach(v=>{total++;if(v==='H')hCount++})
  const attPct = total?Math.round(hCount/total*100):0
  const hafalTotal = Math.round(((h.juz30||0)+(h.juz29||0)+(h.juz28||0))/100*1)
  const avg = Math.round((g.harian+g.pts+(g.pas||g.harian)+g.projek)/4)

  return (
    <div>
      <PageHeader title="Dashboard Orang Tua" sub={`${student.name} · Kelas ${student.class} · Wali: ${student.parent}`} />

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:16 }}>
        <StatCard icon="📅" label="Kehadiran" value={`${attPct}%`} sub="Bulan ini" />
        <StatCard icon="📖" label="Hafalan" value={<>{((h.juz30+h.juz29+h.juz28)/100).toFixed(1)}<span style={{fontSize:14,color:C.textSec}}> juz</span></>} sub="Target 3 juz" />
        <StatCard icon="💰" label="SPP" value={<span style={{color:f.sppStatus==='Lunas'?C.green:C.red}}>{f.sppStatus}</span>} sub={f.sppStatus==='Lunas'?'Bulan Juni ✓':`${f.sppMonths} bulan tunggakan`} />
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12 }}>
        <Card>
          <CardTitle>Nilai terkini</CardTitle>
          {[
            { label:'Matematika', val:g.harian },
            { label:'Bahasa Indonesia', val:g.pts },
            { label:'IPA', val:g.projek },
            { label:'Tahfidz', val:h.juz30>=80?'A':h.juz30>=60?'B':'C' },
            { label:'Rata-rata', val:avg },
          ].map(r => (
            <div key={r.label} style={{ display:'flex',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${C.borderLight}` }}>
              <span style={{ flex:1,fontSize:13,color:C.text }}>{r.label}</span>
              <Badge type={typeof r.val==='number'?(r.val>=80?'green':r.val>=65?'amber':'red'):(r.val==='A'?'green':'amber')}>{r.val}</Badge>
            </div>
          ))}
        </Card>

        <Card>
          <CardTitle>Ibadah minggu ini</CardTitle>
          {[
            { icon:'☀️', label:'Shalat Dhuha', val:`${ib.dhuha}/5 hari` },
            { icon:'🌙', label:'Shalat 5 Waktu', val:ib.shalat5?'Terjaga ✓':'Perlu perbaikan' },
            { icon:'💧', label:'Puasa Sunnah', val:ib.puasa?'Senin-Kamis':'—' },
            { icon:'📖', label:'Tilawah', val:`${ib.tilawah} halaman/hari` },
          ].map(item => (
            <div key={item.label} style={{ display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:`1px solid ${C.borderLight}` }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span style={{ flex:1,fontSize:13,color:C.text }}>{item.label}</span>
              <span style={{ fontSize:12,color:C.textSec }}>{item.val}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card style={{ marginTop:12 }}>
        <CardTitle>Pengumuman</CardTitle>
        {[
          { color:C.blue, text:'Ujian akhir semester 15 Juni 2026' },
          { color:C.green, text:'Wisuda Tahfidz 28 Juni 2026' },
          { color:C.amber, text:'Libur hari raya 20–22 Juni 2026' },
        ].map((n,i) => (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:i<2?`1px solid ${C.borderLight}`:'none' }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:n.color,flexShrink:0 }} />
            <span style={{ fontSize:13,color:C.text }}>{n.text}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════

const NAV_ITEMS = [
  { key:'dashboard', icon:'📊', label:'Dashboard' },
  { key:'presensi', icon:'✅', label:'Presensi' },
  { key:'buku', icon:'📒', label:'Buku Penghubung' },
  { key:'nilai', icon:'📝', label:'Penilaian' },
  { key:'tahfidz', icon:'🌙', label:'Tahfidz & Ibadah' },
  { key:'keuangan', icon:'💰', label:'Keuangan' },
  { key:'ortu', icon:'👨‍👩‍👦', label:'Dashboard Ortu' },
]

const NAV_SECTIONS = [
  { title:'Utama', items:['dashboard','presensi','buku'] },
  { title:'Akademik', items:['nilai','tahfidz'] },
  { title:'Keuangan', items:['keuangan'] },
  { title:'Orang Tua', items:['ortu'] },
]

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [sideOpen, setSideOpen] = useState(false)
  const [students] = useState(INIT_STUDENTS)
  const [grades, setGrades] = useState(INIT_GRADES)
  const [attendance, setAttendance] = useState(INIT_ATTENDANCE)
  const [hafalan] = useState(INIT_HAFALAN)
  const [ibadah] = useState(INIT_IBADAH)
  const [finance] = useState(INIT_FINANCE)

  const navigate = useCallback((p) => { setPage(p); setSideOpen(false) }, [])

  const currentNav = NAV_ITEMS.find(n => n.key === page)

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'"Inter",system-ui,sans-serif', background:C.bg, position:'relative', overflow:'hidden' }}>

      {/* Sidebar overlay on mobile */}
      {sideOpen && <div onClick={()=>setSideOpen(false)} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.3)',zIndex:40 }} />}

      {/* Sidebar */}
      <div style={{
        width:210, background:C.white, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', flexShrink:0, zIndex:45,
        position:'fixed', left: sideOpen ? 0 : -220, top:0, bottom:0, transition:'left .25s ease',
        '@media(minWidth:768px)': { position:'relative', left:0 },
      }}
      className="sidebar-desktop"
      >
        <div style={{ padding:'16px 14px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:34,height:34,borderRadius:8,background:C.blueBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,color:C.blueTx }}>🏫</div>
          <div>
            <div style={{ fontSize:14,fontWeight:600,color:C.text }}>SDIT Al-Furqon</div>
            <div style={{ fontSize:10,color:C.textMute }}>Manajemen Digital</div>
          </div>
        </div>

        <nav style={{ flex:1,overflowY:'auto',padding:'6px 0' }}>
          {NAV_SECTIONS.map(sec => (
            <div key={sec.title}>
              <div style={{ padding:'10px 16px 4px',fontSize:10,fontWeight:600,color:C.textMute,textTransform:'uppercase',letterSpacing:'0.06em' }}>{sec.title}</div>
              {sec.items.map(key => {
                const n = NAV_ITEMS.find(x=>x.key===key)
                const active = page===key
                return (
                  <div key={key} onClick={()=>navigate(key)} style={{
                    display:'flex',alignItems:'center',gap:9,padding:'8px 16px',cursor:'pointer',fontSize:13,
                    background:active?C.blueBg:'transparent', color:active?C.blueTx:C.textSec, fontWeight:active?600:400,
                    transition:'background .15s',
                  }}>
                    <span style={{ fontSize:15 }}>{n.icon}</span>{n.label}
                  </div>
                )
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding:'12px 16px',borderTop:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:8 }}>
          <Avatar init="AD" bg={C.blueBg} color={C.blueTx} size={30} />
          <div>
            <div style={{ fontSize:12,fontWeight:500,color:C.text }}>Admin</div>
            <div style={{ fontSize:10,color:C.textMute }}>Semester Genap</div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex:1,display:'flex',flexDirection:'column',minWidth:0 }}>

        {/* Top bar */}
        <div style={{ background:C.white,borderBottom:`1px solid ${C.border}`,padding:'10px 16px',display:'flex',alignItems:'center',gap:12,flexShrink:0 }}>
          <button onClick={()=>setSideOpen(true)} style={{ background:'none',border:'none',fontSize:20,cursor:'pointer',padding:4,lineHeight:1,display:'block' }} className="menu-btn">☰</button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:600,color:C.text }}>{currentNav?.label}</div>
          </div>
          <Badge type="green">● Online</Badge>
        </div>

        {/* Scrollable content */}
        <div style={{ flex:1,overflowY:'auto',padding:'16px 16px 80px' }}>
          {page==='dashboard' && <DashboardPage students={students} grades={grades} attendance={attendance} finance={finance} />}
          {page==='presensi' && <PresensiPage students={students} attendance={attendance} setAttendance={setAttendance} />}
          {page==='buku' && <BukuPage />}
          {page==='nilai' && <NilaiPage students={students} grades={grades} setGrades={setGrades} />}
          {page==='tahfidz' && <TahfidzPage students={students} hafalan={hafalan} ibadah={ibadah} />}
          {page==='keuangan' && <KeuanganPage students={students} finance={finance} />}
          {page==='ortu' && <OrtuPage students={students} grades={grades} attendance={attendance} hafalan={hafalan} ibadah={ibadah} finance={finance} />}
        </div>

        {/* Mobile bottom nav */}
        <div style={{
          position:'absolute',bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.border}`,
          display:'flex',justifyContent:'space-around',padding:'6px 0 10px',zIndex:30,
        }} className="bottom-nav">
          {['dashboard','presensi','nilai','tahfidz','ortu'].map(key => {
            const n = NAV_ITEMS.find(x=>x.key===key)
            const active = page===key
            return (
              <button key={key} onClick={()=>setPage(key)} style={{
                background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'4px 8px',
                color:active?C.blue:C.textMute,
              }}>
                <span style={{ fontSize:18 }}>{n.icon}</span>
                <span style={{ fontSize:9,fontWeight:active?600:400 }}>{n.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Responsive CSS via style tag injection */}
      <style dangerouslySetInnerHTML={{__html:`
        .sidebar-desktop { position: fixed !important; left: ${sideOpen?'0':'-220px'} !important; }
        .menu-btn { display: block !important; }
        .bottom-nav { display: flex !important; }
        @media (min-width: 768px) {
          .sidebar-desktop { position: relative !important; left: 0 !important; }
          .menu-btn { display: none !important; }
          .bottom-nav { display: none !important; }
        }
      `}} />
    </div>
  )
}
