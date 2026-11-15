const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const WHATSAPP_NUMBER = '916381151840';

const SAMPLE_SAREES = [
  {
    sku_code: 'SFH-101',
    title: 'Pastel Pista Green - Linen Cotton Checks with Tiny Border',
    fabric_category: 'linen',
    fabric_detail: 'Linen Cotton • 6.2m with Blouse',
    price_inr: 999,
    original_price_inr: 1299,
    image_url: 'https://placehold.co/600x750/e7e5e4/6B1D2F?text=SFH-101+Linen+Cotton',
    alt_text: 'Pastel Pista Green Linen Cotton Checks Saree',
    status: 'in_stock'
  },
  {
    sku_code: 'SFH-102',
    title: 'Wine Brown with Aqua - Soft Silk Muthu Kattam Saree',
    fabric_category: 'silk',
    fabric_detail: 'Soft Silk • 6.2m with Running Blouse',
    price_inr: 1499,
    original_price_inr: 1899,
    image_url: 'https://placehold.co/600x750/f5f5f4/6B1D2F?text=SFH-102+Soft+Silk',
    alt_text: 'Wine Brown with Aqua Soft Silk Muthu Kattam Saree',
    status: 'in_stock'
  },
  {
    sku_code: 'SFH-103',
    title: 'Brick Red - Kanchi Mercerised Cotton Big Muthu Kattam',
    fabric_category: 'cotton',
    fabric_detail: 'Kanchi Cotton • 6.2m with Blouse',
    price_inr: 1799,
    original_price_inr: null,
    image_url: 'https://placehold.co/600x750/d6d3d1/44403c?text=SFH-103+Sold+Out',
    alt_text: 'Brick Red Kanchi Mercerised Cotton Saree',
    status: 'sold'
  }
];

let allSarees = [];

async function loadSarees() {
  const summary = document.getElementById('stock-summary');
  const isSupabaseConfigured =
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
    window.supabase;

  if (!isSupabaseConfigured) {
    allSarees = SAMPLE_SAREES;
    const inStockCount = allSarees.filter(s => s.status === 'in_stock').length;
    summary.textContent = 'Showing ' + allSarees.length + ' sample pieces (' + inStockCount + ' in stock) — Connect Supabase URL to go live';
    renderSarees(allSarees);
    return;
  }

  try {
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabaseClient
      .from('sarees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    allSarees = data && data.length > 0 ? data : SAMPLE_SAREES;
    const inStockCount = allSarees.filter(s => s.status === 'in_stock').length;
    summary.textContent = 'Showing ' + allSarees.length + ' curated pieces (' + inStockCount + ' currently in stock)';
    renderSarees(allSarees);
  } catch (err) {
    console.error('Supabase fetch error:', err);
    allSarees = SAMPLE_SAREES;
    summary.textContent = 'Database offline — showing sample catalog';
    renderSarees(allSarees);
  }
}

function renderSarees(sareesList) {
  const grid = document.getElementById('saree-grid');

  if (!sareesList || sareesList.length === 0) {
    grid.innerHTML = '<p class="col-span-full text-center text-stone-600 py-10">No sarees found in this category right now.</p>';
    return;
  }

  grid.innerHTML = sareesList.map(function(saree) {
    const isAvailable = saree.status === 'in_stock';
    const isReserved = saree.status === 'reserved';

    let badgeHtml = '<span class="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded">1 Piece In Stock</span>';
    if (isReserved) {
      badgeHtml = '<span class="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded">Reserved</span>';
    } else if (!isAvailable) {
      badgeHtml = '<span class="absolute top-3 left-3 bg-stone-800 text-white text-xs font-bold px-2.5 py-1 rounded">Sold Out</span>';
    }

    let priceHtml = '<span class="text-lg font-bold text-stone-900">Rs. ' + Number(saree.price_inr).toLocaleString('en-IN') + '</span>';
    if (saree.original_price_inr && saree.original_price_inr > saree.price_inr) {
      priceHtml += ' <span class="text-xs text-stone-400 line-through">Rs. ' + Number(saree.original_price_inr).toLocaleString('en-IN') + '</span>';
    }

    const waText = encodeURIComponent('Hi Sarees for Her! I want to buy ' + saree.sku_code + ' (' + saree.title + ' - Rs. ' + saree.price_inr + '). Is it still available?');
    const ctaHtml = isAvailable
      ? '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waText + '" target="_blank" rel="noopener" class="block w-full text-center brand-maroon text-white font-semibold py-2.5 rounded hover:opacity-95 transition">Buy on WhatsApp</a>'
      : '<button disabled class="block w-full text-center bg-stone-300 text-stone-600 font-semibold py-2.5 rounded cursor-not-allowed">' + (isReserved ? 'Currently Reserved' : 'Sold Out') + '</button>';

    const cardOpacity = !isAvailable ? 'opacity-80' : '';
    const imgGray = !isAvailable ? 'grayscale-[40%]' : '';
    const altText = saree.alt_text || saree.title;

    return '<article class="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm flex flex-col ' + cardOpacity + '">' +
      '<div class="relative aspect-[4/5] bg-stone-100">' +
        '<img src="' + saree.image_url + '" alt="' + altText + '" loading="lazy" onerror="this.src=\'https://placehold.co/600x750/e7e5e4/6B1D2F?text=Image+Coming+Soon\'" class="w-full h-full object-cover ' + imgGray + '" />' +
        badgeHtml +
      '</div>' +
      '<div class="p-5 flex-1 flex flex-col justify-between">' +
        '<div>' +
          '<p class="text-xs text-stone-500 uppercase tracking-wider mb-1">SKU: ' + saree.sku_code + ' • ' + saree.fabric_detail + '</p>' +
          '<h3 class="font-semibold text-base text-stone-900 mb-2">' + saree.title + '</h3>' +
          '<div class="flex items-baseline gap-2 mb-4">' + priceHtml + '</div>' +
        '</div>' +
        ctaHtml +
      '</div>' +
    '</article>';
  }).join('');
}

document.querySelectorAll('.filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(function(b) {
      b.classList.remove('bg-[#6B1D2F]', 'text-white');
      b.classList.add('bg-white', 'text-stone-700');
    });
    btn.classList.remove('bg-white', 'text-stone-700');
    btn.classList.add('bg-[#6B1D2F]', 'text-white');

    const filter = btn.dataset.filter;
    if (filter === 'all') {
      renderSarees(allSarees);
    } else if (filter === 'available') {
      renderSarees(allSarees.filter(function(s) { return s.status === 'in_stock'; }));
    } else {
      renderSarees(allSarees.filter(function(s) { return (s.fabric_category || '').toLowerCase() === filter; }));
    }
  });
});

document.getElementById('callback-form').addEventListener('submit', function(e) {
  e.preventDefault();
  if (this.querySelector('input[name="_gotcha"]').value !== '') return;
  const name = document.getElementById('buyer-name').value.trim();
  const sku = document.getElementById('saree-code').value.trim();
  const msg = encodeURIComponent('Hi! My name is ' + name + '. Can you share a daylight video of Saree ' + sku + '?');
  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + msg, '_blank');
});

const banner = document.getElementById('cookie-banner');
if (!localStorage.getItem('sfh_cookie_ok')) {
  banner.classList.remove('hidden');
}
document.getElementById('accept-cookies').addEventListener('click', function() {
  localStorage.setItem('sfh_cookie_ok', 'true');
  banner.classList.add('hidden');
});

loadSarees();
