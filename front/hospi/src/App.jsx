import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const initialForm = {
  date: '',
  time: '',
  ward: '',
  patientName: '',
  age: '',
  gender: '',
  hn: '',
  an: '',
  weight: '',
  height: '',
  procedure: '',
  markSite: '',
  surgeon: '',
  anesthesiologist: '',
  npoTime: '',
  premedTime: '',
  ivSize: '',
  ivPosition: '',
  otherDocument: '',
  bloodPRC: '',
  bloodFFP: '',
  bloodWB: '',
  bloodNote: '',
  hb: '',
  hct: '',
  fbs: '',
  bun: '',
  cr: '',
  electrolyte: '',
  labOther: '',
  bp: '',
  pr: '',
  rr: '',
  spo2: '',
  temp: '',
  asaClass: '',
  airwayOther: '',
  note: '',
  transferTime: '',
  wardSenderName: '',
  wardSenderPosition: '',
  wardSenderSignature: '',
  wardSenderTime: '',
  orReceiverName: '',
  orReceiverPosition: '',
  orReceiverSignature: '',
  orReceiverTime: '',
}

const initialChecks = {
  identifyNameDob: false,
  wristband: false,
  hnAnMatch: false,
  consentComplete: false,
  markSiteCorrect: false,
  npo: false,
  bathClean: false,
  skinPrep: false,
  denturesRemoved: false,
  contactLensRemoved: false,
  valuablesRemoved: false,
  medicineGiven: false,
  premedGiven: false,
  ivLine: false,
  foley: false,
  ngTube: false,
  etTube: false,
  oxygenRespirator: false,
  xrayReady: false,
  labReady: false,
  chartComplete: false,
  documentOther: false,
  noBloodNeeded: false,
  bloodReserved: false,
  cxrYes: false,
  cxrNo: false,
  cxrRead: false,
  ekgYes: false,
  ekgNo: false,
  ekgRead: false,
  vdrlReactive: false,
  vdrlNonReactive: false,
  papNormal: false,
  papAbnormal: false,
  papNotChecked: false,
  hbsReactive: false,
  hbsNonReactive: false,
  conscious: false,
  drowsy: false,
  confused: false,
  unconscious: false,
  airwayNormal: false,
  difficultMouth: false,
  difficultEt: false,
  stiffNeck: false,
  looseTooth: false,
  airwayOtherCheck: false,
  shortNeck: false,
}

const identificationItems = [
  ['identifyNameDob', 'ผู้ป่วยบอกชื่อ-สกุล และวันเดือนปีเกิดได้'],
  ['wristband', 'ป้ายข้อมือถูกต้อง ตรงกับเวชระเบียน'],
  ['hnAnMatch', 'HN/AN ตรงกับใบ OR'],
  ['consentComplete', 'มีใบยินยอมผ่าตัด (Consent) ครบถ้วน'],
  ['markSiteCorrect', 'ตำแหน่งผ่าตัดถูกต้อง / มีการ mark site'],
]

const preparationItems = [
  ['npo', 'NPO ตั้งแต่เวลา'],
  ['bathClean', 'อาบน้ำ/ทำความสะอาดร่างกายแล้ว'],
  ['skinPrep', 'เตรียมผิวหนังบริเวณผ่าตัดแล้ว'],
  ['denturesRemoved', 'ถอดฟันปลอม'],
  ['contactLensRemoved', 'ถอดคอนแทคเลนส์'],
  ['valuablesRemoved', 'ถอดเครื่องประดับ/ของมีค่า'],
  ['medicineGiven', 'งดยาตามแผนการรักษา'],
  ['premedGiven', 'ให้ยาก่อนผ่าตัด (Premed)'],
]

const equipmentItemsLeft = [
  ['ivLine', 'IV line ใช้งานได้'],
  ['foley', 'Foley catheter'],
  ['ngTube', 'NG tube'],
  ['etTube', 'ET tube'],
  ['oxygenRespirator', 'Oxygen / Respirator'],
]

const equipmentItemsRight = [
  ['xrayReady', 'Film / X-ray พร้อม'],
  ['labReady', 'Lab สำคัญพร้อม'],
  ['chartComplete', 'เวชระเบียนครบถ้วน'],
  ['documentOther', 'อื่น ๆ'],
]

const patientConditionItems = [
  ['conscious', 'รู้สึกตัวดี'],
  ['drowsy', 'ง่วงซึม'],
  ['confused', 'สับสน'],
  ['unconscious', 'ไม่รู้สึกตัว'],
]

const airwayItems = [
  ['airwayNormal', 'ปกติ'],
  ['difficultMouth', 'การอ้าปากจำกัด'],
  ['difficultEt', 'ใส่ ET ยาก'],
  ['stiffNeck', 'เจ็บคอ/คอเคลื่อนไหวไม่ได้'],
  ['looseTooth', 'ฟันปลอม/โยก'],
  ['shortNeck', 'คอสั้น/อ้วน'],
  ['airwayOtherCheck', 'อื่น ๆ'],
]

function formatSavedAt(value) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function summarizeRecord(record) {
  const form = record.form || {}

  return {
    name: form.patientName || 'ไม่ระบุชื่อ',
    hn: form.hn || '-',
    an: form.an || '-',
    procedure: form.procedure || '-',
    ward: form.ward || '-',
    updatedAt: formatSavedAt(record.updatedAt),
  }
}

async function requestApi(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'ไม่สามารถเชื่อมต่อ API ได้'

    try {
      const payload = await response.json()
      message = payload?.error?.message || message
    } catch {
      // Keep the default message when the response has no JSON body.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function TextInput({ label, name, value, onChange, unit = '', wide = false, placeholder = '' }) {
  return (
    <label className={`line-field field-${name}${wide ? ' wide' : ''}`}>
      <span>{label}</span>
      <input name={name} value={value} onChange={onChange} placeholder={placeholder} />
      {unit && <em>{unit}</em>}
    </label>
  )
}

function CheckItem({ id, label, checked, onChange, children }) {
  return (
    <label className="check-item">
      <input type="checkbox" name={id} checked={checked} onChange={onChange} />
      <span>{label}</span>
      {children}
    </label>
  )
}

function Section({ number, title, subtitle, children, className = '' }) {
  return (
    <section className={`check-section ${className}`}>
      <h2>
        <span>{number}</span>
        {title}
        {subtitle && <small>{subtitle}</small>}
      </h2>
      {children}
    </section>
  )
}

function RecordsView({ records, search, onSearch, onOpen, onDelete, onNew, isLoading, error, onRefresh }) {
  const normalizedSearch = search.trim().toLowerCase()
  const filteredRecords = records.filter((record) => {
    const form = record.form || {}
    const searchableText = [
      form.patientName,
      form.hn,
      form.an,
      form.procedure,
      form.ward,
      record.updatedAt,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(normalizedSearch)
  })

  return (
    <section className="records-panel">
      <div className="records-head">
        <div>
          <p className="eyebrow">Patient Records</p>
          <h2>ข้อมูลผู้ป่วยที่บันทึกไว้</h2>
        </div>
        <button type="button" className="primary-button" onClick={onNew}>
          สร้างฟอร์มใหม่
        </button>
      </div>

      <div className="records-tools">
        <label className="search-field">
          <span>ค้นหา</span>
          <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="ชื่อ, HN, AN, หัตถการ, Ward" />
        </label>
        <div className="records-tool-actions">
          <p>{isLoading ? 'กำลังโหลด...' : `${filteredRecords.length} รายการ`}</p>
          <button type="button" className="secondary-button" onClick={onRefresh}>
            โหลดใหม่
          </button>
        </div>
      </div>

      {error ? (
        <div className="records-alert">
          <strong>เชื่อมต่อข้อมูลผู้ป่วยไม่ได้</strong>
          <p>{error}</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="empty-records">
          <strong>ยังไม่มีข้อมูลผู้ป่วย</strong>
          <p>กรอกแบบฟอร์มแล้วกดบันทึก ข้อมูลจะถูกเก็บไว้ใน MongoDB</p>
        </div>
      ) : (
        <div className="records-list">
          {filteredRecords.map((record) => {
            const summary = summarizeRecord(record)

            return (
              <article className="record-row" key={record.id}>
                <div className="record-main">
                  <strong>{summary.name}</strong>
                  <span>HN {summary.hn}</span>
                  <span>AN {summary.an}</span>
                </div>
                <div className="record-detail">
                  <span>หัตถการ: {summary.procedure}</span>
                  <span>Ward: {summary.ward}</span>
                  <span>อัปเดต: {summary.updatedAt}</span>
                </div>
                <div className="record-actions">
                  <button type="button" className="secondary-button" onClick={() => onOpen(record)}>
                    เปิดแก้ไข
                  </button>
                  <button type="button" className="secondary-button" onClick={() => onOpen(record)}>
                    เปิดเพื่อพิมพ์
                  </button>
                  <button type="button" className="danger-button" onClick={() => onDelete(record.id)}>
                    ลบ
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [checks, setChecks] = useState(initialChecks)
  const [mode, setMode] = useState('form')
  const [records, setRecords] = useState([])
  const [activeRecordId, setActiveRecordId] = useState('')
  const [recordSearch, setRecordSearch] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [recordsError, setRecordsError] = useState('')
  const [isLoadingRecords, setIsLoadingRecords] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const checkedCount = useMemo(() => {
    return Object.values(checks).filter(Boolean).length
  }, [checks])

  const requiredCount = useMemo(() => {
    return [
      form.date,
      form.time,
      form.ward,
      form.patientName,
      form.hn,
      form.procedure,
      form.surgeon,
    ].filter(Boolean).length
  }, [form])

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    setIsLoadingRecords(true)
    setRecordsError('')

    try {
      const payload = await requestApi('/api/patient-records')
      setRecords(payload?.data || [])
    } catch (error) {
      setRecordsError(error.message)
    } finally {
      setIsLoadingRecords(false)
    }
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function updateCheck(event) {
    const { name, checked } = event.target
    setChecks((current) => ({ ...current, [name]: checked }))
  }

  function resetForm() {
    setForm(initialForm)
    setChecks(initialChecks)
    setActiveRecordId('')
    setSaveMessage('')
    setMode('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function printForm() {
    window.print()
  }

  async function saveCurrentRecord() {
    setIsSaving(true)
    setSaveMessage('')

    try {
      const path = activeRecordId ? `/api/patient-records/${activeRecordId}` : '/api/patient-records'
      const method = activeRecordId ? 'PUT' : 'POST'
      const payload = await requestApi(path, {
        method,
        body: JSON.stringify({
          form,
          checks,
        }),
      })

      const savedRecord = payload.data
      const nextRecords = activeRecordId
        ? records.map((record) => (record.id === activeRecordId ? savedRecord : record))
        : [savedRecord, ...records]

      setRecords(nextRecords)
      setActiveRecordId(savedRecord.id)
      setSaveMessage(`บันทึกข้อมูล ${form.patientName || 'ผู้ป่วย'} แล้ว`)
    } catch (error) {
      setSaveMessage(`บันทึกไม่สำเร็จ: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  function openRecord(record, nextMode = 'form') {
    setForm({ ...initialForm, ...record.form })
    setChecks({ ...initialChecks, ...record.checks })
    setActiveRecordId(record.id)
    setSaveMessage('')
    setMode(nextMode)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deleteRecord(recordId) {
    const shouldDelete = window.confirm('ต้องการลบข้อมูลผู้ป่วยรายการนี้ใช่ไหม')

    if (!shouldDelete) {
      return
    }

    try {
      await requestApi(`/api/patient-records/${recordId}`, { method: 'DELETE' })
      const nextRecords = records.filter((record) => record.id !== recordId)
      setRecords(nextRecords)

      if (activeRecordId === recordId) {
        setActiveRecordId('')
      }
    } catch (error) {
      setRecordsError(error.message)
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar no-print">
        <div className="brand">
          <span className="brand-mark">OR</span>
          <div>
            <strong>Pre-OR Checklist</strong>
            <small>แบบตรวจสอบก่อนส่งผู้ป่วย</small>
          </div>
        </div>

        <nav className="nav-list">
          <button type="button" className={mode === 'form' ? 'active' : ''} onClick={() => setMode('form')}>
            <span>01</span>
            กรอกข้อมูล
          </button>
          <button type="button" className={mode === 'records' ? 'active' : ''} onClick={() => setMode('records')}>
            <span>02</span>
            ข้อมูลผู้ป่วย
          </button>
        </nav>

        <div className="status-box">
          <p>ข้อมูลหลัก</p>
          <strong>{requiredCount}/7</strong>
          <p>รายการที่ตรวจแล้ว</p>
          <strong>{checkedCount}</strong>
          <p>บันทึกผู้ป่วย</p>
          <strong>{records.length}</strong>
        </div>
      </aside>

      <section className="workspace">
        <div className="toolbar no-print">
          <div>
            <p className="eyebrow">Pre-OR Safety Checklist</p>
            <h1 className="title-line">
              <span>แบบตรวจสอบก่อนส่ง</span>
              <span>ผู้ป่วยเข้าห้องผ่าตัด</span>
            </h1>
          </div>
          <div className="toolbar-actions">
            {mode === 'records' ? (
              <button type="button" className="primary-button" onClick={resetForm}>
                สร้างฟอร์มใหม่
              </button>
            ) : (
              <>
                <button type="button" className="secondary-button" onClick={resetForm}>
                  ล้างฟอร์ม
                </button>
                <button type="button" className="secondary-button" onClick={saveCurrentRecord} disabled={isSaving}>
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
                <button type="button" className="primary-button" onClick={printForm}>
                  พิมพ์
                </button>
              </>
            )}
          </div>
        </div>

        {mode === 'records' ? (
          <RecordsView
            records={records}
            search={recordSearch}
            onSearch={setRecordSearch}
            onOpen={(record) => openRecord(record, 'form')}
            onDelete={deleteRecord}
            onNew={resetForm}
            isLoading={isLoadingRecords}
            error={recordsError}
            onRefresh={loadRecords}
          />
        ) : (
          <form
            id="or-checklist-form"
            className="checklist-form paper-sheet"
            onSubmit={(event) => event.preventDefault()}
          >
            <header className="paper-header">
              <div>
                <h1 className="title-line">
                  <span>แบบตรวจสอบก่อนส่ง</span>
                  <span>ผู้ป่วยเข้าห้องผ่าตัด</span>
                </h1>
                <p>(Pre-OR Safety Checklist)</p>
              </div>
              <div className="header-fields">
                <TextInput label="วันที่" name="date" value={form.date} onChange={updateField} placeholder="วว/ดด/พ.ศ." />
                <TextInput label="เวลา" name="time" value={form.time} onChange={updateField} placeholder="00:00 น." />
                <TextInput label="Ward" name="ward" value={form.ward} onChange={updateField} />
              </div>
            </header>

            {saveMessage && <div className="save-banner no-print">{saveMessage}</div>}

            <section className="patient-info">
              <div className="patient-row patient-top-row">
                <TextInput label="ชื่อ-สกุลผู้ป่วย" name="patientName" value={form.patientName} onChange={updateField} />
                <TextInput label="อายุ" name="age" value={form.age} onChange={updateField} unit="ปี" />
                <div className="gender-field">
                  <span>เพศ</span>
                  <CheckItem id="genderMale" label="ชาย" checked={form.gender === 'ชาย'} onChange={() => setForm((current) => ({ ...current, gender: 'ชาย' }))} />
                  <CheckItem id="genderFemale" label="หญิง" checked={form.gender === 'หญิง'} onChange={() => setForm((current) => ({ ...current, gender: 'หญิง' }))} />
                </div>
              </div>
              <div className="patient-row patient-code-row">
                <TextInput label="HN" name="hn" value={form.hn} onChange={updateField} />
                <TextInput label="AN" name="an" value={form.an} onChange={updateField} />
                <TextInput label="น้ำหนัก" name="weight" value={form.weight} onChange={updateField} unit="kg." />
                <TextInput label="ส่วนสูง" name="height" value={form.height} onChange={updateField} unit="cm." />
              </div>
              <div className="patient-row">
                <TextInput label="หัตถการ/ผ่าตัด" name="procedure" value={form.procedure} onChange={updateField} />
              </div>
              <div className="patient-row">
                <TextInput label="ตำแหน่งผ่าตัด (Mark site)" name="markSite" value={form.markSite} onChange={updateField} />
              </div>
              <div className="patient-row doctor-row">
                <TextInput label="แพทย์ผู้ผ่าตัด" name="surgeon" value={form.surgeon} onChange={updateField} />
                <TextInput label="วิสัญญีแพทย์" name="anesthesiologist" value={form.anesthesiologist} onChange={updateField} />
              </div>
            </section>

            <div className="section-grid two">
              <Section number="1." title="การยืนยันตัวผู้ป่วย" subtitle="Patient Identification">
                <div className="check-list">
                  {identificationItems.map(([id, label]) => (
                    <CheckItem key={id} id={id} label={label} checked={checks[id]} onChange={updateCheck} />
                  ))}
                </div>
              </Section>

              <Section number="2." title="การเตรียมก่อนผ่าตัด">
                <div className="check-list split">
                  {preparationItems.map(([id, label]) => (
                    <CheckItem key={id} id={id} label={label} checked={checks[id]} onChange={updateCheck}>
                      {id === 'npo' && <input className="inline-input" name="npoTime" value={form.npoTime} onChange={updateField} placeholder="เวลา" />}
                      {id === 'premedGiven' && <input className="inline-input" name="premedTime" value={form.premedTime} onChange={updateField} placeholder="เวลา" />}
                    </CheckItem>
                  ))}
                </div>
              </Section>
            </div>

            <div className="section-grid two">
              <Section number="3." title="อุปกรณ์และเอกสาร">
                <div className="document-grid">
                  <div className="check-list">
                    {equipmentItemsLeft.map(([id, label]) => (
                      <CheckItem key={id} id={id} label={label} checked={checks[id]} onChange={updateCheck}>
                        {id === 'ivLine' && (
                          <>
                            <input className="tiny-input" name="ivSize" value={form.ivSize} onChange={updateField} placeholder="G" />
                            <input className="inline-input" name="ivPosition" value={form.ivPosition} onChange={updateField} placeholder="ตำแหน่ง" />
                          </>
                        )}
                      </CheckItem>
                    ))}
                  </div>
                  <div className="check-list">
                    {equipmentItemsRight.map(([id, label]) => (
                      <CheckItem key={id} id={id} label={label} checked={checks[id]} onChange={updateCheck}>
                        {id === 'documentOther' && (
                          <input className="inline-input" name="otherDocument" value={form.otherDocument} onChange={updateField} placeholder="ระบุ" />
                        )}
                      </CheckItem>
                    ))}
                  </div>
                </div>
              </Section>

              <Section number="4." title="การจองเลือด" subtitle="Blood Reservation">
                <div className="blood-grid">
                  <div className="check-list">
                    <CheckItem id="noBloodNeeded" label="ไม่ต้องจองเลือด" checked={checks.noBloodNeeded} onChange={updateCheck} />
                    <CheckItem id="bloodReserved" label="จองแล้ว" checked={checks.bloodReserved} onChange={updateCheck} />
                  </div>
                  <div className="blood-units">
                    <TextInput label="PRC" name="bloodPRC" value={form.bloodPRC} onChange={updateField} unit="unit" />
                    <TextInput label="FFP" name="bloodFFP" value={form.bloodFFP} onChange={updateField} unit="unit" />
                    <TextInput label="WB" name="bloodWB" value={form.bloodWB} onChange={updateField} unit="unit" />
                  </div>
                </div>
                <TextInput label="หมายเหตุ" name="bloodNote" value={form.bloodNote} onChange={updateField} wide />
              </Section>
            </div>

            <div className="section-grid two">
              <Section number="5." title="ผลตรวจทางห้องปฏิบัติการ" subtitle="Lab">
                <div className="lab-layout">
                  <div className="lab-values">
                    <TextInput label="Hb" name="hb" value={form.hb} onChange={updateField} unit="g/dL" />
                    <TextInput label="Hct" name="hct" value={form.hct} onChange={updateField} unit="%" />
                    <TextInput label="FBS" name="fbs" value={form.fbs} onChange={updateField} unit="mg/dL" />
                    <TextInput label="BUN" name="bun" value={form.bun} onChange={updateField} unit="mg/dL" />
                    <TextInput label="Cr" name="cr" value={form.cr} onChange={updateField} unit="mg/dL" />
                    <TextInput label="Electrolyte" name="electrolyte" value={form.electrolyte} onChange={updateField} />
                  </div>
                  <div className="lab-checks">
                    <div className="mini-row">
                      <strong>CXR</strong>
                      <CheckItem id="cxrYes" label="มี" checked={checks.cxrYes} onChange={updateCheck} />
                      <CheckItem id="cxrNo" label="ไม่มี" checked={checks.cxrNo} onChange={updateCheck} />
                      <CheckItem id="cxrRead" label="อ่านผลแล้ว" checked={checks.cxrRead} onChange={updateCheck} />
                    </div>
                    <div className="mini-row">
                      <strong>EKG</strong>
                      <CheckItem id="ekgYes" label="มี" checked={checks.ekgYes} onChange={updateCheck} />
                      <CheckItem id="ekgNo" label="ไม่มี" checked={checks.ekgNo} onChange={updateCheck} />
                      <CheckItem id="ekgRead" label="อ่านผลแล้ว" checked={checks.ekgRead} onChange={updateCheck} />
                    </div>
                    <TextInput label="อื่น ๆ" name="labOther" value={form.labOther} onChange={updateField} />
                    <div className="mini-row">
                      <strong>VDRL</strong>
                      <CheckItem id="vdrlReactive" label="Reactive" checked={checks.vdrlReactive} onChange={updateCheck} />
                      <CheckItem id="vdrlNonReactive" label="Non-Reactive" checked={checks.vdrlNonReactive} onChange={updateCheck} />
                    </div>
                    <div className="mini-row">
                      <strong>Pap smear</strong>
                      <CheckItem id="papNormal" label="ปกติ" checked={checks.papNormal} onChange={updateCheck} />
                      <CheckItem id="papAbnormal" label="ผิดปกติ" checked={checks.papAbnormal} onChange={updateCheck} />
                      <CheckItem id="papNotChecked" label="ยังไม่ตรวจ" checked={checks.papNotChecked} onChange={updateCheck} />
                    </div>
                    <div className="mini-row">
                      <strong>HBs Ag</strong>
                      <CheckItem id="hbsReactive" label="Reactive" checked={checks.hbsReactive} onChange={updateCheck} />
                      <CheckItem id="hbsNonReactive" label="Non-Reactive" checked={checks.hbsNonReactive} onChange={updateCheck} />
                    </div>
                  </div>
                </div>
              </Section>

              <Section number="6." title="สัญญาณชีพล่าสุด" subtitle="Vital Signs">
                <div className="vital-layout">
                  <div className="lab-values">
                    <TextInput label="BP" name="bp" value={form.bp} onChange={updateField} unit="mmHg" />
                    <TextInput label="PR" name="pr" value={form.pr} onChange={updateField} unit="/min" />
                    <TextInput label="RR" name="rr" value={form.rr} onChange={updateField} unit="/min" />
                    <TextInput label="SpO₂" name="spo2" value={form.spo2} onChange={updateField} unit="%" />
                    <TextInput label="Temp" name="temp" value={form.temp} onChange={updateField} unit="°C" />
                  </div>
                  <div className="condition-box">
                    <h3>สภาพผู้ป่วย</h3>
                    {patientConditionItems.map(([id, label]) => (
                      <CheckItem key={id} id={id} label={label} checked={checks[id]} onChange={updateCheck} />
                    ))}
                  </div>
                </div>
              </Section>
            </div>

            <div className="section-grid two">
              <Section number="7." title="การประเมินความเสี่ยง" className="risk-section">
                <div className="risk-layout">
                  <div>
                    <h3>ASA Class</h3>
                    <div className="asa-options">
                      {['I', 'II', 'III', 'IV', 'V', 'E'].map((level) => (
                        <label key={level} className="check-item compact">
                          <input
                            type="checkbox"
                            name="asaClass"
                            value={level}
                            checked={form.asaClass === level}
                            onChange={(event) => setForm((current) => ({ ...current, asaClass: event.target.checked ? level : '' }))}
                          />
                          <span>{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3>Airway</h3>
                    <div className="check-list two-col">
                      {airwayItems.map(([id, label]) => (
                        <CheckItem key={id} id={id} label={label} checked={checks[id]} onChange={updateCheck}>
                          {id === 'airwayOtherCheck' && (
                            <input className="inline-input" name="airwayOther" value={form.airwayOther} onChange={updateField} placeholder="ระบุ" />
                          )}
                        </CheckItem>
                      ))}
                    </div>
                  </div>
                </div>
                <label className="note-field">
                  <span>หมายเหตุ</span>
                  <textarea name="note" value={form.note} onChange={updateField} rows="3" />
                </label>
              </Section>

              <Section number="8." title="การส่งต่อผู้ป่วย" className="handoff-section">
                <TextInput label="เวลาออกจากหอผู้ป่วย" name="transferTime" value={form.transferTime} onChange={updateField} unit="น." />
                <div className="handoff-box">
                  <h3>ผู้ส่ง (Ward)</h3>
                  <TextInput label="ชื่อ-สกุล" name="wardSenderName" value={form.wardSenderName} onChange={updateField} />
                  <TextInput label="ตำแหน่ง" name="wardSenderPosition" value={form.wardSenderPosition} onChange={updateField} />
                  <TextInput label="ลายมือชื่อ" name="wardSenderSignature" value={form.wardSenderSignature} onChange={updateField} />
                  <TextInput label="เวลา" name="wardSenderTime" value={form.wardSenderTime} onChange={updateField} unit="น." />
                </div>
                <div className="handoff-box">
                  <h3>ผู้รับ (OR)</h3>
                  <TextInput label="ชื่อ-สกุล" name="orReceiverName" value={form.orReceiverName} onChange={updateField} />
                  <TextInput label="ตำแหน่ง" name="orReceiverPosition" value={form.orReceiverPosition} onChange={updateField} />
                  <TextInput label="ลายมือชื่อ" name="orReceiverSignature" value={form.orReceiverSignature} onChange={updateField} />
                  <TextInput label="เวลา" name="orReceiverTime" value={form.orReceiverTime} onChange={updateField} unit="น." />
                </div>
              </Section>
            </div>

            <footer className="paper-footer">
              <p>กรุณาตรวจสอบทุกข้อก่อนส่งผู้ป่วยเข้าห้องผ่าตัด</p>
              <p>ขอบคุณค่ะ/ครับ</p>
            </footer>
            {mode === 'form' && (
              <footer className="form-footer no-print">
                <button type="button" className="secondary-button" onClick={resetForm}>
                  ล้างฟอร์ม
                </button>
                <button type="button" className="secondary-button" onClick={saveCurrentRecord} disabled={isSaving}>
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
                <button type="button" className="primary-button" onClick={printForm}>
                  พิมพ์
                </button>
              </footer>
            )}
          </form>
        )}
      </section>
    </main>
  )
}

export default App
