const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = __dirname;
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), context);
const weeks = vm.runInContext('weeks', context);
const cutoff = '2026-10-15';
const lines = [
  '---',
  'title: "Project Work Log — บาส"',
  'document_type: summarized_work_log',
  'language: th',
  'timezone: Asia/Bangkok',
  'coverage_start: 2026-06-29',
  'coverage_end: 2026-10-15',
  'markdown_created: 2026-10-18',
  'source_snapshot: data.js',
  'source_review_date: 2026-10-15',
  'raw_transcript: false',
  `week_count: ${weeks.length}`,
  `entry_count: ${weeks.reduce((n, w) => n + w.items.length, 0)}`,
  '---', '',
  '# Project Work Log — บาส', '',
  'บันทึกงานพัฒนาเกม เว็บ เครื่องมือ และเอกสารโปรเจกต์ ระหว่าง 29 มิถุนายน–15 ตุลาคม 2026 แปลงจากข้อมูลเว็บสรุปงานเป็น Markdown สำหรับให้ AI อ่าน ค้นหา สรุป หรือใช้เป็นบริบททำงานต่อ', '',
  '## ขอบเขตและวิธีตีความ', '',
  '- เอกสารนี้เป็นสรุปจากหลักฐานที่เคยตรวจ ไม่ใช่ข้อความสนทนาดิบ และไม่ใช่รายการแก้ไขโค้ดทุกครั้ง',
  '- สร้างไฟล์ Markdown วันที่ 18 ตุลาคม 2026 แต่ข้อมูลครอบคลุมถึงวันที่ 15 ตุลาคมเท่านั้น ยังไม่ได้รวบรวมหรือตรวจงานวันที่ 16–18 ตุลาคม',
  '- รวม Deepspace, BossFight, มินิเกม, LED/UWB, เว็บต้นแบบ, GDD, Replay และ Launcher',
  '- ไม่รวม Green TPM รายงานวิศวกรรม และงานการบ้าน ตามขอบเขตที่ผู้ใช้ระบุ',
  '- วันที่ของแต่ละรายการมีความละเอียดระดับสัปดาห์ เว้นแต่เนื้อหาจะระบุวันจริง ห้ามถือว่าวันเริ่มสัปดาห์เป็นวันที่ทำรายการนั้นเสร็จ',
  '- คำว่าเพิ่ม แก้ หรือทำแล้ว อ้างตามบันทึกเดิม ไม่ใช่การยืนยันว่าทดสอบซ้ำหรือยังทำงานได้ในปัจจุบัน',
  '- หลักฐานเป็นของสัปดาห์โดยรวม ไม่ได้หมายความว่าทุกหลักฐานรองรับทุกรายการในสัปดาห์นั้น',
  '- ไม่มีหลักฐานไม่เท่ากับไม่ได้ทำงาน และจำนวนหัวข้อไม่ใช่ชั่วโมงทำงาน',
  '- การตั้งค่าและพฤติกรรมอาจเปลี่ยนภายหลัง ให้อ่านตามลำดับเวลาและตรวจโค้ดล่าสุดก่อนนำไปใช้', '',
  '## รูปแบบรายการ', '',
  '- `entry_id`: รหัสอ้างอิงรายการในเอกสารฉบับนี้',
  '- `category`: หมวดงานจากข้อมูลเว็บเดิม',
  '- `evidence_status`: `reported_in_source_summary` คือมีบันทึกในสรุปเดิม ไม่ได้เป็นการรับรองว่างานเสร็จทั้งหมด',
  '- `source_refs`: รหัสหลักฐานระดับสัปดาห์ ใช้ย้อนกลับไปหัวข้อหลักฐานใต้สัปดาห์เดียวกัน',
  '- `coverage_status`: `evidence_found` หรือ `no_evidence_found`', '',
  '## สารบัญตามสัปดาห์', ''
];
for (const w of weeks) lines.push(`- [${w.date} — ${w.title}](#week-${w.date})`);
lines.push('', '## บันทึกงาน', '');
let count = 0;
for (const w of weeks) {
  const end = new Date(w.date + 'T00:00:00Z');
  end.setUTCDate(end.getUTCDate() + 6);
  const weekEnd = end.toISOString().slice(0, 10);
  const refs = w.sources.map((_, i) => `SRC-${w.date}-${String(i + 1).padStart(2, '0')}`);
  lines.push(`<a id="week-${w.date}"></a>`, '', `### ${w.date} — ${w.title}`, '',
    `- period_start: ${w.date}`,
    `- period_end: ${weekEnd > cutoff ? cutoff : weekEnd}`,
    '- date_precision: week',
    `- coverage_status: ${w.gap ? 'no_evidence_found' : 'evidence_found'}`,
    `- entry_count: ${w.items.length}`, '',
    `**ภาพรวม:** ${w.summary}`, '');
  w.items.forEach((item, i) => {
    count++;
    lines.push(`#### LOG-${w.date}-${String(i + 1).padStart(2, '0')} — ${item[1]}`, '',
      `- entry_id: LOG-${w.date}-${String(i + 1).padStart(2, '0')}`,
      `- category: ${item[0]}`,
      '- evidence_status: reported_in_source_summary',
      `- source_refs: ${refs.join(', ')}`, '',
      `**งานและผลลัพธ์ตามบันทึก:** ${item[2]}`, '');
  });
  if (w.note) lines.push(`**ข้อจำกัด / หมายเหตุ:** ${w.note}`, '');
  lines.push('#### หลักฐานระดับสัปดาห์', '');
  w.sources.forEach((s, i) => lines.push(`- ${refs[i]}: ${s}`));
  lines.push('');
}
lines.push('## แหล่งข้อมูลต้นทาง', '',
  '- ประวัติ Codex ในเครื่อง: `C:\\Users\\Dell\\.codex\\sessions` — ใช้คำขอและคำตอบสรุปผลตามวันที่ข้อความจริง',
  '- คลังรายงานฝึกงาน: `C:\\Users\\Dell\\intern-oracle-ai\\reports` และ `sessions` — รายงาน W29–W35 และบันทึกหัวข้อรายวัน',
  '- Git ของ Deepspace, deepspace-gdd, Project Brainrot และ One-minute Puzzle Lab — วันที่และข้อความ commit',
  '- ไฟล์ GDD และรายงานสมดุลของโปรเจกต์ที่กล่าวถึงในหลักฐานรายสัปดาห์',
  '- Repository ของเอกสารนี้: https://github.com/Basakeee/work-journal-2026',
  '- เว็บรายงาน: https://basakeee.github.io/work-journal-2026/', '',
  'พาธในเครื่องเป็นตำแหน่งอ้างอิง ไม่ใช่ไฟล์แนบในเอกสารนี้ และ AI ที่อ่านไฟล์จากเครื่องอื่นอาจเข้าถึงต้นฉบับเหล่านั้นไม่ได้', '');
assert.equal(weeks.length, 16);
assert.equal(count, 75);
const result = lines.join('\n');
assert.equal((result.match(/^#### LOG-/gm) || []).length, count);
fs.writeFileSync(path.join(root, 'WORK_LOG.md'), result, 'utf8');
console.log(`Generated WORK_LOG.md: ${weeks.length} weeks, ${count} entries, ${Buffer.byteLength(result)} UTF-8 bytes.`);
