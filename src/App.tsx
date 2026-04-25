import { useMemo, useState } from 'react'
import {
  Bell,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trophy,
  Users,
  WalletCards,
  XCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import './App.css'

type View = 'panel' | 'alumnos' | 'asistencia' | 'pagos' | 'mensajes'
type AttendanceStatus = 'Presente' | 'Pendiente' | 'Justificado' | 'Ausente'
type PaymentStatus = 'Pagado' | 'Pendiente' | 'Atrasado'

type NavItem = {
  id: View
  label: string
  icon: LucideIcon
}

type Stat = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone: 'green' | 'amber' | 'blue' | 'red'
  target: View
}

type Student = {
  id: number
  name: string
  category: string
  guardian: string
  phone: string
  status: 'Activo' | 'Beca' | 'Revision'
  paymentStatus: PaymentStatus
  attendance: string
}

type Attendance = {
  id: number
  name: string
  category: string
  status: AttendanceStatus
  time: string
}

type Payment = {
  id: number
  name: string
  category: string
  amount: string
  status: PaymentStatus
  dueDate: string
  method: string
}

type MessageTemplate = {
  id: string
  title: string
  body: string
}

const navItems: NavItem[] = [
  { id: 'panel', label: 'Panel', icon: LayoutDashboard },
  { id: 'alumnos', label: 'Alumnos', icon: Users },
  { id: 'asistencia', label: 'Asistencia', icon: ClipboardCheck },
  { id: 'pagos', label: 'Pagos', icon: WalletCards },
  { id: 'mensajes', label: 'Mensajes', icon: MessageCircle },
]

const viewCopy: Record<View, { eyebrow: string; title: string; description: string }> = {
  panel: {
    eyebrow: 'Panel operativo',
    title: 'Gestion diaria de la escuela',
    description: 'Controla asistencia, pagos y mensajes sin salir del celular.',
  },
  alumnos: {
    eyebrow: 'Base de alumnos',
    title: 'Alumnos y apoderados',
    description: 'Busca fichas, revisa categorias y encuentra datos de contacto rapido.',
  },
  asistencia: {
    eyebrow: 'Control de cancha',
    title: 'Asistencia por categoria',
    description: 'Marca presentes, ausentes y justificados en pocos toques.',
  },
  pagos: {
    eyebrow: 'Mensualidades',
    title: 'Pagos y pendientes',
    description: 'Ve quien esta al dia y prepara recordatorios de cobro.',
  },
  mensajes: {
    eyebrow: 'Comunicacion',
    title: 'Mensajes para apoderados',
    description: 'Elige una plantilla, revisa el texto y abre WhatsApp con el mensaje listo.',
  },
}

const categories = [
  { label: 'Sub 6', students: 18, attendance: '91%' },
  { label: 'Sub 8', students: 24, attendance: '83%' },
  { label: 'Sub 10', students: 31, attendance: '88%' },
  { label: 'Sub 12', students: 28, attendance: '79%' },
]

const initialStudents: Student[] = [
  {
    id: 1,
    name: 'Mateo Rojas',
    category: 'Sub 8',
    guardian: 'Carolina Rojas',
    phone: '56981234567',
    status: 'Activo',
    paymentStatus: 'Pagado',
    attendance: '92%',
  },
  {
    id: 2,
    name: 'Agustin Vera',
    category: 'Sub 8',
    guardian: 'Felipe Vera',
    phone: '56982345678',
    status: 'Revision',
    paymentStatus: 'Pendiente',
    attendance: '76%',
  },
  {
    id: 3,
    name: 'Tomas Araya',
    category: 'Sub 10',
    guardian: 'Marcela Araya',
    phone: '56983456789',
    status: 'Activo',
    paymentStatus: 'Pagado',
    attendance: '89%',
  },
  {
    id: 4,
    name: 'Lucas Paredes',
    category: 'Sub 10',
    guardian: 'Jorge Paredes',
    phone: '56984567890',
    status: 'Beca',
    paymentStatus: 'Pendiente',
    attendance: '81%',
  },
  {
    id: 5,
    name: 'Sofia Munoz',
    category: 'Sub 6',
    guardian: 'Daniela Munoz',
    phone: '56985678901',
    status: 'Activo',
    paymentStatus: 'Pagado',
    attendance: '94%',
  },
  {
    id: 6,
    name: 'Diego Herrera',
    category: 'Sub 12',
    guardian: 'Rodrigo Herrera',
    phone: '56986789012',
    status: 'Activo',
    paymentStatus: 'Atrasado',
    attendance: '72%',
  },
]

const initialAttendanceList: Attendance[] = [
  { id: 1, name: 'Mateo Rojas', category: 'Sub 8', status: 'Presente', time: '18:02' },
  { id: 2, name: 'Agustin Vera', category: 'Sub 8', status: 'Pendiente', time: 'Sin marcar' },
  { id: 3, name: 'Valentin Leiva', category: 'Sub 8', status: 'Ausente', time: 'Sin aviso' },
  { id: 4, name: 'Tomas Araya', category: 'Sub 10', status: 'Presente', time: '18:05' },
  { id: 5, name: 'Lucas Paredes', category: 'Sub 10', status: 'Justificado', time: 'Aviso apoderado' },
  { id: 6, name: 'Diego Herrera', category: 'Sub 12', status: 'Pendiente', time: 'Sin marcar' },
]

const initialPaymentList: Payment[] = [
  {
    id: 1,
    name: 'Sofia Munoz',
    category: 'Sub 6',
    amount: '$30.000',
    status: 'Pagado',
    dueDate: '05 abril',
    method: 'Transferencia',
  },
  {
    id: 2,
    name: 'Benjamin Soto',
    category: 'Sub 8',
    amount: '$30.000',
    status: 'Pendiente',
    dueDate: '10 abril',
    method: 'Sin registrar',
  },
  {
    id: 3,
    name: 'Diego Herrera',
    category: 'Sub 12',
    amount: '$35.000',
    status: 'Atrasado',
    dueDate: '31 marzo',
    method: 'Sin registrar',
  },
  {
    id: 4,
    name: 'Agustin Vera',
    category: 'Sub 8',
    amount: '$30.000',
    status: 'Pendiente',
    dueDate: '10 abril',
    method: 'Sin registrar',
  },
]

const messageTemplates: MessageTemplate[] = [
  {
    id: 'pago',
    title: 'Recordatorio de pago',
    body: 'Hola, te escribimos de ADNFutbol para recordar la mensualidad pendiente. Puedes responder este mensaje si ya realizaste la transferencia.',
  },
  {
    id: 'lluvia',
    title: 'Entrenamiento suspendido',
    body: 'Hola, por condiciones de lluvia se suspende el entrenamiento de hoy. Avisaremos la nueva fecha por este mismo canal.',
  },
  {
    id: 'partido',
    title: 'Confirmacion de partido',
    body: 'Hola, necesitamos confirmar asistencia para el partido amistoso del sabado. Por favor responde SI o NO a este mensaje.',
  },
]

const paymentFilters: Array<PaymentStatus | 'Todos'> = ['Todos', 'Pagado', 'Pendiente', 'Atrasado']
const attendanceActions: AttendanceStatus[] = ['Presente', 'Ausente', 'Justificado']

function getStatusClass(status: AttendanceStatus | PaymentStatus | Student['status']) {
  return status.toLowerCase().replaceAll(' ', '-')
}

function App() {
  const [activeView, setActiveView] = useState<View>('panel')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [attendanceCategory, setAttendanceCategory] = useState('Sub 8')
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendanceList)
  const [payments, setPayments] = useState(initialPaymentList)
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'Todos'>('Todos')
  const [selectedTemplateId, setSelectedTemplateId] = useState(messageTemplates[0].id)
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudents[1].id)
  const [notice, setNotice] = useState('')

  const copy = viewCopy[activeView]
  const selectedTemplate = messageTemplates.find((template) => template.id === selectedTemplateId) ?? messageTemplates[0]
  const messageTarget = initialStudents.find((student) => student.id === selectedStudentId) ?? initialStudents[0]

  const categoryOptions = useMemo(() => ['Todas', ...categories.map((category) => category.label)], [])

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return initialStudents.filter((student) => {
      const matchesCategory = selectedCategory === 'Todas' || student.category === selectedCategory
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.guardian.toLowerCase().includes(query) ||
        student.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [searchTerm, selectedCategory])

  const attendanceForCategory = useMemo(
    () => attendanceRecords.filter((record) => record.category === attendanceCategory),
    [attendanceCategory, attendanceRecords],
  )

  const visiblePayments = useMemo(() => {
    if (paymentFilter === 'Todos') {
      return payments
    }

    return payments.filter((payment) => payment.status === paymentFilter)
  }, [paymentFilter, payments])

  const presentToday = attendanceRecords.filter((record) => record.status === 'Presente').length
  const attendancePercentage = Math.round((presentToday / attendanceRecords.length) * 100)
  const pendingPayments = payments.filter((payment) => payment.status !== 'Pagado')
  const whatsappText = encodeURIComponent(`${selectedTemplate.body}\n\nApoderado: ${messageTarget.guardian}`)
  const whatsappLink = `https://wa.me/${messageTarget.phone}?text=${whatsappText}`

  const stats: Stat[] = [
    {
      label: 'Alumnos activos',
      value: String(initialStudents.length),
      detail: '4 categorias formativas',
      icon: Users,
      tone: 'green',
      target: 'alumnos',
    },
    {
      label: 'Asistencia hoy',
      value: `${attendancePercentage}%`,
      detail: 'Sub 8 y Sub 10 en cancha',
      icon: CalendarCheck,
      tone: 'blue',
      target: 'asistencia',
    },
    {
      label: 'Pagos pendientes',
      value: String(pendingPayments.length),
      detail: '$95.000 por cobrar',
      icon: CircleDollarSign,
      tone: 'amber',
      target: 'pagos',
    },
    {
      label: 'Avisos por enviar',
      value: String(messageTemplates.length),
      detail: 'Plantillas listas',
      icon: Bell,
      tone: 'red',
      target: 'mensajes',
    },
  ]

  function navigateTo(view: View) {
    setActiveView(view)
    setNotice('')
  }

  function markAttendance(id: number, status: AttendanceStatus) {
    setAttendanceRecords((records) =>
      records.map((record) => {
        if (record.id !== id) {
          return record
        }

        const timeByStatus: Record<AttendanceStatus, string> = {
          Presente: 'Ahora',
          Ausente: 'Sin aviso',
          Justificado: 'Aviso apoderado',
          Pendiente: 'Sin marcar',
        }

        return { ...record, status, time: timeByStatus[status] }
      }),
    )
  }

  function markCategoryAsPresent() {
    setAttendanceRecords((records) =>
      records.map((record) =>
        record.category === attendanceCategory ? { ...record, status: 'Presente', time: 'Ahora' } : record,
      ),
    )
  }

  function markPayment(id: number, status: PaymentStatus) {
    setPayments((records) => records.map((payment) => (payment.id === id ? { ...payment, status } : payment)))
  }

  function openNewStudent() {
    navigateTo('alumnos')
    setNotice('Formulario de nuevo alumno listo para la siguiente etapa del MVP.')
  }

  function preparePaymentMessage(payment: Payment) {
    const targetStudent = initialStudents.find((student) => student.name === payment.name)

    if (targetStudent) {
      setSelectedStudentId(targetStudent.id)
    }

    setSelectedTemplateId('pago')
    navigateTo('mensajes')
  }

  function copyMessage() {
    const text = `${selectedTemplate.body}\n\nApoderado: ${messageTarget.guardian}`
    void navigator.clipboard
      .writeText(text)
      .then(() => setNotice('Mensaje copiado. Puedes pegarlo en WhatsApp.'))
      .catch(() => setNotice('No se pudo copiar automaticamente, pero el texto esta visible.'))
  }

  function renderNavItem(item: NavItem) {
    const Icon = item.icon
    const isActive = activeView === item.id

    return (
      <button
        aria-current={isActive ? 'page' : undefined}
        aria-label={item.label}
        className={isActive ? 'active' : ''}
        key={item.id}
        onClick={() => navigateTo(item.id)}
        type="button"
      >
        <Icon size={18} aria-hidden="true" />
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegacion principal">
        <button className="brand brand-button" onClick={() => navigateTo('panel')} type="button" aria-label="Ir al panel">
          <div className="brand-mark">ADN</div>
          <div>
            <strong>ADNFutbol</strong>
            <span>Escuela Los Cracks</span>
          </div>
        </button>

        <nav className="main-nav">{navItems.map(renderNavItem)}</nav>

        <div className="school-card">
          <Trophy size={22} aria-hidden="true" />
          <p>Plan piloto</p>
          <strong>30 dias para validar con profesores y apoderados.</strong>
        </div>
      </aside>

      <main className="main-area">
        <header className="mobile-header">
          <button className="icon-button" onClick={() => navigateTo('panel')} type="button" aria-label="Ir al panel">
            <Menu size={20} />
          </button>
          <button className="mobile-brand" onClick={() => navigateTo('panel')} type="button">
            ADNFutbol
          </button>
          <button className="icon-button" onClick={() => navigateTo('alumnos')} type="button" aria-label="Buscar">
            <Search size={20} />
          </button>
        </header>

        <section className="topbar">
          <div>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>

          <div className="topbar-actions">
            <button className="ghost-button" onClick={() => navigateTo('alumnos')} type="button">
              <Search size={18} aria-hidden="true" />
              Buscar alumno
            </button>
            <button className="primary-button" onClick={openNewStudent} type="button">
              <Plus size={18} aria-hidden="true" />
              Nuevo alumno
            </button>
          </div>
        </section>

        {notice && <div className="notice-banner">{notice}</div>}

        {activeView === 'panel' && (
          <DashboardPage
            attendanceRecords={attendanceRecords}
            navigateTo={navigateTo}
            payments={payments}
            preparePaymentMessage={preparePaymentMessage}
            setSelectedTemplateId={setSelectedTemplateId}
            stats={stats}
          />
        )}

        {activeView === 'alumnos' && (
          <StudentsPage
            categoryOptions={categoryOptions}
            filteredStudents={filteredStudents}
            navigateTo={navigateTo}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            setSearchTerm={setSearchTerm}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activeView === 'asistencia' && (
          <AttendancePage
            attendanceCategory={attendanceCategory}
            attendanceForCategory={attendanceForCategory}
            markAttendance={markAttendance}
            markCategoryAsPresent={markCategoryAsPresent}
            setAttendanceCategory={setAttendanceCategory}
          />
        )}

        {activeView === 'pagos' && (
          <PaymentsPage
            markPayment={markPayment}
            paymentFilter={paymentFilter}
            payments={payments}
            preparePaymentMessage={preparePaymentMessage}
            setPaymentFilter={setPaymentFilter}
            visiblePayments={visiblePayments}
          />
        )}

        {activeView === 'mensajes' && (
          <MessagesPage
            copyMessage={copyMessage}
            messageTarget={messageTarget}
            selectedStudentId={selectedStudentId}
            selectedTemplate={selectedTemplate}
            selectedTemplateId={selectedTemplateId}
            setSelectedStudentId={setSelectedStudentId}
            setSelectedTemplateId={setSelectedTemplateId}
            whatsappLink={whatsappLink}
          />
        )}
      </main>

      <nav className="bottom-nav" aria-label="Navegacion movil">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={isActive ? 'active' : ''}
              key={item.id}
              onClick={() => navigateTo(item.id)}
              type="button"
            >
              <Icon size={19} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function DashboardPage({
  attendanceRecords,
  navigateTo,
  payments,
  preparePaymentMessage,
  setSelectedTemplateId,
  stats,
}: {
  attendanceRecords: Attendance[]
  navigateTo: (view: View) => void
  payments: Payment[]
  preparePaymentMessage: (payment: Payment) => void
  setSelectedTemplateId: (id: string) => void
  stats: Stat[]
}) {
  return (
    <>
      <section className="field-banner" aria-label="Resumen de entrenamiento">
        <div>
          <span>Hoy</span>
          <strong>Entrenamiento Sub 8 y Sub 10</strong>
          <p>Cancha 2, 18:00 a 19:30</p>
        </div>
        <button className="field-button" onClick={() => navigateTo('asistencia')} type="button">
          <CalendarCheck size={18} aria-hidden="true" />
          Pasar asistencia
        </button>
      </section>

      <section className="stats-grid" aria-label="Indicadores principales">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <button className={`stat-card ${stat.tone}`} key={stat.label} onClick={() => navigateTo(stat.target)} type="button">
              <div className="stat-icon">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <p>{stat.detail}</p>
              </div>
            </button>
          )
        })}
      </section>

      <section className="dashboard-grid">
        <article className="panel attendance-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Asistencia</span>
              <h2>Clase de hoy</h2>
            </div>
            <button className="small-button" onClick={() => navigateTo('asistencia')} type="button">
              Sub 8
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="attendance-progress" aria-label="Asistencia actual">
            <div></div>
          </div>

          <div className="list">
            {attendanceRecords.slice(0, 4).map((student) => (
              <div className="list-row" key={student.id}>
                <div className="avatar">{student.name.slice(0, 1)}</div>
                <div className="row-main">
                  <strong>{student.name}</strong>
                  <span>
                    {student.category} - {student.time}
                  </span>
                </div>
                <span className={`status ${getStatusClass(student.status)}`}>{student.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel payments-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Pagos</span>
              <h2>Mensualidades</h2>
            </div>
            <button className="icon-button" onClick={() => navigateTo('pagos')} type="button" aria-label="Ver pagos">
              <WalletCards size={18} />
            </button>
          </div>

          <div className="payment-summary">
            <div>
              <span>Recaudado abril</span>
              <strong>$2.840.000</strong>
            </div>
            <div>
              <span>Pendiente</span>
              <strong>$95.000</strong>
            </div>
          </div>

          <div className="list compact">
            {payments.slice(0, 3).map((payment) => (
              <div className="list-row" key={payment.id}>
                <div className="row-main">
                  <strong>{payment.name}</strong>
                  <span>{payment.category}</span>
                </div>
                <strong className="amount">{payment.amount}</strong>
                <span className={`status ${getStatusClass(payment.status)}`}>{payment.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel messages-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">WhatsApp</span>
              <h2>Mensajes listos</h2>
            </div>
            <button className="icon-button" onClick={() => navigateTo('mensajes')} type="button" aria-label="Crear mensaje">
              <Plus size={18} />
            </button>
          </div>

          <div className="message-list">
            {messageTemplates.map((message) => (
              <button
                onClick={() => {
                  setSelectedTemplateId(message.id)
                  navigateTo('mensajes')
                }}
                type="button"
                key={message.id}
              >
                <MessageCircle size={18} aria-hidden="true" />
                <span>{message.title}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel categories-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Categorias</span>
              <h2>Grupos activos</h2>
            </div>
            <button className="icon-button" onClick={() => navigateTo('alumnos')} type="button" aria-label="Ver categorias">
              <Users size={18} />
            </button>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <div className="category-row" key={category.label}>
                <div>
                  <strong>{category.label}</strong>
                  <span>{category.students} alumnos</span>
                </div>
                <div className="mini-field">
                  <span style={{ width: category.attendance }}></span>
                </div>
                <b>{category.attendance}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="panel next-class-panel">
          <div className="match-card">
            <div className="match-icon">
              <ShieldCheck size={24} aria-hidden="true" />
            </div>
            <span>Proxima actividad</span>
            <h2>Amistoso Sub 12</h2>
            <p>Sabado, 09:30 - Complejo Deportivo Quilin</p>
            <button
              className="ghost-button"
              onClick={() => {
                setSelectedTemplateId('partido')
                navigateTo('mensajes')
              }}
              type="button"
            >
              <Clock3 size={18} aria-hidden="true" />
              Enviar recordatorio
            </button>
          </div>
        </article>

        <article className="panel quick-actions-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Acciones rapidas</span>
              <h2>Resolver pendientes</h2>
            </div>
          </div>
          <div className="quick-actions">
            <button onClick={() => navigateTo('alumnos')} type="button">
              <Users size={18} aria-hidden="true" />
              Revisar alumnos
            </button>
            <button onClick={() => preparePaymentMessage(payments[1])} type="button">
              <Phone size={18} aria-hidden="true" />
              Cobrar pendiente
            </button>
          </div>
        </article>
      </section>
    </>
  )
}

function StudentsPage({
  categoryOptions,
  filteredStudents,
  navigateTo,
  searchTerm,
  selectedCategory,
  setSearchTerm,
  setSelectedCategory,
}: {
  categoryOptions: string[]
  filteredStudents: Student[]
  navigateTo: (view: View) => void
  searchTerm: string
  selectedCategory: string
  setSearchTerm: (value: string) => void
  setSelectedCategory: (value: string) => void
}) {
  const highlightedStudent = filteredStudents[0] ?? initialStudents[0]

  return (
    <section className="workspace-grid students-layout">
      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Listado</span>
            <h2>Fichas de alumnos</h2>
          </div>
          <span className="count-pill">{filteredStudents.length} resultados</span>
        </div>

        <div className="filters-bar">
          <label className="search-field">
            <Search size={18} aria-hidden="true" />
            <input
              aria-label="Buscar alumno"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por alumno, apoderado o categoria"
              type="search"
              value={searchTerm}
            />
          </label>

          <div className="segmented" aria-label="Filtrar por categoria">
            {categoryOptions.map((category) => (
              <button
                className={selectedCategory === category ? 'active' : ''}
                key={category}
                onClick={() => setSelectedCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="student-list">
          {filteredStudents.map((student) => (
            <article className="student-card" key={student.id}>
              <div className="avatar">{student.name.slice(0, 1)}</div>
              <div className="student-info">
                <strong>{student.name}</strong>
                <span>
                  {student.category} - Apoderado: {student.guardian}
                </span>
                <small>Telefono: +{student.phone}</small>
              </div>
              <span className={`status ${getStatusClass(student.status)}`}>{student.status}</span>
              <div className="student-actions">
                <button className="small-button" onClick={() => navigateTo('asistencia')} type="button">
                  Asistencia
                </button>
                <button className="small-button" onClick={() => navigateTo('pagos')} type="button">
                  Pagos
                </button>
              </div>
            </article>
          ))}
        </div>
      </article>

      <aside className="panel detail-panel">
        <span className="panel-kicker">Ficha rapida</span>
        <h2>{highlightedStudent.name}</h2>
        <div className="detail-list">
          <div>
            <span>Categoria</span>
            <strong>{highlightedStudent.category}</strong>
          </div>
          <div>
            <span>Apoderado</span>
            <strong>{highlightedStudent.guardian}</strong>
          </div>
          <div>
            <span>Asistencia</span>
            <strong>{highlightedStudent.attendance}</strong>
          </div>
          <div>
            <span>Pago</span>
            <strong>{highlightedStudent.paymentStatus}</strong>
          </div>
        </div>
        <button className="primary-button" onClick={() => navigateTo('mensajes')} type="button">
          <MessageCircle size={18} aria-hidden="true" />
          Contactar apoderado
        </button>
      </aside>
    </section>
  )
}

function AttendancePage({
  attendanceCategory,
  attendanceForCategory,
  markAttendance,
  markCategoryAsPresent,
  setAttendanceCategory,
}: {
  attendanceCategory: string
  attendanceForCategory: Attendance[]
  markAttendance: (id: number, status: AttendanceStatus) => void
  markCategoryAsPresent: () => void
  setAttendanceCategory: (value: string) => void
}) {
  const presentCount = attendanceForCategory.filter((record) => record.status === 'Presente').length
  const pendingCount = attendanceForCategory.filter((record) => record.status === 'Pendiente').length

  return (
    <section className="workspace-grid attendance-layout">
      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Clase actual</span>
            <h2>{attendanceCategory} - Hoy 18:00</h2>
          </div>
          <button className="primary-button" onClick={markCategoryAsPresent} type="button">
            <CheckCircle2 size={18} aria-hidden="true" />
            Todos presentes
          </button>
        </div>

        <div className="segmented category-tabs" aria-label="Elegir categoria">
          {categories.map((category) => (
            <button
              className={attendanceCategory === category.label ? 'active' : ''}
              key={category.label}
              onClick={() => setAttendanceCategory(category.label)}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="attendance-worklist">
          {attendanceForCategory.map((student) => (
            <div className="attendance-row" key={student.id}>
              <div className="avatar">{student.name.slice(0, 1)}</div>
              <div className="row-main">
                <strong>{student.name}</strong>
                <span>{student.time}</span>
              </div>
              <span className={`status ${getStatusClass(student.status)}`}>{student.status}</span>
              <div className="mark-actions">
                {attendanceActions.map((status) => (
                  <button
                    className={student.status === status ? 'active' : ''}
                    key={status}
                    onClick={() => markAttendance(student.id, status)}
                    type="button"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </article>

      <aside className="panel detail-panel">
        <span className="panel-kicker">Resumen</span>
        <h2>{attendanceCategory}</h2>
        <div className="summary-stack">
          <div>
            <CheckCircle2 size={18} aria-hidden="true" />
            <span>Presentes</span>
            <strong>{presentCount}</strong>
          </div>
          <div>
            <Clock3 size={18} aria-hidden="true" />
            <span>Pendientes</span>
            <strong>{pendingCount}</strong>
          </div>
          <div>
            <XCircle size={18} aria-hidden="true" />
            <span>Total clase</span>
            <strong>{attendanceForCategory.length}</strong>
          </div>
        </div>
      </aside>
    </section>
  )
}

function PaymentsPage({
  markPayment,
  paymentFilter,
  payments,
  preparePaymentMessage,
  setPaymentFilter,
  visiblePayments,
}: {
  markPayment: (id: number, status: PaymentStatus) => void
  paymentFilter: PaymentStatus | 'Todos'
  payments: Payment[]
  preparePaymentMessage: (payment: Payment) => void
  setPaymentFilter: (value: PaymentStatus | 'Todos') => void
  visiblePayments: Payment[]
}) {
  const collected = payments.filter((payment) => payment.status === 'Pagado').length
  const pending = payments.length - collected

  return (
    <section className="workspace-grid payments-layout">
      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Abril</span>
            <h2>Mensualidades registradas</h2>
          </div>
          <span className="count-pill">{visiblePayments.length} registros</span>
        </div>

        <div className="segmented payment-filters" aria-label="Filtrar pagos">
          {paymentFilters.map((filter) => (
            <button
              className={paymentFilter === filter ? 'active' : ''}
              key={filter}
              onClick={() => setPaymentFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="payment-table">
          {visiblePayments.map((payment) => (
            <article className="payment-row" key={payment.id}>
              <div className="row-main">
                <strong>{payment.name}</strong>
                <span>
                  {payment.category} - vence {payment.dueDate} - {payment.method}
                </span>
              </div>
              <strong className="amount">{payment.amount}</strong>
              <span className={`status ${getStatusClass(payment.status)}`}>{payment.status}</span>
              <div className="mark-actions">
                {(['Pagado', 'Pendiente', 'Atrasado'] as PaymentStatus[]).map((status) => (
                  <button
                    className={payment.status === status ? 'active' : ''}
                    key={status}
                    onClick={() => markPayment(payment.id, status)}
                    type="button"
                  >
                    {status}
                  </button>
                ))}
              </div>
              {payment.status !== 'Pagado' && (
                <button className="small-button" onClick={() => preparePaymentMessage(payment)} type="button">
                  WhatsApp
                </button>
              )}
            </article>
          ))}
        </div>
      </article>

      <aside className="panel detail-panel">
        <span className="panel-kicker">Estado de caja</span>
        <h2>Resumen simple</h2>
        <div className="detail-list">
          <div>
            <span>Pagados</span>
            <strong>{collected}</strong>
          </div>
          <div>
            <span>Pendientes</span>
            <strong>{pending}</strong>
          </div>
          <div>
            <span>Total esperado</span>
            <strong>$125.000</strong>
          </div>
        </div>
      </aside>
    </section>
  )
}

function MessagesPage({
  copyMessage,
  messageTarget,
  selectedStudentId,
  selectedTemplate,
  selectedTemplateId,
  setSelectedStudentId,
  setSelectedTemplateId,
  whatsappLink,
}: {
  copyMessage: () => void
  messageTarget: Student
  selectedStudentId: number
  selectedTemplate: MessageTemplate
  selectedTemplateId: string
  setSelectedStudentId: (id: number) => void
  setSelectedTemplateId: (id: string) => void
  whatsappLink: string
}) {
  return (
    <section className="workspace-grid messages-layout">
      <article className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Plantillas</span>
            <h2>Elige mensaje</h2>
          </div>
        </div>

        <div className="message-list">
          {messageTemplates.map((message) => (
            <button
              className={selectedTemplateId === message.id ? 'active' : ''}
              key={message.id}
              onClick={() => setSelectedTemplateId(message.id)}
              type="button"
            >
              <MessageCircle size={18} aria-hidden="true" />
              <span>{message.title}</span>
            </button>
          ))}
        </div>
      </article>

      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Vista previa</span>
            <h2>{selectedTemplate.title}</h2>
          </div>
          <span className="status pendiente">WhatsApp</span>
        </div>

        <div className="filters-bar">
          <div className="segmented student-targets" aria-label="Elegir apoderado">
            {initialStudents.slice(0, 4).map((student) => (
              <button
                className={selectedStudentId === student.id ? 'active' : ''}
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                type="button"
              >
                {student.guardian}
              </button>
            ))}
          </div>
        </div>

        <div className="message-preview">
          <div>
            <span>Para</span>
            <strong>{messageTarget.guardian}</strong>
            <small>+{messageTarget.phone}</small>
          </div>
          <p>{selectedTemplate.body}</p>
        </div>

        <div className="message-actions">
          <button className="ghost-button" onClick={copyMessage} type="button">
            Copiar texto
          </button>
          <a className="primary-button" href={whatsappLink} target="_blank" rel="noreferrer">
            <Phone size={18} aria-hidden="true" />
            Abrir WhatsApp
          </a>
        </div>
      </article>
    </section>
  )
}

export default App
