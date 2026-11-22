const money = n => new Intl.NumberFormat('de-DE', {style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const actual = n => new Intl.NumberFormat('de-DE', {style:'currency',currency:'EUR'}).format(n / 100000);
const date = d => new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(d+'T00:00:00Z'));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dialog = document.querySelector('#detail');
fetch('artworks.json').then(r => {if (!r.ok) throw Error(); return r.json()}).then(works => {
 const grid=document.querySelector('#works');
 grid.innerHTML=works.map((w,i)=>`<button class="card" data-index="${i}"><div class="card-image"><img src="${esc(w.images[0])}" alt="${esc(w.title || 'Kunstwerk ohne Titel')}" loading="lazy"></div><div class="card-meta">VERKAUFT · ${date(w.date).toUpperCase()}</div><h3>${esc(w.title || 'Titel folgt')}</h3><div class="price">${money(w.price)}</div><div class="actual">Entspricht ${actual(w.price)}</div><span class="card-link">Werk ansehen</span></button>`).join('');
 grid.addEventListener('click', e=>{const button=e.target.closest('[data-index]'); if(!button)return; const w=works[button.dataset.index]; document.querySelector('#detail-content').innerHTML=`<div class="detail-media">${w.video?`<video src="${esc(w.video)}" autoplay muted loop playsinline poster="${esc(w.images[0])}"></video>`:''}${w.images.map((src,i)=>`<img src="${esc(src)}" alt="${esc(w.title || 'Kunstwerk ohne Titel')} – Ansicht ${i+1}" loading="lazy">`).join('')}</div><div class="detail-copy"><span>VERKAUFT · ${date(w.date).toUpperCase()}</span><h2>${esc(w.title || 'Titel folgt')}</h2><p class="detail-price">${money(w.price)}</p><p>Entspricht ${actual(w.price)}</p><hr><h3>Über das Werk</h3><div class="description">${w.description?esc(w.description):'Beschreibung folgt.'}</div></div>`;dialog.showModal();});
}).catch(()=>document.querySelector('#works').textContent='Die Sammlung konnte nicht geladen werden. Bitte versuchen Sie es später erneut.');
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
