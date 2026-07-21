import { useState, useRef, useEffect } from "react";
import {
  Leaf, MapPin, Eye, Brain, CheckCircle, Send, ChevronRight,
  BookOpen, Plus, X, AlertTriangle, MessageSquare, Lightbulb,
  FlaskConical, Radio, Footprints, HelpCircle, Telescope,
  Trash2, Edit2, Download, ArrowLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ObservationEntry {
  id: string;
  createdAt: string;
  date: string; time: string; tidal: string; weather: string;
  location: string; coordinates: string;
  ecoObjectType: string; species: string; habitat: string; ecologicalProcess: string;
  signalDescription: string; signalType: string[];
  subjectType: string; subjectName: string; subjectRole: string;
  perceptionMethods: string[]; perceptionNotes: string;
  interpretation: string;
  judgmentBasis: string[]; judgmentNotes: string;
  hasAlternatives: string; alternativeDetails: string;
  verificationMethods: string[]; verificationStatus: string;
  disseminationChannels: string[]; disseminationNotes: string;
  actionsTaken: string[]; actionNotes: string;
  uncertainties: string;
  knowledgeAdopted: string; knowledgeOmitted: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIGNAL_TYPES = ["视觉 Visual", "听觉 Auditory", "测量 Measured", "嗅觉 Olfactory", "触觉 Tactile"];
const SUBJECT_TYPES = ["居民 Resident", "工作人员 Staff", "研究人员 Researcher", "设备 Device", "其他 Other"];
const PERCEPTION_METHODS = ["经验观察 Experiential", "仪器测量 Instruments", "照片记录 Photography", "身体感受 Physical sensation", "遥感 Remote sensing"];
const JUDGMENT_BASIS = ["过去经验 Past experience", "基线数据 Baseline data", "专业知识 Expertise", "比较对象 Comparison", "文献记录 Literature"];
const VERIFICATION_METHODS = ["重复观察 Repeat observation", "专家确认 Expert confirmation", "数据对照 Data comparison", "实验室分析 Lab analysis"];
const DISSEMINATION_CHANNELS = ["口头交流 Verbal", "纸质表格 Paper forms", "微信群 WeChat group", "数据库 Database", "报告 Report"];
const SUBSEQUENT_ACTIONS = ["触发巡护 Trigger patrol", "启动调查 Launch investigation", "启动修复 Initiate repair", "专家沟通 Expert communication", "暂不处理 No action yet"];

const SECTIONS = [
  { id: "location", num: "I",    zh: "时间与地点", en: "Time & Location",            icon: MapPin },
  { id: "ecoobject",num: "II",   zh: "生态对象",   en: "Ecological Object",          icon: Leaf },
  { id: "signal",   num: "III",  zh: "观察到的信号",en: "Observed Signal",            icon: Eye },
  { id: "subject",  num: "IV",   zh: "感知主体",   en: "Perceiving Subject",         icon: Telescope },
  { id: "method",   num: "V",    zh: "感知方式",   en: "Method of Perception",       icon: FlaskConical },
  { id: "interp",   num: "VI",   zh: "初步解释",   en: "Preliminary Interpretation", icon: Lightbulb },
  { id: "basis",    num: "VII",  zh: "判断依据",   en: "Basis for Judgment",         icon: Brain },
  { id: "alts",     num: "VIII", zh: "其他解释",   en: "Alternative Interpretations",icon: MessageSquare },
  { id: "verify",   num: "IX",   zh: "验证方式",   en: "Verification Method",        icon: CheckCircle },
  { id: "dissem",   num: "X",    zh: "信息去向",   en: "Information Dissemination",  icon: Radio },
  { id: "actions",  num: "XI",   zh: "后续行动",   en: "Subsequent Actions",         icon: Footprints },
  { id: "uncertain",num: "XII",  zh: "不确定性",   en: "Uncertainties",              icon: HelpCircle },
  { id: "reflect",  num: "XIII", zh: "你的反思",   en: "Your Reflection",            icon: AlertTriangle },
];

const SEED_ENTRIES: ObservationEntry[] = [
  {
    id: "OBS-2024-0312-001", createdAt: "2024-03-12T08:47:00",
    date: "2024-03-12", time: "07:15", tidal: "低潮 Low tide", weather: "晴，微风 Clear, light breeze",
    location: "红树林东区潮间带 East mangrove intertidal zone", coordinates: "22.4871°N, 114.0235°E",
    ecoObjectType: "物种 Species", species: "白鹭 Egretta garzetta (Little Egret)", habitat: "红树林边缘浅水区", ecologicalProcess: "",
    signalDescription: "发现约30只白鹭聚集于一处取食，数量显著高于往常基线（5–8只）。鸟群行为活跃，反复俯冲入水。",
    signalType: ["视觉 Visual"],
    subjectType: "工作人员 Staff", subjectName: "陈志远", subjectRole: "湿地保育员 Wetland ranger",
    perceptionMethods: ["经验观察 Experiential", "照片记录 Photography"],
    perceptionNotes: "使用10×42双筒望远镜远距观察，拍摄约40张照片记录行为。",
    interpretation: "该区域鱼类资源短期内显著集聚，可能与近日上游农业排水携带营养物质有关，形成局部富营养化。",
    judgmentBasis: ["过去经验 Past experience", "基线数据 Baseline data"],
    judgmentNotes: "过去4年同期记录白鹭数量均低于10只，本次异常。",
    hasAlternatives: "有 Yes",
    alternativeDetails: "当地渔民认为是涨潮前鱼类向浅水区洄游的季节性规律，非异常事件。需进一步对照历史数据。",
    verificationMethods: ["重复观察 Repeat observation", "数据对照 Data comparison"], verificationStatus: "进行中 In progress",
    disseminationChannels: ["微信群 WeChat group", "数据库 Database"],
    disseminationNotes: "已上报保护区管理处微信工作群，照片附件存入本地数据库。",
    actionsTaken: ["触发巡护 Trigger patrol", "启动调查 Launch investigation"],
    actionNotes: "安排次日上午水质采样，联系渔业研究所协助鱼类丰度评估。",
    uncertainties: "无法确定白鹭聚集是否与上游排水直接相关；缺乏该区域水质实时监测数据；渔民的季节性解释尚未量化验证。",
    knowledgeAdopted: "采用了保育员的监测基线数据和经验判断，将其作为异常判断的主要依据。",
    knowledgeOmitted: "渔民的地方性知识（渔汛规律）未被纳入官方记录，仅以「替代解释」附注形式留存，未进入数据库字段。",
  },
  {
    id: "OBS-2024-0308-003", createdAt: "2024-03-08T14:22:00",
    date: "2024-03-08", time: "13:40", tidal: "涨潮中 Mid-rising", weather: "多云，偶有薄雾",
    location: "核心区北侧木栈道 North boardwalk, core zone", coordinates: "22.4902°N, 114.0198°E",
    ecoObjectType: "生态过程 Process", species: "", habitat: "",
    ecologicalProcess: "红树林幼苗定植 Mangrove seedling establishment",
    signalDescription: "在木栈道北侧泥滩发现大量秋茄胚轴（约200根/m²），密度远高于往年春季记录。",
    signalType: ["视觉 Visual", "测量 Measured"],
    subjectType: "研究人员 Researcher", subjectName: "林美华", subjectRole: "植物生态学研究员",
    perceptionMethods: ["仪器测量 Instruments", "照片记录 Photography"],
    perceptionNotes: "使用50×50cm样方框计数，重复3次取平均值。",
    interpretation: "今年秋茄结实量高，加之近期潮汐条件有利于胚轴随水流定植，预测本年度红树林自然更新良好。",
    judgmentBasis: ["基线数据 Baseline data", "专业知识 Expertise", "比较对象 Comparison"],
    judgmentNotes: "与2019–2023年同期数据比较，本年胚轴密度为历史最高值。",
    hasAlternatives: "否 No", alternativeDetails: "",
    verificationMethods: ["重复观察 Repeat observation", "专家确认 Expert confirmation"], verificationStatus: "已完成 Completed",
    disseminationChannels: ["报告 Report", "数据库 Database"],
    disseminationNotes: "纳入季度生态评估报告，数据存入长期监测数据库。",
    actionsTaken: ["暂不处理 No action yet"],
    actionNotes: "建议设置临时围护防止游客踩踏，待确认定植率后决定是否扩大保护范围。",
    uncertainties: "实际定植成活率未知，胚轴密度高不等于最终种群增长。未测量底质盐度与含水率，这些因素对定植结果影响显著。",
    knowledgeAdopted: "以定量样方数据和文献比较作为主要依据，专业研究框架主导解释。",
    knowledgeOmitted: "未记录社区护林员对该区域历史变化的口述观察，其长期积累的非正式知识未进入本次记录。",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function emptyEntry(): Omit<ObservationEntry, "id" | "createdAt"> {
  return {
    date: new Date().toISOString().split("T")[0], time: new Date().toTimeString().slice(0, 5),
    tidal: "", weather: "", location: "", coordinates: "",
    ecoObjectType: "", species: "", habitat: "", ecologicalProcess: "",
    signalDescription: "", signalType: [],
    subjectType: "", subjectName: "", subjectRole: "",
    perceptionMethods: [], perceptionNotes: "",
    interpretation: "",
    judgmentBasis: [], judgmentNotes: "",
    hasAlternatives: "", alternativeDetails: "",
    verificationMethods: [], verificationStatus: "",
    disseminationChannels: [], disseminationNotes: "",
    actionsTaken: [], actionNotes: "",
    uncertainties: "", knowledgeAdopted: "", knowledgeOmitted: "",
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded p-6 max-w-sm w-full shadow-xl">
        <p className="text-sm text-foreground mb-5 leading-relaxed">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded border border-border text-sm text-muted-foreground hover:text-foreground transition-all">
            取消 Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-destructive text-destructive-foreground text-sm hover:opacity-90 transition-opacity">
            确认删除 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Form Primitives ───────────────────────────────────────────────────

function SectionHeader({ num, zh, en, icon: Icon }: { num: string; zh: string; en: string; icon: React.ElementType }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>{num}</span>
        <Icon size={15} className="text-primary shrink-0 mt-0.5" />
      </div>
      <div>
        <h3 className="text-lg leading-tight" style={{ fontFamily: "'Lora', serif" }}>{zh}</h3>
        <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{en}</p>
      </div>
    </div>
  );
}

function Field({ label, sublabel, children, required }: { label: string; sublabel?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="block" style={{ fontFamily: "'DM Mono', monospace" }}>
        <span className="text-[11px] tracking-wide text-foreground/80 uppercase">{label}{required && <span className="text-accent ml-1">*</span>}</span>
        {sublabel && <span className="block text-[11px] text-muted-foreground mt-0.5 normal-case tracking-normal">{sublabel}</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-input-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full bg-input-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all resize-y leading-relaxed" />
  );
}

function CheckGroup({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => onChange(active ? value.filter((v) => v !== opt) : [...value, opt])}
            className={`text-xs px-2.5 py-1.5 rounded border transition-all cursor-pointer ${active ? "bg-primary text-primary-foreground border-primary" : "bg-input-background border-border text-foreground hover:border-primary/50"}`}
            style={{ fontFamily: "'DM Mono', monospace" }}>{opt}</button>
        );
      })}
    </div>
  );
}

function RadioGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className={`text-xs px-2.5 py-1.5 rounded border transition-all cursor-pointer ${active ? "bg-primary text-primary-foreground border-primary" : "bg-input-background border-border text-foreground hover:border-primary/50"}`}
            style={{ fontFamily: "'DM Mono', monospace" }}>{opt}</button>
        );
      })}
    </div>
  );
}

function SectionDivider() { return <div className="border-t border-border my-8" />; }

// ─── Log Card ─────────────────────────────────────────────────────────────────

function LogCard({ entry, onSelect, onEdit, onDelete }: {
  entry: ObservationEntry;
  onSelect: (e: ObservationEntry) => void;
  onEdit: (e: ObservationEntry) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-card border border-border rounded hover:border-primary/40 hover:shadow-sm transition-all group">
      <button type="button" onClick={() => onSelect(entry)} className="w-full text-left p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-muted-foreground tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>{entry.id}</span>
              <span className="text-[10px] text-muted-foreground">·</span>
              <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{formatDate(entry.date)} {entry.time}</span>
            </div>
            <p className="text-sm font-medium text-foreground leading-snug mb-1" style={{ fontFamily: "'Lora', serif" }}>
              {entry.species || entry.ecologicalProcess || entry.habitat || "未知名词"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{entry.signalDescription}</p>
          </div>
          <ChevronRight size={14} className="text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded" style={{ fontFamily: "'DM Mono', monospace" }}>{(entry.location || "未定义方位").split(" ")[0]}</span>
          {entry.subjectName && <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{entry.subjectName} · {entry.subjectRole}</span>}
        </div>
      </button>
      <div className="border-t border-border/50 px-4 py-2 flex items-center gap-1">
        <button type="button" onClick={() => onEdit(entry)}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary px-2 py-1 rounded hover:bg-primary/5 transition-all"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          <Edit2 size={11} /> 编辑
        </button>
        <button type="button" onClick={() => onDelete(entry.id)}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-destructive px-2 py-1 rounded hover:bg-destructive/5 transition-all"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          <Trash2 size={11} /> 删除
        </button>
      </div>
    </div>
  );
}

// ─── Entry Detail Modal ───────────────────────────────────────────────────────

function EntryDetail({ entry, onClose, onEdit, onDelete }: {
  entry: ObservationEntry;
  onClose: () => void;
  onEdit: (e: ObservationEntry) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 终极无顶端空白 A4 打印方案
  function handleDownload() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rows = [
      { label: "时间与地点", en: "TIME & LOCATION", value: [entry.date, entry.time, entry.tidal, entry.weather, entry.location, entry.coordinates].filter(Boolean).join("  ·  ") },
      { label: "生态对象", en: "ECOLOGICAL OBJECT", value: entry.species || entry.ecologicalProcess || entry.habitat },
      { label: "观察到的信号", en: "OBSERVED SIGNAL", value: [(entry.signalType || []).join("、"), entry.signalDescription].filter(Boolean).join("\n") },
      { label: "感知主体", en: "PERCEIVING SUBJECT", value: [entry.subjectName, entry.subjectRole, entry.subjectType].filter(Boolean).join("  ·  ") },
      { label: "感知方式", en: "METHOD OF PERCEPTION", value: [(entry.perceptionMethods || []).join("、"), entry.perceptionNotes].filter(Boolean).join("\n") },
      { label: "初步解释", en: "PRELIMINARY INTERPRETATION", value: entry.interpretation },
      { label: "判断依据", en: "BASIS FOR JUDGMENT", value: [(entry.judgmentBasis || []).join("、"), entry.judgmentNotes].filter(Boolean).join("\n") },
      { label: "其他解释", en: "ALTERNATIVE INTERPRETATIONS", value: entry.hasAlternatives === "有 Yes" ? entry.alternativeDetails : (entry.hasAlternatives || "") },
      { label: "验证方式", en: "VERIFICATION METHOD", value: [(entry.verificationMethods || []).join("、"), entry.verificationStatus].filter(Boolean).join("  ·  ") },
      { label: "信息去向", en: "INFORMATION DISSEMINATION", value: [(entry.disseminationChannels || []).join("、"), entry.disseminationNotes].filter(Boolean).join("\n") },
      { label: "后续行动", en: "SUBSEQUENT ACTIONS", value: [(entry.actionsTaken || []).join("、"), entry.actionNotes].filter(Boolean).join("\n") },
      { label: "不确定性", en: "UNCERTAINTIES", value: entry.uncertainties },
      { label: "知识采纳", en: "KNOWLEDGE ADOPTED", value: entry.knowledgeAdopted },
      { label: "未被呈现", en: "KNOWLEDGE OMITTED", value: entry.knowledgeOmitted },
    ];

    const rowsHtml = rows
      .filter(r => r.value)
      .map(r => `
        <div class="row-item">
          <div class="row-label">${r.en} · ${r.label}</div>
          <div class="row-content">${r.value}</div>
        </div>
      `).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${entry.species || entry.ecologicalProcess || "生态观察记录"}_PDF</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              padding: 0;
              margin: 0;
              color: #1a1a1a;
              background: #ffffff;
            }
            .header {
              padding-bottom: 12px;
              margin-bottom: 16px;
              border-bottom: 2px solid #111111;
            }
            .header-tag {
              font-size: 10px;
              letter-spacing: 1.5px;
              color: #666666;
              font-family: monospace;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .header-title {
              font-size: 20px;
              font-weight: bold;
              color: #111111;
              margin-bottom: 4px;
            }
            .header-meta {
              font-size: 11px;
              color: #777777;
              font-family: monospace;
            }
            .row-item {
              padding: 10px 0;
              border-bottom: 1px solid #e5e5e5;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .row-label {
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 1px;
              color: #777777;
              font-family: monospace;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .row-content {
              font-size: 13px;
              color: #222222;
              line-height: 1.6;
              white-space: pre-line;
            }
            @page {
              size: A4 portrait;
              margin: 15mm 15mm 15mm 15mm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-tag">生态观察记录 · ECOLOGICAL OBSERVATION LOG</div>
            <div class="header-title">${entry.species || entry.ecologicalProcess || entry.habitat || "Observation Record"}</div>
            <div class="header-meta">${entry.id} · ${formatDate(entry.date)} ${entry.time}</div>
          </div>
          ${rowsHtml}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 200);
  }

  const rows: { label: string; en: string; value: string }[] = [
    { label: "时间与地点", en: "Time & Location", value: [entry.date, entry.time, entry.tidal, entry.weather, entry.location, entry.coordinates].filter(Boolean).join("  ·  ") },
    { label: "生态对象", en: "Ecological Object", value: entry.species || entry.ecologicalProcess || entry.habitat },
    { label: "观察到的信号", en: "Observed Signal", value: [(entry.signalType || []).join("、"), entry.signalDescription].filter(Boolean).join("\n") },
    { label: "感知主体", en: "Perceiving Subject", value: [entry.subjectName, entry.subjectRole, entry.subjectType].filter(Boolean).join("  ·  ") },
    { label: "感知方式", en: "Method of Perception", value: [(entry.perceptionMethods || []).join("、"), entry.perceptionNotes].filter(Boolean).join("\n") },
    { label: "初步解释", en: "Preliminary Interpretation", value: entry.interpretation },
    { label: "判断依据", en: "Basis for Judgment", value: [(entry.judgmentBasis || []).join("、"), entry.judgmentNotes].filter(Boolean).join("\n") },
    { label: "其他解释", en: "Alternative Interpretations", value: entry.hasAlternatives === "有 Yes" ? entry.alternativeDetails : (entry.hasAlternatives || "") },
    { label: "验证方式", en: "Verification Method", value: [(entry.verificationMethods || []).join("、"), entry.verificationStatus].filter(Boolean).join("  ·  ") },
    { label: "信息去向", en: "Information Dissemination", value: [(entry.disseminationChannels || []).join("、"), entry.disseminationNotes].filter(Boolean).join("\n") },
    { label: "后续行动", en: "Subsequent Actions", value: [(entry.actionsTaken || []).join("、"), entry.actionNotes].filter(Boolean).join("\n") },
    { label: "不确定性", en: "Uncertainties", value: entry.uncertainties },
    { label: "知识采纳", en: "Knowledge Adopted", value: entry.knowledgeAdopted },
    { label: "未被呈现", en: "Knowledge Omitted", value: entry.knowledgeOmitted },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
          <div className="shrink-0 bg-card border-b border-border px-5 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>{entry.id}</p>
              <h2 className="text-base truncate" style={{ fontFamily: "'Lora', serif" }}>{entry.species || entry.ecologicalProcess || "Observation Record"}</h2>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => { onClose(); onEdit(entry); }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-border hover:border-primary/40 px-2.5 py-1.5 rounded transition-all"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                <Edit2 size={11} /> 编辑
              </button>
              <button onClick={handleDownload}
                className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded transition-all font-medium"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                <Download size={11} /> 导出 PDF
              </button>
              <button onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 px-2.5 py-1.5 rounded transition-all"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                <Trash2 size={11} /> 删除
              </button>
              <button onClick={onClose} className="ml-1 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-secondary">
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-6">
            <div className="bg-white p-6 rounded border border-gray-100 shadow-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <div className="mb-5 pb-4 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-sm bg-primary flex items-center justify-center">
                    <Leaf size={10} className="text-primary-foreground" />
                  </div>
                  <span className="text-[10px] text-muted-foreground tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>生态观察记录 · ECOLOGICAL OBSERVATION LOG</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Lora', serif" }}>{entry.species || entry.ecologicalProcess || entry.habitat || "Observation"}</h1>
                <p className="text-[11px] text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{entry.id} · {formatDate(entry.date)} {entry.time}</p>
              </div>

              {rows.map((row, i) =>
                row.value ? (
                  <div key={i} className={`py-3 ${i < rows.length - 1 ? "border-b border-border/40" : ""}`}>
                    <div className="flex gap-2 items-baseline mb-1">
                      <span className="text-[10px] tracking-wide text-muted-foreground uppercase shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>{row.en}</span>
                      <span className="text-[10px] text-muted-foreground/50">·</span>
                      <span className="text-[11px] text-muted-foreground">{row.label}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{row.value}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          message={`确定要删除记录「${entry.id}」吗？此操作不可撤销。`}
          onConfirm={() => { onDelete(entry.id); onClose(); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}

// ─── Observation Form ─────────────────────────────────────────────────────────

function ObservationForm({ initial, editingId, onSave, onCancel }: {
  initial: Omit<ObservationEntry, "id" | "createdAt">;
  editingId: string | null;
  onSave: (data: Omit<ObservationEntry, "id" | "createdAt">) => void;
  onCancel: () => void;
}) {
  const [form, setFormState] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState("location");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setFormState((prev) => ({ ...prev, [key]: val }));

  function scrollToSection(id: string) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { onSave(form); setSubmitted(false); }, 600);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex gap-8">
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-20">
            {editingId && (
              <div className="mb-4 px-2.5 py-2 bg-accent/10 border border-accent/20 rounded text-[10px] text-accent" style={{ fontFamily: "'DM Mono', monospace" }}>
                编辑模式 · {editingId}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>Sections</p>
            <nav className="space-y-0.5">
              {SECTIONS.map((s) => {
                const active = activeSection === s.id;
                return (
                  <button key={s.id} type="button" onClick={() => scrollToSection(s.id)}
                    className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded text-xs transition-all ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                    style={{ fontFamily: "'DM Mono', monospace" }}>
                    <span className="text-[9px] opacity-60 w-6 shrink-0">{s.num}</span>
                    <span className="truncate">{s.zh}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl mb-1" style={{ fontFamily: "'Lora', serif" }}>
                {editingId ? "编辑观察记录" : "新建观察记录"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {editingId ? `正在修改 ${editingId}` : "Complete all fields as thoroughly as possible."}
              </p>
            </div>
            {editingId && (
              <button type="button" onClick={onCancel}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded px-3 py-1.5 hover:border-foreground/30 transition-all"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                <ArrowLeft size={13} /> 取消
              </button>
            )}
          </div>

          <div id="location" ref={(el) => { sectionRefs.current["location"] = el; }} className="scroll-mt-20">
            <SectionHeader num="I" zh="时间与地点" en="Time & Location" icon={MapPin} />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="日期 Date" required>
                <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
                  className="w-full bg-input-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </Field>
              <Field label="时间 Time">
                <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)}
                  className="w-full bg-input-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="潮汐 Tidal" sublabel="e.g. 低潮, 涨潮中, 高潮"><TextInput value={form.tidal} onChange={(v) => set("tidal", v)} placeholder="低潮 Low tide" /></Field>
              <Field label="天气 Weather"><TextInput value={form.weather} onChange={(v) => set("weather", v)} placeholder="晴，东南风2级" /></Field>
            </div>
            <div className="space-y-4">
              <Field label="具体区域 Location" required sublabel="Descriptive name of the site"><TextInput value={form.location} onChange={(v) => set("location", v)} placeholder="红树林东区潮间带" /></Field>
              <Field label="坐标 Coordinates" sublabel="GPS if available"><TextInput value={form.coordinates} onChange={(v) => set("coordinates", v)} placeholder="22.4871°N, 114.0235°E" /></Field>
            </div>
          </div>
          <SectionDivider />

          <div id="ecoobject" ref={(el) => { sectionRefs.current["ecoobject"] = el; }} className="scroll-mt-20">
            <SectionHeader num="II" zh="生态对象" en="Ecological Object" icon={Leaf} />
            <div className="mb-4"><Field label="对象类型 Object Type" required><RadioGroup options={["物种 Species", "生境 Habitat", "生态过程 Process"]} value={form.ecoObjectType} onChange={(v) => set("ecoObjectType", v)} /></Field></div>
            <div className="space-y-4">
              <Field label="物种 Species" sublabel="Scientific and common name"><TextInput value={form.species} onChange={(v) => set("species", v)} placeholder="Egretta garzetta / 白鹭" /></Field>
              <Field label="生境 Habitat"><TextInput value={form.habitat} onChange={(v) => set("habitat", v)} placeholder="红树林边缘浅水区" /></Field>
              <Field label="生态过程 Process"><TextInput value={form.ecologicalProcess} onChange={(v) => set("ecologicalProcess", v)} placeholder="潮汐浮力传播 / Tidal seed dispersal" /></Field>
            </div>
          </div>
          <SectionDivider />

          <div id="signal" ref={(el) => { sectionRefs.current["signal"] = el; }} className="scroll-mt-20">
            <SectionHeader num="III" zh="观察到的信号" en="Observed Signal" icon={Eye} />
            <div className="space-y-4">
              <Field label="信号类型 Signal Type"><CheckGroup options={SIGNAL_TYPES} value={form.signalType} onChange={(v) => set("signalType", v)} /></Field>
              <Field label="信号描述 Description" required sublabel="Describe what was seen, heard, or measured — be concrete">
                <TextArea value={form.signalDescription} onChange={(v) => set("signalDescription", v)} placeholder="约30只白鹭聚集取食，数量显著高于往常基线…" rows={4} />
              </Field>
            </div>
          </div>
          <SectionDivider />

          <div id="subject" ref={(el) => { sectionRefs.current["subject"] = el; }} className="scroll-mt-20">
            <SectionHeader num="IV" zh="感知主体" en="Perceiving Subject" icon={Telescope} />
            <div className="mb-4"><Field label="主体类型 Subject Type" required><RadioGroup options={SUBJECT_TYPES} value={form.subjectType} onChange={(v) => set("subjectType", v)} /></Field></div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="姓名/编号 Name / ID"><TextInput value={form.subjectName} onChange={(v) => set("subjectName", v)} placeholder="陈志远" /></Field>
              <Field label="角色/职位 Role"><TextInput value={form.subjectRole} onChange={(v) => set("subjectRole", v)} placeholder="湿地保育员 Wetland ranger" /></Field>
            </div>
          </div>
          <SectionDivider />

          <div id="method" ref={(el) => { sectionRefs.current["method"] = el; }} className="scroll-mt-20">
            <SectionHeader num="V" zh="感知方式" en="Method of Perception" icon={FlaskConical} />
            <div className="space-y-4">
              <Field label="感知方式 Methods Used"><CheckGroup options={PERCEPTION_METHODS} value={form.perceptionMethods} onChange={(v) => set("perceptionMethods", v)} /></Field>
              <Field label="补充说明 Notes" sublabel="Equipment, conditions, limitations">
                <TextArea value={form.perceptionNotes} onChange={(v) => set("perceptionNotes", v)} placeholder="使用10×42双筒望远镜，光线良好，距离约80m…" />
              </Field>
            </div>
          </div>
          <SectionDivider />

          <div id="interp" ref={(el) => { sectionRefs.current["interp"] = el; }} className="scroll-mt-20">
            <SectionHeader num="VI" zh="初步解释" en="Preliminary Interpretation" icon={Lightbulb} />
            <Field label="当事人解释 Interpretation" sublabel="What do you think this signal means?">
              <TextArea value={form.interpretation} onChange={(v) => set("interpretation", v)} placeholder="认为此次聚集可能与上游排水引发局部富营养化有关…" rows={4} />
            </Field>
          </div>
          <SectionDivider />

          <div id="basis" ref={(el) => { sectionRefs.current["basis"] = el; }} className="scroll-mt-20">
            <SectionHeader num="VII" zh="判断依据" en="Basis for Judgment" icon={Brain} />
            <div className="space-y-4">
              <Field label="依据类型 Basis Type"><CheckGroup options={JUDGMENT_BASIS} value={form.judgmentBasis} onChange={(v) => set("judgmentBasis", v)} /></Field>
              <Field label="具体说明 Details" sublabel="Which data, experience, or comparison?">
                <TextArea value={form.judgmentNotes} onChange={(v) => set("judgmentNotes", v)} placeholder="过去4年同期记录白鹭均低于10只，本次显著偏高…" />
              </Field>
            </div>
          </div>
          <SectionDivider />

          <div id="alts" ref={(el) => { sectionRefs.current["alts"] = el; }} className="scroll-mt-20">
            <SectionHeader num="VIII" zh="其他解释" en="Alternative Interpretations" icon={MessageSquare} />
            <div className="space-y-4">
              <Field label="是否存在其他解释 Alternatives exist?" required>
                <RadioGroup options={["有 Yes", "否 No", "不确定 Uncertain"]} value={form.hasAlternatives} onChange={(v) => set("hasAlternatives", v)} />
              </Field>
              {(form.hasAlternatives === "有 Yes" || form.hasAlternatives === "不确定 Uncertain") && (
                <Field label="其他解释内容 Details" sublabel="Who holds these views, based on what?">
                  <TextArea value={form.alternativeDetails} onChange={(v) => set("alternativeDetails", v)} placeholder="当地渔民认为这是鱼类洄游的季节性规律…" rows={3} />
                </Field>
              )}
            </div>
          </div>
          <SectionDivider />

          <div id="verify" ref={(el) => { sectionRefs.current["verify"] = el; }} className="scroll-mt-20">
            <SectionHeader num="IX" zh="验证方式" en="Verification Method" icon={CheckCircle} />
            <div className="space-y-4">
              <Field label="验证方法 Methods"><CheckGroup options={VERIFICATION_METHODS} value={form.verificationMethods} onChange={(v) => set("verificationMethods", v)} /></Field>
              <Field label="验证状态 Status">
                <RadioGroup options={["已完成 Completed", "进行中 In progress", "待启动 Pending", "无法验证 Not verifiable"]} value={form.verificationStatus} onChange={(v) => set("verificationStatus", v)} />
              </Field>
            </div>
          </div>
          <SectionDivider />

          <div id="dissem" ref={(el) => { sectionRefs.current["dissem"] = el; }} className="scroll-mt-20">
            <SectionHeader num="X" zh="信息去向" en="Information Dissemination" icon={Radio} />
            <div className="space-y-4">
              <Field label="传播渠道 Channels"><CheckGroup options={DISSEMINATION_CHANNELS} value={form.disseminationChannels} onChange={(v) => set("disseminationChannels", v)} /></Field>
              <Field label="补充说明 Notes">
                <TextArea value={form.disseminationNotes} onChange={(v) => set("disseminationNotes", v)} placeholder="已在保护区管理处微信工作群发送通知…" />
              </Field>
            </div>
          </div>
          <SectionDivider />

          <div id="actions" ref={(el) => { sectionRefs.current["actions"] = el; }} className="scroll-mt-20">
            <SectionHeader num="XI" zh="后续行动" en="Subsequent Actions" icon={Footprints} />
            <div className="space-y-4">
              <Field label="行动类型 Actions Taken"><CheckGroup options={SUBSEQUENT_ACTIONS} value={form.actionsTaken} onChange={(v) => set("actionsTaken", v)} /></Field>
              <Field label="行动描述 Details">
                <TextArea value={form.actionNotes} onChange={(v) => set("actionNotes", v)} placeholder="安排次日08:00水质采样，联系渔业研究所…" />
              </Field>
            </div>
          </div>
          <SectionDivider />

          <div id="uncertain" ref={(el) => { sectionRefs.current["uncertain"] = el; }} className="scroll-mt-20">
            <SectionHeader num="XII" zh="不确定性" en="Uncertainties" icon={HelpCircle} />
            <Field label="仍然无法确定的地方 What remains unclear" sublabel="Be honest about the limits of this observation">
              <TextArea value={form.uncertainties} onChange={(v) => set("uncertainties", v)} placeholder="无法确定聚集行为是否与上游排水直接相关…" rows={4} />
            </Field>
          </div>
          <SectionDivider />

          <div id="reflect" ref={(el) => { sectionRefs.current["reflect"] = el; }} className="scroll-mt-20">
            <SectionHeader num="XIII" zh="你的反思" en="Your Reflection" icon={AlertTriangle} />
            <div className="bg-amber-50/60 border border-amber-200/60 rounded p-4 mb-5">
              <p className="text-xs text-amber-800/80 leading-relaxed" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>
                "Who counted, who was listened to, and what knowledge was left out of the record? Whose way of seeing shaped this observation?"
              </p>
            </div>
            <div className="space-y-4">
              <Field label="谁的知识被采纳 Whose knowledge was adopted" sublabel="Which voices or data shaped the interpretation?">
                <TextArea value={form.knowledgeAdopted} onChange={(v) => set("knowledgeAdopted", v)} placeholder="采用了保育员的监测基线数据和经验判断…" rows={3} />
              </Field>
              <Field label="谁或什么没有被呈现 What was not presented" sublabel="Which perspectives or ways of knowing are absent?">
                <TextArea value={form.knowledgeOmitted} onChange={(v) => set("knowledgeOmitted", v)} placeholder="渔民的地方性知识未被纳入官方记录字段…" rows={3} />
              </Field>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground"><span className="text-accent">*</span> Required fields</p>
            <div className="flex items-center gap-2">
              {editingId && (
                <button type="button" onClick={onCancel}
                  className="flex items-center gap-2 px-4 py-2.5 rounded text-sm border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                  取消
                </button>
              )}
              <button type="submit" disabled={submitted}
                className={`flex items-center gap-2 px-6 py-2.5 rounded text-sm font-medium transition-all ${submitted ? "bg-primary/50 text-primary-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95"}`}>
                {submitted ? (
                  <><CheckCircle size={13} /> {editingId ? "已保存" : "已提交"}</>
                ) : (
                  <><Send size={13} /> {editingId ? "保存修改 Save" : "提交记录 Submit"}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<"form" | "log">("log");

  const [entries, setEntries] = useState<ObservationEntry[]>(() => {
    const saved = localStorage.getItem("eco_observation_logs");
    return saved ? JSON.parse(saved) : SEED_ENTRIES;
  });

  const [selectedEntry, setSelectedEntry] = useState<ObservationEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<ObservationEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("eco_observation_logs", JSON.stringify(entries));
  }, [entries]);

  function handleEdit(entry: ObservationEntry) {
    setEditingEntry(entry);
    setSelectedEntry(null);
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setSelectedEntry(null);
    setDeleteConfirmId(null);
  }

  function handleSave(data: Omit<ObservationEntry, "id" | "createdAt">) {
    if (editingEntry) {
      setEntries((prev) => prev.map((e) => e.id === editingEntry.id ? { ...editingEntry, ...data } : e));
      setEditingEntry(null);
    } else {
      const id = `OBS-${new Date().toISOString().replace(/[-T:]/g, "").slice(0, 12)}-${String(entries.length + 1).padStart(3, "0")}`;
      setEntries((prev) => [{ ...data, id, createdAt: new Date().toISOString() }, ...prev]);
    }
    setView("log");
  }

  function handleCancelEdit() {
    setEditingEntry(null);
    setView("log");
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center shrink-0">
              <Leaf size={13} className="text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-medium leading-none" style={{ fontFamily: "'Lora', serif" }}>生态观察记录系统</span>
              <span className="hidden sm:block text-[10px] text-muted-foreground tracking-widest mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>ECOLOGICAL OBSERVATION LOG</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-secondary rounded p-0.5">
            <button onClick={() => { setEditingEntry(null); setView("form"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${view === "form" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              style={{ fontFamily: "'DM Mono', monospace" }}>
              <Plus size={11} /> 新建记录
            </button>
            <button onClick={() => setView("log")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${view === "log" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              style={{ fontFamily: "'DM Mono', monospace" }}>
              <BookOpen size={11} /> 历史记录
              <span className="bg-primary/10 text-primary rounded px-1 text-[10px]">{entries.length}</span>
            </button>
          </div>
        </div>
      </header>

      {view === "log" && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-2xl mb-1" style={{ fontFamily: "'Lora', serif" }}>观察记录存档</h1>
              <p className="text-sm text-muted-foreground">{entries.length} 条记录 · 按日期降序</p>
            </div>
            <button onClick={() => { setEditingEntry(null); setView("form"); }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:opacity-90 transition-opacity">
              <Plus size={13} /> 新建记录
            </button>
          </div>
          {entries.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Leaf size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">暂无记录，点击「新建记录」开始。</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {entries.map((e) => (
                <LogCard key={e.id} entry={e} onSelect={setSelectedEntry} onEdit={handleEdit} onDelete={setDeleteConfirmId} />
              ))}
            </div>
          )}
        </div>
      )}

      {view === "form" && (
        <ObservationForm
          initial={editingEntry ? { ...editingEntry } : emptyEntry()}
          editingId={editingEntry?.id ?? null}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      )}

      {selectedEntry && (
        <EntryDetail
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {deleteConfirmId && (
        <ConfirmDialog
          message={`确定要删除记录「${deleteConfirmId}」吗？此操作不可撤销。`}
          onConfirm={() => handleDelete(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}