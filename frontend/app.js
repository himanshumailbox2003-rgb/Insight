const API = "http://localhost:5000/api/upload";
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const kpisEl = document.getElementById('kpis');
const rawEl = document.getElementById('rawData');
const darkToggle = document.getElementById('darkToggle');

// Persist theme
const current = localStorage.getItem('theme') || 'light';
if(current==='dark'){
  document.documentElement.setAttribute('data-theme','dark');
  darkToggle.checked = true;
}

darkToggle.addEventListener('change', () => {
  if(darkToggle.checked){
    document.documentElement.setAttribute('data-theme','dark');
    localStorage.setItem('theme','dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme','light');
  }
});

uploadBtn.addEventListener('click', async () => {
  if(!fileInput.files.length){
    alert('Please choose a CSV file first.');
    return;
  }
  const file = fileInput.files[0];
  const fd = new FormData();
  fd.append('file', file);
  uploadBtn.disabled = true;
  uploadBtn.textContent = 'Analyzing...';
  try {
    const res = await fetch(API, { method: 'POST', body: fd });
    const data = await res.json();
    if(res.ok){
      renderSummary(data.summary);
      renderCharts(data.sample);
    } else {
      alert('Error: ' + (data.error || 'Unknown'));
    }
  } catch(err){
    alert('Failed to contact backend. Make sure backend is running on http://localhost:5000');
    console.error(err);
  }
  uploadBtn.disabled = false;
  uploadBtn.textContent = 'Upload & Analyze';
});

function renderSummary(s){
  kpisEl.innerHTML = '';
  const rows = card('Rows', s.rows);
  const cols = card('Columns', s.columns);
  const missing = card('Missing Values', s.missing_values);
  const outliers = card('Detected Outliers', s.outliers.outlier_rows);
  kpisEl.appendChild(rows);
  kpisEl.appendChild(cols);
  kpisEl.appendChild(missing);
  kpisEl.appendChild(outliers);
  // add per-column KPIs
  Object.entries(s.kpis || {}).forEach(([col,stats])=>{
    const el = card(col, `mean: ${toFixed(stats.mean)}\nmedian: ${toFixed(stats.median)}\nstd: ${toFixed(stats.std)}`);
    kpisEl.appendChild(el);
  });
}

function toFixed(v){ return v===null||v===undefined?'-':(Math.round(v*100)/100) }

function card(title, value){
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `<strong>${title}</strong><div class="muted">${typeof value==='number'?value:('<pre>'+value+'</pre>')}</div>`;
  return div;
}

let chart = null;
function renderCharts(sample){
  const ctx = document.getElementById('chart1').getContext('2d');
  if(!sample || !Object.keys(sample).length){
    rawEl.textContent = 'No numeric columns detected.';
    if(chart) chart.destroy();
    return;
  }
  // choose first numeric column for plotting
  const cols = Object.keys(sample).filter(k=>k!=='index');
  const labels = sample.index || sample[cols[0]].map((_,i)=>i+1);
  const datasets = cols.map((c,i)=>({
    label:c,
    data: sample[c].map(v=>isNaN(v)?0:+v),
    tension: 0.3,
    fill: false,
    borderWidth: 2,
    pointRadius: 2
  }));
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      interaction: { mode: 'index', intersect: false }
    }
  });
  rawEl.textContent = JSON.stringify(sample, null, 2);
}
