import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "motion/react";
import { 
  QrCode, 
  Trash2, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Copy, 
  Check, 
  History, 
  Sliders, 
  Link as LinkIcon, 
  AlertCircle 
} from "lucide-react";

interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  color: string;
}

interface ThemeConfig {
  id: string;
  name: string;
  icon: string;
  pageBg: string;
  cardBg: string;
  borderColor: string;
  textTitle: string;
  textSubtitle: string;
  textLabel: string;
  inputClass: string;
  buttonPrimaryClass: string;
  buttonSecondaryClass: string;
  defaultQrColor: string;
  palette: { name: string; hex: string }[];
}

const THEMES: ThemeConfig[] = [
  {
    id: "minimalist",
    name: "Tối giản Slate",
    icon: "▫️",
    pageBg: "bg-zinc-50 selection:bg-zinc-200",
    cardBg: "bg-white border-zinc-200 shadow-sm rounded-2xl",
    borderColor: "border-zinc-100",
    textTitle: "text-zinc-900",
    textSubtitle: "text-zinc-400",
    textLabel: "text-zinc-500",
    inputClass: "text-zinc-800 border-zinc-200 focus:ring-zinc-400 focus:border-zinc-400 bg-zinc-50/50 placeholder-zinc-400",
    buttonPrimaryClass: "bg-zinc-900 hover:bg-zinc-800 text-white font-semibold shadow-sm shadow-zinc-400/10 cursor-pointer",
    buttonSecondaryClass: "border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-700 cursor-pointer",
    defaultQrColor: "#18181b",
    palette: [
      { name: "Kẽm tối", hex: "#18181b" },
      { name: "Đỏ hồng", hex: "#be123c" },
      { name: "Xanh lục", hex: "#047857" },
      { name: "Xanh dương", hex: "#0369a1" },
      { name: "Cam sậm", hex: "#c2410c" }
    ]
  },
  {
    id: "cosmic",
    name: "Cosmic Dark",
    icon: "🌌",
    pageBg: "bg-zinc-950 selection:bg-indigo-900/60",
    cardBg: "bg-zinc-900/95 border-zinc-805 shadow-xl shadow-black/60 rounded-2xl backdrop-blur-md",
    borderColor: "border-zinc-800/80",
    textTitle: "text-zinc-100 font-medium tracking-tight",
    textSubtitle: "text-zinc-500",
    textLabel: "text-zinc-400",
    inputClass: "text-zinc-200 border-zinc-850 focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-950/50 placeholder-zinc-600",
    buttonPrimaryClass: "bg-indigo-600 hover:bg-indigo-500 text-indigo-50 font-semibold shadow-sm shadow-indigo-500/20 cursor-pointer",
    buttonSecondaryClass: "border-zinc-800 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 cursor-pointer",
    defaultQrColor: "#4f46e5",
    palette: [
      { name: "Tím Cosmic", hex: "#4f46e5" },
      { name: "Lục Neon", hex: "#059669" },
      { name: "Hồng Neon", hex: "#db2777" },
      { name: "Đỏ lửa", hex: "#dc2626" },
      { name: "Cam Neon", hex: "#ea580c" }
    ]
  },
  {
    id: "warm",
    name: "Ấm sữa trà",
    icon: "☕",
    pageBg: "bg-[#fbf7f1] selection:bg-[#e0d5c1]",
    cardBg: "bg-[#fffdfb] border-[#eae2d6] shadow-sm rounded-2xl",
    borderColor: "border-[#f5eee3]",
    textTitle: "text-[#473a32] font-serif font-bold",
    textSubtitle: "text-[#8e7c6d]",
    textLabel: "text-[#8e7c6d]",
    inputClass: "text-[#473a32] border-[#e2d7c3] focus:ring-[#9e896c] focus:border-[#9e896c] bg-[#FAF7F3] placeholder-amber-900/30",
    buttonPrimaryClass: "bg-[#75634d] hover:bg-[#60503d] text-[#fffdfa] font-semibold shadow-sm shadow-[#a1927d]/10 cursor-pointer",
    buttonSecondaryClass: "border-[#e2d7c3] hover:bg-[#FAF7F3] text-[#8e7c6d] hover:text-[#473a32] cursor-pointer",
    defaultQrColor: "#75634d",
    palette: [
      { name: "Trà đậm", hex: "#75634d" },
      { name: "Nâu cà phê", hex: "#4a3c31" },
      { name: "Cam đất gốm", hex: "#c2410c" },
      { name: "Đỏ tương tế", hex: "#991b1b" },
      { name: "Rêu rậm", hex: "#166534" }
    ]
  },
  {
    id: "retro",
    name: "Retro Mono",
    icon: "💾",
    pageBg: "bg-[#ebeae4] selection:bg-[#c3c2bc]",
    cardBg: "bg-[#f5f4ef] border-2 border-[#1c1c1b] shadow-[4px_4px_0px_0px_rgba(28,28,27,1)] rounded-none",
    borderColor: "border-b border-[#1c1c1b]",
    textTitle: "text-[#1c1c1b] font-mono uppercase tracking-widest font-bold",
    textSubtitle: "text-zinc-500 font-mono",
    textLabel: "text-zinc-700 font-mono font-semibold",
    inputClass: "text-[#1c1c1b] font-mono border-2 border-[#1c1c1b] focus:bg-white focus:outline-none placeholder-zinc-400 bg-white",
    buttonPrimaryClass: "bg-[#1c1c1b] hover:bg-[#313130] text-[#f5f4ef] font-mono font-bold border border-[#1c1c1b] active:translate-y-0.5 active:translate-x-0.5 shadow-[2px_2px_0px_0px_rgba(28,28,27,1)] active:shadow-none cursor-pointer",
    buttonSecondaryClass: "border-2 border-[#1c1c1b] bg-white hover:bg-[#ebeae2] text-[#1c1c1b] font-mono font-semibold active:translate-y-0.5 cursor-pointer",
    defaultQrColor: "#1c1c1b",
    palette: [
      { name: "Mực đen", hex: "#1c1c1b" },
      { name: "Đỏ retro", hex: "#b91c1c" },
      { name: "Xanh dương", hex: "#1d4ed8" },
      { name: "Xanh lá đậm", hex: "#15803d" },
      { name: "Xám khối", hex: "#3f3f46" }
    ]
  }
];

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [activeQRText, setActiveQRText] = useState("");
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    try {
      const saved = localStorage.getItem("luqrcode_theme_id");
      return saved && THEMES.some(t => t.id === saved) ? saved : "minimalist";
    } catch {
      return "minimalist";
    }
  });
  const [selectedColor, setSelectedColor] = useState("#18181b");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("H");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentTheme = THEMES.find((t) => t.id === currentThemeId) || THEMES[0];

  // Set corrected initial selected item color based on theme
  useEffect(() => {
    const savedColor = localStorage.getItem("luqrcode_last_color");
    if (savedColor) {
      setSelectedColor(savedColor);
    } else {
      setSelectedColor(currentTheme.defaultQrColor);
    }
  }, [currentThemeId]);

  // Load history from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("luqrcode_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Lỗi khi tải lịch sử mã QR:", e);
    }
  }, []);

  // Save history to local storage
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("luqrcode_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Lỗi khi lưu lịch sử mã QR:", e);
    }
  };

  // Trigger temporary custom toasts
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Render QR Code inside Canvas when values change
  useEffect(() => {
    if (activeQRText && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        activeQRText,
        {
          width: 160,
          margin: 1,
          color: {
            dark: selectedColor,
            light: "#ffffff",
          },
          errorCorrectionLevel: errorCorrection,
        },
        (error) => {
          if (error) {
            console.error("QR Code Error:", error);
            showToast("Lỗi khi tạo mã QR.", "error");
          }
        }
      );
    }
  }, [activeQRText, selectedColor, errorCorrection]);

  const handleThemeChange = (themeId: string) => {
    setCurrentThemeId(themeId);
    try {
      localStorage.setItem("luqrcode_theme_id", themeId);
    } catch (e) {
      console.error(e);
    }
    const theme = THEMES.find(t => t.id === themeId);
    if (theme) {
      setSelectedColor(theme.defaultQrColor);
      localStorage.setItem("luqrcode_last_color", theme.defaultQrColor);
      showToast(`Đã chuyển sang: ${theme.name}`, "success");
    }
  };

  const handleGenerate = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      showToast("Vui lòng nhập đường dẫn URL hoặc văn bản.", "error");
      return;
    }

    // Auto-prepend https:// if it looks like a clean web domain (e.g. google.com)
    let finalValue = trimmed;
    if (
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/i.test(trimmed) &&
      !/^https?:\/\//i.test(trimmed)
    ) {
      finalValue = `https://${trimmed}`;
      setInputValue(finalValue);
      showToast("Tự động thêm tiền tố 'https://'", "info");
    }

    setActiveQRText(finalValue);

    // Save to history (avoid duplicates inside top 5)
    const filtered = history.filter((item) => item.text !== finalValue);
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text: finalValue,
      timestamp: Date.now(),
      color: selectedColor,
    };
    saveHistory([newItem, ...filtered].slice(0, 5));
    showToast("Đã tạo mã QR thành công!", "success");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  const handleReset = () => {
    setInputValue("");
    setActiveQRText("");
    showToast("Đã xóa dữ liệu đầu vào", "info");
  };

  const downloadQR = () => {
    if (!canvasRef.current || !activeQRText) {
      showToast("Không tìm thấy mã QR để tải về.", "error");
      return;
    }
    try {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      
      // Clean filename based on URL host name or title
      let friendlyName = "luqrcode";
      try {
        if (activeQRText.startsWith("http")) {
          const parsedUrl = new URL(activeQRText);
          friendlyName = `luqr_${parsedUrl.hostname.replace("www.", "")}`;
        } else {
          friendlyName = `luqr_${activeQRText.slice(0, 15).replace(/[^a-zA-Z0-9]/g, "_")}`;
        }
      } catch {
        // fallback
      }
      
      link.download = `${friendlyName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Đã lưu ảnh mã QR thành công!", "success");
    } catch (e) {
      showToast("Lỗi khi tải ảnh. Vui lòng thử lại.", "error");
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInputValue(item.text);
    setActiveQRText(item.text);
    setSelectedColor(item.color);
    showToast("Đã tải dòng lịch sử này lên", "success");
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering loadFromHistory
    const filtered = history.filter((item) => item.id !== id);
    saveHistory(filtered);
    showToast("Đã xóa lịch sử", "info");
  };

  const copyToClipboard = async (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast("Đã sao chép liên kết vào bộ nhớ tạm", "success");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast("Không thể sao chép liên kết.", "error");
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.pageBg} flex flex-col items-center justify-center p-4 transition-colors duration-300`}>
      
      {/* Toast Alert System overlay */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[340px] px-4 pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border shadow-sm text-xs font-medium w-full pointer-events-auto bg-white ${
                toast.type === "error"
                  ? "border-red-100 text-red-600 shadow-red-50"
                  : toast.type === "success"
                  ? "border-emerald-100 text-emerald-700 shadow-emerald-50"
                  : "border-zinc-100 text-zinc-650 shadow-zinc-50"
              }`}
            >
              {toast.type === "error" ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              )}
              <span className="truncate">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Single Card Container */}
      <div id="main_card" className={`w-full max-w-[340px] ${currentTheme.cardBg} border p-4 space-y-4 transition-all duration-300`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${currentTheme.borderColor}`}>
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded-md transition-colors ${
              currentThemeId === 'retro' 
                ? 'bg-[#1c1c1b] text-[#f5f4ef]' 
                : currentThemeId === 'cosmic'
                ? 'bg-indigo-650 text-white'
                : currentThemeId === 'warm'
                ? 'bg-[#75634d] text-[#fffdfa]'
                : 'bg-zinc-950 text-white'
            }`}>
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h1 className={`text-xs font-semibold tracking-tight leading-none ${currentTheme.textTitle}`}>LuQRcode</h1>
              <p className={`text-[9px] mt-0.5 font-medium ${currentTheme.textSubtitle}`}>Trình tạo mã QR tối giản</p>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded leading-none transition-colors ${
            currentThemeId === 'cosmic' ? 'bg-zinc-800 text-zinc-350' : currentThemeId === 'warm' ? 'bg-[#f5eee3] text-[#8e7c6d]' : 'bg-zinc-100 text-zinc-500'
          }`}>v1.2</span>
        </div>

        {/* Input area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="url-input" className={`block text-[11px] font-medium transition-colors ${currentTheme.textLabel}`}>
              Nhập link URL hoặc nội dung văn bản
            </label>
            {inputValue && (
              <button 
                type="button"
                onClick={() => setInputValue("")}
                className={`text-[10px] font-medium transition-colors ${
                  currentThemeId === 'cosmic' ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-650'
                }`}
              >
                Nhập lại
              </button>
            )}
          </div>
          <div className="relative">
            <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${
              currentThemeId === 'cosmic' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              <LinkIcon className="w-3.5 h-3.5" />
            </span>
            <input 
              type="text" 
              id="url-input" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com" 
              className={`w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg transition ${currentTheme.inputClass}`}
            />
          </div>
        </div>

        {/* Toolbar switches */}
        <div className="flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => {
              setShowSettings(!showSettings);
              if (showHistory) setShowHistory(false);
            }}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-all cursor-pointer ${
              showSettings 
                ? currentThemeId === 'cosmic'
                  ? "bg-zinc-800 text-zinc-100 font-medium"
                  : currentThemeId === 'warm'
                  ? "bg-[#faf6f0] text-[#473a32] font-semibold"
                  : "bg-zinc-100 text-zinc-900 font-medium" 
                : currentThemeId === 'cosmic'
                ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                : currentThemeId === 'warm'
                ? "text-[#8e7c6d] hover:text-[#473a32] hover:bg-[#FAF7F3]"
                : "text-zinc-550 hover:text-zinc-800 hover:bg-zinc-50"
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Tùy chỉnh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowHistory(!showHistory);
              if (showSettings) setShowSettings(false);
            }}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-all relative cursor-pointer ${
              showHistory 
                ? currentThemeId === 'cosmic'
                  ? "bg-zinc-800 text-zinc-100 font-medium"
                  : currentThemeId === 'warm'
                  ? "bg-[#faf6f0] text-[#473a32] font-semibold"
                  : "bg-zinc-100 text-zinc-900 font-medium" 
                : currentThemeId === 'cosmic'
                ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-805/40"
                : currentThemeId === 'warm'
                ? "text-[#8e7c6d] hover:text-[#473a32] hover:bg-[#FAF7F3]"
                : "text-zinc-550 hover:text-zinc-800 hover:bg-zinc-50"
            }`}
          >
            <History className="w-3 h-3" />
            <span>Lịch sử</span>
            {history.length > 0 && (
              <span className={`absolute -top-1 -right-0.5 w-1.5 h-1.5 rounded-full ${
                currentThemeId === 'cosmic' ? 'bg-indigo-400' : 'bg-zinc-800'
              }`} />
            )}
          </button>
        </div>

        {/* Expandable options (Customize theme, color, error correction settings) */}
        <AnimatePresence initial={false}>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`overflow-hidden border rounded-lg p-2.5 space-y-2.5 ${
                currentThemeId === 'cosmic' ? 'bg-zinc-950/40 border-zinc-800/60' : currentThemeId === 'warm' ? 'bg-[#FAF7F3] border-[#f2e7d7]' : 'bg-zinc-50 border-zinc-100'
              }`}
            >
              {/* Theme Selector */}
              <div className="space-y-1">
                <span className={`text-[10px] ${currentTheme.textLabel} block font-semibold uppercase tracking-wider`}>
                  Lựa chọn Giao diện
                </span>
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleThemeChange(theme.id)}
                      className={`flex items-center space-x-1.5 px-2 py-1.5 text-[10px] font-semibold border rounded-lg transition-all text-left cursor-pointer ${
                        currentThemeId === theme.id
                          ? currentThemeId === 'cosmic'
                            ? "bg-indigo-600 border-indigo-650 text-white"
                            : currentThemeId === 'warm'
                            ? "bg-[#75634d] border-[#75634d] text-white"
                            : "bg-zinc-900 border-zinc-900 text-white"
                          : currentThemeId === 'cosmic'
                          ? "bg-zinc-900 border-zinc-800 text-zinc-450 hover:text-zinc-200"
                          : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      <span>{theme.icon}</span>
                      <span className="truncate">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selector */}
              <div className="space-y-1">
                <span className={`text-[10px] ${currentTheme.textLabel} block font-semibold uppercase tracking-wider`}>
                  Màu sắc cốt mã (QR Accent)
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {currentTheme.palette.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color.hex);
                        try {
                          localStorage.setItem("luqrcode_last_color", color.hex);
                        } catch { /* handle */ }
                        showToast(`Màu sắc: ${color.name}`, "success");
                      }}
                      className={`w-5 h-5 rounded-full border transition flex items-center justify-center relative cursor-pointer ${
                        selectedColor === color.hex 
                          ? "ring-2 ring-offset-1 border-white" 
                          : "border-zinc-200/80"
                      }`}
                      style={{ 
                        backgroundColor: color.hex,
                        boxShadow: selectedColor === color.hex ? `0 0 0 1.5px ${color.hex}` : undefined
                      }}
                      title={color.name}
                    >
                      {selectedColor === color.hex && (
                        <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error correction level selector */}
              <div className="space-y-1 pt-0.5">
                <span className={`text-[10px] ${currentTheme.textLabel} block font-semibold uppercase tracking-wider`}>
                  Khôi phục dòng lỗi (Error Correction)
                </span>
                <div className="grid grid-cols-4 gap-1 pt-0.5">
                  {(["L", "M", "Q", "H"] as const).map((level) => {
                    const desc = level === "L" ? "Thấp" : level === "M" ? "Trung" : level === "Q" ? "Khá" : "Tốt nhất";
                    const isSelected = errorCorrection === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          setErrorCorrection(level);
                          showToast(`Mức bảo vệ: ${desc}`, "success");
                        }}
                        className={`py-1 text-[10px] font-bold border rounded text-center transition-all cursor-pointer ${
                          isSelected
                            ? currentThemeId === 'cosmic'
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : currentThemeId === 'warm'
                              ? "bg-[#75634d] border-[#75634d] text-white"
                              : "bg-zinc-900 border-zinc-900 text-white"
                            : currentThemeId === 'cosmic'
                            ? "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80"
                            : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {level} <span className="text-[8px] font-normal opacity-70">({desc})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expandable History list */}
        <AnimatePresence initial={false}>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`overflow-hidden border rounded-lg p-2.5 ${
                currentThemeId === 'cosmic' ? 'bg-zinc-950/40 border-zinc-800/60' : currentThemeId === 'warm' ? 'bg-[#FAF7F3] border-[#f2e7d7]' : 'bg-zinc-50 border-zinc-100'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200/60 mb-1.5">
                <span className={`text-[10px] ${currentTheme.textLabel} font-semibold uppercase tracking-wider`}>
                  Mã đã tạo gần đây
                </span>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      saveHistory([]);
                      showToast("Đã xóa tất cả lịch sử", "info");
                    }}
                    className={`text-[9px] font-medium transition-colors ${
                      currentThemeId === 'cosmic' ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-400 hover:text-red-650'
                    }`}
                  >
                    Xóa hết
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-4 text-zinc-400 text-[11px] font-medium">
                  Chưa có lịch sử tạo mã nào.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className={`group flex items-center justify-between p-1.5 border rounded-md transition duration-150 cursor-pointer ${
                        currentThemeId === 'cosmic'
                          ? 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                          : currentThemeId === 'warm'
                          ? 'bg-white border-[#eae2d6]/80 hover:border-[#75634d]'
                          : 'bg-white border-zinc-150 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 min-w-0 max-w-[70%]">
                        <span 
                          className="w-1.5 h-1.5 rounded-full shrink-0" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <span className={`text-[10.5px] truncate font-medium ${
                          currentThemeId === 'cosmic' ? 'text-zinc-300' : 'text-zinc-700'
                        }`}>
                          {item.text}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => copyToClipboard(item.text, item.id, e)}
                          className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition ${
                            currentThemeId === 'cosmic' ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-400 hover:text-zinc-700'
                          }`}
                          title="Sao chép"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => deleteHistoryItem(item.id, e)}
                          className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition ${
                            currentThemeId === 'cosmic' ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-300 hover:text-red-500'
                          }`}
                          title="Xóa"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button 
            type="button"
            onClick={handleGenerate} 
            className={`flex-1 py-1.5 px-3 rounded-lg transition duration-155 text-xs ${currentTheme.buttonPrimaryClass}`}
          >
            Tạo mã QR
          </button>
          <button 
            type="button"
            onClick={handleReset} 
            className={`py-1.5 px-3 rounded-lg transition duration-155 text-xs border ${currentTheme.buttonSecondaryClass}`}
          >
            Xóa dòng
          </button>
        </div>

        {/* QR Display Area */}
        <AnimatePresence>
          {activeQRText && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col items-center justify-center pt-4 border-t ${currentTheme.borderColor} space-y-3`}
            >
              <div 
                className={`p-2 border rounded-xl shadow-inner flex items-center justify-center transition-all ${
                  currentThemeId === 'cosmic' ? 'bg-zinc-950 border-zinc-800' : currentThemeId === 'warm' ? 'bg-white border-[#f0e6d6]' : 'bg-white border-zinc-200/80'
                }`}
                style={{ contentVisibility: "auto" }}
              >
                <canvas 
                  ref={canvasRef} 
                  id="qrcode" 
                  className="w-[140px] h-[140px]" 
                />
              </div>

              {/* Target info text preview */}
              <div className="text-center max-w-[210px] mx-auto space-y-0.5">
                <span className={`text-[10px] ${currentTheme.textSubtitle} block uppercase font-mono tracking-wider`}>
                  Đang hiển thị mã cho:
                </span>
                <p className={`text-[11px] truncate font-mono px-2 py-0.5 rounded border transition-colors ${
                  currentThemeId === 'cosmic' 
                    ? 'bg-zinc-950/60 border-zinc-800 text-indigo-400' 
                    : currentThemeId === 'warm' 
                    ? 'bg-[#faf6f0] border-[#ecdac5] text-[#75634d]'
                    : 'bg-zinc-50 border-zinc-150 text-zinc-650'
                }`}>
                  {activeQRText}
                </p>
              </div>
              
              {/* Download & Custom action button */}
              <div className="flex w-full space-x-2">
                <button 
                  type="button"
                  onClick={downloadQR} 
                  className={`flex-1 flex items-center justify-center space-x-1.5 text-[11px] py-1.5 px-2.5 rounded-lg transition duration-150 ${currentTheme.buttonPrimaryClass}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh PNG</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeQRText);
                    showToast("Đã sao chép liên kết dán gốc!", "success");
                  }} 
                  className={`flex-1 flex items-center justify-center space-x-1 text-[11px] py-1.5 px-2.5 rounded-lg border transition duration-150 ${currentTheme.buttonSecondaryClass}`}
                >
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Sao chép đích</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
