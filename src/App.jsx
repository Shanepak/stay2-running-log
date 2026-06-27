import { useState, useEffect } from "react";

const SHOES = [
  { name: "Triumph 23", type: "롱런" },
  { name: "Endorphin Pro 4", type: "템포" },
  { name: "Metaspeed Edge", type: "인터벌" },
  { name: "KIPRUN KD900X LD+", type: "레이스" },
  { name: "기타 (직접입력)", type: "" },
];

const TRAINING_TYPES = ["Recovery", "Easy", "Long", "Tempo", "Interval", "Race", "Strength"];
const CONDITION_TYPES = ["매우좋음", "좋음", "보통", "피곤", "매우피곤"];

const CONDITION_COLOR = {
  "매우좋음": "#00ff87", "좋음": "#7aff60", "보통": "#ffd60a",
  "피곤": "#ff9500", "매우피곤": "#ff3b30"
};

const TRAINING_COLOR = {
  Recovery: "#60a5fa", Easy: "#34d399", Long: "#a78bfa",
  Tempo: "#fbbf24", Interval: "#f87171", Race: "#00ff87", Strength: "#94a3b8"
};

const INITIAL_FORM = {
  date: new Date().toISOString().split("T")[0],
  trainingType: "",
  distance: "", time: "", avgHR: "", maxHR: "",
  avgPace: "", cadence: "", strideLength: "",
  groundContact: "", verticalOscillation: "", power: "",
  runCondition: "",
  shoe: "", shoeCustom: "", rpe: "",
  temperature: "", feelsLike: "", humidity: "", windSpeed: "",
  isRaining: false, timeOfDay: "",
  sleep: "", condition: "", musclePain: false, weight: "",
  memo: "",
};

function Label({ children, sub }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>{children}</span>
      {sub && <span style={{ fontSize: 11, color: "#888", marginLeft: 6 }}>{sub}</span>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width: "100%", background: "#1a1a1a", border: "1px solid #2e2e2e",
        borderRadius: 8, color: "#f0f0f0", padding: "9px 12px",
        fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
      }} />
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <div onClick={() => onChange(!value)}
      style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
      <div style={{
        width: 40, height: 22, borderRadius: 11,
        background: value ? "#00ff87" : "#2e2e2e", position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 2, left: value ? 20 : 2, transition: "left 0.2s",
        }} />
      </div>
      <span style={{ fontSize: 13, color: value ? "#00ff87" : "#888" }}>{label}</span>
    </div>
  );
}

function StarRating({ value, onChange, max = 5 }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <div key={n} onClick={() => onChange(n)} style={{
          width: 32, height: 32, borderRadius: 8,
          background: n <= value ? "#00ff87" : "#1a1a1a",
          border: `1px solid ${n <= value ? "#00ff87" : "#2e2e2e"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: n <= value ? "#000" : "#555", cursor: "pointer",
        }}>{n}</div>
      ))}
    </div>
  );
}

function RPESlider({ value, onChange }) {
  const color = value <= 3 ? "#00ff87" : value <= 6 ? "#ffd60a" : value <= 8 ? "#ff9500" : "#ff3b30";
  const label = value <= 3 ? "가벼움" : value <= 6 ? "보통" : value <= 8 ? "힘듦" : "한계";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "#888" }}>RPE (힘든 정도)</span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value || "-"}{value ? ` / 10 · ${label}` : ""}</span>
      </div>
      <input type="range" min={1} max={10} value={value || 5}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", accentColor: color }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <span key={n} style={{ fontSize: 10, color: n == value ? color : "#444" }}>{n}</span>
        ))}
      </div>
    </div>
  );
}

function SelectButtons({ options, value, onChange, colorMap }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((opt) => {
        const c = colorMap ? colorMap[opt] : "#00ff87";
        const active = value === opt;
        return (
          <div key={opt} onClick={() => onChange(active ? "" : opt)} style={{
            padding: "7px 14px", borderRadius: 20,
            border: `1px solid ${active ? c : "#2e2e2e"}`,
            background: active ? `${c}25` : "#1a1a1a",
            color: active ? c : "#666",
            fontSize: 13, cursor: "pointer", transition: "all 0.15s",
          }}>{opt}</div>
        );
      })}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "20px", marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f0f0", marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}

function Report({ form, onClose }) {
  const selectedShoe = form.shoe === "기타 (직접입력)" ? form.shoeCustom : form.shoe;
  const rpeColor = !form.rpe ? "#888" : form.rpe <= 3 ? "#00ff87" : form.rpe <= 6 ? "#ffd60a" : form.rpe <= 8 ? "#ff9500" : "#ff3b30";
  const tColor = form.trainingType ? TRAINING_COLOR[form.trainingType] : "#888";
  const cColor = form.runCondition ? CONDITION_COLOR[form.runCondition] : "#888";

  const Row = ({ label, value, unit, highlight }) => value ? (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
      <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: highlight || "#f0f0f0" }}>
        {value}{unit && <span style={{ fontSize: 11, color: "#555", marginLeft: 3 }}>{unit}</span>}
      </span>
    </div>
  ) : null;

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* 헤더 */}
      <div style={{
        background: "linear-gradient(135deg, #00ff8718, #00d4ff0d)",
        border: "1px solid #00ff8728", borderRadius: 16, padding: "20px",
        marginBottom: 10, position: "relative",
      }}>
        {onClose && (
          <div onClick={onClose} style={{
            position: "absolute", top: 14, right: 14, fontSize: 18, color: "#555", cursor: "pointer",
          }}>✕</div>
        )}
        <div style={{ fontSize: 10, color: "#00ff87", letterSpacing: 3, marginBottom: 4 }}>STAY2 · RUNNING LOG</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#f0f0f0", marginBottom: 6 }}>{form.date}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {form.trainingType && (
            <span style={{ fontSize: 12, fontWeight: 700, color: tColor, background: `${tColor}20`, padding: "3px 10px", borderRadius: 20 }}>
              {form.trainingType}
            </span>
          )}
          {form.runCondition && (
            <span style={{ fontSize: 12, fontWeight: 700, color: cColor, background: `${cColor}20`, padding: "3px 10px", borderRadius: 20 }}>
              {form.runCondition}
            </span>
          )}
          {selectedShoe && (
            <span style={{ fontSize: 12, color: "#888", background: "#1a1a1a", padding: "3px 10px", borderRadius: 20 }}>
              👟 {selectedShoe}
            </span>
          )}
        </div>
      </div>

      {/* 핵심 3지표 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 }}>
        {[
          { label: "거리", value: form.distance, unit: "km" },
          { label: "시간", value: form.time },
          { label: "페이스", value: form.avgPace, unit: "/km" },
        ].map(({ label, value, unit }) => value ? (
          <div key={label} style={{
            background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "12px 8px", textAlign: "center",
          }}>
            <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#00ff87" }}>{value}</div>
            {unit && <div style={{ fontSize: 10, color: "#444" }}>{unit}</div>}
          </div>
        ) : null)}
      </div>

      {/* 러닝 상세 */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "16px 20px", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 8 }}>📊 러닝 데이터</div>
        <Row label="평균 심박" value={form.avgHR} unit="bpm" />
        <Row label="최고 심박" value={form.maxHR} unit="bpm" />
        <Row label="케이던스" value={form.cadence} unit="spm" />
        <Row label="보폭" value={form.strideLength} unit="m" />
        <Row label="지면 접촉시간" value={form.groundContact} unit="ms" />
        <Row label="수직 진폭" value={form.verticalOscillation} unit="cm" />
        <Row label="파워" value={form.power} unit="W" />
        {form.rpe && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ fontSize: 13, color: "#666" }}>RPE</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: rpeColor }}>{form.rpe} / 10</span>
          </div>
        )}
      </div>

      {/* 환경 */}
      {(form.temperature || form.humidity || form.timeOfDay) && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "16px 20px", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 8 }}>🌤 환경</div>
          <Row label="기온" value={form.temperature} unit="°C" />
          <Row label="체감온도" value={form.feelsLike} unit="°C" />
          <Row label="습도" value={form.humidity} unit="%" />
          <Row label="풍속" value={form.windSpeed} unit="m/s" />
          <Row label="시간대" value={form.timeOfDay} />
          {form.isRaining && <Row label="강수" value="🌧 있음" />}
        </div>
      )}

      {/* 몸 상태 */}
      {(form.sleep || form.condition || form.weight || form.musclePain) && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "16px 20px", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 8 }}>🧠 몸 상태</div>
          <Row label="수면" value={form.sleep} unit="h" />
          {form.condition && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 13, color: "#666" }}>컨디션</span>
              <div style={{ display: "flex", gap: 3 }}>
                {[1,2,3,4,5].map(n => (
                  <div key={n} style={{
                    width: 18, height: 18, borderRadius: 4,
                    background: n <= form.condition ? "#00ff87" : "#1a1a1a",
                    border: `1px solid ${n <= form.condition ? "#00ff87" : "#2e2e2e"}`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <Row label="체중" value={form.weight} unit="kg" />
          {form.musclePain && <Row label="근육통" value="⚠️ 있음" highlight="#ff9500" />}
        </div>
      )}

      {/* 메모 */}
      {form.memo && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "16px 20px", marginBottom: 10 }}>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>📝 메모</div>
          <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{form.memo}</div>
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 10, color: "#2a2a2a", letterSpacing: 3, marginTop: 4 }}>
        STAY2 · KEEP RUNNING<br />© 2026 Shanepak
      </div>
    </div>
  );
}

function Stats({ records }) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());

  const totalDist = (recs) => recs.reduce((sum, r) => sum + (parseFloat(r.distance) || 0), 0);

  const yearRecs = records.filter(r => new Date(r.date).getFullYear() === thisYear);
  const monthRecs = records.filter(r => {
    const d = new Date(r.date);
    return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
  });
  const weekRecs = records.filter(r => new Date(r.date) >= weekStart);

  // 신발별 누적
  const shoeMap = {};
  records.forEach(r => {
    const shoe = r.shoe === "기타 (직접입력)" ? r.shoeCustom : r.shoe;
    if (shoe && r.distance) {
      shoeMap[shoe] = (shoeMap[shoe] || 0) + (parseFloat(r.distance) || 0);
    }
  });

  const StatBox = ({ label, value, sub }) => (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "16px 12px", textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#00ff87" }}>{value.toFixed(1)}</div>
      <div style={{ fontSize: 11, color: "#444" }}>{sub}</div>
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 10 }}>📈 누적 통계</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
        <StatBox label="이번 주" value={totalDist(weekRecs)} sub="km" />
        <StatBox label="이번 달" value={totalDist(monthRecs)} sub="km" />
        <StatBox label="올해" value={totalDist(yearRecs)} sub="km" />
      </div>

      {Object.keys(shoeMap).length > 0 && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 10 }}>👟 신발별 누적 거리</div>
          {Object.entries(shoeMap).sort((a,b) => b[1]-a[1]).map(([shoe, dist]) => {
            const pct = Math.min((dist / Math.max(...Object.values(shoeMap))) * 100, 100);
            return (
              <div key={shoe} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#ccc" }}>{shoe}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#00ff87" }}>{dist.toFixed(1)} km</span>
                </div>
                <div style={{ height: 4, background: "#1e1e1e", borderRadius: 2 }}>
                  <div style={{ height: 4, width: `${pct}%`, background: "#00ff87", borderRadius: 2, transition: "width 0.4s" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {records.length === 0 && (
        <div style={{ textAlign: "center", color: "#444", fontSize: 14, padding: 24 }}>
          아직 기록이 없어요 🏃‍♂️<br />첫 러닝을 기록해보세요!
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [view, setView] = useState("form");
  const [records, setRecords] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stay2_records") || "[]"); } catch { return []; }
  });
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    localStorage.setItem("stay2_records", JSON.stringify(records));
  }, [records]);

  const set = (key) => (e) => {
    const val = typeof e === "object" && e.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSave = () => {
    const newRecord = { ...form, id: Date.now() };
    const updated = [newRecord, ...records];
    setRecords(updated);
    setSelectedRecord(newRecord);
    setView("report");
  };

  const handleNew = () => {
    setForm({ ...INITIAL_FORM, date: new Date().toISOString().split("T")[0] });
    setSelectedRecord(null);
    setView("form");
  };

  const NAV = [
    { id: "form", label: "입력" },
    { id: "report", label: "리포트" },
    { id: "history", label: "기록" },
    { id: "stats", label: "통계" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: 480, margin: "0 auto", paddingBottom: 80,
    }}>
      {/* 헤더 */}
      <div style={{ padding: "20px 20px 0", marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "#00ff87", letterSpacing: 3, marginBottom: 2 }}>STAY2</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Running Log</div>
      </div>

      {/* 컨텐츠 */}
      <div style={{ padding: "0 16px" }}>

        {/* 입력 화면 */}
        {view === "form" && (
          <>
            <div style={{ marginBottom: 12 }}>
              <Label>날짜</Label>
              <Input type="date" value={form.date} onChange={set("date")} />
            </div>

            <Section title="📊 러닝 데이터">
              <div>
                <Label>훈련 종류</Label>
                <SelectButtons options={TRAINING_TYPES} value={form.trainingType} onChange={set("trainingType")} colorMap={TRAINING_COLOR} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><Label sub="km">거리</Label><Input value={form.distance} onChange={set("distance")} placeholder="0.00" type="number" /></div>
                <div><Label sub="hh:mm:ss">시간</Label><Input value={form.time} onChange={set("time")} placeholder="00:00:00" /></div>
                <div><Label sub="bpm">평균 심박</Label><Input value={form.avgHR} onChange={set("avgHR")} placeholder="150" type="number" /></div>
                <div><Label sub="bpm">최고 심박</Label><Input value={form.maxHR} onChange={set("maxHR")} placeholder="175" type="number" /></div>
                <div><Label sub="/km">평균 페이스</Label><Input value={form.avgPace} onChange={set("avgPace")} placeholder="5:30" /></div>
                <div><Label sub="spm">케이던스</Label><Input value={form.cadence} onChange={set("cadence")} placeholder="180" type="number" /></div>
                <div><Label sub="m">보폭</Label><Input value={form.strideLength} onChange={set("strideLength")} placeholder="1.20" type="number" /></div>
                <div><Label sub="ms">지면 접촉시간</Label><Input value={form.groundContact} onChange={set("groundContact")} placeholder="210" type="number" /></div>
                <div><Label sub="cm">수직 진폭</Label><Input value={form.verticalOscillation} onChange={set("verticalOscillation")} placeholder="8.5" type="number" /></div>
                <div><Label sub="W">파워</Label><Input value={form.power} onChange={set("power")} placeholder="280" type="number" /></div>
              </div>
              <div>
                <Label>컨디션</Label>
                <SelectButtons options={CONDITION_TYPES} value={form.runCondition} onChange={set("runCondition")} colorMap={CONDITION_COLOR} />
              </div>
              <div>
                <Label>사용 신발</Label>
                <SelectButtons options={SHOES.map(s => s.name)} value={form.shoe} onChange={set("shoe")} />
                {form.shoe === "기타 (직접입력)" && (
                  <div style={{ marginTop: 8 }}>
                    <Input value={form.shoeCustom} onChange={set("shoeCustom")} placeholder="신발 이름 입력" />
                  </div>
                )}
              </div>
              <RPESlider value={form.rpe} onChange={set("rpe")} />
            </Section>

            <Section title="🌤 환경 데이터">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><Label sub="°C">기온</Label><Input value={form.temperature} onChange={set("temperature")} placeholder="22" type="number" /></div>
                <div><Label sub="°C">체감온도</Label><Input value={form.feelsLike} onChange={set("feelsLike")} placeholder="24" type="number" /></div>
                <div><Label sub="%">습도</Label><Input value={form.humidity} onChange={set("humidity")} placeholder="65" type="number" /></div>
                <div><Label sub="m/s">풍속</Label><Input value={form.windSpeed} onChange={set("windSpeed")} placeholder="3.2" type="number" /></div>
              </div>
              <div>
                <Label>시간대</Label>
                <SelectButtons options={["새벽","오전","오후","야간"]} value={form.timeOfDay} onChange={set("timeOfDay")} />
              </div>
              <Toggle value={form.isRaining} onChange={set("isRaining")} label="강수 있음" />
            </Section>

            <Section title="🧠 몸 상태">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><Label sub="시간">수면시간</Label><Input value={form.sleep} onChange={set("sleep")} placeholder="7.5" type="number" /></div>
                <div><Label sub="kg">체중</Label><Input value={form.weight} onChange={set("weight")} placeholder="68.0" type="number" /></div>
              </div>
              <div>
                <Label>컨디션 (1~5)</Label>
                <StarRating value={form.condition} onChange={set("condition")} max={5} />
              </div>
              <Toggle value={form.musclePain} onChange={set("musclePain")} label="근육통 있음" />
            </Section>

            <Section title="📝 메모">
              <textarea value={form.memo} onChange={set("memo")}
                placeholder="오늘 러닝 느낀점, 특이사항 등..."
                rows={4} style={{
                  width: "100%", background: "#1a1a1a", border: "1px solid #2e2e2e",
                  borderRadius: 8, color: "#f0f0f0", padding: "10px 12px", fontSize: 14,
                  outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box",
                }} />
            </Section>

            <div onClick={handleSave} style={{
              background: "#00ff87", color: "#000", fontWeight: 800, fontSize: 16,
              textAlign: "center", padding: "16px", borderRadius: 14, cursor: "pointer", letterSpacing: 1,
            }}>저장 & 리포트 보기 →</div>
          </>
        )}

        {/* 리포트 화면 */}
        {view === "report" && (
          <>
            {selectedRecord ? (
              <Report form={selectedRecord} />
            ) : records.length > 0 ? (
              <Report form={records[0]} />
            ) : (
              <div style={{ textAlign: "center", color: "#444", padding: 40 }}>
                저장된 기록이 없어요 😅
              </div>
            )}
            <div onClick={handleNew} style={{
              background: "#00ff87", color: "#000", fontWeight: 800, fontSize: 15,
              textAlign: "center", padding: "14px", borderRadius: 14, cursor: "pointer", marginTop: 12,
            }}>+ 새 러닝 기록</div>
          </>
        )}

        {/* 기록 목록 */}
        {view === "history" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 10 }}>
              📋 전체 기록 ({records.length}개)
            </div>
            {records.length === 0 ? (
              <div style={{ textAlign: "center", color: "#444", padding: 40 }}>
                아직 기록이 없어요 🏃‍♂️
              </div>
            ) : records.map(r => {
              const tColor = r.trainingType ? TRAINING_COLOR[r.trainingType] : "#555";
              return (
                <div key={r.id} onClick={() => { setSelectedRecord(r); setView("report"); }}
                  style={{
                    background: "#111", border: "1px solid #1e1e1e", borderRadius: 14,
                    padding: "14px 16px", marginBottom: 8, cursor: "pointer",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#888" }}>{r.date}</span>
                    {r.trainingType && (
                      <span style={{ fontSize: 11, color: tColor, background: `${tColor}20`, padding: "2px 8px", borderRadius: 20 }}>
                        {r.trainingType}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    {r.distance && (
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#00ff87" }}>{r.distance}<span style={{ fontSize: 11, color: "#555", marginLeft: 2 }}>km</span></span>
                    )}
                    {r.avgPace && <span style={{ fontSize: 14, color: "#888" }}>{r.avgPace}/km</span>}
                    {r.avgHR && <span style={{ fontSize: 14, color: "#888" }}>♥ {r.avgHR}</span>}
                  </div>
                  {r.shoe && r.shoe !== "기타 (직접입력)" && (
                    <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>👟 {r.shoe}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 통계 */}
        {view === "stats" && <Stats records={records} />}
      </div>

      {/* 하단 네비게이션 */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "#0d0d0d", borderTop: "1px solid #1e1e1e",
        display: "flex", padding: "10px 0 20px",
      }}>
        {NAV.map(({ id, label }) => (
          <div key={id} onClick={() => { setSelectedRecord(null); setView(id); }}
            style={{
              flex: 1, textAlign: "center", fontSize: 13, fontWeight: view === id ? 700 : 400,
              color: view === id ? "#00ff87" : "#444", cursor: "pointer", padding: "6px 0",
              borderTop: `2px solid ${view === id ? "#00ff87" : "transparent"}`,
            }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
