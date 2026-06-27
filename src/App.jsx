import { useState } from "react";

const SHOES = [
  { name: "Triumph 23", type: "롱런" },
  { name: "Endorphin Pro 4", type: "템포" },
  { name: "Metaspeed Edge", type: "인터벌" },
  { name: "KIPRUN KD900X LD+", type: "레이스" },
  { name: "기타 (직접입력)", type: "" },
];

const INITIAL_FORM = {
  date: new Date().toISOString().split("T")[0],
  // 1. 러닝 데이터
  distance: "",
  time: "",
  avgHR: "",
  maxHR: "",
  avgPace: "",
  cadence: "",
  strideLength: "",
  groundContact: "",
  verticalOscillation: "",
  power: "",
  shoe: "",
  shoeCustom: "",
  rpe: "",
  // 2. 환경
  temperature: "",
  feelsLike: "",
  humidity: "",
  windSpeed: "",
  isRaining: false,
  timeOfDay: "",
  // 3. 몸 상태
  sleep: "",
  condition: "",
  musclePain: false,
  weight: "",
  // 메모
  memo: "",
};

const SECTIONS = [
  { id: "running", label: "📊 러닝 데이터", emoji: "📊" },
  { id: "environment", label: "🌤 환경", emoji: "🌤" },
  { id: "body", label: "🧠 몸 상태", emoji: "🧠" },
  { id: "memo", label: "📝 메모", emoji: "📝" },
];

function Label({ children, sub }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>{children}</span>
      {sub && <span style={{ fontSize: 11, color: "#888", marginLeft: 6 }}>{sub}</span>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", unit }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: "#1a1a1a",
          border: "1px solid #2e2e2e",
          borderRadius: 8,
          color: "#f0f0f0",
          padding: "9px 12px",
          fontSize: 14,
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      {unit && <span style={{ fontSize: 12, color: "#666", minWidth: 24 }}>{unit}</span>}
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: value ? "#00ff87" : "#2e2e2e",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 2,
            left: value ? 20 : 2,
            transition: "left 0.2s",
          }}
        />
      </div>
      <span style={{ fontSize: 13, color: value ? "#00ff87" : "#888" }}>{label}</span>
    </div>
  );
}

function StarRating({ value, onChange, max = 5 }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          onClick={() => onChange(n)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: n <= value ? "#00ff87" : "#1a1a1a",
            border: `1px solid ${n <= value ? "#00ff87" : "#2e2e2e"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: n <= value ? "#000" : "#555",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {n}
        </div>
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
        <span style={{ fontSize: 13, color: "#888" }}>RPE</span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value || "-"} {value ? `/ 10 · ${label}` : ""}</span>
      </div>
      <input
        type="range" min={1} max={10} value={value || 5}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", accentColor: color }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <span key={n} style={{ fontSize: 10, color: n == value ? color : "#444" }}>{n}</span>
        ))}
      </div>
    </div>
  );
}

function SelectButtons({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((opt) => (
        <div
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: "7px 14px",
            borderRadius: 20,
            border: `1px solid ${value === opt ? "#00ff87" : "#2e2e2e"}`,
            background: value === opt ? "#00ff8720" : "#1a1a1a",
            color: value === opt ? "#00ff87" : "#666",
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: "#111",
      border: "1px solid #1e1e1e",
      borderRadius: 16,
      padding: "20px",
      marginBottom: 12,
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f0f0", marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Report({ form }) {
  const selectedShoe = form.shoe === "기타 (직접입력)" ? form.shoeCustom : form.shoe;
  const rpeColor = form.rpe <= 3 ? "#00ff87" : form.rpe <= 6 ? "#ffd60a" : form.rpe <= 8 ? "#ff9500" : "#ff3b30";

  const Row = ({ label, value, unit, highlight }) => (
    value ? (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e1e1e" }}>
        <span style={{ fontSize: 13, color: "#888" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: highlight || "#f0f0f0" }}>
          {value}{unit ? <span style={{ fontSize: 12, color: "#666", marginLeft: 3 }}>{unit}</span> : ""}
        </span>
      </div>
    ) : null
  );

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* 헤더 */}
      <div style={{
        background: "linear-gradient(135deg, #00ff8720, #00d4ff10)",
        border: "1px solid #00ff8730",
        borderRadius: 16,
        padding: "20px",
        marginBottom: 12,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 11, color: "#00ff87", letterSpacing: 3, marginBottom: 6 }}>STAY2 · RUNNING LOG</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#f0f0f0" }}>{form.date}</div>
        {selectedShoe && <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>👟 {selectedShoe}</div>}
      </div>

      {/* 핵심 지표 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
        marginBottom: 12,
      }}>
        {[
          { label: "거리", value: form.distance, unit: "km" },
          { label: "시간", value: form.time },
          { label: "평균 페이스", value: form.avgPace, unit: "/km" },
        ].map(({ label, value, unit }) => value ? (
          <div key={label} style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: 12,
            padding: "14px 10px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#00ff87" }}>{value}</div>
            {unit && <div style={{ fontSize: 11, color: "#555" }}>{unit}</div>}
          </div>
        ) : null)}
      </div>

      {/* 러닝 상세 */}
      <Section title="📊 러닝 데이터">
        <Row label="평균 심박" value={form.avgHR} unit="bpm" />
        <Row label="최고 심박" value={form.maxHR} unit="bpm" />
        <Row label="케이던스" value={form.cadence} unit="spm" />
        <Row label="보폭" value={form.strideLength} unit="m" />
        <Row label="지면 접촉시간" value={form.groundContact} unit="ms" />
        <Row label="수직 진폭" value={form.verticalOscillation} unit="cm" />
        <Row label="파워" value={form.power} unit="W" />
        {form.rpe && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ fontSize: 13, color: "#888" }}>RPE</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: rpeColor }}>{form.rpe} / 10</span>
          </div>
        )}
      </Section>

      {/* 환경 */}
      {(form.temperature || form.humidity || form.windSpeed || form.timeOfDay) && (
        <Section title="🌤 환경">
          <Row label="기온" value={form.temperature} unit="°C" />
          <Row label="체감온도" value={form.feelsLike} unit="°C" />
          <Row label="습도" value={form.humidity} unit="%" />
          <Row label="풍속" value={form.windSpeed} unit="m/s" />
          {form.timeOfDay && <Row label="시간대" value={form.timeOfDay} />}
          {form.isRaining && <Row label="강수" value="🌧 있음" />}
        </Section>
      )}

      {/* 몸 상태 */}
      {(form.sleep || form.condition || form.weight) && (
        <Section title="🧠 몸 상태">
          <Row label="수면시간" value={form.sleep} unit="h" />
          {form.condition && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e1e1e" }}>
              <span style={{ fontSize: 13, color: "#888" }}>컨디션</span>
              <div style={{ display: "flex", gap: 4 }}>
                {[1,2,3,4,5].map(n => (
                  <div key={n} style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: n <= form.condition ? "#00ff87" : "#1a1a1a",
                    border: `1px solid ${n <= form.condition ? "#00ff87" : "#2e2e2e"}`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <Row label="체중" value={form.weight} unit="kg" />
          {form.musclePain && <Row label="근육통" value="⚠️ 있음" highlight="#ff9500" />}
        </Section>
      )}

      {/* 메모 */}
      {form.memo && (
        <div style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: 16,
          padding: 20,
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>📝 메모</div>
          <div style={{ fontSize: 14, color: "#d0d0d0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{form.memo}</div>
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 11, color: "#333", marginTop: 8, letterSpacing: 2 }}>
        STAY2 · KEEP RUNNING
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [view, setView] = useState("form"); // form | report
  const [records, setRecords] = useState([]);

  const set = (key) => (e) => {
    const val = typeof e === "object" && e.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSave = () => {
    setRecords((r) => [{ ...form, id: Date.now() }, ...r]);
    setView("report");
  };

  const handleNew = () => {
    setForm({ ...INITIAL_FORM, date: new Date().toISOString().split("T")[0] });
    setView("form");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#f0f0f0",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      padding: "0 0 40px",
    }}>
      {/* 상단 헤더 */}
      <div style={{
        padding: "20px 20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}>
        <div>
          <div style={{ fontSize: 11, color: "#00ff87", letterSpacing: 3, marginBottom: 2 }}>STAY2</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Running Log</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div
            onClick={() => setView("form")}
            style={{
              padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
              background: view === "form" ? "#00ff87" : "#1a1a1a",
              color: view === "form" ? "#000" : "#666",
              fontWeight: view === "form" ? 700 : 400,
              border: "1px solid " + (view === "form" ? "#00ff87" : "#2e2e2e"),
            }}
          >입력</div>
          <div
            onClick={() => setView("report")}
            style={{
              padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
              background: view === "report" ? "#00ff87" : "#1a1a1a",
              color: view === "report" ? "#000" : "#666",
              fontWeight: view === "report" ? 700 : 400,
              border: "1px solid " + (view === "report" ? "#00ff87" : "#2e2e2e"),
            }}
          >리포트</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {view === "form" ? (
          <>
            {/* 날짜 */}
            <div style={{ marginBottom: 12 }}>
              <Label>날짜</Label>
              <Input type="date" value={form.date} onChange={set("date")} />
            </div>

            {/* 1. 러닝 데이터 */}
            <Section title="📊 러닝 데이터">
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
                <Label>사용 신발</Label>
                <SelectButtons
                  options={SHOES.map(s => s.name)}
                  value={form.shoe}
                  onChange={set("shoe")}
                />
                {form.shoe === "기타 (직접입력)" && (
                  <div style={{ marginTop: 8 }}>
                    <Input value={form.shoeCustom} onChange={set("shoeCustom")} placeholder="신발 이름 입력" />
                  </div>
                )}
              </div>

              <RPESlider value={form.rpe} onChange={set("rpe")} />
            </Section>

            {/* 2. 환경 */}
            <Section title="🌤 환경 데이터">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><Label sub="°C">기온</Label><Input value={form.temperature} onChange={set("temperature")} placeholder="22" type="number" /></div>
                <div><Label sub="°C">체감온도</Label><Input value={form.feelsLike} onChange={set("feelsLike")} placeholder="24" type="number" /></div>
                <div><Label sub="%">습도</Label><Input value={form.humidity} onChange={set("humidity")} placeholder="65" type="number" /></div>
                <div><Label sub="m/s">풍속</Label><Input value={form.windSpeed} onChange={set("windSpeed")} placeholder="3.2" type="number" /></div>
              </div>
              <div>
                <Label>시간대</Label>
                <SelectButtons options={["새벽", "오전", "오후", "야간"]} value={form.timeOfDay} onChange={set("timeOfDay")} />
              </div>
              <Toggle value={form.isRaining} onChange={set("isRaining")} label="강수 있음" />
            </Section>

            {/* 3. 몸 상태 */}
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

            {/* 메모 */}
            <Section title="📝 메모">
              <textarea
                value={form.memo}
                onChange={set("memo")}
                placeholder="오늘 러닝 느낀점, 특이사항 등..."
                rows={4}
                style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: "1px solid #2e2e2e",
                  borderRadius: 8,
                  color: "#f0f0f0",
                  padding: "10px 12px",
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                  boxSizing: "border-box",
                }}
              />
            </Section>

            {/* 저장 버튼 */}
            <div
              onClick={handleSave}
              style={{
                background: "#00ff87",
                color: "#000",
                fontWeight: 800,
                fontSize: 16,
                textAlign: "center",
                padding: "16px",
                borderRadius: 14,
                cursor: "pointer",
                letterSpacing: 1,
                marginTop: 4,
              }}
            >
              저장 & 리포트 보기 →
            </div>
          </>
        ) : (
          <>
            <Report form={records[0] || form} />
            <div
              onClick={handleNew}
              style={{
                background: "#00ff87",
                color: "#000",
                fontWeight: 800,
                fontSize: 15,
                textAlign: "center",
                padding: "14px",
                borderRadius: 14,
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              + 새 러닝 기록
            </div>
          </>
        )}
      </div>
    </div>
  );
}
