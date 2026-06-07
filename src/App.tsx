import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import {
  Bell,
  Ban,
  BarChart3,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Download,
  Dumbbell,
  Eye,
  FileText,
  Footprints,
  HandCoins,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  Trophy,
  Trash2,
  UserCog,
  UserRound,
  Users,
  Upload,
  WalletCards,
  XCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import adnIcon from './assets/adn-futbol-icon.svg'
import './App.css'

type View = 'panel' | 'alumnos' | 'eventos' | 'asistencia' | 'pagos' | 'finanzas' | 'balance' | 'gestion' | 'mensajes' | 'perfil'
type AuthStep = 'credentials' | 'app'
type AttendanceStatus = 'Presente' | 'Pendiente' | 'Justificado' | 'Ausente'
type EventAttendanceStatus = AttendanceStatus | 'Confirmado'
type EventType = 'Entrenamiento' | 'Partido'
type PaymentStatus = 'Pagado' | 'Pendiente' | 'Atrasado'
type IncomeStatus = 'Recibido' | 'Pendiente'
type MessageMode = 'individual' | 'masivo'
type ReportKind = 'asistencia' | 'finanzas'
type UserRole = 'SuperAdmin' | 'Director' | 'DT' | 'Finanzas' | 'Alumno'
type AccountStatus = 'Activo' | 'Pendiente' | 'Bloqueado'
type SuperAdminSection = 'escuelas' | 'crear' | 'usuarios' | 'carga' | 'permisos'

type School = {
  id: string
  name: string
  city: string
  initials: string
  logo?: string
  accent: string
  secondary: string
  adminName: string
  contactEmail: string
  plan: string
  monthlyFee: string
}

type User = {
  id: string
  name: string
  rut: string
  password: string
  role: UserRole
  category: string
  schoolId?: string
  studentId?: number
  status: AccountStatus
  lastAccess: string
  permissions: string[]
}

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
  schoolId: string
  name: string
  rut: string
  category: string
  guardian: string
  phone: string
  status: 'Activo' | 'Beca' | 'Revision'
  paymentStatus: PaymentStatus
  attendance: string
  position: string
  dominantFoot: string
  birthYear: number
  shirtNumber: number
  photoTone: string
  strengths: string[]
  notes: string
  coachComment: string
  medical: string
  goals: number
  assists: number
}

type Attendance = {
  id: number
  schoolId: string
  studentId: number
  name: string
  category: string
  status: AttendanceStatus
  time: string
  date: string
}

type Payment = {
  id: number
  schoolId: string
  studentId: number
  name: string
  category: string
  amount: string
  status: PaymentStatus
  dueDate: string
  method: string
}

type CalendarEvent = {
  id: string
  schoolId: string
  type: EventType
  title: string
  category: string
  date: string
  time: string
  location: string
  opponent?: string
}

type EventAttendance = {
  eventId: string
  studentId: number
  status: EventAttendanceStatus
}

type Expense = {
  id: number
  schoolId: string
  title: string
  category: string
  amount: string
  date: string
  status: 'Pagado' | 'Pendiente'
  receiptName?: string
  receiptUrl?: string
}

type Income = {
  id: number
  schoolId: string
  title: string
  category: string
  amount: string
  date: string
  status: IncomeStatus
  receiptName?: string
  receiptUrl?: string
}

type Category = {
  id: string
  schoolId: string
  label: string
  students: number
  attendance: string
  branch: string
}

type MessageTemplate = {
  id: string
  title: string
  body: string
}

type ReportRow = {
  label: string
  detail: string
  amount?: string
  status?: string
}

type ReportResult = {
  kind: ReportKind
  title: string
  subtitle: string
  summary: string
  generatedAt: string
  totals: Array<{ label: string; value: string }>
  rows: ReportRow[]
  text: string
}

type NewStudentForm = {
  name: string
  rut: string
  category: string
  guardian: string
  phone: string
  position: string
  dominantFoot: string
  birthYear: string
  shirtNumber: string
  notes: string
  medical: string
}

type NewSchoolForm = {
  name: string
  city: string
  region: string
  commune: string
  initials: string
  logo: string
  accent: string
  secondary: string
  adminName: string
  adminRut: string
  adminPassword: string
  contactEmail: string
  plan: string
  monthlyFee: string
}

type NewUserForm = {
  name: string
  rut: string
  password: string
  role: UserRole
  schoolId: string
  category: string
}

type NewCategoryForm = {
  label: string
  branch: string
}

type NewExpenseForm = {
  title: string
  category: string
  categoryDetail: string
  amount: string
  date: string
  status: Expense['status']
  receiptName: string
  receiptUrl: string
}

type NewIncomeForm = {
  title: string
  category: string
  categoryDetail: string
  amount: string
  date: string
  status: IncomeStatus
  receiptName: string
  receiptUrl: string
}

type NewTrainingForm = {
  month: string
  weekdays: string[]
  time: string
  category: string
  location: string
}

type NewMatchForm = {
  title: string
  date: string
  time: string
  category: string
  location: string
  opponent: string
}

type StoredAppState = {
  schools: School[]
  users: User[]
  students: Student[]
  categories: Category[]
  expenses: Expense[]
  incomes: Income[]
  attendanceRecords: Attendance[]
  payments: Payment[]
  events: CalendarEvent[]
  eventAttendance: EventAttendance[]
}

const initialSchools: School[] = [
  {
    id: 'los-cracks',
    name: 'Escuela Los Cracks',
    city: 'La Florida, Santiago',
    initials: 'LC',
    accent: '#087A25',
    secondary: '#E9F8DF',
    adminName: 'Camila Fuentes',
    contactEmail: 'admin@loscracks.cl',
    plan: 'Pro',
    monthlyFee: '$30.000',
  },
  {
    id: 'cantera-sur',
    name: 'Cantera Sur FC',
    city: 'Puente Alto, Santiago',
    initials: 'CS',
    accent: '#1768a6',
    secondary: '#e2f1fb',
    adminName: 'Valentina Perez',
    contactEmail: 'contacto@canterasur.cl',
    plan: 'Inicial',
    monthlyFee: '$28.000',
  },
]

const demoUsers: User[] = [
  {
    id: 'super-admin',
    name: 'Diego Viveros',
    rut: '99999999-9',
    password: 'demo123',
    role: 'SuperAdmin',
    category: 'Plataforma completa',
    status: 'Activo',
    lastAccess: 'Hoy, 22:10',
    permissions: ['Control total', 'Crear escuelas', 'Gestionar usuarios', 'Revisar finanzas'],
  },
  {
    id: 'director',
    name: 'Camila Fuentes',
    rut: '11111111-1',
    password: 'demo123',
    role: 'Director',
    category: 'Todas',
    schoolId: 'los-cracks',
    status: 'Activo',
    lastAccess: 'Hoy, 19:42',
    permissions: ['Gestion escolar', 'Alumnos', 'Asistencia', 'Finanzas', 'Mensajes', 'Exportar reportes'],
  },
  {
    id: 'finanzas-los-cracks',
    name: 'Paula Finanzas',
    rut: '33333333-3',
    password: 'demo123',
    role: 'Finanzas',
    category: 'Caja escuela',
    schoolId: 'los-cracks',
    status: 'Activo',
    lastAccess: 'Ayer, 18:15',
    permissions: ['Pagos', 'Conciliacion', 'Mensajes de cobro'],
  },
  {
    id: 'dt-sub8',
    name: 'Felipe Morales',
    rut: '22222222-2',
    password: 'demo123',
    role: 'DT',
    category: 'Sub 8',
    schoolId: 'los-cracks',
    status: 'Activo',
    lastAccess: 'Hoy, 17:58',
    permissions: ['Asistencia', 'Alumnos Sub 8', 'Comentarios deportivos', 'Mensajes'],
  },
  {
    id: 'dt-sub10',
    name: 'Valentina Perez',
    rut: '100000000-K',
    password: 'demo123',
    role: 'DT',
    category: 'Sub 10',
    schoolId: 'cantera-sur',
    status: 'Pendiente',
    lastAccess: 'Sin ingreso',
    permissions: ['Asistencia', 'Alumnos Sub 10', 'Comentarios deportivos', 'Mensajes'],
  },
  {
    id: 'alumno-mateo',
    name: 'Mateo Rojas',
    rut: '44444444-4',
    password: 'demo123',
    role: 'Alumno',
    category: 'Sub 8',
    schoolId: 'los-cracks',
    studentId: 1,
    status: 'Activo',
    lastAccess: 'Hoy, 20:03',
    permissions: ['Perfil propio', 'Pagos propios', 'Mensajes'],
  },
]

const navItems: NavItem[] = [
  { id: 'panel', label: 'Panel', icon: LayoutDashboard },
  { id: 'alumnos', label: 'Alumnos', icon: Users },
  { id: 'eventos', label: 'Eventos', icon: CalendarCheck },
  { id: 'asistencia', label: 'Asistencia', icon: ClipboardCheck },
  { id: 'pagos', label: 'Pagos', icon: WalletCards },
  { id: 'finanzas', label: 'Finanzas', icon: CircleDollarSign },
  { id: 'balance', label: 'Balance', icon: HandCoins },
  { id: 'gestion', label: 'Gestion', icon: UserCog },
  { id: 'mensajes', label: 'Mensajes', icon: MessageCircle },
  { id: 'perfil', label: 'Perfil', icon: UserRound },
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
  eventos: {
    eyebrow: 'Calendario escuela',
    title: 'Entrenamientos y partidos',
    description: 'Programa actividades, partidos y confirma asistencia por evento.',
  },
  pagos: {
    eyebrow: 'Mensualidades',
    title: 'Pagos y pendientes',
    description: 'Ve quien esta al dia y prepara recordatorios de cobro.',
  },
  finanzas: {
    eyebrow: 'Portal financiero',
    title: 'Caja, pagos y conciliacion',
    description: 'Organiza mensualidades, transferencias y pendientes de apoderados.',
  },
  balance: {
    eyebrow: 'Balance mensual',
    title: 'Ingresos, gastos y resultado',
    description: 'Revisa pagos cobrados, gastos ingresados y balance operativo del mes.',
  },
  gestion: {
    eyebrow: 'Administracion escuela',
    title: 'Usuarios y categorias',
    description: 'Crea usuarios de tu escuela, organiza categorias y mantiene permisos simples.',
  },
  mensajes: {
    eyebrow: 'Comunicacion',
    title: 'Mensajes para apoderados',
    description: 'Elige una plantilla, revisa el texto y prepara envios por WhatsApp.',
  },
  perfil: {
    eyebrow: 'Ficha deportiva',
    title: 'Perfil del jugador',
    description: 'Foto, posicion, datos del apoderado y seguimiento formativo.',
  },
}

const initialCategories: Category[] = [
  { id: 'los-cracks-sub6', schoolId: 'los-cracks', label: 'Sub 6', students: 18, attendance: '91%', branch: 'Mixta' },
  { id: 'los-cracks-sub8', schoolId: 'los-cracks', label: 'Sub 8', students: 24, attendance: '83%', branch: 'Mixta' },
  { id: 'los-cracks-sub10', schoolId: 'los-cracks', label: 'Sub 10', students: 31, attendance: '88%', branch: 'Mixta' },
  { id: 'los-cracks-sub12', schoolId: 'los-cracks', label: 'Sub 12', students: 28, attendance: '79%', branch: 'Mixta' },
  { id: 'los-cracks-fem-sub12', schoolId: 'los-cracks', label: 'Femenina Sub 12', students: 16, attendance: '86%', branch: 'Femenina' },
  { id: 'cantera-sub8', schoolId: 'cantera-sur', label: 'Sub 8', students: 20, attendance: '84%', branch: 'Mixta' },
  { id: 'cantera-sub10', schoolId: 'cantera-sur', label: 'Sub 10', students: 22, attendance: '87%', branch: 'Mixta' },
]

const initialStudents: Student[] = [
  {
    id: 1,
    schoolId: 'los-cracks',
    name: 'Mateo Rojas',
    rut: '23456789-1',
    category: 'Sub 8',
    guardian: 'Carolina Rojas',
    phone: '56981234567',
    status: 'Activo',
    paymentStatus: 'Pagado',
    attendance: '92%',
    position: 'Delantero',
    dominantFoot: 'Derecha',
    birthYear: 2017,
    shirtNumber: 9,
    photoTone: '#087a25',
    strengths: ['Velocidad', 'Definicion', 'Presion alta'],
    notes: 'Jugador intenso, con buena lectura para atacar espacios.',
    coachComment: 'Mejorar control orientado y definicion con pierna izquierda.',
    medical: 'Sin observaciones',
    goals: 12,
    assists: 5,
  },
  {
    id: 2,
    schoolId: 'los-cracks',
    name: 'Agustin Vera',
    rut: '24567890-2',
    category: 'Sub 8',
    guardian: 'Felipe Vera',
    phone: '56982345678',
    status: 'Revision',
    paymentStatus: 'Pendiente',
    attendance: '76%',
    position: 'Volante',
    dominantFoot: 'Izquierda',
    birthYear: 2017,
    shirtNumber: 8,
    photoTone: '#1768a6',
    strengths: ['Pase corto', 'Vision', 'Cambio de ritmo'],
    notes: 'Necesita reforzar asistencia, pero muestra muy buena tecnica.',
    coachComment: 'Trabajar constancia, recepcion de balon y toma de decision rapida.',
    medical: 'Usa plantillas deportivas',
    goals: 4,
    assists: 9,
  },
  {
    id: 3,
    schoolId: 'los-cracks',
    name: 'Tomas Araya',
    rut: '22345678-3',
    category: 'Sub 10',
    guardian: 'Marcela Araya',
    phone: '56983456789',
    status: 'Activo',
    paymentStatus: 'Pagado',
    attendance: '89%',
    position: 'Defensa central',
    dominantFoot: 'Derecha',
    birthYear: 2015,
    shirtNumber: 4,
    photoTone: '#b88916',
    strengths: ['Marca', 'Juego aereo', 'Liderazgo'],
    notes: 'Capitan natural del grupo, ordena bien la linea defensiva.',
    coachComment: 'Seguir reforzando salida limpia y comunicacion con laterales.',
    medical: 'Sin observaciones',
    goals: 2,
    assists: 3,
  },
  {
    id: 4,
    schoolId: 'los-cracks',
    name: 'Lucas Paredes',
    rut: '22987654-4',
    category: 'Sub 10',
    guardian: 'Jorge Paredes',
    phone: '56984567890',
    status: 'Beca',
    paymentStatus: 'Pendiente',
    attendance: '81%',
    position: 'Arquero',
    dominantFoot: 'Derecha',
    birthYear: 2015,
    shirtNumber: 1,
    photoTone: '#8b3d2e',
    strengths: ['Reflejos', 'Salida baja', 'Voz de mando'],
    notes: 'Buen progreso en coordinacion y confianza bajo presion.',
    coachComment: 'Practicar saque largo y posicionamiento en centros laterales.',
    medical: 'Alergia estacional informada',
    goals: 0,
    assists: 1,
  },
  {
    id: 5,
    schoolId: 'los-cracks',
    name: 'Sofia Munoz',
    rut: '25111222-5',
    category: 'Sub 6',
    guardian: 'Daniela Munoz',
    phone: '56985678901',
    status: 'Activo',
    paymentStatus: 'Pagado',
    attendance: '94%',
    position: 'Extremo',
    dominantFoot: 'Derecha',
    birthYear: 2019,
    shirtNumber: 7,
    photoTone: '#7c4d9e',
    strengths: ['Conduccion', 'Alegria', 'Coordinacion'],
    notes: 'Participa mucho y ayuda a integrar a companeros nuevos.',
    coachComment: 'Potenciar conduccion con cambios de direccion y cierre de jugadas.',
    medical: 'Sin observaciones',
    goals: 6,
    assists: 2,
  },
  {
    id: 6,
    schoolId: 'los-cracks',
    name: 'Diego Herrera',
    rut: '21555333-6',
    category: 'Sub 12',
    guardian: 'Rodrigo Herrera',
    phone: '56986789012',
    status: 'Activo',
    paymentStatus: 'Atrasado',
    attendance: '72%',
    position: 'Lateral',
    dominantFoot: 'Izquierda',
    birthYear: 2013,
    shirtNumber: 3,
    photoTone: '#2f6f73',
    strengths: ['Resistencia', 'Centros', 'Anticipacion'],
    notes: 'Debe mejorar puntualidad, pero responde bien a tareas claras.',
    coachComment: 'Reforzar perfil corporal defensivo y centros con pierna menos habil.',
    medical: 'Control de rodilla informado',
    goals: 1,
    assists: 6,
  },
]

const initialAttendanceList: Attendance[] = [
  { id: 1, schoolId: 'los-cracks', studentId: 1, name: 'Mateo Rojas', category: 'Sub 8', status: 'Presente', time: '18:02', date: '2026-04-25' },
  { id: 2, schoolId: 'los-cracks', studentId: 2, name: 'Agustin Vera', category: 'Sub 8', status: 'Pendiente', time: 'Sin marcar', date: '2026-04-25' },
  { id: 3, schoolId: 'los-cracks', studentId: 7, name: 'Valentin Leiva', category: 'Sub 8', status: 'Ausente', time: 'Sin aviso', date: '2026-04-25' },
  { id: 4, schoolId: 'los-cracks', studentId: 3, name: 'Tomas Araya', category: 'Sub 10', status: 'Presente', time: '18:05', date: '2026-04-25' },
  { id: 5, schoolId: 'los-cracks', studentId: 4, name: 'Lucas Paredes', category: 'Sub 10', status: 'Justificado', time: 'Aviso apoderado', date: '2026-04-25' },
  { id: 6, schoolId: 'los-cracks', studentId: 6, name: 'Diego Herrera', category: 'Sub 12', status: 'Pendiente', time: 'Sin marcar', date: '2026-04-25' },
  { id: 7, schoolId: 'los-cracks', studentId: 1, name: 'Mateo Rojas', category: 'Sub 8', status: 'Presente', time: '18:01', date: '2026-04-23' },
  { id: 8, schoolId: 'los-cracks', studentId: 2, name: 'Agustin Vera', category: 'Sub 8', status: 'Ausente', time: 'Sin aviso', date: '2026-04-23' },
  { id: 9, schoolId: 'los-cracks', studentId: 3, name: 'Tomas Araya', category: 'Sub 10', status: 'Presente', time: '18:04', date: '2026-04-23' },
  { id: 10, schoolId: 'los-cracks', studentId: 4, name: 'Lucas Paredes', category: 'Sub 10', status: 'Presente', time: '18:00', date: '2026-04-23' },
]

const initialPaymentList: Payment[] = [
  {
    id: 1,
    schoolId: 'los-cracks',
    studentId: 5,
    name: 'Sofia Munoz',
    category: 'Sub 6',
    amount: '$30.000',
    status: 'Pagado',
    dueDate: '05 abril',
    method: 'Transferencia',
  },
  {
    id: 2,
    schoolId: 'los-cracks',
    studentId: 0,
    name: 'Benjamin Soto',
    category: 'Sub 8',
    amount: '$30.000',
    status: 'Pendiente',
    dueDate: '10 abril',
    method: 'Sin registrar',
  },
  {
    id: 3,
    schoolId: 'los-cracks',
    studentId: 6,
    name: 'Diego Herrera',
    category: 'Sub 12',
    amount: '$35.000',
    status: 'Atrasado',
    dueDate: '31 marzo',
    method: 'Sin registrar',
  },
  {
    id: 4,
    schoolId: 'los-cracks',
    studentId: 2,
    name: 'Agustin Vera',
    category: 'Sub 8',
    amount: '$30.000',
    status: 'Pendiente',
    dueDate: '10 abril',
    method: 'Sin registrar',
  },
]

const initialEvents: CalendarEvent[] = [
  {
    id: 'event-train-los-cracks-sub8-2026-04-25',
    schoolId: 'los-cracks',
    type: 'Entrenamiento',
    title: 'Entrenamiento Sub 8',
    category: 'Sub 8',
    date: '2026-04-25',
    time: '18:00',
    location: 'Cancha 2',
  },
  {
    id: 'event-match-los-cracks-sub10-2026-04-27',
    schoolId: 'los-cracks',
    type: 'Partido',
    title: 'Amistoso Sub 10',
    category: 'Sub 10',
    date: '2026-04-27',
    time: '10:00',
    location: 'Cancha principal',
    opponent: 'Cantera Sur FC',
  },
]

const initialEventAttendance: EventAttendance[] = [
  { eventId: 'event-train-los-cracks-sub8-2026-04-25', studentId: 1, status: 'Presente' },
  { eventId: 'event-train-los-cracks-sub8-2026-04-25', studentId: 2, status: 'Pendiente' },
  { eventId: 'event-match-los-cracks-sub10-2026-04-27', studentId: 3, status: 'Confirmado' },
  { eventId: 'event-match-los-cracks-sub10-2026-04-27', studentId: 4, status: 'Pendiente' },
]

const initialExpenses: Expense[] = [
  {
    id: 1,
    schoolId: 'los-cracks',
    title: 'Arriendo cancha',
    category: 'Infraestructura',
    amount: '$120.000',
    date: '2026-04-05',
    status: 'Pagado',
    receiptName: 'boleta-cancha-abril.pdf',
  },
  {
    id: 2,
    schoolId: 'los-cracks',
    title: 'Balones y conos',
    category: 'Implementos',
    amount: '$68.000',
    date: '2026-04-12',
    status: 'Pagado',
    receiptName: 'implementos-abril.jpg',
  },
  {
    id: 3,
    schoolId: 'los-cracks',
    title: 'Pago profesores',
    category: 'Honorarios',
    amount: '$180.000',
    date: '2026-04-28',
    status: 'Pendiente',
  },
  {
    id: 4,
    schoolId: 'cantera-sur',
    title: 'Transporte amistoso',
    category: 'Traslado',
    amount: '$75.000',
    date: '2026-04-18',
    status: 'Pagado',
  },
]

const initialIncomes: Income[] = [
  {
    id: 1,
    schoolId: 'los-cracks',
    title: 'Inscripcion nuevos alumnos',
    category: 'Inscripcion',
    amount: '$90.000',
    date: '2026-04-03',
    status: 'Recibido',
    receiptName: 'transferencias-inscripcion.pdf',
  },
  {
    id: 2,
    schoolId: 'los-cracks',
    title: 'Aporte sponsor local',
    category: 'Sponsor',
    amount: '$150.000',
    date: '2026-04-15',
    status: 'Recibido',
  },
  {
    id: 3,
    schoolId: 'cantera-sur',
    title: 'Matriculas abril',
    category: 'Matricula',
    amount: '$75.000',
    date: '2026-04-08',
    status: 'Recibido',
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
const matchAttendanceActions: EventAttendanceStatus[] = ['Confirmado', 'Ausente', 'Pendiente']
const weekDayOptions = [
  { label: 'Lun', value: '1' },
  { label: 'Mar', value: '2' },
  { label: 'Mie', value: '3' },
  { label: 'Jue', value: '4' },
  { label: 'Vie', value: '5' },
  { label: 'Sab', value: '6' },
  { label: 'Dom', value: '0' },
]
const knownPermissions = [
  'Control total',
  'Crear escuelas',
  'Editar escuelas',
  'Gestionar usuarios',
  'Editar usuarios',
  'Asignar permisos',
  'Bloquear cuentas',
  'Reiniciar claves',
  'Revisar finanzas',
  'Exportar reportes',
  'Alumnos',
  'Asistencia',
  'Finanzas',
  'Mensajes',
  'Perfil propio',
  'Pagos propios',
  'Comentarios deportivos',
  'Mensajes de cobro',
]

function getStatusClass(status: string) {
  return status.toLowerCase().replaceAll(' ', '-')
}

function getWhatsappLink(phone: string, body: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(body)}`
}

function getWhatsappShareLink(body: string) {
  return `https://wa.me/?text=${encodeURIComponent(body)}`
}

function buildReportText(report: Omit<ReportResult, 'text'>) {
  const totals = report.totals.map((total) => `${total.label}: ${total.value}`).join('\n')
  const rows = report.rows.length
    ? report.rows
        .map((row, index) => `${index + 1}. ${row.label} | ${row.detail}${row.amount ? ` | ${row.amount}` : ''}${row.status ? ` | ${row.status}` : ''}`)
        .join('\n')
    : 'Sin registros para los filtros seleccionados.'

  return `${report.title}
${report.subtitle}
Generado: ${report.generatedAt}

${report.summary}

Totales:
${totals}

Detalle:
${rows}`
}

const crc32Table = Array.from({ length: 256 }, (_, index) => {
  let value = index

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }

  return value >>> 0
})

function getCrc32(bytes: Uint8Array) {
  let crc = 0xffffffff

  for (const byte of bytes) {
    crc = crc32Table[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }

  return (crc ^ 0xffffffff) >>> 0
}

function getExcelColumnName(index: number) {
  let current = index
  let name = ''

  while (current > 0) {
    current -= 1
    name = String.fromCharCode(65 + (current % 26)) + name
    current = Math.floor(current / 26)
  }

  return name
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getReportExcelRows(report: ReportResult) {
  const detailRows = report.rows.length
    ? report.rows.map((row, index) => [
        String(index + 1),
        row.label,
        row.detail,
        row.amount ?? '',
        row.status ?? '',
      ])
    : [['', 'Sin registros para los filtros seleccionados.', '', '', '']]

  return [
    ['ADNFutbol', report.title],
    ['Filtro', report.subtitle],
    ['Generado', report.generatedAt],
    [],
    ['Resumen', report.summary],
    [],
    ['Totales'],
    ['Concepto', 'Valor'],
    ...report.totals.map((total) => [total.label, total.value]),
    [],
    ['Detalle'],
    ['#', 'Item', 'Detalle', 'Monto', 'Estado'],
    ...detailRows,
  ]
}

function buildWorksheetXml(rows: string[][]) {
  const maxColumns = Math.max(...rows.map((row) => row.length), 1)
  const dimension = `A1:${getExcelColumnName(maxColumns)}${rows.length || 1}`
  const rowXml = rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 1
      const cells = row
        .map((cell, cellIndex) => {
          const cellRef = `${getExcelColumnName(cellIndex + 1)}${rowNumber}`

          return `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(cell)}</t></is></c>`
        })
        .join('')

      return `<row r="${rowNumber}">${cells}</row>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="${dimension}"/>
  <cols>
    <col min="1" max="1" width="14" customWidth="1"/>
    <col min="2" max="2" width="34" customWidth="1"/>
    <col min="3" max="3" width="44" customWidth="1"/>
    <col min="4" max="4" width="18" customWidth="1"/>
    <col min="5" max="5" width="18" customWidth="1"/>
  </cols>
  <sheetData>${rowXml}</sheetData>
</worksheet>`
}

function toArrayBuffer(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)

  return buffer
}

function createZipBlob(entries: Array<{ name: string; content: string }>) {
  const encoder = new TextEncoder()
  const now = new Date()
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2)
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0

  entries.forEach((entry) => {
    const fileName = encoder.encode(entry.name)
    const data = encoder.encode(entry.content)
    const crc = getCrc32(data)
    const localHeader = new Uint8Array(30 + fileName.length)
    const localView = new DataView(localHeader.buffer)

    localView.setUint32(0, 0x04034b50, true)
    localView.setUint16(4, 20, true)
    localView.setUint16(8, 0, true)
    localView.setUint16(10, dosTime, true)
    localView.setUint16(12, dosDate, true)
    localView.setUint32(14, crc, true)
    localView.setUint32(18, data.length, true)
    localView.setUint32(22, data.length, true)
    localView.setUint16(26, fileName.length, true)
    localHeader.set(fileName, 30)

    localParts.push(localHeader, data)

    const centralHeader = new Uint8Array(46 + fileName.length)
    const centralView = new DataView(centralHeader.buffer)

    centralView.setUint32(0, 0x02014b50, true)
    centralView.setUint16(4, 20, true)
    centralView.setUint16(6, 20, true)
    centralView.setUint16(10, 0, true)
    centralView.setUint16(12, dosTime, true)
    centralView.setUint16(14, dosDate, true)
    centralView.setUint32(16, crc, true)
    centralView.setUint32(20, data.length, true)
    centralView.setUint32(24, data.length, true)
    centralView.setUint16(28, fileName.length, true)
    centralView.setUint32(42, offset, true)
    centralHeader.set(fileName, 46)

    centralParts.push(centralHeader)
    offset += localHeader.length + data.length
  })

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0)
  const endRecord = new Uint8Array(22)
  const endView = new DataView(endRecord.buffer)

  endView.setUint32(0, 0x06054b50, true)
  endView.setUint16(8, entries.length, true)
  endView.setUint16(10, entries.length, true)
  endView.setUint32(12, centralSize, true)
  endView.setUint32(16, offset, true)

  return new Blob([...localParts, ...centralParts, endRecord].map(toArrayBuffer), {
    type: 'application/zip',
  })
}

function buildReportWorkbook(report: ReportResult) {
  return buildWorkbook('Reporte', getReportExcelRows(report))
}

function buildWorkbook(sheetName: string, rows: string[][]) {
  const worksheet = buildWorksheetXml(rows)
  const safeSheetName = escapeXml(sheetName.replace(/[\\/?*[\]:]/g, '').slice(0, 31) || 'Hoja 1')
  const files = [
    {
      name: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`,
    },
    {
      name: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: 'xl/workbook.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${safeSheetName}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`,
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`,
    },
    {
      name: 'xl/worksheets/sheet1.xml',
      content: worksheet,
    },
  ]

  return createZipBlob(files).slice(0, undefined, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
}

function buildBulkUserTemplateWorkbook(schools: School[], categories: Category[]) {
  const firstSchool = schools[0]
  const firstCategory = categories.find((category) => category.schoolId === firstSchool?.id)
  const rows = [
    ['Plantilla carga masiva usuarios ADNFutbol'],
    ['Instrucciones', 'Completa las columnas y copia las filas de usuarios hacia la caja de carga masiva.'],
    ['Roles permitidos', 'Director, DT, Finanzas, Alumno'],
    ['RUT', 'Usa formato 11111111-1, sin puntos.'],
    [],
    ['Nombre', 'RUT', 'Rol', 'ID escuela', 'Categoria', 'Clave'],
    ['Carlos Soto', '66666666-6', 'DT', firstSchool?.id ?? 'id-escuela', firstCategory?.label ?? 'Sub 8', 'demo123'],
    ['Andrea Mella', '77777777-7', 'Finanzas', firstSchool?.id ?? 'id-escuela', 'Todas', 'demo123'],
    ['Camila Fuentes', '88888888-8', 'Director', firstSchool?.id ?? 'id-escuela', 'Todas', 'demo123'],
    [],
    ['Escuelas disponibles'],
    ['Escuela', 'ID escuela'],
    ...schools.map((school) => [school.name, school.id]),
    [],
    ['Categorias disponibles'],
    ['Escuela', 'Categoria'],
    ...categories.map((category) => [schools.find((school) => school.id === category.schoolId)?.name ?? category.schoolId, category.label]),
  ]

  return buildWorkbook('Plantilla usuarios', rows)
}

function getReportFileName(report: ReportResult) {
  const slug = `${report.kind}-${report.subtitle}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `${slug || 'reporte-adnfutbol'}.xlsx`
}

function normalizeRut(value: string) {
  return value.replace(/\./g, '').trim().toUpperCase()
}

function isValidRutFormat(value: string) {
  return /^\d{7,9}-[\dK]$/.test(normalizeRut(value))
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CL', {
    currency: 'CLP',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

function hexToRgbValue(hex: string) {
  const cleanHex = hex.replace('#', '')
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : cleanHex
  const value = Number.parseInt(fullHex, 16)

  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue]
    .map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0'))
    .join('')}`
}

function mixWithWhite(hex: string, amount = 0.82) {
  const [red, green, blue] = hexToRgbValue(hex).split(',').map((value) => Number(value.trim()))

  return rgbToHex(
    red + (255 - red) * amount,
    green + (255 - green) * amount,
    blue + (255 - blue) * amount,
  )
}

function darkenHex(hex: string, amount = 0.56) {
  const [red, green, blue] = hexToRgbValue(hex).split(',').map((value) => Number(value.trim()))

  return rgbToHex(red * (1 - amount), green * (1 - amount), blue * (1 - amount))
}

function getReadableAccent(red: number, green: number, blue: number) {
  const tooLight = red * 0.299 + green * 0.587 + blue * 0.114 > 190
  const accent = tooLight
    ? rgbToHex(red * 0.58, green * 0.58, blue * 0.58)
    : rgbToHex(red, green, blue)

  return accent
}

function detectImageColors(imageSource: string) {
  return new Promise<{ accent: string; secondary: string }>((resolve, reject) => {
    const image = new Image()

    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas')
      const size = 48
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext('2d', { willReadFrequently: true })

      if (!context) {
        reject(new Error('No se pudo leer el logo.'))
        return
      }

      context.drawImage(image, 0, 0, size, size)
      const pixels = context.getImageData(0, 0, size, size).data
      let totalRed = 0
      let totalGreen = 0
      let totalBlue = 0
      let count = 0

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index]
        const green = pixels[index + 1]
        const blue = pixels[index + 2]
        const alpha = pixels[index + 3]
        const max = Math.max(red, green, blue)
        const min = Math.min(red, green, blue)

        if (alpha < 90 || max > 244 || max - min < 18) {
          continue
        }

        totalRed += red
        totalGreen += green
        totalBlue += blue
        count += 1
      }

      if (!count) {
        resolve({ accent: '#087A25', secondary: '#E9F8DF' })
        return
      }

      const accent = getReadableAccent(totalRed / count, totalGreen / count, totalBlue / count)
      resolve({ accent, secondary: mixWithWhite(accent) })
    })
    image.addEventListener('error', () => reject(new Error('No se pudo cargar el logo.')))
    image.src = imageSource
  })
}

function buildEmptyTrainingForm(category = 'Sub 8'): NewTrainingForm {
  return {
    month: '2026-04',
    weekdays: ['6'],
    time: '18:00',
    category,
    location: 'Cancha 1',
  }
}

function buildEmptyMatchForm(category = 'Sub 8'): NewMatchForm {
  return {
    title: 'Partido amistoso',
    date: '2026-04-30',
    time: '10:00',
    category,
    location: 'Cancha principal',
    opponent: '',
  }
}

function formatEventDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    weekday: 'short',
  })
}

const chileanRegions = [
  { region: 'Región de Arica y Parinacota', communes: ['Arica', 'Camarones', 'Putre', 'General Lagos'] },
  { region: 'Región de Tarapacá', communes: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica', 'Huara', 'Camiña', 'Colchane'] },
  { region: 'Región de Antofagasta', communes: ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'Taltal', 'San Pedro de Atacama', 'María Elena', 'Sierra Gorda'] },
  { region: 'Región de Atacama', communes: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Huasco', 'Freirina'] },
  { region: 'Región de Coquimbo', communes: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Salamanca', 'Los Vilos', 'Vicuña', 'Monte Patria'] },
  { region: 'Región de Valparaíso', communes: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón', 'Quillota', 'San Antonio', 'Los Andes', 'San Felipe'] },
  {
    region: 'Región Metropolitana de Santiago',
    communes: [
      'Santiago',
      'Cerrillos',
      'Cerro Navia',
      'Conchalí',
      'El Bosque',
      'Estación Central',
      'Huechuraba',
      'Independencia',
      'La Cisterna',
      'La Florida',
      'La Granja',
      'La Pintana',
      'La Reina',
      'Las Condes',
      'Lo Barnechea',
      'Lo Espejo',
      'Lo Prado',
      'Macul',
      'Maipú',
      'Ñuñoa',
      'Pedro Aguirre Cerda',
      'Peñalolén',
      'Providencia',
      'Pudahuel',
      'Puente Alto',
      'Quilicura',
      'Quinta Normal',
      'Recoleta',
      'Renca',
      'San Bernardo',
      'San Joaquín',
      'San Miguel',
      'San Ramón',
      'Vitacura',
    ],
  },
  { region: "Región del Libertador General Bernardo O'Higgins", communes: ['Rancagua', 'Machalí', 'Graneros', 'Rengo', 'San Fernando', 'Santa Cruz', 'Pichilemu', 'Mostazal'] },
  { region: 'Región del Maule', communes: ['Talca', 'Curicó', 'Linares', 'Cauquenes', 'Molina', 'San Javier', 'Constitución', 'Parral'] },
  { region: 'Región de Ñuble', communes: ['Chillán', 'Chillán Viejo', 'Bulnes', 'San Carlos', 'Coihueco', 'Yungay', 'Quirihue', 'Cobquecura'] },
  { region: 'Región del Biobío', communes: ['Concepción', 'Talcahuano', 'Chiguayante', 'San Pedro de la Paz', 'Coronel', 'Los Ángeles', 'Lota', 'Tomé'] },
  { region: 'Región de La Araucanía', communes: ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol', 'Victoria', 'Lautaro', 'Nueva Imperial'] },
  { region: 'Región de Los Ríos', communes: ['Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli', 'Los Lagos', 'Paillaco', 'Lanco', 'Mariquina'] },
  { region: 'Región de Los Lagos', communes: ['Puerto Montt', 'Puerto Varas', 'Osorno', 'Castro', 'Ancud', 'Frutillar', 'Calbuco', 'Quellón'] },
  { region: 'Región de Aysén del General Carlos Ibáñez del Campo', communes: ['Coyhaique', 'Puerto Aysén', 'Chile Chico', 'Cochrane', 'Puerto Cisnes', 'Guaitecas'] },
  { region: 'Región de Magallanes y de la Antártica Chilena', communes: ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Cabo de Hornos', 'Primavera', 'Timaukel'] },
]

function buildEmptyStudentForm(category: string): NewStudentForm {
  return {
    name: '',
    rut: '',
    category: category === 'Todas' ? 'Sub 8' : category,
    guardian: '',
    phone: '',
    position: 'Volante',
    dominantFoot: 'Derecha',
    birthYear: '2017',
    shirtNumber: '10',
    notes: '',
    medical: 'Sin observaciones',
  }
}

function buildEmptySchoolForm(): NewSchoolForm {
  const defaultRegion = chileanRegions.find((item) => item.region === 'Región Metropolitana de Santiago') ?? chileanRegions[0]
  const defaultCommune = defaultRegion.communes[0]

  return {
    name: 'Escuela Nuevo Barrio',
    city: `${defaultCommune}, ${defaultRegion.region}`,
    region: defaultRegion.region,
    commune: defaultCommune,
    initials: 'NB',
    logo: '',
    accent: '#087A25',
    secondary: '#E9F8DF',
    adminName: 'Nuevo encargado',
    adminRut: '55555555-5',
    adminPassword: 'demo123',
    contactEmail: 'contacto@escuela.cl',
    plan: 'Inicial',
    monthlyFee: '$30.000',
  }
}

function buildEmptyUserForm(schoolId = initialSchools[0].id): NewUserForm {
  return {
    name: 'Nuevo usuario escuela',
    rut: '55555555-5',
    password: 'demo123',
    role: 'DT',
    schoolId,
    category: 'Sub 8',
  }
}

function buildEmptyCategoryForm(): NewCategoryForm {
  return {
    label: 'Femenina Sub 10',
    branch: 'Femenina',
  }
}

function buildEmptyExpenseForm(): NewExpenseForm {
  return {
    title: 'Arriendo cancha',
    category: 'Infraestructura',
    categoryDetail: '',
    amount: '$50.000',
    date: '2026-04-25',
    status: 'Pagado',
    receiptName: '',
    receiptUrl: '',
  }
}

function buildEmptyIncomeForm(): NewIncomeForm {
  return {
    title: 'Inscripcion alumno',
    category: 'Inscripcion',
    categoryDetail: '',
    amount: '$30.000',
    date: '2026-04-25',
    status: 'Recibido',
    receiptName: '',
    receiptUrl: '',
  }
}

function getRoleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    SuperAdmin: 'SuperAdmin',
    Director: 'Admin escuela',
    DT: 'Profesor',
    Finanzas: 'Finanzas',
    Alumno: 'Alumno',
  }

  return labels[role]
}

function getDefaultPermissions(role: UserRole, category: string) {
  const permissions: Record<UserRole, string[]> = {
    SuperAdmin: [
      'Control total',
      'Crear escuelas',
      'Editar escuelas',
      'Gestionar usuarios',
      'Editar usuarios',
      'Asignar permisos',
      'Bloquear cuentas',
      'Reiniciar claves',
      'Revisar finanzas',
      'Exportar reportes',
    ],
    Director: ['Gestion escolar', 'Alumnos', 'Asistencia', 'Finanzas', 'Mensajes', 'Exportar reportes'],
    DT: ['Asistencia', `Alumnos ${category}`, 'Comentarios deportivos', 'Mensajes'],
    Finanzas: ['Pagos', 'Conciliacion', 'Mensajes de cobro', 'Exportar reportes'],
    Alumno: ['Perfil propio', 'Pagos propios', 'Mensajes'],
  }

  return permissions[role]
}

const storedAppKey = 'adnfutbol-state-v1'

function loadStoredAppState(): Partial<StoredAppState> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawState = window.localStorage.getItem(storedAppKey)

    if (!rawState) {
      return {}
    }

    const state = JSON.parse(rawState) as Partial<StoredAppState>

    return {
      ...state,
      attendanceRecords: state.attendanceRecords?.map((record) => ({
        ...record,
        schoolId: record.schoolId ?? 'los-cracks',
      })),
      eventAttendance: state.eventAttendance ?? [],
      events: state.events?.map((event) => ({
        ...event,
        schoolId: event.schoolId ?? 'los-cracks',
      })),
      payments: state.payments?.map((payment) => ({
        ...payment,
        schoolId: payment.schoolId ?? 'los-cracks',
      })),
      students: state.students?.map((student) => ({
        ...student,
        schoolId: student.schoolId ?? 'los-cracks',
      })),
    }
  } catch {
    return {}
  }
}

function saveStoredAppState(state: StoredAppState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(storedAppKey, JSON.stringify(state))
  void fetch('/api/state', {
    body: JSON.stringify(state),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  }).catch(() => undefined)
}
function SectionTabs({
  value,
  onChange,
  tabs,
}: {
  value: string
  onChange: (v: string) => void
  tabs: { id: string; label: string }[]
}) {
  return (
    <div className="tabs-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={value === tab.id ? 'active' : ''}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function App() {
  const [storedState] = useState(() => loadStoredAppState())
  const [isPersistenceReady, setIsPersistenceReady] = useState(false)
  const [authStep, setAuthStep] = useState<AuthStep>('credentials')
  const [loginRut, setLoginRut] = useState('99999999-9')
  const [password, setPassword] = useState('demo123')
  const [coach, setCoach] = useState<User | null>(null)
  const [authNotice, setAuthNotice] = useState('')
  const [schools, setSchools] = useState<School[]>(() => storedState.schools ?? initialSchools)
  const [newSchoolForm, setNewSchoolForm] = useState<NewSchoolForm>(() => buildEmptySchoolForm())
  const [users, setUsers] = useState<User[]>(() => storedState.users ?? demoUsers)
  const [newUserForm, setNewUserForm] = useState<NewUserForm>(() => buildEmptyUserForm())
  const [schoolUserForm, setSchoolUserForm] = useState<NewUserForm>(() => buildEmptyUserForm('los-cracks'))
  const [bulkUserText, setBulkUserText] = useState('')
  const [superAdminPreviewSchoolId, setSuperAdminPreviewSchoolId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<View>('panel')
  const [students, setStudents] = useState<Student[]>(() => storedState.students ?? initialStudents)
  const [categories, setCategories] = useState<Category[]>(() => storedState.categories ?? initialCategories)
  const [newCategoryForm, setNewCategoryForm] = useState<NewCategoryForm>(() => buildEmptyCategoryForm())
  const [expenses, setExpenses] = useState<Expense[]>(() => storedState.expenses ?? initialExpenses)
  const [incomes, setIncomes] = useState<Income[]>(() => storedState.incomes ?? initialIncomes)
  const [newExpenseForm, setNewExpenseForm] = useState<NewExpenseForm>(() => buildEmptyExpenseForm())
  const [newIncomeForm, setNewIncomeForm] = useState<NewIncomeForm>(() => buildEmptyIncomeForm())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [attendanceCategory, setAttendanceCategory] = useState('Sub 8')
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>(() => storedState.attendanceRecords ?? initialAttendanceList)
  const [payments, setPayments] = useState<Payment[]>(() => storedState.payments ?? initialPaymentList)
  const [events, setEvents] = useState<CalendarEvent[]>(() => storedState.events ?? initialEvents)
  const [eventAttendance, setEventAttendance] = useState<EventAttendance[]>(() => storedState.eventAttendance ?? initialEventAttendance)
  const [selectedEventId, setSelectedEventId] = useState(initialEvents[0]?.id ?? '')
  const [trainingForm, setTrainingForm] = useState<NewTrainingForm>(() => buildEmptyTrainingForm())
  const [matchForm, setMatchForm] = useState<NewMatchForm>(() => buildEmptyMatchForm())
  const [bulkEventText, setBulkEventText] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'Todos'>('Todos')
  const [financeStatusFilter, setFinanceStatusFilter] = useState<PaymentStatus | 'Todos'>('Todos')
  const [reportDate, setReportDate] = useState('2026-04-25')
  const [reportCategory, setReportCategory] = useState('Todas')
  const [generatedReport, setGeneratedReport] = useState<ReportResult | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState(messageTemplates[1].id)
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudents[0].id)
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialStudents[0].id)
  const [messageMode, setMessageMode] = useState<MessageMode>('individual')
  const [bulkCategory, setBulkCategory] = useState('Todas')
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [studentForm, setStudentForm] = useState<NewStudentForm>(() => buildEmptyStudentForm('Sub 8'))
  const [bulkImportText, setBulkImportText] = useState('')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [changingPasswordUserId, setChangingPasswordUserId] = useState<string | null>(null)
  const [newPasswordValue, setNewPasswordValue] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadServerState() {
      try {
        const response = await fetch('/api/state')
        const serverState = (await response.json()) as Partial<StoredAppState> | null

        if (!isMounted) {
          return
        }

        if (serverState?.schools?.length) {
          setSchools(serverState.schools)
          setUsers(serverState.users ?? demoUsers)
          setStudents(serverState.students ?? initialStudents)
          setCategories(serverState.categories ?? initialCategories)
          setExpenses(serverState.expenses ?? initialExpenses)
          setIncomes(serverState.incomes ?? initialIncomes)
          setAttendanceRecords(serverState.attendanceRecords ?? initialAttendanceList)
          setPayments(serverState.payments ?? initialPaymentList)
          setEvents(serverState.events ?? initialEvents)
          setEventAttendance(serverState.eventAttendance ?? initialEventAttendance)
        }
      } catch {
        // Si el archivo local aun no existe, se usa localStorage como respaldo.
      } finally {
        if (isMounted) {
          setIsPersistenceReady(true)
        }
      }
    }

    void loadServerState()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isPersistenceReady) {
      return
    }

    saveStoredAppState({
      attendanceRecords,
      categories,
      eventAttendance,
      events,
      expenses,
      incomes,
      payments,
      schools,
      students,
      users,
    })
  }, [attendanceRecords, categories, eventAttendance, events, expenses, incomes, isPersistenceReady, payments, schools, students, users])

  const isSuperAdmin = coach?.role === 'SuperAdmin'
  const isFinance = coach?.role === 'Finanzas'
  const isStudentPortal = coach?.role === 'Alumno'
  const school = schools.find((item) => item.id === coach?.schoolId) ?? schools[0]
  const canSeeAll = coach?.role === 'Director'
  const canManageStudents = coach?.role === 'Director' || coach?.role === 'DT'
  const canUseFinance = coach?.role === 'Director' || coach?.role === 'Finanzas'
  const canUseAttendance = coach?.role === 'Director' || coach?.role === 'DT'
  const canSeeStudents = coach?.role === 'Director' || coach?.role === 'DT'
  const allowedCategory = coach?.category ?? 'Todas'
  const schoolCategories = useMemo(
    () => categories.filter((category) => category.schoolId === school.id),
    [categories, school.id],
  )
  const schoolUsers = useMemo(
    () => users.filter((user) => user.schoolId === school.id && user.role !== 'SuperAdmin'),
    [school.id, users],
  )
  const scopedExpenses = useMemo(
    () => expenses.filter((expense) => expense.schoolId === school.id),
    [expenses, school.id],
  )
  const scopedIncomes = useMemo(
    () => incomes.filter((income) => income.schoolId === school.id),
    [incomes, school.id],
  )
  const schoolStudents = useMemo(
    () => students.filter((student) => student.schoolId === school.id),
    [school.id, students],
  )
  const schoolAttendanceRecords = useMemo(
    () => attendanceRecords.filter((record) => record.schoolId === school.id),
    [attendanceRecords, school.id],
  )
  const schoolPayments = useMemo(
    () => payments.filter((payment) => payment.schoolId === school.id),
    [payments, school.id],
  )
  const schoolEvents = useMemo(
    () =>
      events
        .filter((event) => event.schoolId === school.id)
        .sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`)),
    [events, school.id],
  )
  const emptyStudent = useMemo<Student>(
    () => ({
      id: 0,
      schoolId: school.id,
      name: 'Sin alumnos',
      rut: '00000000-0',
      category: 'Sin categoria',
      guardian: 'Sin apoderado',
      phone: '56900000000',
      status: 'Revision',
      paymentStatus: 'Pendiente',
      attendance: '0%',
      position: 'Sin posicion',
      dominantFoot: 'Sin definir',
      birthYear: 0,
      shirtNumber: 0,
      photoTone: '#65736b',
      strengths: ['Sin registros'],
      notes: 'Esta escuela todavia no tiene alumnos registrados.',
      coachComment: '',
      medical: 'Sin observaciones',
      goals: 0,
      assists: 0,
    }),
    [school.id],
  )

  const scopedStudents = useMemo(() => {
    if (coach?.role === 'Alumno' && coach.studentId) {
      return schoolStudents.filter((student) => student.id === coach.studentId)
    }

    if (!coach || canSeeAll) {
      return schoolStudents
    }

    return schoolStudents.filter((student) => student.category === allowedCategory)
  }, [allowedCategory, canSeeAll, coach, schoolStudents])

  const scopedAttendance = useMemo(() => {
    if (!coach || canSeeAll) {
      return schoolAttendanceRecords
    }

    return schoolAttendanceRecords.filter((record) => record.category === allowedCategory)
  }, [allowedCategory, canSeeAll, coach, schoolAttendanceRecords])

  const scopedPayments = useMemo(() => {
    if (!coach || canSeeAll) {
      return schoolPayments
    }

    return schoolPayments.filter((payment) => payment.category === allowedCategory)
  }, [allowedCategory, canSeeAll, coach, schoolPayments])

  const scopedCategories = useMemo(() => {
    if (!coach || canSeeAll) {
      return schoolCategories
    }

    return schoolCategories.filter((category) => category.label === allowedCategory)
  }, [allowedCategory, canSeeAll, coach, schoolCategories])

  const copy = viewCopy[activeView]
  const selectedTemplate = messageTemplates.find((template) => template.id === selectedTemplateId) ?? messageTemplates[0]
  const messageTarget = scopedStudents.find((student) => student.id === selectedStudentId) ?? scopedStudents[0] ?? emptyStudent
  const selectedPlayer = scopedStudents.find((student) => student.id === selectedPlayerId) ?? scopedStudents[0] ?? emptyStudent

  const categoryOptions = useMemo(() => {
    if (isStudentPortal) {
      return [allowedCategory]
    }

    if (!coach || canSeeAll) {
      return ['Todas', ...schoolCategories.map((category) => category.label)]
    }

    return [allowedCategory]
  }, [allowedCategory, canSeeAll, coach, isStudentPortal, schoolCategories])

  const roleNavItems = useMemo(() => {
    if (coach?.role === 'Director') {
      return navItems
    }

    if (coach?.role === 'DT') {
      return navItems.filter((item) => ['panel', 'alumnos', 'eventos', 'asistencia', 'mensajes', 'perfil'].includes(item.id))
    }

    if (isFinance) {
      return navItems.filter((item) => ['panel', 'finanzas', 'balance', 'pagos', 'mensajes', 'perfil'].includes(item.id))
    }

    if (isStudentPortal) {
      return navItems.filter((item) => ['eventos', 'perfil', 'pagos', 'mensajes'].includes(item.id))
    }

    return navItems.filter((item) => item.id !== 'finanzas' || canUseFinance)
  }, [canUseFinance, coach?.role, isFinance, isStudentPortal])

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return scopedStudents.filter((student) => {
      const matchesCategory = selectedCategory === 'Todas' || student.category === selectedCategory
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.rut.toLowerCase().includes(query) ||
        student.guardian.toLowerCase().includes(query) ||
        student.category.toLowerCase().includes(query) ||
        student.position.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [scopedStudents, searchTerm, selectedCategory])

  const attendanceForCategory = useMemo(
    () => scopedAttendance.filter((record) => record.category === attendanceCategory),
    [attendanceCategory, scopedAttendance],
  )

  const visiblePayments = useMemo(() => {
    if (paymentFilter === 'Todos') {
      return scopedPayments
    }

    return scopedPayments.filter((payment) => payment.status === paymentFilter)
  }, [paymentFilter, scopedPayments])

  const bulkRecipients = useMemo(() => {
    if (bulkCategory === 'Todas') {
      return scopedStudents
    }

    return scopedStudents.filter((student) => student.category === bulkCategory)
  }, [bulkCategory, scopedStudents])

  const presentToday = scopedAttendance.filter((record) => record.status === 'Presente').length
  const attendancePercentage = scopedAttendance.length ? Math.round((presentToday / scopedAttendance.length) * 100) : 0
  const pendingPayments = scopedPayments.filter((payment) => payment.status !== 'Pagado')
  const individualMessage = `${selectedTemplate.body}\n\nApoderado: ${messageTarget.guardian}`
  const bulkMessage = `${selectedTemplate.body}\n\n${school.name} - ${bulkCategory === 'Todas' ? 'Todas las categorias' : bulkCategory}`
  const whatsappLink = getWhatsappLink(messageTarget.phone, individualMessage)

  const stats = ([
    {
      label: 'Alumnos visibles',
      value: String(scopedStudents.length),
      detail: canSeeAll ? 'Todas las categorias' : allowedCategory,
      icon: Users,
      tone: 'green',
      target: 'alumnos',
    },
    {
      label: 'Asistencia hoy',
      value: `${attendancePercentage}%`,
      detail: canSeeAll ? 'Resumen escuela' : `${allowedCategory} en cancha`,
      icon: CalendarCheck,
      tone: 'blue',
      target: 'asistencia',
    },
    {
      label: 'Pagos pendientes',
      value: String(pendingPayments.length),
      detail: canSeeAll ? 'Pendientes escuela' : `Pendientes ${allowedCategory}`,
      icon: CircleDollarSign,
      tone: 'amber',
      target: 'pagos',
    },
    {
      label: 'Avisos masivos',
      value: String(bulkRecipients.length),
      detail: 'Apoderados disponibles',
      icon: Bell,
      tone: 'red',
      target: 'mensajes',
    },
  ] satisfies Stat[]).filter((stat) => roleNavItems.some((item) => item.id === stat.target))

  function login() {
    const normalizedRut = normalizeRut(loginRut)

    if (!isValidRutFormat(normalizedRut)) {
      setAuthNotice('Ingresa el RUT sin puntos y con guion. Ejemplo: 11111111-1 o 100000000-K.')
      return
    }

    const foundCoach = users.find(
      (item) => item.rut === normalizedRut && item.password === password,
    )

    if (!foundCoach) {
      setAuthNotice('RUT o contrasena incorrectos. Usa demo123 para probar.')
      return
    }

    if (foundCoach.status === 'Bloqueado') {
      setAuthNotice('Esta cuenta esta bloqueada. El SuperAdmin debe reactivarla.')
      return
    }

    setCoach(foundCoach)
    setSuperAdminPreviewSchoolId(null)
    setAuthNotice('')
    setAuthStep('app')
    setActiveView('panel')

    if (foundCoach.role === 'SuperAdmin') {
      return
    }

    const firstCategory = foundCoach.role === 'Director' || foundCoach.role === 'Finanzas' ? 'Todas' : foundCoach.category
    const firstStudent = students.find(
      (student) =>
        student.schoolId === foundCoach.schoolId &&
        (firstCategory === 'Todas' || student.category === firstCategory),
    )

    setActiveView(foundCoach.role === 'Finanzas' ? 'finanzas' : foundCoach.role === 'Alumno' ? 'perfil' : 'panel')
    setSelectedCategory(firstCategory)
    setAttendanceCategory(firstCategory === 'Todas' ? 'Sub 8' : firstCategory)
    setBulkCategory(firstCategory)
    setSchoolUserForm(buildEmptyUserForm(foundCoach.schoolId ?? schools[0]?.id))

    if (firstStudent) {
      setSelectedStudentId(firstStudent.id)
      setSelectedPlayerId(firstStudent.id)
    }
  }

  function logout() {
    setCoach(null)
    setAuthStep('credentials')
    setActiveView('panel')
    setNotice('')
    setSuperAdminPreviewSchoolId(null)
  }

  function navigateTo(view: View) {
    const canOpenView = roleNavItems.some((item) => item.id === view)

    if (!canOpenView) {
      setActiveView(roleNavItems[0]?.id ?? 'panel')
      setNotice('Tu perfil no tiene permiso para abrir esa seccion.')
      return
    }

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
        record.schoolId === school.id && record.category === attendanceCategory
          ? { ...record, status: 'Presente', time: 'Ahora' }
          : record,
      ),
    )
  }

  function markPayment(id: number, status: PaymentStatus) {
    setPayments((records) => records.map((payment) => (payment.id === id ? { ...payment, status } : payment)))
  }

  function updateTrainingForm(field: keyof NewTrainingForm, value: string) {
    setTrainingForm((current) => ({ ...current, [field]: value }))
  }

  function toggleTrainingWeekday(day: string) {
    setTrainingForm((current) => {
      const hasDay = current.weekdays.includes(day)

      return {
        ...current,
        weekdays: hasDay ? current.weekdays.filter((item) => item !== day) : [...current.weekdays, day],
      }
    })
  }

  function updateMatchForm(field: keyof NewMatchForm, value: string) {
    setMatchForm((current) => ({ ...current, [field]: value }))
  }

  function addMonthlyTrainings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!trainingForm.month || !trainingForm.weekdays.length || !trainingForm.time || !trainingForm.category) {
      setNotice('Selecciona mes, dias, horario y categoria para crear entrenamientos.')
      return
    }

    const [year, month] = trainingForm.month.split('-').map(Number)
    const selectedDays = new Set(trainingForm.weekdays.map(Number))
    const createdEvents: CalendarEvent[] = []
    const existingKeys = new Set(
      events.map((item) => `${item.schoolId}-${item.type}-${item.category}-${item.date}-${item.time}`),
    )

    for (let day = 1; day <= new Date(year, month, 0).getDate(); day += 1) {
      const currentDate = new Date(year, month - 1, day)

      if (!selectedDays.has(currentDate.getDay())) {
        continue
      }

      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const duplicateKey = `${school.id}-Entrenamiento-${trainingForm.category}-${date}-${trainingForm.time}`

      if (existingKeys.has(duplicateKey)) {
        continue
      }

      createdEvents.push({
        id: `event-training-${school.id}-${trainingForm.category}-${date}-${trainingForm.time}`.replace(/[^a-zA-Z0-9-]+/g, '-'),
        schoolId: school.id,
        type: 'Entrenamiento',
        title: `Entrenamiento ${trainingForm.category}`,
        category: trainingForm.category,
        date,
        time: trainingForm.time,
        location: trainingForm.location.trim() || 'Cancha por definir',
      })
    }

    if (!createdEvents.length) {
      setNotice('No se crearon entrenamientos nuevos. Revisa si ya existian para esos dias y horario.')
      return
    }

    setEvents((current) => [...current, ...createdEvents])
    setSelectedEventId(createdEvents[0].id)
    setNotice(`${createdEvents.length} entrenamientos creados para ${trainingForm.month}.`)
  }

  function addMatchEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!matchForm.title.trim() || !matchForm.date || !matchForm.time || !matchForm.category) {
      setNotice('Completa nombre, fecha, hora y categoria del partido.')
      return
    }

    const newEvent: CalendarEvent = {
      id: `event-match-${school.id}-${matchForm.category}-${matchForm.date}-${Date.now()}`.replace(/[^a-zA-Z0-9-]+/g, '-'),
      schoolId: school.id,
      type: 'Partido',
      title: matchForm.title.trim(),
      category: matchForm.category,
      date: matchForm.date,
      time: matchForm.time,
      location: matchForm.location.trim() || 'Cancha por definir',
      opponent: matchForm.opponent.trim(),
    }

    setEvents((current) => [...current, newEvent])
    setSelectedEventId(newEvent.id)
    setMatchForm(buildEmptyMatchForm(matchForm.category))
    setNotice(`Partido creado para ${newEvent.category}.`)
  }

  function saveBulkEvents(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const lines = bulkEventText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const validTypes: EventType[] = ['Entrenamiento', 'Partido']
    const importedEvents: CalendarEvent[] = []

    lines.forEach((line, index) => {
      const [typeValue, titleValue, categoryValue, date, time, locationValue, opponentValue = ''] = line
        .split(line.includes(';') ? ';' : '\t')
        .map((item) => item.trim())
      const normalizedType = validTypes.find((type) => type.toLowerCase() === typeValue.toLowerCase())

      if (!normalizedType || !categoryValue || !date || !time) {
        return
      }

      importedEvents.push({
        id: `event-bulk-${school.id}-${Date.now()}-${index}`.replace(/[^a-zA-Z0-9-]+/g, '-'),
        schoolId: school.id,
        type: normalizedType,
        title: titleValue || (normalizedType === 'Partido' ? 'Partido' : `Entrenamiento ${categoryValue}`),
        category: categoryValue,
        date,
        time,
        location: locationValue || 'Cancha por definir',
        opponent: normalizedType === 'Partido' ? opponentValue : undefined,
      })
    })

    if (!importedEvents.length) {
      setNotice('No se importaron eventos. Usa: Tipo;Titulo;Categoria;Fecha;Hora;Lugar;Rival')
      return
    }

    setEvents((current) => [...current, ...importedEvents])
    setSelectedEventId(importedEvents[0].id)
    setBulkEventText('')
    setNotice(`${importedEvents.length} eventos importados correctamente.`)
  }

  function markEventAttendance(eventId: string, student: Student, status: EventAttendanceStatus) {
    const targetEvent = events.find((item) => item.id === eventId)

    setEventAttendance((current) => [
      ...current.filter((item) => item.eventId !== eventId || item.studentId !== student.id),
      { eventId, studentId: student.id, status },
    ])

    if (!targetEvent || targetEvent.type !== 'Entrenamiento' || status === 'Confirmado') {
      return
    }

    setAttendanceRecords((records) => {
      const nextStatus = status as AttendanceStatus
      const timeByStatus: Record<AttendanceStatus, string> = {
        Presente: targetEvent.time,
        Ausente: 'Sin aviso',
        Justificado: 'Aviso apoderado',
        Pendiente: 'Sin marcar',
      }
      const existingRecord = records.find(
        (record) =>
          record.schoolId === school.id &&
          record.date === targetEvent.date &&
          record.studentId === student.id,
      )

      if (existingRecord) {
        return records.map((record) =>
          record.id === existingRecord.id ? { ...record, status: nextStatus, time: timeByStatus[nextStatus] } : record,
        )
      }

      return [
        ...records,
        {
          id: Math.max(...records.map((record) => record.id), 0) + 1,
          schoolId: school.id,
          studentId: student.id,
          name: student.name,
          category: student.category,
          status: nextStatus,
          time: timeByStatus[nextStatus],
          date: targetEvent.date,
        },
      ]
    })
  }

  function openNewStudent() {
    navigateTo('alumnos')
    const defaultCategory = canSeeAll ? (selectedCategory === 'Todas' ? attendanceCategory : selectedCategory) : allowedCategory

    setStudentForm(buildEmptyStudentForm(defaultCategory))
    setIsStudentFormOpen(true)
    setNotice('')
  }

  function openBulkImport() {
    if (!canSeeAll) {
      setNotice('La carga masiva esta disponible solo para el administrador/director.')
      return
    }

    navigateTo('alumnos')
    setBulkImportText('Martin Gonzalez;26111222-3;Sub 8;Paula Gonzalez;912345678;Delantero;2017;11')
    setIsBulkImportOpen(true)
    setNotice('')
  }

  function closeBulkImport() {
    setIsBulkImportOpen(false)
  }

  function closeNewStudent() {
    setIsStudentFormOpen(false)
  }

  function updateStudentForm(field: keyof NewStudentForm, value: string) {
    setStudentForm((current) => ({ ...current, [field]: value }))
  }

  function saveNewStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!studentForm.name.trim() || !studentForm.rut.trim() || !studentForm.guardian.trim() || !studentForm.phone.trim()) {
      setNotice('Completa nombre, RUT, apoderado y telefono para crear el alumno.')
      return
    }

    const normalizedStudentRut = normalizeRut(studentForm.rut)

    if (!isValidRutFormat(normalizedStudentRut)) {
      setNotice('El RUT del alumno debe ir sin puntos y con guion. Ejemplo: 11111111-1.')
      return
    }

    const newId = Math.max(...students.map((student) => student.id), 0) + 1
    const cleanPhone = studentForm.phone.replace(/\D/g, '')
    const newStudent: Student = {
      id: newId,
      schoolId: school.id,
      name: studentForm.name.trim(),
      rut: normalizedStudentRut,
      category: studentForm.category,
      guardian: studentForm.guardian.trim(),
      phone: cleanPhone.startsWith('56') ? cleanPhone : `56${cleanPhone}`,
      status: 'Activo',
      paymentStatus: 'Pendiente',
      attendance: '0%',
      position: studentForm.position,
      dominantFoot: studentForm.dominantFoot,
      birthYear: Number(studentForm.birthYear) || 2017,
      shirtNumber: Number(studentForm.shirtNumber) || 10,
      photoTone: '#087a25',
      strengths: ['En observacion'],
      notes: studentForm.notes.trim() || 'Ficha creada recientemente. Pendiente evaluacion del DT.',
      coachComment: '',
      medical: studentForm.medical.trim() || 'Sin observaciones',
      goals: 0,
      assists: 0,
    }

    setStudents((current) => [...current, newStudent])
    setAttendanceRecords((records) => [
      ...records,
      {
        id: Math.max(...records.map((record) => record.id), 0) + 1,
        schoolId: school.id,
        studentId: newId,
        name: newStudent.name,
        category: newStudent.category,
        status: 'Pendiente',
        time: 'Sin marcar',
        date: '2026-04-25',
      },
    ])
    setPayments((records) => [
      ...records,
      {
        id: Math.max(...records.map((payment) => payment.id), 0) + 1,
        schoolId: school.id,
        studentId: newId,
        name: newStudent.name,
        category: newStudent.category,
        amount: '$30.000',
        status: 'Pendiente',
        dueDate: '10 abril',
        method: 'Sin registrar',
      },
    ])
    setSelectedCategory(newStudent.category)
    setAttendanceCategory(newStudent.category)
    setSelectedStudentId(newId)
    setSelectedPlayerId(newId)
    setIsStudentFormOpen(false)
    setNotice(`${newStudent.name} fue agregado a ${newStudent.category}.`)
  }

  function saveBulkImport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSeeAll) {
      setNotice('Solo el administrador/director puede usar carga masiva.')
      return
    }

    const lines = bulkImportText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const validCategories = new Set(schoolCategories.map((category) => category.label))
    const currentMaxStudentId = Math.max(...students.map((student) => student.id), 0)
    const currentMaxAttendanceId = Math.max(...attendanceRecords.map((record) => record.id), 0)
    const currentMaxPaymentId = Math.max(...payments.map((payment) => payment.id), 0)

    const importedStudents: Student[] = []

    lines.forEach((line, index) => {
      const [name, rut, category, guardian, phone, position = 'Volante', birthYear = '2017', shirtNumber = '10'] = line
        .split(';')
        .map((item) => item.trim())

      const normalizedStudentRut = normalizeRut(rut)

      if (!name || !isValidRutFormat(normalizedStudentRut) || !guardian || !phone || !validCategories.has(category)) {
        return
      }

      const cleanPhone = phone.replace(/\D/g, '')
      importedStudents.push({
        id: currentMaxStudentId + importedStudents.length + 1,
        schoolId: school.id,
        name,
        rut: normalizedStudentRut,
        category,
        guardian,
        phone: cleanPhone.startsWith('56') ? cleanPhone : `56${cleanPhone}`,
        status: 'Activo',
        paymentStatus: 'Pendiente',
        attendance: '0%',
        position,
        dominantFoot: 'Derecha',
        birthYear: Number(birthYear) || 2017,
        shirtNumber: Number(shirtNumber) || 10,
        photoTone: index % 2 === 0 ? '#087a25' : '#1768a6',
        strengths: ['En observacion'],
        notes: 'Alumno importado por carga masiva. Pendiente evaluacion del DT.',
        coachComment: '',
        medical: 'Sin observaciones',
        goals: 0,
        assists: 0,
      })
    })

    if (!importedStudents.length) {
      setNotice('No se pudo importar. Usa RUT sin puntos y con guion: Nombre;RUT;Categoria;Apoderado;Telefono;Posicion;Ano;Numero')
      return
    }

    setStudents((current) => [...current, ...importedStudents])
    setAttendanceRecords((records) => [
      ...records,
      ...importedStudents.map((student, index) => ({
        id: currentMaxAttendanceId + index + 1,
        schoolId: school.id,
        studentId: student.id,
        name: student.name,
        category: student.category,
        status: 'Pendiente' as AttendanceStatus,
        time: 'Sin marcar',
        date: '2026-04-25',
      })),
    ])
    setPayments((records) => [
      ...records,
      ...importedStudents.map((student, index) => ({
        id: currentMaxPaymentId + index + 1,
        schoolId: school.id,
        studentId: student.id,
        name: student.name,
        category: student.category,
        amount: '$30.000',
        status: 'Pendiente' as PaymentStatus,
        dueDate: '10 abril',
        method: 'Sin registrar',
      })),
    ])
    setSelectedCategory('Todas')
    setBulkImportText('')
    setIsBulkImportOpen(false)
    setNotice(`${importedStudents.length} alumnos importados correctamente.`)
  }

  function preparePaymentMessage(payment: Payment) {
    const targetStudent = scopedStudents.find((student) => student.id === payment.studentId || student.name === payment.name)

    if (targetStudent) {
      setSelectedStudentId(targetStudent.id)
    }

    setMessageMode('individual')
    setSelectedTemplateId('pago')
    navigateTo('mensajes')
  }

  function openPlayerProfile(studentId: number) {
    setSelectedPlayerId(studentId)
    navigateTo('perfil')
  }

  function updatePlayerComment(studentId: number, comment: string) {
    setStudents((current) =>
      current.map((student) => (student.id === studentId ? { ...student, coachComment: comment } : student)),
    )
  }

  function savePlayerComment(playerName: string) {
    setNotice(`Comentario de mejora actualizado para ${playerName}.`)
  }

  function addSchool(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      !newSchoolForm.name.trim() ||
      !newSchoolForm.region.trim() ||
      !newSchoolForm.commune.trim() ||
      !newSchoolForm.initials.trim() ||
      !newSchoolForm.adminName.trim()
    ) {
      setNotice('Completa nombre, region, comuna, iniciales y encargado para crear la escuela.')
      return
    }

    const newId = newSchoolForm.name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const newSchool: School = {
      id: `${newId || 'escuela'}-${schools.length + 1}`,
      name: newSchoolForm.name.trim(),
      city: `${newSchoolForm.commune}, ${newSchoolForm.region}`,
      initials: newSchoolForm.initials.trim().slice(0, 3).toUpperCase(),
      logo: newSchoolForm.logo,
      accent: newSchoolForm.accent,
      secondary: newSchoolForm.secondary,
      adminName: newSchoolForm.adminName.trim(),
      contactEmail: newSchoolForm.contactEmail.trim(),
      plan: newSchoolForm.plan,
      monthlyFee: newSchoolForm.plan === 'Beneficio' ? '$0' : newSchoolForm.monthlyFee.trim(),
    }
    const starterCategories: Category[] = ['Sub 6', 'Sub 8', 'Sub 10', 'Sub 12', 'Femenina Sub 12'].map((label) => ({
      id: `${newSchool.id}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      schoolId: newSchool.id,
      label,
      students: 0,
      attendance: '0%',
      branch: label.includes('Femenina') ? 'Femenina' : 'Mixta',
    }))

    setSchools((current) => [...current, newSchool])
    setCategories((current) => [...current, ...starterCategories])
    setNewUserForm(buildEmptyUserForm(newSchool.id))
    setNewSchoolForm({ ...buildEmptySchoolForm(), adminRut: `${55000000 + schools.length + 1}-5` })
    setNotice(`${newSchool.name} fue creada y guardada sin alumnos ni usuarios. Ahora puedes crear sus accesos desde Usuarios.`)
  }

  function deleteSchool(schoolId: string) {
    const targetSchool = schools.find((item) => item.id === schoolId)

    if (!targetSchool) {
      return
    }

    if (schools.length <= 1) {
      setNotice('No puedes borrar la ultima escuela disponible.')
      return
    }

    const confirmed = window.confirm(`Vas a borrar ${targetSchool.name} y sus usuarios, categorias y gastos asociados. Esta accion no se puede deshacer en esta sesion.`)

    if (!confirmed) {
      return
    }

    const remainingSchools = schools.filter((item) => item.id !== schoolId)

    setSchools(remainingSchools)
    setUsers((current) => current.filter((user) => user.schoolId !== schoolId || user.role === 'SuperAdmin'))
    setStudents((current) => current.filter((student) => student.schoolId !== schoolId))
    setAttendanceRecords((current) => current.filter((record) => record.schoolId !== schoolId))
    setPayments((current) => current.filter((payment) => payment.schoolId !== schoolId))
    setEvents((current) => current.filter((event) => event.schoolId !== schoolId))
    setEventAttendance((current) =>
      current.filter((attendance) => events.find((event) => event.id === attendance.eventId)?.schoolId !== schoolId),
    )
    setCategories((current) => current.filter((category) => category.schoolId !== schoolId))
    setExpenses((current) => current.filter((expense) => expense.schoolId !== schoolId))
    setIncomes((current) => current.filter((income) => income.schoolId !== schoolId))
    setNewUserForm(buildEmptyUserForm(remainingSchools[0]?.id ?? initialSchools[0].id))
    setNotice(`${targetSchool.name} fue borrada del prototipo.`)
  }

  function updateNewSchoolForm(field: keyof NewSchoolForm, value: string) {
    setNewSchoolForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'region'
        ? {
            city: `${chileanRegions.find((item) => item.region === value)?.communes[0] ?? ''}, ${value}`,
            commune: chileanRegions.find((item) => item.region === value)?.communes[0] ?? '',
          }
        : {}),
      ...(field === 'commune' ? { city: `${value}, ${current.region}` } : {}),
      ...(field === 'plan' && value === 'Beneficio' ? { monthlyFee: '$0' } : {}),
    }))
  }

  function updateNewUserForm(field: keyof NewUserForm, value: string) {
    setNewUserForm((current) => ({ ...current, [field]: value }))
  }

  function updateSchoolUserForm(field: keyof NewUserForm, value: string) {
    setSchoolUserForm((current) => ({ ...current, [field]: value }))
  }

  function updateNewCategoryForm(field: keyof NewCategoryForm, value: string) {
    setNewCategoryForm((current) => ({ ...current, [field]: value }))
  }

  function updateNewExpenseForm(field: keyof NewExpenseForm, value: string) {
    setNewExpenseForm((current) => ({ ...current, [field]: value }))
  }

  function updateNewIncomeForm(field: keyof NewIncomeForm, value: string) {
    setNewIncomeForm((current) => ({ ...current, [field]: value }))
  }

  function addSchoolUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (coach?.role !== 'Director') {
      setNotice('Solo el administrador de escuela puede crear usuarios de su escuela.')
      return
    }

    const normalizedRut = normalizeRut(schoolUserForm.rut)
    const duplicatedRut = users.some((user) => user.rut === normalizedRut)

    if (!schoolUserForm.name.trim() || !isValidRutFormat(normalizedRut)) {
      setNotice('Completa nombre y RUT valido para crear el usuario.')
      return
    }

    if (duplicatedRut) {
      setNotice('Ya existe un usuario con ese RUT.')
      return
    }

    const role = schoolUserForm.role === 'SuperAdmin' ? 'DT' : schoolUserForm.role
    const newUser: User = {
      id: `school-${role.toLowerCase()}-${Date.now()}`,
      name: schoolUserForm.name.trim(),
      rut: normalizedRut,
      password: schoolUserForm.password.trim() || 'demo123',
      role,
      category: role === 'Director' || role === 'Finanzas' ? 'Todas' : schoolUserForm.category,
      schoolId: school.id,
      status: 'Activo',
      lastAccess: 'Sin ingreso',
      permissions: getDefaultPermissions(role, schoolUserForm.category),
    }

    setUsers((current) => [...current, newUser])
    setSchoolUserForm(buildEmptyUserForm(school.id))
    setNotice(`${newUser.name} fue creado solo para ${school.name}.`)
  }

  function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (coach?.role !== 'Director') {
      setNotice('Solo el administrador de escuela puede crear categorias.')
      return
    }

    if (!newCategoryForm.label.trim()) {
      setNotice('Escribe el nombre de la categoria.')
      return
    }

    const label = newCategoryForm.label.trim()
    const exists = schoolCategories.some((category) => category.label.toLowerCase() === label.toLowerCase())

    if (exists) {
      setNotice('Esa categoria ya existe en tu escuela.')
      return
    }

    const slug = label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const newCategory: Category = {
      id: `${school.id}-${slug || 'categoria'}-${categories.length + 1}`,
      schoolId: school.id,
      label,
      students: 0,
      attendance: '0%',
      branch: newCategoryForm.branch,
    }

    setCategories((current) => [...current, newCategory])
    setNewCategoryForm(buildEmptyCategoryForm())
    setSelectedCategory(label)
    setAttendanceCategory(label)
    setNotice(`${label} fue creada para ${school.name}.`)
  }

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canUseFinance) {
      setNotice('Tu perfil no tiene permiso para ingresar gastos.')
      return
    }

    if (!newExpenseForm.title.trim() || !newExpenseForm.amount.trim()) {
      setNotice('Completa nombre y monto del gasto.')
      return
    }

    if (newExpenseForm.category === 'Otro' && !newExpenseForm.categoryDetail.trim()) {
      setNotice('Escribe el detalle del egreso cuando uses la categoria Otro.')
      return
    }

    const expenseCategory =
      newExpenseForm.category === 'Otro' ? `Otro: ${newExpenseForm.categoryDetail.trim()}` : newExpenseForm.category

    const newExpense: Expense = {
      id: Math.max(...expenses.map((expense) => expense.id), 0) + 1,
      schoolId: school.id,
      title: newExpenseForm.title.trim(),
      category: expenseCategory,
      amount: newExpenseForm.amount.trim(),
      date: newExpenseForm.date,
      status: newExpenseForm.status,
      receiptName: newExpenseForm.receiptName || undefined,
      receiptUrl: newExpenseForm.receiptUrl || undefined,
    }

    setExpenses((current) => [...current, newExpense])
    setNewExpenseForm(buildEmptyExpenseForm())
    setNotice(`${newExpense.title} fue ingresado al balance.`)
  }

  function markExpense(id: number, status: Expense['status']) {
    setExpenses((current) => current.map((expense) => (expense.id === id ? { ...expense, status } : expense)))
  }

  function addIncome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canUseFinance) {
      setNotice('Tu perfil no tiene permiso para ingresar ingresos.')
      return
    }

    if (!newIncomeForm.title.trim() || !newIncomeForm.amount.trim()) {
      setNotice('Completa nombre y monto del ingreso.')
      return
    }

    if (newIncomeForm.category === 'Otro' && !newIncomeForm.categoryDetail.trim()) {
      setNotice('Escribe el detalle del ingreso cuando uses la categoria Otro.')
      return
    }

    const incomeCategory =
      newIncomeForm.category === 'Otro' ? `Otro: ${newIncomeForm.categoryDetail.trim()}` : newIncomeForm.category

    const newIncome: Income = {
      id: Math.max(...incomes.map((income) => income.id), 0) + 1,
      schoolId: school.id,
      title: newIncomeForm.title.trim(),
      category: incomeCategory,
      amount: newIncomeForm.amount.trim(),
      date: newIncomeForm.date,
      status: newIncomeForm.status,
      receiptName: newIncomeForm.receiptName || undefined,
      receiptUrl: newIncomeForm.receiptUrl || undefined,
    }

    setIncomes((current) => [...current, newIncome])
    setNewIncomeForm(buildEmptyIncomeForm())
    setNotice(`${newIncome.title} fue ingresado como ingreso.`)
  }

  function markIncome(id: number, status: IncomeStatus) {
    setIncomes((current) => current.map((income) => (income.id === id ? { ...income, status } : income)))
  }

  function addUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedRut = normalizeRut(newUserForm.rut)
    const duplicatedRut = users.some((user) => user.rut === normalizedRut)

    if (!newUserForm.name.trim() || !isValidRutFormat(normalizedRut)) {
      setNotice('Completa nombre y RUT valido para crear el usuario.')
      return
    }

    if (duplicatedRut) {
      setNotice('Ya existe un usuario con ese RUT.')
      return
    }

    const selectedSchool = schools.find((item) => item.id === newUserForm.schoolId)
    const newUser: User = {
      id: `${newUserForm.role.toLowerCase()}-${Date.now()}`,
      name: newUserForm.name.trim(),
      rut: normalizedRut,
      password: newUserForm.password.trim() || 'demo123',
      role: newUserForm.role,
      category: newUserForm.role === 'Director' || newUserForm.role === 'Finanzas' ? 'Todas' : newUserForm.category,
      schoolId: newUserForm.role === 'SuperAdmin' ? undefined : newUserForm.schoolId,
      status: 'Activo',
      lastAccess: 'Sin ingreso',
      permissions: getDefaultPermissions(newUserForm.role, newUserForm.category),
    }

    setUsers((current) => [...current, newUser])
    setNewUserForm(buildEmptyUserForm(selectedSchool?.id ?? schools[0]?.id))
    setNotice(`${newUser.name} creado como ${getRoleLabel(newUser.role)} en ${selectedSchool?.name ?? 'ADNFutbol'}. Credenciales: RUT ${newUser.rut} / Clave: ${newUser.password}`)
  }

  function saveBulkUsers(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const lines = bulkUserText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const validRoles = new Set<UserRole>(['Director', 'DT', 'Finanzas', 'Alumno'])
    const existingRuts = new Set(users.map((user) => user.rut))
    const importedUsers: User[] = []

    lines.forEach((line) => {
      const [name, rut, roleValue, schoolId, category = 'Sub 8', passwordValue = 'demo123'] = line
        .split(line.includes(';') ? ';' : '\t')
        .map((item) => item.trim())
      const role = roleValue as UserRole
      const normalizedRut = normalizeRut(rut)
      const schoolExists = schools.some((item) => item.id === schoolId)

      if (!name || !validRoles.has(role) || !schoolExists || !isValidRutFormat(normalizedRut) || existingRuts.has(normalizedRut)) {
        return
      }

      existingRuts.add(normalizedRut)
      importedUsers.push({
        id: `bulk-${role.toLowerCase()}-${Date.now()}-${importedUsers.length}`,
        name,
        rut: normalizedRut,
        password: passwordValue || 'demo123',
        role,
        category: role === 'Director' || role === 'Finanzas' ? 'Todas' : category,
        schoolId,
        status: 'Activo',
        lastAccess: 'Sin ingreso',
        permissions: getDefaultPermissions(role, category),
      })
    })

    if (!importedUsers.length) {
      setNotice('No se importaron usuarios. Usa: Nombre;RUT;Rol;ID escuela;Categoria;Clave')
      return
    }

    setUsers((current) => [...current, ...importedUsers])
    setBulkUserText('')
    setNotice(`${importedUsers.length} usuarios importados correctamente.`)
  }

  function toggleUserStatus(userId: string) {
    setUsers((current) =>
      current.map((user) => {
        if (user.id !== userId || user.role === 'SuperAdmin') {
          return user
        }

        return { ...user, status: user.status === 'Bloqueado' ? 'Activo' : 'Bloqueado' }
      }),
    )
  }

  function openChangePassword(userId: string) {
    setChangingPasswordUserId(userId)
    setNewPasswordValue('')
    setNewPasswordError('')
  }

  function confirmChangePassword() {
    if (newPasswordValue.trim().length < 4) {
      setNewPasswordError('La clave debe tener al menos 4 caracteres.')
      return
    }
    setUsers((current) =>
      current.map((user) =>
        user.id === changingPasswordUserId ? { ...user, password: newPasswordValue.trim() } : user,
      ),
    )
    setNotice('Clave actualizada correctamente.')
    setChangingPasswordUserId(null)
    setNewPasswordValue('')
    setNewPasswordError('')
  }

  function cancelChangePassword() {
    setChangingPasswordUserId(null)
    setNewPasswordValue('')
    setNewPasswordError('')
  }

  function updateUserRole(userId: string, role: UserRole) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              role,
              category: role === 'Director' || role === 'Finanzas' || role === 'SuperAdmin' ? 'Todas' : user.category,
              permissions: getDefaultPermissions(role, user.category),
            }
          : user,
      ),
    )
  }

  function updateUserField(userId: string, field: keyof Pick<User, 'name' | 'rut' | 'category' | 'schoolId' | 'status'>, value: string) {
    setUsers((current) =>
      current.map((user) => {
        if (user.id !== userId) {
          return user
        }

        const nextRut = field === 'rut' ? normalizeRut(value) : user.rut

        return {
          ...user,
          [field]: field === 'rut' ? nextRut : value,
        }
      }),
    )
  }

  function toggleUserPermission(userId: string, permission: string) {
    setUsers((current) =>
      current.map((user) => {
        if (user.id !== userId) {
          return user
        }

        const hasPermission = user.permissions.includes(permission)

        return {
          ...user,
          permissions: hasPermission
            ? user.permissions.filter((item) => item !== permission)
            : [...user.permissions, permission],
        }
      }),
    )
  }

  function generateReport(type: 'finanzas' | 'asistencia') {
    const categoryLabel = reportCategory === 'Todas' ? 'todas las categorias' : reportCategory
    const generatedAt = new Date().toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    })

    if (type === 'finanzas') {
      const reportPayments =
        reportCategory === 'Todas' ? scopedPayments : scopedPayments.filter((payment) => payment.category === reportCategory)
      const paid = reportPayments.filter((payment) => payment.status === 'Pagado')
      const pending = reportPayments.filter((payment) => payment.status !== 'Pagado')
      const overdue = reportPayments.filter((payment) => payment.status === 'Atrasado')
      const expectedAmount = reportPayments.reduce((total, payment) => total + Number(payment.amount.replace(/\D/g, '')), 0)
      const collectedAmount = paid.reduce((total, payment) => total + Number(payment.amount.replace(/\D/g, '')), 0)
      const manualIncome = scopedIncomes
        .filter((income) => income.status === 'Recibido')
        .reduce((total, income) => total + Number(income.amount.replace(/\D/g, '')), 0)
      const paidExpenses = scopedExpenses
        .filter((expense) => expense.status === 'Pagado')
        .reduce((total, expense) => total + Number(expense.amount.replace(/\D/g, '')), 0)
      const balance = collectedAmount + manualIncome - paidExpenses
      const rows: ReportRow[] = [
        ...reportPayments.map((payment) => ({
          label: `Mensualidad: ${payment.name}`,
          detail: `${payment.category} - ${payment.method} - vence ${payment.dueDate}`,
          amount: payment.amount,
          status: payment.status,
        })),
        ...scopedIncomes.map((income) => ({
          label: `Ingreso: ${income.title}`,
          detail: `${income.category} - ${income.date}${income.receiptName ? ` - comprobante ${income.receiptName}` : ''}`,
          amount: income.amount,
          status: income.status,
        })),
        ...scopedExpenses.map((expense) => ({
          label: `Egreso: ${expense.title}`,
          detail: `${expense.category} - ${expense.date}${expense.receiptName ? ` - comprobante ${expense.receiptName}` : ''}`,
          amount: expense.amount,
          status: expense.status,
        })),
      ]
      const reportBase: Omit<ReportResult, 'text'> = {
        generatedAt,
        kind: 'finanzas',
        rows,
        subtitle: `${school.name} - ${categoryLabel}`,
        summary: `${paid.length} mensualidades pagadas, ${pending.length} pendientes/atrasadas y balance operativo de ${formatCurrency(balance)}.`,
        title: 'Reporte de finanzas',
        totals: [
          { label: 'Mensualidades esperadas', value: formatCurrency(expectedAmount) },
          { label: 'Mensualidades recaudadas', value: formatCurrency(collectedAmount) },
          { label: 'Ingresos manuales', value: formatCurrency(manualIncome) },
          { label: 'Gastos pagados', value: formatCurrency(paidExpenses) },
          { label: 'Pendientes/atrasados', value: String(pending.length) },
          { label: 'Atrasados', value: String(overdue.length) },
          { label: 'Balance', value: formatCurrency(balance) },
        ],
      }

      setGeneratedReport({ ...reportBase, text: buildReportText(reportBase) })
      setNotice('Reporte de finanzas generado.')
      return
    }

    const reportAttendance = scopedAttendance.filter(
      (record) => record.date === reportDate && (reportCategory === 'Todas' || record.category === reportCategory),
    )
    const present = reportAttendance.filter((record) => record.status === 'Presente').length
    const absent = reportAttendance.filter((record) => record.status === 'Ausente').length
    const justified = reportAttendance.filter((record) => record.status === 'Justificado').length
    const pending = reportAttendance.filter((record) => record.status === 'Pendiente').length
    const rows: ReportRow[] = reportAttendance.map((record) => ({
      label: record.name,
      detail: `${record.category} - ${record.time}`,
      status: record.status,
    }))
    const reportBase: Omit<ReportResult, 'text'> = {
      generatedAt,
      kind: 'asistencia',
      rows,
      subtitle: `${school.name} - ${reportDate} - ${categoryLabel}`,
      summary: `${present} presentes, ${absent} ausentes, ${justified} justificados y ${pending} pendientes.`,
      title: 'Reporte de asistencia',
      totals: [
        { label: 'Presentes', value: String(present) },
        { label: 'Ausentes', value: String(absent) },
        { label: 'Justificados', value: String(justified) },
        { label: 'Pendientes', value: String(pending) },
        { label: 'Total registros', value: String(reportAttendance.length) },
      ],
    }

    setGeneratedReport({ ...reportBase, text: buildReportText(reportBase) })
    setNotice('Reporte de asistencia generado.')
  }

  function copyGeneratedReport() {
    if (!generatedReport) {
      setNotice('Primero genera un reporte.')
      return
    }

    void navigator.clipboard
      .writeText(generatedReport.text)
      .then(() => setNotice('Reporte copiado.'))
      .catch(() => setNotice('No se pudo copiar automaticamente, pero el reporte esta visible.'))
  }

  function downloadGeneratedReport() {
    if (!generatedReport) {
      setNotice('Primero genera un reporte.')
      return
    }

    const blob = buildReportWorkbook(generatedReport)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = getReportFileName(generatedReport)
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setNotice('Reporte Excel exportado.')
  }

  function openSchoolPortal(schoolId: string) {
    const selectedSchool = schools.find((item) => item.id === schoolId)

    if (!selectedSchool) {
      return
    }

    setCoach({
      id: `portal-${selectedSchool.id}`,
      name: 'SuperAdmin',
      rut: '99999999-9',
      password: 'demo123',
      role: 'Director',
      category: 'Todas',
      schoolId: selectedSchool.id,
      status: 'Activo',
      lastAccess: 'Vista SuperAdmin',
      permissions: ['Vista completa escuela', 'Alumnos', 'Asistencia', 'Finanzas', 'Mensajes'],
    })
    setSuperAdminPreviewSchoolId(selectedSchool.id)
    setActiveView('panel')
    setSelectedCategory('Todas')
    setAttendanceCategory('Sub 8')
    setSelectedEventId(events.find((event) => event.schoolId === selectedSchool.id)?.id ?? '')
    setBulkCategory('Todas')
    setSchoolUserForm(buildEmptyUserForm(selectedSchool.id))
    setNotice(`Viendo portal de ${selectedSchool.name}.`)
  }

  function returnToSuperAdmin() {
    const superAdminUser = users.find((user) => user.role === 'SuperAdmin') ?? demoUsers[0]

    setCoach(superAdminUser)
    setSuperAdminPreviewSchoolId(null)
    setActiveView('panel')
    setNotice('Volviste al portal SuperAdmin.')
  }

  function copyMessage() {
    void navigator.clipboard
      .writeText(messageMode === 'masivo' ? bulkMessage : individualMessage)
      .then(() => setNotice(messageMode === 'masivo' ? 'Mensaje masivo copiado.' : 'Mensaje copiado.'))
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

  if (authStep !== 'app' || !coach) {
    return (
      <AuthScreen
        authNotice={authNotice}
        login={login}
        loginRut={loginRut}
        password={password}
        setLoginRut={setLoginRut}
        setPassword={setPassword}
      />
    )
  }

  if (isSuperAdmin) {
    return (
      <SuperAdminPortal
        addSchool={addSchool}
        addUser={addUser}
        bulkUserText={bulkUserText}
        categories={categories}
        deleteSchool={deleteSchool}
        editingUserId={editingUserId}
        logout={logout}
        newSchoolForm={newSchoolForm}
        newUserForm={newUserForm}
        notice={notice}
        openSchoolPortal={openSchoolPortal}
        openChangePassword={openChangePassword}
        confirmChangePassword={confirmChangePassword}
        cancelChangePassword={cancelChangePassword}
        changingPasswordUserId={changingPasswordUserId}
        newPasswordValue={newPasswordValue}
        setNewPasswordValue={setNewPasswordValue}
        newPasswordError={newPasswordError}
        saveBulkUsers={saveBulkUsers}
        schools={schools}
        setBulkUserText={setBulkUserText}
        setEditingUserId={setEditingUserId}
        toggleUserStatus={toggleUserStatus}
        toggleUserPermission={toggleUserPermission}
        updateNewSchoolForm={updateNewSchoolForm}
        updateNewUserForm={updateNewUserForm}
        updateUserField={updateUserField}
        updateUserRole={updateUserRole}
        users={users}
      />
    )
  }

  const previewSchool = schools.find((item) => item.id === superAdminPreviewSchoolId)

  return (
    <div
      className="app-shell"
      style={
        {
          '--school-accent': school.accent,
          '--school-soft': school.secondary,
          '--school-accent-rgb': hexToRgbValue(school.accent),
          '--school-deep': darkenHex(school.accent),
        } as CSSProperties
      }
    >
      <aside className="sidebar" aria-label="Navegacion principal">
        <button className="brand brand-button" onClick={() => navigateTo('panel')} type="button" aria-label="Ir al panel">
          <div className="brand-mark">
            <img src={school.logo || adnIcon} alt="ADNFutbol" />
          </div>
          <div>
            <strong>{school.name}</strong>
            <span>
              {getRoleLabel(coach.role)} - {coach.category}
            </span>
          </div>
        </button>

        {previewSchool && (
          <button className="super-return-button" onClick={returnToSuperAdmin} type="button">
            <RotateCcw size={16} aria-hidden="true" />
            Volver a SuperAdmin
          </button>
        )}

        <nav className="main-nav">{roleNavItems.map(renderNavItem)}</nav>

        <div className="school-card">
          <Trophy size={22} aria-hidden="true" />
          <p>{school.city}</p>
          <strong>{canSeeAll || isFinance ? 'Vista completa de la escuela.' : `Vista limitada a ${coach.category}.`}</strong>
          <button className="logout-button" onClick={logout} type="button">
            <LogOut size={16} aria-hidden="true" />
            Salir
          </button>
        </div>
      </aside>

      <main className="main-area">
        {previewSchool && (
          <div className="preview-banner">
            <Eye size={18} aria-hidden="true" />
            Estas viendo {previewSchool.name} como administrador. Puedes volver al SuperAdmin cuando quieras.
            <button onClick={returnToSuperAdmin} type="button">Volver</button>
          </div>
        )}
        <header className="mobile-header">
          <button className="icon-button" onClick={() => navigateTo('panel')} type="button" aria-label="Ir al panel">
            <Menu size={20} />
          </button>
          <button className="mobile-brand" onClick={() => navigateTo('panel')} type="button" aria-label="Ir al panel">
            <img src={school.logo || adnIcon} alt="" />
          </button>
          {!isStudentPortal && !isFinance && (
            <button className="icon-button" onClick={() => navigateTo('alumnos')} type="button" aria-label="Buscar">
              <Search size={20} />
            </button>
          )}
        </header>

        <section className="topbar">
          <div>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
            <div className="coach-strip">
              <span className="coach-school">{school.name}</span>
              <span>{coach.name}</span>
              <strong>{coach.role === 'Director' || coach.role === 'Finanzas' ? 'Todas las categorias' : coach.category}</strong>
            </div>
          </div>

          {activeView === 'alumnos' && (
            <div className="topbar-actions">
              {!isStudentPortal && !isFinance && (
                <button className="ghost-button" onClick={() => navigateTo('alumnos')} type="button">
                  <Search size={18} aria-hidden="true" />
                  Buscar alumno
                </button>
              )}
              {canSeeAll && (
                <button className="ghost-button" onClick={openBulkImport} type="button">
                  <Upload size={18} aria-hidden="true" />
                  Carga masiva
                </button>
              )}
              {canManageStudents && (
                <button className="primary-button" onClick={openNewStudent} type="button">
                  <Plus size={18} aria-hidden="true" />
                  Nuevo alumno
                </button>
              )}
            </div>
          )}
        </section>

        {notice && <div className="notice-banner">{notice}</div>}

        {activeView === 'panel' && (
          <DashboardPage
            attendanceRecords={scopedAttendance}
            canSeeAll={canSeeAll}
            canSeeStudents={canSeeStudents}
            canUseAttendance={canUseAttendance}
            canUseFinance={canUseFinance}
            coach={coach}
            navigateTo={navigateTo}
            payments={scopedPayments}
            preparePaymentMessage={preparePaymentMessage}
            scopedCategories={scopedCategories}
            setMessageMode={setMessageMode}
            setSelectedTemplateId={setSelectedTemplateId}
            stats={stats}
          />
        )}

        {activeView === 'alumnos' && (
          <StudentsPage
            canViewPayments={canUseFinance}
            categoryOptions={categoryOptions}
            filteredStudents={filteredStudents}
            fallbackStudent={scopedStudents[0] ?? emptyStudent}
            navigateTo={navigateTo}
            openPlayerProfile={openPlayerProfile}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            setSearchTerm={setSearchTerm}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activeView === 'eventos' && (
          <EventsPage
            addMatchEvent={addMatchEvent}
            addMonthlyTrainings={addMonthlyTrainings}
            bulkEventText={bulkEventText}
            canManageEvents={canUseAttendance}
            categoryOptions={categoryOptions}
            coach={coach}
            eventAttendance={eventAttendance}
            events={schoolEvents}
            markEventAttendance={markEventAttendance}
            matchForm={matchForm}
            saveBulkEvents={saveBulkEvents}
            scopedStudents={scopedStudents}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            setBulkEventText={setBulkEventText}
            toggleTrainingWeekday={toggleTrainingWeekday}
            trainingForm={trainingForm}
            updateMatchForm={updateMatchForm}
            updateTrainingForm={updateTrainingForm}
          />
        )}

        {activeView === 'asistencia' && (
          <AttendancePage
            attendanceRecords={scopedAttendance}
            attendanceCategory={attendanceCategory}
            attendanceForCategory={attendanceForCategory}
            copyGeneratedReport={copyGeneratedReport}
            downloadGeneratedReport={downloadGeneratedReport}
            generatedReport={generatedReport}
            generateReport={generateReport}
            markAttendance={markAttendance}
            markCategoryAsPresent={markCategoryAsPresent}
            reportCategory={reportCategory}
            reportDate={reportDate}
            scopedCategories={scopedCategories}
            setAttendanceCategory={setAttendanceCategory}
            setReportCategory={setReportCategory}
            setReportDate={setReportDate}
          />
        )}

        {activeView === 'pagos' && (
          <PaymentsPage
            canEditPayments={canUseFinance}
            markPayment={markPayment}
            paymentFilter={paymentFilter}
            payments={scopedPayments}
            preparePaymentMessage={preparePaymentMessage}
            setPaymentFilter={setPaymentFilter}
            visiblePayments={visiblePayments}
          />
        )}

        {activeView === 'finanzas' && (
          <FinancePage
            attendanceRecords={scopedAttendance}
            categoryOptions={categoryOptions}
            copyGeneratedReport={copyGeneratedReport}
            downloadGeneratedReport={downloadGeneratedReport}
            financeStatusFilter={financeStatusFilter}
            generatedReport={generatedReport}
            generateReport={generateReport}
            markPayment={markPayment}
            payments={scopedPayments}
            preparePaymentMessage={preparePaymentMessage}
            reportCategory={reportCategory}
            reportDate={reportDate}
            setFinanceStatusFilter={setFinanceStatusFilter}
            setReportCategory={setReportCategory}
            setReportDate={setReportDate}
          />
        )}

        {activeView === 'balance' && (
          <BalancePage
            addExpense={addExpense}
            addIncome={addIncome}
            expenses={scopedExpenses}
            incomes={scopedIncomes}
            markExpense={markExpense}
            markIncome={markIncome}
            markPayment={markPayment}
            newExpenseForm={newExpenseForm}
            newIncomeForm={newIncomeForm}
            payments={scopedPayments}
            school={school}
            updateNewExpenseForm={updateNewExpenseForm}
            updateNewIncomeForm={updateNewIncomeForm}
          />
        )}

        {activeView === 'gestion' && (
          <SchoolManagementPage
            addCategory={addCategory}
            addSchoolUser={addSchoolUser}
            categories={schoolCategories}
            newCategoryForm={newCategoryForm}
            school={school}
            schoolUserForm={schoolUserForm}
            updateNewCategoryForm={updateNewCategoryForm}
            updateSchoolUserForm={updateSchoolUserForm}
            users={schoolUsers}
          />
        )}

        {activeView === 'mensajes' && (
          <MessagesPage
            bulkCategory={bulkCategory}
            bulkMessage={bulkMessage}
            bulkRecipients={bulkRecipients}
            categoryOptions={categoryOptions}
            copyMessage={copyMessage}
            individualMessage={individualMessage}
            messageMode={messageMode}
            messageTarget={messageTarget}
            scopedStudents={scopedStudents}
            selectedStudentId={selectedStudentId}
            selectedTemplate={selectedTemplate}
            selectedTemplateId={selectedTemplateId}
            setBulkCategory={setBulkCategory}
            setMessageMode={setMessageMode}
            setSelectedStudentId={setSelectedStudentId}
            setSelectedTemplateId={setSelectedTemplateId}
            whatsappLink={whatsappLink}
          />
        )}

        {activeView === 'perfil' && (
          isStudentPortal ? (
            <PlayerProfilePage
              navigateTo={navigateTo}
              player={selectedPlayer}
              preparePaymentMessage={preparePaymentMessage}
              savePlayerComment={savePlayerComment}
              setSelectedStudentId={setSelectedStudentId}
              updatePlayerComment={updatePlayerComment}
            />
          ) : (
            <UserProfilePage
              attendanceRecords={scopedAttendance}
              coach={coach}
              navigateTo={navigateTo}
              payments={scopedPayments}
              school={school}
            />
          )
        )}
        <DeveerreFooter />
      </main>

      {isStudentFormOpen && (
        <AddStudentModal
          canSeeAll={canSeeAll}
          categoryOptions={categoryOptions.filter((category) => category !== 'Todas')}
          closeNewStudent={closeNewStudent}
          saveNewStudent={saveNewStudent}
          studentForm={studentForm}
          updateStudentForm={updateStudentForm}
        />
      )}

      {isBulkImportOpen && (
        <BulkImportModal
          bulkImportText={bulkImportText}
          closeBulkImport={closeBulkImport}
          saveBulkImport={saveBulkImport}
          setBulkImportText={setBulkImportText}
        />
      )}

      <nav className="bottom-nav" aria-label="Navegacion movil">
        {roleNavItems.map((item) => {
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

function AuthScreen({
  authNotice,
  login,
  loginRut,
  password,
  setLoginRut,
  setPassword,
}: {
  authNotice: string
  login: () => void
  loginRut: string
  password: string
  setLoginRut: (value: string) => void
  setPassword: (value: string) => void
}) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <img className="auth-logo" src={adnIcon} alt="ADNFutbol" />
        <div>
          <span className="panel-kicker">INGRESO</span>
          <h1>
            BIENVENIDOS A <strong>ADN</strong>FUTBOL
          </h1>
          <p>Organiza tu escuela, acompaña a tus jugadores y enfoca cada entrenamiento en mejorar.</p>
        </div>

        <label className="form-field">
          <span>RUT</span>
          <input
            inputMode="text"
            onChange={(event) => setLoginRut(normalizeRut(event.target.value))}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                login()
              }
            }}
            placeholder="11111111-1"
            value={loginRut}
          />
        </label>

        <label className="form-field">
          <span>Contrasena</span>
          <input
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                login()
              }
            }}
            type="password"
            value={password}
          />
        </label>

        <button className="primary-button" onClick={login} type="button">
          <LockKeyhole size={18} aria-hidden="true" />
          Ingresar
        </button>

        {authNotice && <div className="auth-notice">{authNotice}</div>}
      </section>
      <DeveerreFooter variant="light" />
    </main>
  )
}

function SuperAdminPortal({
  addSchool,
  addUser,
  bulkUserText,
  categories,
  deleteSchool,
  editingUserId,
  logout,
  newSchoolForm,
  newUserForm,
  notice,
  openSchoolPortal,
  openChangePassword,
  confirmChangePassword,
  cancelChangePassword,
  changingPasswordUserId,
  newPasswordValue,
  setNewPasswordValue,
  newPasswordError,
  saveBulkUsers,
  schools,
  setBulkUserText,
  setEditingUserId,
  toggleUserPermission,
  toggleUserStatus,
  updateNewSchoolForm,
  updateNewUserForm,
  updateUserField,
  updateUserRole,
  users,
}: {
  addSchool: (event: FormEvent<HTMLFormElement>) => void
  addUser: (event: FormEvent<HTMLFormElement>) => void
  bulkUserText: string
  categories: Category[]
  deleteSchool: (schoolId: string) => void
  editingUserId: string | null
  logout: () => void
  newSchoolForm: NewSchoolForm
  newUserForm: NewUserForm
  notice: string
  openSchoolPortal: (schoolId: string) => void
  openChangePassword: (userId: string) => void
  confirmChangePassword: () => void
  cancelChangePassword: () => void
  changingPasswordUserId: string | null
  newPasswordValue: string
  setNewPasswordValue: (value: string) => void
  newPasswordError: string
  saveBulkUsers: (event: FormEvent<HTMLFormElement>) => void
  schools: School[]
  setBulkUserText: (value: string) => void
  setEditingUserId: (userId: string | null) => void
  toggleUserPermission: (userId: string, permission: string) => void
  toggleUserStatus: (userId: string) => void
  updateNewSchoolForm: (field: keyof NewSchoolForm, value: string) => void
  updateNewUserForm: (field: keyof NewUserForm, value: string) => void
  updateUserField: (userId: string, field: keyof Pick<User, 'name' | 'rut' | 'category' | 'schoolId' | 'status'>, value: string) => void
  updateUserRole: (userId: string, role: UserRole) => void
  users: User[]
}) {
  const [section, setSection] = useState<SuperAdminSection>('escuelas')
  const [userTab, setUserTab] = useState<'directorio' | 'gestion'>('directorio')
  const [expandedUserSchoolId, setExpandedUserSchoolId] = useState(schools[0]?.id ?? '')
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const managedUsers = users.filter((user) => user.role !== 'SuperAdmin')
  const blockedAccounts = managedUsers.filter((user) => user.status === 'Bloqueado').length
  const pendingAccounts = managedUsers.filter((user) => user.status === 'Pendiente').length
  const selectedSchool = schools.find((school) => school.id === newUserForm.schoolId) ?? schools[0]
  const selectedSchoolCategories = categories.filter((category) => category.schoolId === selectedSchool?.id)
  const selectedRegionCommunes = chileanRegions.find((item) => item.region === newSchoolForm.region)?.communes ?? []
  const normalizedUserSearch = userSearchTerm.trim().toLowerCase()
  const userGroups = schools.map((school) => {
    const schoolUsers = managedUsers.filter((user) => user.schoolId === school.id)
    const visibleUsers = normalizedUserSearch
      ? schoolUsers.filter((user) =>
          [user.name, user.rut, user.category, getRoleLabel(user.role), user.status, school.name]
            .join(' ')
            .toLowerCase()
            .includes(normalizedUserSearch),
        )
      : schoolUsers

    return {
      school,
      total: schoolUsers.length,
      users: visibleUsers,
    }
  })
  const visibleUserGroups = normalizedUserSearch ? userGroups.filter((group) => group.users.length > 0) : userGroups
  const superSections: { id: SuperAdminSection; label: string; icon: LucideIcon }[] = [
    { id: 'escuelas', label: 'Escuelas', icon: Building2 },
    { id: 'crear', label: 'Crear escuela', icon: Plus },
    { id: 'usuarios', label: 'Usuarios', icon: UserCog },
    { id: 'carga', label: 'Carga masiva', icon: Upload },
    { id: 'permisos', label: 'Permisos', icon: ShieldCheck },
  ]

  function downloadBulkUserTemplate() {
    const blob = buildBulkUserTemplateWorkbook(schools, categories)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'plantilla-usuarios-adnfutbol.xlsx'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function handleSchoolLogoUpload(file: File | undefined) {
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const logo = String(reader.result ?? '')
      updateNewSchoolForm('logo', logo)
      void detectImageColors(logo)
        .then((colors) => {
          updateNewSchoolForm('accent', colors.accent)
          updateNewSchoolForm('secondary', colors.secondary)
        })
        .catch(() => undefined)
    })
    reader.readAsDataURL(file)
  }

  return (
    <main className="superadmin-shell">
      <section className="superadmin-topbar">
        <div className="superadmin-brand">
          <img src={adnIcon} alt="ADNFutbol" />
          <div>
            <span className="panel-kicker">SuperAdmin</span>
            <h1>Control total de escuelas</h1>
            <p>Administra escuelas, portales, marca, pagos y accesos desde un solo lugar.</p>
          </div>
        </div>
        <button className="logout-button super-logout" onClick={logout} type="button">
          <LogOut size={16} aria-hidden="true" />
          Salir
        </button>
      </section>

      <nav className="superadmin-tabs" aria-label="Menu SuperAdmin">
        {superSections.map((item) => {
          const Icon = item.icon

          return (
            <button className={section === item.id ? 'active' : ''} key={item.id} onClick={() => setSection(item.id)} type="button">
              <Icon size={17} aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {notice && <div className="notice-banner">{notice}</div>}

      {section === 'escuelas' && (
        <section className="superadmin-single">
          <article className="panel wide-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Red ADNFutbol</span>
                <h2>Escuelas activas</h2>
              </div>
              <span className="count-pill">{schools.length} escuelas</span>
            </div>

            <div className="school-network">
              {schools.map((school) => (
                <article className="school-admin-card" key={school.id} style={{ '--school-accent': school.accent, '--school-soft': school.secondary } as CSSProperties}>
                  <div className="school-admin-logo">
                    {school.logo ? <img src={school.logo} alt="" /> : school.initials}
                  </div>
                  <div>
                    <strong>{school.name}</strong>
                    <span>{school.city}</span>
                    <span>{school.plan} - Encargado: {school.adminName}</span>
                    <small>ID: {school.id}</small>
                  </div>
                  <div className="school-admin-actions">
                    <button className="small-button" onClick={() => openSchoolPortal(school.id)} type="button">
                      Ver portal
                    </button>
                    <button
                      className="small-button"
                      onClick={() => {
                        updateNewUserForm('schoolId', school.id)
                        updateNewUserForm('role', 'Director')
                        updateNewUserForm('category', 'Todas')
                        setSection('usuarios')
                      }}
                      type="button"
                    >
                      <UserCog size={15} aria-hidden="true" />
                      Crear admin
                    </button>
                    <button className="small-button danger-button" onClick={() => deleteSchool(school.id)} type="button">
                      <Trash2 size={15} aria-hidden="true" />
                      Borrar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      )}

      {section === 'crear' && (
        <section className="superadmin-single">
          <article className="panel create-school-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Nueva escuela</span>
                <h2>Crear portal</h2>
                <p>Al guardar se crea la escuela vacia; luego puedes crear sus usuarios y cargar alumnos.</p>
              </div>
            </div>

            <form className="school-form" onSubmit={addSchool}>
              <label className="form-field">
                <span>Nombre escuela</span>
                <input onChange={(event) => updateNewSchoolForm('name', event.target.value)} value={newSchoolForm.name} />
              </label>
              <div className="color-fields">
                <label className="form-field">
                  <span>Región</span>
                  <select onChange={(event) => updateNewSchoolForm('region', event.target.value)} value={newSchoolForm.region}>
                    {chileanRegions.map((item) => (
                      <option key={item.region} value={item.region}>{item.region}</option>
                    ))}
                  </select>
                </label>
                <label className="form-field">
                  <span>Comuna</span>
                  <select onChange={(event) => updateNewSchoolForm('commune', event.target.value)} value={newSchoolForm.commune}>
                    {selectedRegionCommunes.map((commune) => (
                      <option key={commune} value={commune}>{commune}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="form-field">
                <span>Logo / iniciales</span>
                <input onChange={(event) => updateNewSchoolForm('initials', event.target.value)} value={newSchoolForm.initials} />
              </label>
              <label className="form-field">
                <span>Encargado principal</span>
                <input onChange={(event) => updateNewSchoolForm('adminName', event.target.value)} value={newSchoolForm.adminName} />
              </label>
              <label className="form-field">
                <span>Correo contacto</span>
                <input onChange={(event) => updateNewSchoolForm('contactEmail', event.target.value)} value={newSchoolForm.contactEmail} />
              </label>
              <div className="color-fields">
                <label className="form-field">
                  <span>Plan</span>
                  <select onChange={(event) => updateNewSchoolForm('plan', event.target.value)} value={newSchoolForm.plan}>
                    <option>Inicial</option>
                    <option>Pro</option>
                    <option>Academia completa</option>
                    <option>Beneficio</option>
                  </select>
                </label>
                <label className="form-field">
                  <span>Mensualidad base</span>
                  <input
                    disabled={newSchoolForm.plan === 'Beneficio'}
                    onChange={(event) => updateNewSchoolForm('monthlyFee', event.target.value)}
                    value={newSchoolForm.plan === 'Beneficio' ? '$0' : newSchoolForm.monthlyFee}
                  />
                </label>
              </div>
              <label className="form-field">
                <span>Subir logo</span>
                <input
                  accept="image/*"
                  type="file"
                  onChange={(event) => {
                    handleSchoolLogoUpload(event.target.files?.[0])
                  }}
                />
              </label>
              {newSchoolForm.logo && (
                <div className="logo-preview">
                  <img src={newSchoolForm.logo} alt="" />
                  <span>Logo cargado</span>
                </div>
              )}
              <div className="color-fields">
                <label className="form-field">
                  <span>Color logo</span>
                  <input type="color" onChange={(event) => updateNewSchoolForm('accent', event.target.value)} value={newSchoolForm.accent} />
                </label>
                <label className="form-field">
                  <span>Color suave</span>
                  <input type="color" onChange={(event) => updateNewSchoolForm('secondary', event.target.value)} value={newSchoolForm.secondary} />
                </label>
              </div>
              <button className="primary-button" type="submit">
                <Plus size={18} aria-hidden="true" />
                Agregar escuela
              </button>
            </form>
          </article>
        </section>
      )}

      {section === 'usuarios' && (
        <section className="superadmin-single">
          <article className="panel superadmin-action-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Nuevo acceso</span>
                <h2>Crear usuario cuando lo necesites</h2>
                <p>El formulario queda cerrado para mantener limpio el directorio.</p>
              </div>
              <button className="primary-button" onClick={() => setIsCreateUserOpen(true)} type="button">
                <UserCog size={18} aria-hidden="true" />
                Crear usuario
              </button>
            </div>
          </article>

          <article className="panel">
            <div className="users-panel-header">
              <div>
                <span className="panel-kicker">Gestión de accesos</span>
                <h2>Usuarios</h2>
              </div>
              <div className="users-subtabs">
                <button
                  className={userTab === 'directorio' ? 'users-subtab active' : 'users-subtab'}
                  onClick={() => setUserTab('directorio')}
                  type="button"
                >
                  <Users size={15} aria-hidden="true" />
                  Directorio
                  <span className="subtab-pill">{managedUsers.length}</span>
                </button>
                <button
                  className={userTab === 'gestion' ? 'users-subtab active' : 'users-subtab'}
                  onClick={() => setUserTab('gestion')}
                  type="button"
                >
                  <KeyRound size={15} aria-hidden="true" />
                  Roles y claves
                  {blockedAccounts > 0 && <span className="subtab-pill danger">{blockedAccounts} bloq.</span>}
                </button>
              </div>
            </div>

            {userTab === 'directorio' && (
              <div className="users-tab-body">
                <label className="search-field superadmin-user-search">
                  <Search size={18} aria-hidden="true" />
                  <input
                    aria-label="Buscar usuario"
                    onChange={(event) => setUserSearchTerm(event.target.value)}
                    placeholder="Buscar por nombre, RUT, rol o categoría"
                    value={userSearchTerm}
                  />
                </label>
                <div className="admin-school-list">
                  {visibleUserGroups.map(({ school: userSchool, total, users: schoolUsers }) => {
                    const isOpen = normalizedUserSearch ? schoolUsers.length > 0 : expandedUserSchoolId === userSchool.id
                    return (
                      <article className="admin-school-group" key={userSchool.id}>
                        <button
                          className="admin-school-toggle"
                          onClick={() => setExpandedUserSchoolId(isOpen ? '' : userSchool.id)}
                          type="button"
                        >
                          <div>
                            <strong>{userSchool.name}</strong>
                            <span>{userSchool.city}</span>
                          </div>
                          <span className="count-pill">{normalizedUserSearch ? schoolUsers.length : total} usuarios</span>
                          <ChevronDown className={isOpen ? 'open' : ''} size={18} aria-hidden="true" />
                        </button>
                        {isOpen && (
                          <div className="admin-user-list">
                            {schoolUsers.map((user) => (
                              <article className="admin-user-row" key={user.id}>
                                <div className="avatar">{user.name.slice(0, 1)}</div>
                                <div>
                                  <strong>{user.name}</strong>
                                  <span>{getRoleLabel(user.role)} — {user.category}</span>
                                  <small>RUT: {user.rut} · Último acceso: {user.lastAccess}</small>
                                </div>
                                <span className={`status ${getStatusClass(user.status)}`}>{user.status}</span>
                                <button
                                  className="small-button"
                                  onClick={() => { setUserTab('gestion'); setEditingUserId(user.id) }}
                                  type="button"
                                >
                                  <Pencil size={15} aria-hidden="true" />
                                  Editar
                                </button>
                              </article>
                            ))}
                            {!schoolUsers.length && <p className="helper-text">Esta escuela aún no tiene usuarios creados.</p>}
                          </div>
                        )}
                      </article>
                    )
                  })}
                  {!visibleUserGroups.length && <p className="helper-text">No encontramos usuarios con esa búsqueda.</p>}
                </div>
              </div>
            )}

            {userTab === 'gestion' && (
              <div className="users-tab-body">
                <div className="gestion-stats">
                  <div className="gestion-stat">
                    <strong>{managedUsers.filter((u) => u.status === 'Activo').length}</strong>
                    <span>Activos</span>
                  </div>
                  <div className="gestion-stat">
                    <strong>{pendingAccounts}</strong>
                    <span>Pendientes</span>
                  </div>
                  <div className={`gestion-stat ${blockedAccounts > 0 ? 'danger' : ''}`}>
                    <strong>{blockedAccounts}</strong>
                    <span>Bloqueados</span>
                  </div>
                </div>
                <div className="account-table">
                  {users.map((user) => {
                    const isEditing = editingUserId === user.id
                    return (
                      <article className={isEditing ? 'account-row editing' : 'account-row'} key={user.id}>
                        <div>
                          {isEditing ? (
                            <>
                              <input onChange={(event) => updateUserField(user.id, 'name', event.target.value)} value={user.name} />
                              <input onChange={(event) => updateUserField(user.id, 'rut', event.target.value)} value={user.rut} />
                            </>
                          ) : (
                            <>
                              <strong>{user.name}</strong>
                              <span>{user.rut} · {user.schoolId ? schools.find(s => s.id === user.schoolId)?.name ?? user.schoolId : 'ADNFutbol'}</span>
                            </>
                          )}
                        </div>
                        <select disabled={user.role === 'SuperAdmin'} onChange={(event) => updateUserRole(user.id, event.target.value as UserRole)} value={user.role}>
                          <option value="SuperAdmin">SuperAdmin</option>
                          <option value="Director">Admin escuela</option>
                          <option value="DT">Profesor</option>
                          <option value="Finanzas">Finanzas</option>
                          <option value="Alumno">Alumno</option>
                        </select>
                        {isEditing ? (
                          <div className="account-edit-fields">
                            <select onChange={(event) => updateUserField(user.id, 'schoolId', event.target.value)} value={user.schoolId ?? ''}>
                              <option value="">ADNFutbol</option>
                              {schools.map((school) => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                              ))}
                            </select>
                            <select onChange={(event) => updateUserField(user.id, 'category', event.target.value)} value={user.category}>
                              <option>Todas</option>
                              {(selectedSchoolCategories.length ? selectedSchoolCategories : categories).map((category) => (
                                <option key={category.id}>{category.label}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className={`status ${getStatusClass(user.status)}`}>{user.status}</span>
                        )}
                        <div className="account-actions">
                          <button className="small-button" onClick={() => setEditingUserId(isEditing ? null : user.id)} type="button">
                            <Pencil size={15} aria-hidden="true" />
                            {isEditing ? 'Listo' : 'Editar'}
                          </button>
                          <button className="small-button" onClick={() => openChangePassword(user.id)} type="button">
                            <KeyRound size={15} aria-hidden="true" />
                            Clave
                          </button>
                          <button className="small-button" disabled={user.role === 'SuperAdmin'} onClick={() => toggleUserStatus(user.id)} type="button">
                            <Ban size={15} aria-hidden="true" />
                            {user.status === 'Bloqueado' ? 'Activar' : 'Bloquear'}
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )}
          </article>
        </section>
      )}

      {section === 'carga' && (
        <section className="superadmin-grid">
          <article className="panel wide-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Carga masiva</span>
                <h2>Subir usuarios por escuela</h2>
              </div>
              <button className="ghost-button" onClick={downloadBulkUserTemplate} type="button">
                <Download size={18} aria-hidden="true" />
                Descargar plantilla
              </button>
            </div>
            <form className="bulk-import-form" onSubmit={saveBulkUsers}>
              <p className="helper-text">
                Pega una fila por usuario. Acepta texto con punto y coma o filas copiadas desde Excel:
                <strong> Nombre;RUT;Rol;ID escuela;Categoria;Clave</strong>
              </p>
              <label className="form-field full">
                <span>Usuarios</span>
                <textarea
                  className="bulk-textarea super-bulk"
                  onChange={(event) => setBulkUserText(event.target.value)}
                  placeholder="Carlos Soto;66666666-6;DT;los-cracks;Sub 8;demo123"
                  value={bulkUserText}
                />
              </label>
              <div className="csv-example">
                <span>Ejemplos</span>
                <code>Carlos Soto;66666666-6;DT;los-cracks;Sub 8;demo123</code>
                <code>Andrea Mella;77777777-7;Finanzas;cantera-sur;Todas;demo123</code>
              </div>
              <button className="primary-button" type="submit">
                <Upload size={18} aria-hidden="true" />
                Importar usuarios
              </button>
            </form>
          </article>
          <aside className="panel">
            <span className="panel-kicker">IDs disponibles</span>
            <h2>Escuelas</h2>
            <div className="school-id-list">
              {schools.map((school) => (
                <div key={school.id}>
                  <strong>{school.name}</strong>
                  <code>{school.id}</code>
                </div>
              ))}
            </div>
          </aside>
        </section>
      )}

      {section === 'permisos' && (
        <section className="superadmin-single">
          <article className="panel wide-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Permisos</span>
                <h2>Asignar accesos por usuario</h2>
              </div>
              <span className="count-pill">{managedUsers.length} usuarios</span>
            </div>
            <div className="permission-user-list">
              {managedUsers.map((user) => (
                <article className="permission-user-card" key={user.id}>
                  <div>
                    <strong>{user.name}</strong>
                    <span>
                      {getRoleLabel(user.role)} - {schools.find((school) => school.id === user.schoolId)?.name ?? user.schoolId}
                    </span>
                  </div>
                  <div className="permission-check-grid">
                    {knownPermissions.map((permission) => (
                      <label className="permission-check" key={permission}>
                        <input
                          checked={user.permissions.includes(permission)}
                          onChange={() => toggleUserPermission(user.id, permission)}
                          type="checkbox"
                        />
                        <span>{permission}</span>
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      )}

      {changingPasswordUserId && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Cambiar clave">
          <div className="modal-box">
            <h3 className="modal-title">
              <KeyRound size={18} aria-hidden="true" />
              Cambiar clave
            </h3>
            <p className="modal-subtitle">
              Usuario: <strong>{users.find((u) => u.id === changingPasswordUserId)?.name}</strong>
            </p>
            <label className="field-label" htmlFor="new-password-input">Nueva clave</label>
            <input
              autoFocus
              className="modal-input"
              id="new-password-input"
              onChange={(event) => { setNewPasswordValue(event.target.value); }}
              onKeyDown={(event) => { if (event.key === 'Enter') confirmChangePassword() }}
              placeholder="Mínimo 4 caracteres"
              type="text"
              value={newPasswordValue}
            />
            {newPasswordError && <p className="modal-error">{newPasswordError}</p>}
            <div className="modal-actions">
              <button className="btn-primary" onClick={confirmChangePassword} type="button">
                <CheckCircle2 size={15} aria-hidden="true" />
                Guardar clave
              </button>
              <button className="btn-ghost" onClick={cancelChangePassword} type="button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <DeveerreFooter />
    </main>
  )
}

function AddStudentModal({
  canSeeAll,
  categoryOptions,
  closeNewStudent,
  saveNewStudent,
  studentForm,
  updateStudentForm,
}: {
  canSeeAll: boolean
  categoryOptions: string[]
  closeNewStudent: () => void
  saveNewStudent: (event: FormEvent<HTMLFormElement>) => void
  studentForm: NewStudentForm
  updateStudentForm: (field: keyof NewStudentForm, value: string) => void
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="student-modal" aria-labelledby="new-student-title" role="dialog" aria-modal="true">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Nuevo alumno</span>
            <h2 id="new-student-title">Crear ficha de jugador</h2>
          </div>
          <button className="icon-button" onClick={closeNewStudent} type="button" aria-label="Cerrar formulario">
            <XCircle size={18} />
          </button>
        </div>

        <form className="student-form" onSubmit={saveNewStudent}>
          <label className="form-field">
            <span>Nombre del alumno</span>
            <input
              autoFocus
              onChange={(event) => updateStudentForm('name', event.target.value)}
              placeholder="Ej: Martin Gonzalez"
              value={studentForm.name}
            />
          </label>

          <label className="form-field">
            <span>RUT alumno</span>
            <input
              onChange={(event) => updateStudentForm('rut', normalizeRut(event.target.value))}
              placeholder="Ej: 26111222-3"
              value={studentForm.rut}
            />
          </label>

          <label className="form-field">
            <span>Categoria</span>
            <select
              disabled={!canSeeAll}
              onChange={(event) => updateStudentForm('category', event.target.value)}
              value={studentForm.category}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Apoderado</span>
            <input
              onChange={(event) => updateStudentForm('guardian', event.target.value)}
              placeholder="Nombre del apoderado"
              value={studentForm.guardian}
            />
          </label>

          <label className="form-field">
            <span>Telefono WhatsApp</span>
            <input
              inputMode="tel"
              onChange={(event) => updateStudentForm('phone', event.target.value)}
              placeholder="Ej: 9 1234 5678"
              value={studentForm.phone}
            />
          </label>

          <label className="form-field">
            <span>Posicion</span>
            <select onChange={(event) => updateStudentForm('position', event.target.value)} value={studentForm.position}>
              <option>Arquero</option>
              <option>Defensa central</option>
              <option>Lateral</option>
              <option>Volante</option>
              <option>Extremo</option>
              <option>Delantero</option>
            </select>
          </label>

          <label className="form-field">
            <span>Pierna habil</span>
            <select onChange={(event) => updateStudentForm('dominantFoot', event.target.value)} value={studentForm.dominantFoot}>
              <option>Derecha</option>
              <option>Izquierda</option>
              <option>Ambas</option>
            </select>
          </label>

          <label className="form-field">
            <span>Ano nacimiento</span>
            <input
              inputMode="numeric"
              onChange={(event) => updateStudentForm('birthYear', event.target.value)}
              value={studentForm.birthYear}
            />
          </label>

          <label className="form-field">
            <span>Numero camiseta</span>
            <input
              inputMode="numeric"
              onChange={(event) => updateStudentForm('shirtNumber', event.target.value)}
              value={studentForm.shirtNumber}
            />
          </label>

          <label className="form-field full">
            <span>Notas del DT</span>
            <textarea
              onChange={(event) => updateStudentForm('notes', event.target.value)}
              placeholder="Observaciones deportivas iniciales"
              value={studentForm.notes}
            />
          </label>

          <label className="form-field full">
            <span>Salud / observaciones</span>
            <textarea onChange={(event) => updateStudentForm('medical', event.target.value)} value={studentForm.medical} />
          </label>

          <div className="modal-actions">
            <button className="ghost-button" onClick={closeNewStudent} type="button">
              Cancelar
            </button>
            <button className="primary-button" type="submit">
              <Plus size={18} aria-hidden="true" />
              Guardar alumno
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function BulkImportModal({
  bulkImportText,
  closeBulkImport,
  saveBulkImport,
  setBulkImportText,
}: {
  bulkImportText: string
  closeBulkImport: () => void
  saveBulkImport: (event: FormEvent<HTMLFormElement>) => void
  setBulkImportText: (value: string) => void
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="student-modal bulk-modal" aria-labelledby="bulk-import-title" role="dialog" aria-modal="true">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Administrador</span>
            <h2 id="bulk-import-title">Carga masiva de alumnos</h2>
          </div>
          <button className="icon-button" onClick={closeBulkImport} type="button" aria-label="Cerrar carga masiva">
            <XCircle size={18} />
          </button>
        </div>

        <form className="bulk-import-form" onSubmit={saveBulkImport}>
          <p className="helper-text">
            Pega una fila por alumno usando punto y coma. Formato:
            <strong> Nombre;RUT;Categoria;Apoderado;Telefono;Posicion;Ano;Numero</strong>
          </p>

          <label className="form-field full">
            <span>Lista de alumnos</span>
            <textarea
              className="bulk-textarea"
              onChange={(event) => setBulkImportText(event.target.value)}
              value={bulkImportText}
            />
          </label>

          <div className="csv-example">
            <span>Ejemplo</span>
            <code>Martin Gonzalez;26111222-3;Sub 8;Paula Gonzalez;912345678;Delantero;2017;11</code>
            <code>Isidora Lagos;25444555-6;Sub 10;Claudio Lagos;987654321;Volante;2015;8</code>
          </div>

          <div className="modal-actions">
            <button className="ghost-button" onClick={closeBulkImport} type="button">
              Cancelar
            </button>
            <button className="primary-button" type="submit">
              <Upload size={18} aria-hidden="true" />
              Importar alumnos
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function DashboardPage({
  attendanceRecords,
  canSeeAll,
  canSeeStudents,
  canUseAttendance,
  canUseFinance,
  coach,
  navigateTo,
  payments,
  preparePaymentMessage,
  scopedCategories,
  setMessageMode,
  setSelectedTemplateId,
  stats,
}: {
  attendanceRecords: Attendance[]
  canSeeAll: boolean
  canSeeStudents: boolean
  canUseAttendance: boolean
  canUseFinance: boolean
  coach: User
  navigateTo: (view: View) => void
  payments: Payment[]
  preparePaymentMessage: (payment: Payment) => void
  scopedCategories: Category[]
  setMessageMode: (mode: MessageMode) => void
  setSelectedTemplateId: (id: string) => void
  stats: Stat[]
}) {
  return (
    <>
      {canUseAttendance && (
        <section className="field-banner" aria-label="Resumen de entrenamiento">
          <div>
            <span>Hoy</span>
            <strong>{canSeeAll ? 'Entrenamientos de la escuela' : `Entrenamiento ${coach.category}`}</strong>
            <p>Cancha 2, 18:00 a 19:30</p>
          </div>
          <button className="field-button" onClick={() => navigateTo('asistencia')} type="button">
            <CalendarCheck size={18} aria-hidden="true" />
            Pasar asistencia
          </button>
        </section>
      )}

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
        {canUseAttendance && (
          <article className="panel attendance-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Asistencia</span>
              <h2>Clase de hoy</h2>
            </div>
            <button className="small-button" onClick={() => navigateTo('asistencia')} type="button">
              {canSeeAll ? 'Ver grupos' : coach.category}
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="attendance-progress" aria-label="Asistencia actual">
            <div style={{ width: `${Math.max(18, Math.round((attendanceRecords.filter((student) => student.status === 'Presente').length / Math.max(attendanceRecords.length, 1)) * 100))}%` }}></div>
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
        )}

        {canUseFinance && (
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
              <span>Registros visibles</span>
              <strong>{payments.length}</strong>
            </div>
            <div>
              <span>Pendientes</span>
              <strong>{payments.filter((payment) => payment.status !== 'Pagado').length}</strong>
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
        )}

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
                  setMessageMode(message.id === 'lluvia' ? 'masivo' : 'individual')
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

        {canSeeStudents && (
          <article className="panel categories-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Categorias</span>
              <h2>{canSeeAll ? 'Grupos activos' : 'Mi grupo'}</h2>
            </div>
            <button className="icon-button" onClick={() => navigateTo('alumnos')} type="button" aria-label="Ver categorias">
              <Users size={18} />
            </button>
          </div>

          <div className="category-list">
            {scopedCategories.map((category) => (
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
        )}

        <article className="panel next-class-panel">
          <div className="match-card">
            <div className="match-icon">
              <ShieldCheck size={24} aria-hidden="true" />
            </div>
            <span>Proxima actividad</span>
            <h2>{canSeeAll ? 'Amistoso escuela' : `Amistoso ${coach.category}`}</h2>
            <p>Sabado, 09:30 - Complejo Deportivo Quilin</p>
            <button
              className="ghost-button"
              onClick={() => {
                setSelectedTemplateId('partido')
                setMessageMode('masivo')
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
            {canSeeStudents && (
              <button onClick={() => navigateTo('alumnos')} type="button">
                <Users size={18} aria-hidden="true" />
                Revisar alumnos
              </button>
            )}
            {canUseFinance && (
              <button onClick={() => preparePaymentMessage(payments.find((payment) => payment.status !== 'Pagado') ?? payments[0])} type="button">
                <Phone size={18} aria-hidden="true" />
                Cobrar pendiente
              </button>
            )}
          </div>
        </article>
      </section>
    </>
  )
}

function StudentsPage({
  canViewPayments,
  categoryOptions,
  fallbackStudent,
  filteredStudents,
  navigateTo,
  openPlayerProfile,
  searchTerm,
  selectedCategory,
  setSearchTerm,
  setSelectedCategory,
}: {
  canViewPayments: boolean
  categoryOptions: string[]
  fallbackStudent: Student
  filteredStudents: Student[]
  navigateTo: (view: View) => void
  openPlayerProfile: (studentId: number) => void
  searchTerm: string
  selectedCategory: string
  setSearchTerm: (value: string) => void
  setSelectedCategory: (value: string) => void
}) {
  const highlightedStudent = filteredStudents[0] ?? fallbackStudent

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
              placeholder="Buscar por alumno, apoderado, categoria o posicion"
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
              <PlayerAvatar player={student} />
              <div className="student-info">
                <strong>{student.name}</strong>
                <span>
                  {student.category} - {student.position} - Apoderado: {student.guardian}
                </span>
                <small>
                  RUT: {student.rut} - Telefono: +{student.phone}
                </small>
              </div>
              <span className={`status ${getStatusClass(student.status)}`}>{student.status}</span>
              <div className="student-actions">
                <button className="small-button" onClick={() => openPlayerProfile(student.id)} type="button">
                  Ver perfil
                </button>
                <button className="small-button" onClick={() => navigateTo('asistencia')} type="button">
                  Asistencia
                </button>
                {canViewPayments && (
                  <button className="small-button" onClick={() => navigateTo('pagos')} type="button">
                    Pagos
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </article>

      <aside className="panel detail-panel">
        <span className="panel-kicker">Ficha rapida</span>
        <PlayerAvatar player={highlightedStudent} large />
        <h2>{highlightedStudent.name}</h2>
        <div className="detail-list">
          <div>
            <span>RUT</span>
            <strong>{highlightedStudent.rut}</strong>
          </div>
          <div>
            <span>Categoria</span>
            <strong>{highlightedStudent.category}</strong>
          </div>
          <div>
            <span>Posicion</span>
            <strong>{highlightedStudent.position}</strong>
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
        <button className="primary-button" onClick={() => openPlayerProfile(highlightedStudent.id)} type="button">
          <UserRound size={18} aria-hidden="true" />
          Abrir perfil
        </button>
      </aside>
    </section>
  )
}

function EventsPage({
  addMatchEvent,
  addMonthlyTrainings,
  bulkEventText,
  canManageEvents,
  categoryOptions,
  coach,
  eventAttendance,
  events,
  markEventAttendance,
  matchForm,
  saveBulkEvents,
  scopedStudents,
  selectedEventId,
  setSelectedEventId,
  setBulkEventText,
  toggleTrainingWeekday,
  trainingForm,
  updateMatchForm,
  updateTrainingForm,
}: {
  addMatchEvent: (event: FormEvent<HTMLFormElement>) => void
  addMonthlyTrainings: (event: FormEvent<HTMLFormElement>) => void
  bulkEventText: string
  canManageEvents: boolean
  categoryOptions: string[]
  coach: User
  eventAttendance: EventAttendance[]
  events: CalendarEvent[]
  markEventAttendance: (eventId: string, student: Student, status: EventAttendanceStatus) => void
  matchForm: NewMatchForm
  saveBulkEvents: (event: FormEvent<HTMLFormElement>) => void
  scopedStudents: Student[]
  selectedEventId: string
  setSelectedEventId: (eventId: string) => void
  setBulkEventText: (value: string) => void
  toggleTrainingWeekday: (day: string) => void
  trainingForm: NewTrainingForm
  updateMatchForm: (field: keyof NewMatchForm, value: string) => void
  updateTrainingForm: (field: keyof NewTrainingForm, value: string) => void
}) {
  const [eventModal, setEventModal] = useState<'training' | 'match' | 'bulk' | null>(null)
  const eventCategories = categoryOptions.length ? categoryOptions : ['Todas']
  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? events[0]
  const eventRoster = selectedEvent
    ? scopedStudents.filter((student) => selectedEvent.category === 'Todas' || student.category === selectedEvent.category)
    : []
  const selectedActions = selectedEvent?.type === 'Partido' ? matchAttendanceActions : attendanceActions
  const eventStatusMap = new Map(
    eventAttendance
      .filter((attendance) => attendance.eventId === selectedEvent?.id)
      .map((attendance) => [attendance.studentId, attendance.status]),
  )
  const confirmedCount = eventRoster.filter((student) => eventStatusMap.get(student.id) === 'Confirmado' || eventStatusMap.get(student.id) === 'Presente').length
  const pendingCount = selectedEvent ? eventRoster.length - confirmedCount : 0
  const canConfirmAsStudent = coach.role === 'Alumno' && selectedEvent?.type === 'Partido'

  return (
    <section className="workspace-grid events-layout">
      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Agenda escuela</span>
            <h2>Eventos programados</h2>
          </div>
          <span className="count-pill">{events.length} eventos</span>
        </div>

        <div className="event-list">
          {events.map((event) => (
            <button
              className={selectedEvent?.id === event.id ? 'event-card active' : 'event-card'}
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              type="button"
            >
              <div>
                <span className={`event-type ${event.type === 'Partido' ? 'match' : 'training'}`}>{event.type}</span>
                <strong>{event.title}</strong>
                <small>{event.category} - {event.location}</small>
              </div>
              <div>
                <b>{formatEventDate(event.date)}</b>
                <span>{event.time}</span>
              </div>
            </button>
          ))}
          {!events.length && <p className="helper-text">Aun no hay eventos creados para esta escuela.</p>}
        </div>
      </article>

      <aside className="detail-column">
        {canManageEvents && (
          <article className="panel event-actions-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Crear eventos</span>
                <h2>Agenda operativa</h2>
              </div>
            </div>
            <div className="event-action-stack">
              <button className="primary-button" onClick={() => setEventModal('training')} type="button">
                <CalendarCheck size={18} aria-hidden="true" />
                Crear entrenamientos
              </button>
              <button className="ghost-button" onClick={() => setEventModal('match')} type="button">
                <Trophy size={18} aria-hidden="true" />
                Crear partido
              </button>
              <button className="ghost-button" onClick={() => setEventModal('bulk')} type="button">
                <Upload size={18} aria-hidden="true" />
                Carga masiva
              </button>
            </div>
          </article>
        )}
      </aside>

      <article className="panel wide-panel event-attendance-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">{selectedEvent?.type ?? 'Evento'}</span>
            <h2>{selectedEvent?.title ?? 'Selecciona un evento'}</h2>
            {selectedEvent && (
              <p>
                {selectedEvent.category} - {formatEventDate(selectedEvent.date)} - {selectedEvent.time}
                {selectedEvent.opponent ? ` - Rival: ${selectedEvent.opponent}` : ''}
              </p>
            )}
          </div>
          {selectedEvent && <span className="count-pill">{confirmedCount} confirmados</span>}
        </div>

        {selectedEvent && (
          <div className="event-summary-strip">
            <div>
              <span>Total convocados</span>
              <strong>{eventRoster.length}</strong>
            </div>
            <div>
              <span>{selectedEvent.type === 'Partido' ? 'Confirmados' : 'Presentes'}</span>
              <strong>{confirmedCount}</strong>
            </div>
            <div>
              <span>Pendientes</span>
              <strong>{Math.max(pendingCount, 0)}</strong>
            </div>
          </div>
        )}

        <div className="event-roster">
          {eventRoster.map((student) => {
            const currentStatus = eventStatusMap.get(student.id) ?? 'Pendiente'
            const availableActions = canConfirmAsStudent ? matchAttendanceActions : selectedActions

            return (
              <div className="event-roster-row" key={student.id}>
                <PlayerAvatar player={student} />
                <div>
                  <strong>{student.name}</strong>
                  <span>{student.category} - {student.position}</span>
                </div>
                <span className={`status ${getStatusClass(currentStatus)}`}>{currentStatus}</span>
                {(canManageEvents || canConfirmAsStudent) && selectedEvent && (
                  <div className="mark-actions">
                    {availableActions.map((status) => (
                      <button
                        className={currentStatus === status ? 'active' : ''}
                        key={status}
                        onClick={() => markEventAttendance(selectedEvent.id, student, status)}
                        type="button"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {selectedEvent && !eventRoster.length && <p className="helper-text">No hay alumnos para la categoria de este evento.</p>}
          {!selectedEvent && <p className="helper-text">Crea o selecciona un evento para gestionar asistencia.</p>}
        </div>
      </article>

      {eventModal && (
        <div className="modal-backdrop" role="presentation">
          <section className="student-modal event-modal" aria-labelledby="event-modal-title" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <span className="panel-kicker">Eventos</span>
                <h2 id="event-modal-title">
                  {eventModal === 'training' ? 'Crear entrenamientos' : eventModal === 'match' ? 'Crear partido' : 'Carga masiva de eventos'}
                </h2>
              </div>
              <button className="icon-button" onClick={() => setEventModal(null)} type="button" aria-label="Cerrar eventos">
                <XCircle size={20} aria-hidden="true" />
              </button>
            </div>

            {eventModal === 'training' && (
              <form className="event-form" onSubmit={addMonthlyTrainings}>
                <label className="form-field">
                  <span>Mes</span>
                  <input onChange={(event) => updateTrainingForm('month', event.target.value)} type="month" value={trainingForm.month} />
                </label>
                <label className="form-field">
                  <span>Categoria</span>
                  <select onChange={(event) => updateTrainingForm('category', event.target.value)} value={trainingForm.category}>
                    {eventCategories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <div className="weekday-grid" aria-label="Dias de entrenamiento">
                  {weekDayOptions.map((day) => (
                    <button
                      className={trainingForm.weekdays.includes(day.value) ? 'active' : ''}
                      key={day.value}
                      onClick={() => toggleTrainingWeekday(day.value)}
                      type="button"
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                <div className="color-fields">
                  <label className="form-field">
                    <span>Hora</span>
                    <input onChange={(event) => updateTrainingForm('time', event.target.value)} type="time" value={trainingForm.time} />
                  </label>
                  <label className="form-field">
                    <span>Cancha</span>
                    <input onChange={(event) => updateTrainingForm('location', event.target.value)} value={trainingForm.location} />
                  </label>
                </div>
                <div className="modal-actions">
                  <button className="ghost-button" onClick={() => setEventModal(null)} type="button">
                    Cancelar
                  </button>
                  <button className="primary-button" type="submit">
                    <CalendarCheck size={18} aria-hidden="true" />
                    Crear entrenamientos
                  </button>
                </div>
              </form>
            )}

            {eventModal === 'match' && (
              <form className="event-form" onSubmit={addMatchEvent}>
                <label className="form-field">
                  <span>Nombre</span>
                  <input onChange={(event) => updateMatchForm('title', event.target.value)} value={matchForm.title} />
                </label>
                <label className="form-field">
                  <span>Rival</span>
                  <input onChange={(event) => updateMatchForm('opponent', event.target.value)} value={matchForm.opponent} />
                </label>
                <label className="form-field">
                  <span>Categoria</span>
                  <select onChange={(event) => updateMatchForm('category', event.target.value)} value={matchForm.category}>
                    {eventCategories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <div className="color-fields">
                  <label className="form-field">
                    <span>Fecha</span>
                    <input onChange={(event) => updateMatchForm('date', event.target.value)} type="date" value={matchForm.date} />
                  </label>
                  <label className="form-field">
                    <span>Hora</span>
                    <input onChange={(event) => updateMatchForm('time', event.target.value)} type="time" value={matchForm.time} />
                  </label>
                </div>
                <label className="form-field">
                  <span>Lugar</span>
                  <input onChange={(event) => updateMatchForm('location', event.target.value)} value={matchForm.location} />
                </label>
                <div className="modal-actions">
                  <button className="ghost-button" onClick={() => setEventModal(null)} type="button">
                    Cancelar
                  </button>
                  <button className="primary-button" type="submit">
                    <Trophy size={18} aria-hidden="true" />
                    Crear partido
                  </button>
                </div>
              </form>
            )}

            {eventModal === 'bulk' && (
              <form className="event-form" onSubmit={saveBulkEvents}>
                <p className="helper-text">
                  Pega una fila por evento. Formato:
                  <strong> Tipo;Titulo;Categoria;Fecha;Hora;Lugar;Rival</strong>
                </p>
                <label className="form-field full">
                  <span>Eventos</span>
                  <textarea
                    className="bulk-textarea"
                    onChange={(event) => setBulkEventText(event.target.value)}
                    placeholder="Entrenamiento;Entrenamiento Sub 8;Sub 8;2026-05-04;18:00;Cancha 1;&#10;Partido;Amistoso Sub 10;Sub 10;2026-05-11;10:00;Cancha principal;Rival FC"
                    value={bulkEventText}
                  />
                </label>
                <div className="csv-example">
                  <span>Ejemplos</span>
                  <code>Entrenamiento;Entrenamiento Sub 8;Sub 8;2026-05-04;18:00;Cancha 1;</code>
                  <code>Partido;Amistoso Sub 10;Sub 10;2026-05-11;10:00;Cancha principal;Rival FC</code>
                </div>
                <div className="modal-actions">
                  <button className="ghost-button" onClick={() => setEventModal(null)} type="button">
                    Cancelar
                  </button>
                  <button className="primary-button" type="submit">
                    <Upload size={18} aria-hidden="true" />
                    Importar eventos
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </section>
  )
}

function ReportResultPanel({
  copyGeneratedReport,
  downloadGeneratedReport,
  report,
}: {
  copyGeneratedReport: () => void
  downloadGeneratedReport: () => void
  report: ReportResult
}) {
  return (
    <article className="report-result-card">
      <div className="panel-header">
        <div>
          <span className="panel-kicker">Informe generado</span>
          <h2>{report.title}</h2>
          <p>{report.subtitle}</p>
        </div>
        <span className="count-pill">{report.generatedAt}</span>
      </div>

      <p className="report-summary">{report.summary}</p>

      <div className="report-total-grid">
        {report.totals.map((total) => (
          <div key={total.label}>
            <span>{total.label}</span>
            <strong>{total.value}</strong>
          </div>
        ))}
      </div>

      <div className="report-row-list">
        {report.rows.map((row, index) => (
          <div className="report-row" key={`${row.label}-${index}`}>
            <div>
              <strong>{row.label}</strong>
              <span>{row.detail}</span>
            </div>
            {row.amount && <b>{row.amount}</b>}
            {row.status && <span className={`status ${getStatusClass(row.status)}`}>{row.status}</span>}
          </div>
        ))}
        {!report.rows.length && <p className="helper-text">No hay registros para los filtros seleccionados.</p>}
      </div>

      <div className="report-actions">
        <button className="ghost-button" onClick={copyGeneratedReport} type="button">
          <FileText size={18} aria-hidden="true" />
          Copiar informe
        </button>
        <button className="primary-button" onClick={downloadGeneratedReport} type="button">
          <Download size={18} aria-hidden="true" />
          Exportar Excel
        </button>
      </div>
    </article>
  )
}

function AttendancePage({
  attendanceRecords,
  attendanceCategory,
  attendanceForCategory,
  copyGeneratedReport,
  downloadGeneratedReport,
  generatedReport,
  generateReport,
  markAttendance,
  markCategoryAsPresent,
  reportCategory,
  reportDate,
  scopedCategories,
  setAttendanceCategory,
  setReportCategory,
  setReportDate,
}: {
  attendanceRecords: Attendance[]
  attendanceCategory: string
  attendanceForCategory: Attendance[]
  copyGeneratedReport: () => void
  downloadGeneratedReport: () => void
  generatedReport: ReportResult | null
  generateReport: (type: 'finanzas' | 'asistencia') => void
  markAttendance: (id: number, status: AttendanceStatus) => void
  markCategoryAsPresent: () => void
  reportCategory: string
  reportDate: string
  scopedCategories: Category[]
  setAttendanceCategory: (value: string) => void
  setReportCategory: (value: string) => void
  setReportDate: (value: string) => void
}) {
  const presentCount = attendanceForCategory.filter((record) => record.status === 'Presente').length
  const pendingCount = attendanceForCategory.filter((record) => record.status === 'Pendiente').length
  const reportCategories = scopedCategories.length > 1 ? ['Todas', ...scopedCategories.map((category) => category.label)] : scopedCategories.map((category) => category.label)
  const attendanceReportRows = attendanceRecords.filter(
    (record) => record.date === reportDate && (reportCategory === 'Todas' || record.category === reportCategory),
  )

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
          {scopedCategories.map((category) => (
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

      <aside className="detail-column">
        <article className="panel detail-panel">
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
        </article>

        <article className="panel attendance-report-card">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Reporte profesor</span>
              <h2>Asistencia por fecha</h2>
            </div>
            <FileText size={20} aria-hidden="true" />
          </div>
          <div className="report-controls compact">
            <label className="form-field">
              <span>Fecha</span>
              <input onChange={(event) => setReportDate(event.target.value)} type="date" value={reportDate} />
            </label>
            <label className="form-field">
              <span>Categoria</span>
              <select onChange={(event) => setReportCategory(event.target.value)} value={reportCategory}>
                {reportCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <button className="primary-button" onClick={() => generateReport('asistencia')} type="button">
              <FileText size={18} aria-hidden="true" />
              Generar reporte
            </button>
          </div>
          {generatedReport?.kind === 'asistencia' && (
            <ReportResultPanel
              copyGeneratedReport={copyGeneratedReport}
              downloadGeneratedReport={downloadGeneratedReport}
              report={generatedReport}
            />
          )}
          <div className="attendance-report-list">
            {attendanceReportRows.map((record) => (
              <div className="attendance-report-row" key={record.id}>
                <div>
                  <strong>{record.name}</strong>
                  <span>{record.category} - {record.time}</span>
                </div>
                <span className={`status ${getStatusClass(record.status)}`}>{record.status}</span>
              </div>
            ))}
            {!attendanceReportRows.length && <p className="helper-text">No hay registros para esta fecha.</p>}
          </div>
        </article>
      </aside>
    </section>
  )
}

function PaymentsPage({
  canEditPayments,
  markPayment,
  paymentFilter,
  payments,
  preparePaymentMessage,
  setPaymentFilter,
  visiblePayments,
}: {
  canEditPayments: boolean
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
              {canEditPayments && (
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
              )}
              {canEditPayments && payment.status !== 'Pagado' && (
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

function FinancePage({
  attendanceRecords,
  categoryOptions,
  copyGeneratedReport,
  downloadGeneratedReport,
  financeStatusFilter,
  generatedReport,
  generateReport,
  markPayment,
  payments,
  preparePaymentMessage,
  reportCategory,
  reportDate,
  setFinanceStatusFilter,
  setReportCategory,
  setReportDate,
}: {
  attendanceRecords: Attendance[]
  categoryOptions: string[]
  copyGeneratedReport: () => void
  downloadGeneratedReport: () => void
  financeStatusFilter: PaymentStatus | 'Todos'
  generatedReport: ReportResult | null
  generateReport: (type: 'finanzas' | 'asistencia') => void
  markPayment: (id: number, status: PaymentStatus) => void
  payments: Payment[]
  preparePaymentMessage: (payment: Payment) => void
  reportCategory: string
  reportDate: string
  setFinanceStatusFilter: (status: PaymentStatus | 'Todos') => void
  setReportCategory: (category: string) => void
  setReportDate: (date: string) => void
}) {
  const paidPayments = payments.filter((payment) => payment.status === 'Pagado')
  const pendingPayments = payments.filter((payment) => payment.status !== 'Pagado')
  const filteredPayments =
    financeStatusFilter === 'Todos' ? payments : payments.filter((payment) => payment.status === financeStatusFilter)
  const reportAttendance = attendanceRecords.filter(
    (record) => record.date === reportDate && (reportCategory === 'Todas' || record.category === reportCategory),
  )
  const totalExpected = payments.reduce((total, payment) => total + Number(payment.amount.replace(/\D/g, '')), 0)
  const collected = paidPayments.reduce((total, payment) => total + Number(payment.amount.replace(/\D/g, '')), 0)

  return (
    <section className="finance-page">
      <div className="finance-hero">
        <div>
          <span>Finanzas escuela</span>
          <h2>Mensualidades, caja y transferencias</h2>
          <p>Un espacio pensado para ver pagados, pendientes, atrasos y reportes simples por categoria o fecha.</p>
        </div>
        <strong>{formatCurrency(collected)}</strong>
      </div>

      <section className="finance-grid">
        <article className="panel finance-card">
          <WalletCards size={20} aria-hidden="true" />
          <span>Recaudado</span>
          <strong>{formatCurrency(collected)}</strong>
          <p>{paidPayments.length} pagos confirmados</p>
        </article>
        <article className="panel finance-card">
          <Clock3 size={20} aria-hidden="true" />
          <span>Pendiente</span>
          <strong>{formatCurrency(totalExpected - collected)}</strong>
          <p>{pendingPayments.length} apoderados por contactar</p>
        </article>
        <article className="panel finance-card">
          <CircleDollarSign size={20} aria-hidden="true" />
          <span>Total esperado</span>
          <strong>{formatCurrency(totalExpected)}</strong>
          <p>Mes operativo actual</p>
        </article>
      </section>

      <section className="finance-reports panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Informes</span>
            <h2>Reportes de asistencia y finanzas</h2>
          </div>
          <FileText size={22} aria-hidden="true" />
        </div>
        <div className="report-controls">
          <label className="form-field">
            <span>Fecha asistencia</span>
            <input onChange={(event) => setReportDate(event.target.value)} type="date" value={reportDate} />
          </label>
          <label className="form-field">
            <span>Categoria</span>
            <select onChange={(event) => setReportCategory(event.target.value)} value={reportCategory}>
              {categoryOptions.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <button className="ghost-button" onClick={() => generateReport('asistencia')} type="button">
            <CalendarCheck size={18} aria-hidden="true" />
            Generar asistencia
          </button>
          <button className="primary-button" onClick={() => generateReport('finanzas')} type="button">
            <BarChart3 size={18} aria-hidden="true" />
            Generar finanzas
          </button>
        </div>
        {generatedReport && (
          <ReportResultPanel
            copyGeneratedReport={copyGeneratedReport}
            downloadGeneratedReport={downloadGeneratedReport}
            report={generatedReport}
          />
        )}
      </section>

      <section className="workspace-grid finance-layout">
        <article className="panel wide-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Conciliacion</span>
              <h2>Pagos de apoderados</h2>
            </div>
            <span className="count-pill">{filteredPayments.length} registros</span>
          </div>

          <div className="segmented payment-filters finance-status-tabs" aria-label="Filtrar pagos finanzas">
            {paymentFilters.map((filter) => (
              <button
                className={financeStatusFilter === filter ? 'active' : ''}
                key={filter}
                onClick={() => setFinanceStatusFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="payment-table">
            {filteredPayments.map((payment) => (
              <article className="payment-row" key={payment.id}>
                <div className="row-main">
                  <strong>{payment.name}</strong>
                  <span>
                    {payment.category} - {payment.method} - vence {payment.dueDate}
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
                    Cobrar
                  </button>
                )}
              </article>
            ))}
          </div>
        </article>

        <aside className="panel detail-panel">
          <span className="panel-kicker">Asistencia por fecha</span>
          <h2>{reportDate}</h2>
          <div className="attendance-report-list">
            {reportAttendance.map((record) => (
              <div className="attendance-report-row" key={record.id}>
                <div>
                  <strong>{record.name}</strong>
                  <span>{record.category} - {record.time}</span>
                </div>
                <span className={`status ${getStatusClass(record.status)}`}>{record.status}</span>
              </div>
            ))}
            {!reportAttendance.length && <p className="helper-text">No hay asistencia para esta fecha/categoria.</p>}
          </div>
        </aside>
      </section>
    </section>
  )
}

function BalancePage({
  addExpense,
  addIncome,
  expenses,
  incomes,
  markExpense,
  markIncome,
  markPayment,
  newExpenseForm,
  newIncomeForm,
  payments,
  school,
  updateNewExpenseForm,
  updateNewIncomeForm,
}: {
  addExpense: (event: FormEvent<HTMLFormElement>) => void
  addIncome: (event: FormEvent<HTMLFormElement>) => void
  expenses: Expense[]
  incomes: Income[]
  markExpense: (id: number, status: Expense['status']) => void
  markIncome: (id: number, status: IncomeStatus) => void
  markPayment: (id: number, status: PaymentStatus) => void
  newExpenseForm: NewExpenseForm
  newIncomeForm: NewIncomeForm
  payments: Payment[]
  school: School
  updateNewExpenseForm: (field: keyof NewExpenseForm, value: string) => void
  updateNewIncomeForm: (field: keyof NewIncomeForm, value: string) => void
}) {
  const paidIncome = payments
    .filter((payment) => payment.status === 'Pagado')
    .reduce((total, payment) => total + Number(payment.amount.replace(/\D/g, '')), 0)
  const manualIncome = incomes
    .filter((income) => income.status === 'Recibido')
    .reduce((total, income) => total + Number(income.amount.replace(/\D/g, '')), 0)
  const expectedIncome = payments.reduce((total, payment) => total + Number(payment.amount.replace(/\D/g, '')), 0)
  const paidExpenses = expenses
    .filter((expense) => expense.status === 'Pagado')
    .reduce((total, expense) => total + Number(expense.amount.replace(/\D/g, '')), 0)
  const pendingExpenses = expenses
    .filter((expense) => expense.status !== 'Pagado')
    .reduce((total, expense) => total + Number(expense.amount.replace(/\D/g, '')), 0)
  const result = paidIncome + manualIncome - paidExpenses

  return (
    <section className="balance-page">
      <section className="finance-grid">
        <article className="panel finance-card">
          <CircleDollarSign size={20} aria-hidden="true" />
          <span>Ingresos cobrados</span>
          <strong>{formatCurrency(paidIncome + manualIncome)}</strong>
          <p>{payments.filter((payment) => payment.status === 'Pagado').length} pagos + {incomes.filter((income) => income.status === 'Recibido').length} ingresos</p>
        </article>
        <article className="panel finance-card">
          <HandCoins size={20} aria-hidden="true" />
          <span>Gastos pagados</span>
          <strong>{formatCurrency(paidExpenses)}</strong>
          <p>{formatCurrency(pendingExpenses)} pendientes por pagar</p>
        </article>
        <article className="panel finance-card">
          <BarChart3 size={20} aria-hidden="true" />
          <span>Resultado mensual</span>
          <strong>{formatCurrency(result)}</strong>
          <p>Esperado mensualidades: {formatCurrency(expectedIncome)}</p>
        </article>
      </section>

      <article className="panel movement-entry-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Caja mensual</span>
            <h2>Ingresar movimiento</h2>
            <p>Registra ingresos o egresos y adjunta una boleta o comprobante si lo necesitas.</p>
          </div>
        </div>
        <div className="movement-forms">
          <form className="movement-form income-form" onSubmit={addIncome}>
            <div className="movement-form-title">
              <CircleDollarSign size={19} aria-hidden="true" />
              <strong>Ingreso</strong>
            </div>
            <label className="form-field">
              <span>Nombre ingreso</span>
              <input onChange={(event) => updateNewIncomeForm('title', event.target.value)} value={newIncomeForm.title} />
            </label>
            <label className="form-field">
              <span>Tipo</span>
              <select
                onChange={(event) => {
                  updateNewIncomeForm('category', event.target.value)

                  if (event.target.value !== 'Otro') {
                    updateNewIncomeForm('categoryDetail', '')
                  }
                }}
                value={newIncomeForm.category}
              >
                <option>Inscripcion</option>
                <option>Matricula</option>
                <option>Sponsor</option>
                <option>Venta indumentaria</option>
                <option>Otro</option>
              </select>
            </label>
            {newIncomeForm.category === 'Otro' && (
              <label className="form-field">
                <span>Detalle ingreso</span>
                <input
                  onChange={(event) => updateNewIncomeForm('categoryDetail', event.target.value)}
                  placeholder="Ej: rifa, aporte extraordinario"
                  value={newIncomeForm.categoryDetail}
                />
              </label>
            )}
            <label className="form-field">
              <span>Monto</span>
              <input onChange={(event) => updateNewIncomeForm('amount', event.target.value)} value={newIncomeForm.amount} />
            </label>
            <label className="form-field">
              <span>Fecha</span>
              <input onChange={(event) => updateNewIncomeForm('date', event.target.value)} type="date" value={newIncomeForm.date} />
            </label>
            <label className="form-field">
              <span>Estado</span>
              <select onChange={(event) => updateNewIncomeForm('status', event.target.value as IncomeStatus)} value={newIncomeForm.status}>
                <option>Recibido</option>
                <option>Pendiente</option>
              </select>
            </label>
            <label className="form-field full">
              <span>Adjuntar boleta / comprobante opcional</span>
              <input
                accept="image/*,.pdf"
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0]

                  if (!file) {
                    return
                  }

                  const reader = new FileReader()
                  reader.addEventListener('load', () => {
                    updateNewIncomeForm('receiptName', file.name)
                    updateNewIncomeForm('receiptUrl', String(reader.result ?? ''))
                  })
                  reader.readAsDataURL(file)
                }}
              />
            </label>
            {newIncomeForm.receiptName && <div className="receipt-chip">Comprobante: {newIncomeForm.receiptName}</div>}
            <button className="primary-button" type="submit">
              <Plus size={18} aria-hidden="true" />
              Agregar ingreso
            </button>
          </form>

          <form className="movement-form expense-form" onSubmit={addExpense}>
            <div className="movement-form-title">
              <HandCoins size={19} aria-hidden="true" />
              <strong>Egreso</strong>
            </div>
            <label className="form-field">
              <span>Nombre gasto</span>
              <input onChange={(event) => updateNewExpenseForm('title', event.target.value)} value={newExpenseForm.title} />
            </label>
            <label className="form-field">
              <span>Categoria</span>
              <select
                onChange={(event) => {
                  updateNewExpenseForm('category', event.target.value)

                  if (event.target.value !== 'Otro') {
                    updateNewExpenseForm('categoryDetail', '')
                  }
                }}
                value={newExpenseForm.category}
              >
                <option>Infraestructura</option>
                <option>Implementos</option>
                <option>Honorarios</option>
                <option>Traslado</option>
                <option>Otro</option>
              </select>
            </label>
            {newExpenseForm.category === 'Otro' && (
              <label className="form-field">
                <span>Detalle egreso</span>
                <input
                  onChange={(event) => updateNewExpenseForm('categoryDetail', event.target.value)}
                  placeholder="Ej: agua, colacion, arbitraje"
                  value={newExpenseForm.categoryDetail}
                />
              </label>
            )}
            <label className="form-field">
              <span>Monto</span>
              <input onChange={(event) => updateNewExpenseForm('amount', event.target.value)} value={newExpenseForm.amount} />
            </label>
            <label className="form-field">
              <span>Fecha</span>
              <input onChange={(event) => updateNewExpenseForm('date', event.target.value)} type="date" value={newExpenseForm.date} />
            </label>
            <label className="form-field">
              <span>Estado</span>
              <select onChange={(event) => updateNewExpenseForm('status', event.target.value as Expense['status'])} value={newExpenseForm.status}>
                <option>Pagado</option>
                <option>Pendiente</option>
              </select>
            </label>
            <label className="form-field full">
              <span>Adjuntar boleta / comprobante opcional</span>
              <input
                accept="image/*,.pdf"
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0]

                  if (!file) {
                    return
                  }

                  const reader = new FileReader()
                  reader.addEventListener('load', () => {
                    updateNewExpenseForm('receiptName', file.name)
                    updateNewExpenseForm('receiptUrl', String(reader.result ?? ''))
                  })
                  reader.readAsDataURL(file)
                }}
              />
            </label>
            {newExpenseForm.receiptName && <div className="receipt-chip">Comprobante: {newExpenseForm.receiptName}</div>}
            <button className="primary-button" type="submit">
              <Plus size={18} aria-hidden="true" />
              Agregar egreso
            </button>
          </form>
        </div>
      </article>

      <section className="workspace-grid balance-layout">
        <article className="panel wide-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">{school.name}</span>
              <h2>Ingresos por mensualidades</h2>
            </div>
            <span className="count-pill">{payments.length} registros</span>
          </div>
          <div className="payment-table">
            {payments.map((payment) => (
              <article className="payment-row" key={payment.id}>
                <div className="row-main">
                  <strong>{payment.name}</strong>
                  <span>{payment.category} - {payment.method}</span>
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
              </article>
            ))}
          </div>
        </article>
      </section>

      <article className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Detalle de ingresos</span>
            <h2>Ingresos manuales</h2>
          </div>
        </div>
        <div className="expense-list">
          {incomes.map((income) => (
            <article className="expense-row income-row" key={income.id}>
              <div>
                <strong>{income.title}</strong>
                <span>
                  {income.category} - {income.date}
                  {income.receiptName ? ` - Boleta: ${income.receiptName}` : ''}
                </span>
              </div>
              <strong>{income.amount}</strong>
              <span className={`status ${getStatusClass(income.status)}`}>{income.status}</span>
              <div className="mark-actions">
                {(['Recibido', 'Pendiente'] as IncomeStatus[]).map((status) => (
                  <button
                    className={income.status === status ? 'active' : ''}
                    key={status}
                    onClick={() => markIncome(income.id, status)}
                    type="button"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </article>

      <article className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Detalle de gastos</span>
            <h2>Movimiento mensual</h2>
          </div>
        </div>
        <div className="expense-list">
          {expenses.map((expense) => (
            <article className="expense-row" key={expense.id}>
              <div>
                <strong>{expense.title}</strong>
                <span>
                  {expense.category} - {expense.date}
                  {expense.receiptName ? ` - Boleta: ${expense.receiptName}` : ''}
                </span>
              </div>
              <strong>{expense.amount}</strong>
              <span className={`status ${getStatusClass(expense.status)}`}>{expense.status}</span>
              <div className="mark-actions">
                {(['Pagado', 'Pendiente'] as Expense['status'][]).map((status) => (
                  <button
                    className={expense.status === status ? 'active' : ''}
                    key={status}
                    onClick={() => markExpense(expense.id, status)}
                    type="button"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  )
}

function SchoolManagementPage({
  addCategory,
  addSchoolUser,
  categories,
  newCategoryForm,
  school,
  schoolUserForm,
  updateNewCategoryForm,
  updateSchoolUserForm,
  users,
}: {
  addCategory: (event: FormEvent<HTMLFormElement>) => void
  addSchoolUser: (event: FormEvent<HTMLFormElement>) => void
  categories: Category[]
  newCategoryForm: NewCategoryForm
  school: School
  schoolUserForm: NewUserForm
  updateNewCategoryForm: (field: keyof NewCategoryForm, value: string) => void
  updateSchoolUserForm: (field: keyof NewUserForm, value: string) => void
  users: User[]
}) {
  const [tab, setTab] = useState('usuarios')
  return (
    <section className="workspace-grid management-layout">
    <SectionTabs
  value={tab}
  onChange={setTab}
  tabs={[
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'crear', label: 'Crear usuario' },
    { id: 'categorias', label: 'Categorías' },
  ]}
/>

      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">{school.name}</span>
            <h2>Usuarios de la escuela</h2>
          </div>
          <span className="count-pill">{users.length} usuarios</span>
        </div>
        <div className="admin-user-list">
          {users.map((user) => (
            <article className="admin-user-row school-user-row" key={user.id}>
              <div className="avatar">{user.name.slice(0, 1)}</div>
              <div>
                <strong>{user.name}</strong>
                <span>{getRoleLabel(user.role)} - {user.category}</span>
                <small>RUT: {user.rut} - {user.status}</small>
              </div>
              <span className={`status ${getStatusClass(user.status)}`}>{user.status}</span>
            </article>
          ))}
        </div>
      </article>

      <aside className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Nuevo usuario</span>
            <h2>Crear acceso</h2>
          </div>
        </div>
        <form className="school-form" onSubmit={addSchoolUser}>
          <label className="form-field">
            <span>Nombre</span>
            <input onChange={(event) => updateSchoolUserForm('name', event.target.value)} value={schoolUserForm.name} />
          </label>
          <label className="form-field">
            <span>RUT</span>
            <input onChange={(event) => updateSchoolUserForm('rut', normalizeRut(event.target.value))} value={schoolUserForm.rut} />
          </label>
          <label className="form-field">
            <span>Clave</span>
            <input onChange={(event) => updateSchoolUserForm('password', event.target.value)} value={schoolUserForm.password} />
          </label>
          <label className="form-field">
            <span>Rol</span>
            <select onChange={(event) => updateSchoolUserForm('role', event.target.value as UserRole)} value={schoolUserForm.role}>
              <option value="DT">Profesor</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Alumno">Alumno</option>
            </select>
          </label>
          <label className="form-field">
            <span>Categoria</span>
            <select onChange={(event) => updateSchoolUserForm('category', event.target.value)} value={schoolUserForm.category}>
              {categories.map((category) => (
                <option key={category.id}>{category.label}</option>
              ))}
            </select>
          </label>
          <button className="primary-button" type="submit">
            <UserCog size={18} aria-hidden="true" />
            Crear usuario
          </button>
        </form>
      </aside>

      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Categorias</span>
            <h2>Grupos de la escuela</h2>
          </div>
          <span className="count-pill">{categories.length} categorias</span>
        </div>
        <div className="category-list">
          {categories.map((category) => (
            <div className="category-row" key={category.id}>
              <div>
                <strong>{category.label}</strong>
                <span>{category.branch} - {category.students} alumnos</span>
              </div>
              <div className="mini-field">
                <span style={{ width: category.attendance }}></span>
              </div>
              <b>{category.attendance}</b>
            </div>
          ))}
        </div>
      </article>

      <aside className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Nueva categoria</span>
            <h2>Crear grupo</h2>
          </div>
        </div>
        <form className="school-form" onSubmit={addCategory}>
          <label className="form-field">
            <span>Nombre categoria</span>
            <input onChange={(event) => updateNewCategoryForm('label', event.target.value)} value={newCategoryForm.label} />
          </label>
          <label className="form-field">
            <span>Rama</span>
            <select onChange={(event) => updateNewCategoryForm('branch', event.target.value)} value={newCategoryForm.branch}>
              <option>Mixta</option>
              <option>Femenina</option>
              <option>Masculina</option>
              <option>Arqueros</option>
              <option>Proyeccion</option>
            </select>
          </label>
          <button className="primary-button" type="submit">
            <Plus size={18} aria-hidden="true" />
            Crear categoria
          </button>
        </form>
      </aside>
    </section>
  )
}

function MessagesPage({
  bulkCategory,
  bulkMessage,
  bulkRecipients,
  categoryOptions,
  copyMessage,
  individualMessage,
  messageMode,
  messageTarget,
  scopedStudents,
  selectedStudentId,
  selectedTemplate,
  selectedTemplateId,
  setBulkCategory,
  setMessageMode,
  setSelectedStudentId,
  setSelectedTemplateId,
  whatsappLink,
}: {
  bulkCategory: string
  bulkMessage: string
  bulkRecipients: Student[]
  categoryOptions: string[]
  copyMessage: () => void
  individualMessage: string
  messageMode: MessageMode
  messageTarget: Student
  scopedStudents: Student[]
  selectedStudentId: number
  selectedTemplate: MessageTemplate
  selectedTemplateId: string
  setBulkCategory: (category: string) => void
  setMessageMode: (mode: MessageMode) => void
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

        <div className="segmented message-mode-tabs" aria-label="Tipo de mensaje">
          <button className={messageMode === 'individual' ? 'active' : ''} onClick={() => setMessageMode('individual')} type="button">
            Individual
          </button>
          <button className={messageMode === 'masivo' ? 'active' : ''} onClick={() => setMessageMode('masivo')} type="button">
            Masivo
          </button>
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

        {messageMode === 'individual' && (
          <>
            <div className="filters-bar">
              <div className="segmented student-targets" aria-label="Elegir apoderado">
                {scopedStudents.map((student) => (
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
              <p>{individualMessage}</p>
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
          </>
        )}

        {messageMode === 'masivo' && (
          <>
            <div className="filters-bar">
              <div className="segmented student-targets" aria-label="Elegir categoria para mensaje masivo">
                {categoryOptions.map((category) => (
                  <button
                    className={bulkCategory === category ? 'active' : ''}
                    key={category}
                    onClick={() => setBulkCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="message-preview bulk-preview">
              <div>
                <span>Destinatarios</span>
                <strong>{bulkRecipients.length} apoderados</strong>
                <small>{bulkCategory === 'Todas' ? 'Todas las categorias visibles' : bulkCategory}</small>
              </div>
              <p>{bulkMessage}</p>
            </div>

            <div className="message-actions">
              <button className="ghost-button" onClick={copyMessage} type="button">
                Copiar mensaje masivo
              </button>
              <a className="primary-button" href={getWhatsappShareLink(bulkMessage)} target="_blank" rel="noreferrer">
                <Phone size={18} aria-hidden="true" />
                Abrir WhatsApp Web
              </a>
            </div>

            <div className="bulk-recipient-list">
              {bulkRecipients.map((student) => (
                <div className="bulk-recipient" key={student.id}>
                  <div>
                    <strong>{student.guardian}</strong>
                    <span>
                      {student.name} - {student.category}
                    </span>
                  </div>
                  <a className="small-button" href={getWhatsappLink(student.phone, bulkMessage)} target="_blank" rel="noreferrer">
                    Enviar
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </article>
    </section>
  )
}

function UserProfilePage({
  attendanceRecords,
  coach,
  navigateTo,
  payments,
  school,
}: {
  attendanceRecords: Attendance[]
  coach: User
  navigateTo: (view: View) => void
  payments: Payment[]
  school: School
}) {
  const pendingPayments = payments.filter((payment) => payment.status !== 'Pagado').length
  const presentToday = attendanceRecords.filter((record) => record.status === 'Presente').length
  const profileCopy: Record<Exclude<UserRole, 'Alumno' | 'SuperAdmin'>, { title: string; description: string; actions: View[] }> = {
    Director: {
      title: 'Perfil administrador escuela',
      description: 'Vista de gestion para revisar operacion, categorias, finanzas, asistencia y comunicacion.',
      actions: ['gestion', 'alumnos', 'asistencia', 'finanzas', 'balance', 'mensajes'],
    },
    DT: {
      title: 'Perfil profesor',
      description: 'Vista pensada para cancha: asistencia, seguimiento de jugadores, comentarios y mensajes a apoderados.',
      actions: ['alumnos', 'asistencia', 'mensajes'],
    },
    Finanzas: {
      title: 'Perfil finanzas',
      description: 'Vista enfocada en mensualidades, estados de pago, cobros y reportes financieros.',
      actions: ['finanzas', 'balance', 'pagos', 'mensajes'],
    },
  }
  const current = profileCopy[coach.role as Exclude<UserRole, 'Alumno' | 'SuperAdmin'>] ?? profileCopy.Director

  return (
    <section className="workspace-grid profile-layout">
      <article className="panel player-profile-card">
        <div className="staff-photo">
          <UserRound size={34} aria-hidden="true" />
        </div>
        <div>
          <span className="panel-kicker">{getRoleLabel(coach.role)}</span>
          <h2>{coach.name}</h2>
          <p>{current.description}</p>
        </div>
        <div className="profile-tags">
          {coach.permissions.map((permission) => (
            <span key={permission}>{permission}</span>
          ))}
        </div>
      </article>

      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">{school.name}</span>
            <h2>{current.title}</h2>
          </div>
        </div>

        <div className="profile-metrics">
          <div>
            <Building2 size={18} aria-hidden="true" />
            <span>Escuela</span>
            <strong>{school.initials}</strong>
          </div>
          <div>
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Rol</span>
            <strong>{getRoleLabel(coach.role)}</strong>
          </div>
          <div>
            <CalendarCheck size={18} aria-hidden="true" />
            <span>Presentes hoy</span>
            <strong>{presentToday}</strong>
          </div>
          <div>
            <WalletCards size={18} aria-hidden="true" />
            <span>Pagos pendientes</span>
            <strong>{pendingPayments}</strong>
          </div>
        </div>

        <div className="profile-columns">
          <div className="detail-list">
            <div>
              <span>RUT usuario</span>
              <strong>{coach.rut}</strong>
            </div>
            <div>
              <span>Categoria asignada</span>
              <strong>{coach.category}</strong>
            </div>
            <div>
              <span>Estado cuenta</span>
              <strong>{coach.status}</strong>
            </div>
          </div>
          <div className="detail-list">
            <div>
              <span>Ultimo acceso</span>
              <strong>{coach.lastAccess}</strong>
            </div>
            <div>
              <span>Plan escuela</span>
              <strong>{school.plan}</strong>
            </div>
            <div>
              <span>Contacto escuela</span>
              <strong>{school.contactEmail}</strong>
            </div>
          </div>
        </div>

        <div className="role-action-grid">
          {current.actions.map((view) => (
            <button className="ghost-button" key={view} onClick={() => navigateTo(view)} type="button">
              <SlidersHorizontal size={18} aria-hidden="true" />
              Abrir {navItems.find((item) => item.id === view)?.label}
            </button>
          ))}
        </div>
      </article>
    </section>
  )
}

function PlayerProfilePage({
  navigateTo,
  player,
  preparePaymentMessage,
  savePlayerComment,
  setSelectedStudentId,
  updatePlayerComment,
}: {
  navigateTo: (view: View) => void
  player: Student
  preparePaymentMessage: (payment: Payment) => void
  savePlayerComment: (playerName: string) => void
  setSelectedStudentId: (id: number) => void
  updatePlayerComment: (studentId: number, comment: string) => void
}) {
  const paymentRecord =
    initialPaymentList.find((payment) => payment.studentId === player.id) ??
    initialPaymentList.find((payment) => payment.name === player.name) ??
    initialPaymentList[0]

  return (
    <section className="workspace-grid profile-layout">
      <article className="panel player-profile-card">
        <PlayerAvatar player={player} large />
        <div>
          <span className="panel-kicker">{player.category}</span>
          <h2>{player.name}</h2>
          <p>{player.notes}</p>
        </div>

        <div className="profile-tags">
          {player.strengths.map((strength) => (
            <span key={strength}>{strength}</span>
          ))}
        </div>

        <div className="message-actions">
          <button
            className="primary-button"
            onClick={() => {
              setSelectedStudentId(player.id)
              navigateTo('mensajes')
            }}
            type="button"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Contactar apoderado
          </button>
          <button className="ghost-button" onClick={() => preparePaymentMessage(paymentRecord)} type="button">
            <WalletCards size={18} aria-hidden="true" />
            Revisar pago
          </button>
        </div>
      </article>

      <article className="panel wide-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Informacion deportiva</span>
            <h2>Seguimiento del jugador</h2>
          </div>
        </div>

        <div className="profile-metrics">
          <div>
            <Shirt size={18} aria-hidden="true" />
            <span>Camiseta</span>
            <strong>{player.shirtNumber}</strong>
          </div>
          <div>
            <Footprints size={18} aria-hidden="true" />
            <span>Posicion</span>
            <strong>{player.position}</strong>
          </div>
          <div>
            <Dumbbell size={18} aria-hidden="true" />
            <span>Pierna habil</span>
            <strong>{player.dominantFoot}</strong>
          </div>
          <div>
            <CalendarCheck size={18} aria-hidden="true" />
            <span>Asistencia</span>
            <strong>{player.attendance}</strong>
          </div>
        </div>

        <div className="profile-columns">
          <div className="detail-list">
            <div>
              <span>RUT alumno</span>
              <strong>{player.rut}</strong>
            </div>
            <div>
              <span>Apoderado</span>
              <strong>{player.guardian}</strong>
            </div>
            <div>
              <span>Telefono</span>
              <strong>+{player.phone}</strong>
            </div>
            <div>
              <span>Ano nacimiento</span>
              <strong>{player.birthYear}</strong>
            </div>
          </div>

          <div className="detail-list">
            <div>
              <span>Goles</span>
              <strong>{player.goals}</strong>
            </div>
            <div>
              <span>Asistencias</span>
              <strong>{player.assists}</strong>
            </div>
            <div>
              <span>Salud</span>
              <strong>{player.medical}</strong>
            </div>
          </div>
        </div>

        <form
          className="coach-comment-form"
          onSubmit={(event) => {
            event.preventDefault()
            savePlayerComment(player.name)
          }}
        >
          <label className="form-field full">
            <span>Comentario del profesor</span>
            <textarea
              onChange={(event) => updatePlayerComment(player.id, event.target.value)}
              placeholder="Ej: Reforzar control orientado, confianza con pierna izquierda y toma de decision."
              value={player.coachComment}
            />
          </label>
          <div className="comment-actions">
            <button className="primary-button" type="submit">
              Guardar comentario
            </button>
          </div>
        </form>
      </article>
    </section>
  )
}

function PlayerAvatar({ large = false, player }: { large?: boolean; player: Student }) {
  return (
    <div className={large ? 'player-photo large' : 'player-photo'} style={{ background: player.photoTone }}>
      <span>{player.name.slice(0, 1)}</span>
      <strong>{player.shirtNumber}</strong>
    </div>
  )
}

function DeveerreFooter({ variant = 'default' }: { variant?: 'default' | 'light' }) {
  return (
    <footer className={variant === 'light' ? 'deveerre-footer light' : 'deveerre-footer'}>
      Diseñado y creado por Deveerre. Todos los derechos reservados.
    </footer>
  )
}

export default App
