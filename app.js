const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let month='',expanded=false;
const categories=[...new Set(weeks.flatMap(w=>w.items.map(i=>i[0])))];
categories.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;$('category').append(o)});
function render(){const q=$('search').value.trim().toLocaleLowerCase(),cat=$('category').value;let n=0,total=0;
 $('weeks').innerHTML=weeks.map((w,index)=>{if(month&&w.date.slice(5,7)!==month)return '';const broad=(w.title+' '+w.summary).toLocaleLowerCase().includes(q);const items=w.items.filter(i=>(!cat||i[0]===cat)&&(!q||broad||i.join(' ').toLocaleLowerCase().includes(q)));if((cat||q)&&!items.length&&!(w.gap&&!cat&&broad))return '';n++;total+=items.length;
 return `<article class="week ${w.gap?'gap':''}"><div class="date"><small>WEEK ${String(index+1).padStart(2,'0')}</small><span>${esc(w.range)}</span></div><div class="week-body"><h3>${esc(w.title)}</h3><p class="summary">${esc(w.summary)}</p>${items.length?`<div class="entries">${items.map(i=>`<article class="entry"><span>${esc(i[0])}</span><h4>${esc(i[1])}</h4><p>${esc(i[2])}</p></article>`).join('')}</div>`:''}${w.note?`<p class="week-note">${esc(w.note)}</p>`:''}<details ${expanded?'open':''}><summary>หลักฐานและหมายเหตุของสัปดาห์ ↗</summary><ul>${w.sources.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></details></div></article>`}).join('');
 $('count').textContent=`แสดง ${n} สัปดาห์ · ${total} หัวข้องาน${month?' · จัดเดือนตามวันเริ่มสัปดาห์':''}`;$('empty').hidden=n!==0;
}
$('search').addEventListener('input',render);$('category').addEventListener('change',render);
$('months').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;month=b.dataset.month;document.querySelectorAll('#months button').forEach(x=>x.classList.toggle('active',x===b));render()});
$('expand').addEventListener('click',()=>{expanded=!expanded;$('expand').textContent=expanded?'ปิดหลักฐานทั้งหมด':'เปิดหลักฐานทั้งหมด';document.querySelectorAll('details').forEach(d=>d.open=expanded)});
$('reset').addEventListener('click',()=>{$('search').value='';$('category').value='';month='';document.querySelectorAll('#months button').forEach(b=>b.classList.toggle('active',b.dataset.month===''));render()});
$('print').addEventListener('click',()=>window.print());render();
