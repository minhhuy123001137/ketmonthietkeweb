/* ============================================================
   HQHN CRM — JavaScript
   HQHN Web Studio | Phiên bản 1.0
============================================================ */

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

/**
 * Xếp hạng khách hàng dựa trên tổng giá trị giao dịch:
 *   Vàng  >= 10,000,000 VND
 *   Bạc    3,000,000 – 9,999,999 VND
 *   Đồng  <  3,000,000 VND
 */
function getRank(total) {
  if (total >= 10000000) return { key: 'vang', label: '★ Vàng' };
  if (total >= 3000000)  return { key: 'bac',  label: '◆ Bạc'  };
  return                        { key: 'dong', label: '● Đồng' };
}

/** Format số tiền theo định dạng VND */
function fmtVND(n) {
  return n.toLocaleString('vi-VN') + ' ₫';
}

/** Format ngày dd/mm/yyyy */
function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
}

/* ============================================================
   DỮ LIỆU MẪU — Khách hàng, Lịch, Khảo sát
============================================================ */

/** Danh sách khách hàng mặc định */
const DEFAULT_CUSTOMERS = [
  {
    id: 'c1',
    name: 'Nguyễn Thị Lan',
    phone: '0901 234 101',
    email: 'lan.nguyen@gmail.com',
    transactions: [
      { date: '2026-08-10', desc: 'Thiết kế logo thương hiệu', amount: 5000000 },
      { date: '2026-09-05', desc: 'Thiết kế website bán hàng', amount: 8000000 },
    ],
    interactions: [
      { date: '2026-10-01', type: 'Cuộc gọi', text: 'Xác nhận yêu cầu thiết kế logo, khách hài lòng với concept.' },
      { date: '2026-10-20', type: 'Email',    text: 'Gửi bản thiết kế lần 1, khách yêu cầu chỉnh màu chủ đạo sang xanh navy.' },
    ]
  },
  {
    id: 'c2',
    name: 'Trần Minh Khoa',
    phone: '0912 345 202',
    email: 'khoa.tran@outlook.com',
    transactions: [
      { date: '2026-07-15', desc: 'Dịch vụ SEO 3 tháng', amount: 4500000 },
    ],
    interactions: [
      { date: '2026-07-16', type: 'Cuộc gọi', text: 'Tư vấn gói SEO, khách đồng ý ký hợp đồng.' },
    ]
  },
  {
    id: 'c3',
    name: 'Lê Thị Hoa',
    phone: '0933 456 303',
    email: 'hoa.le@company.vn',
    transactions: [
      { date: '2026-06-20', desc: 'Thiết kế landing page', amount: 3500000 },
      { date: '2026-08-01', desc: 'Chỉnh sửa và cập nhật nội dung', amount: 1200000 },
    ],
    interactions: [
      { date: '2026-06-22', type: 'Họp online', text: 'Review mockup lần 1, cần thay đổi layout header.' },
      { date: '2026-07-05', type: 'Email',      text: 'Gửi file thiết kế hoàn chỉnh, khách xác nhận.' },
    ]
  },
  {
    id: 'c4',
    name: 'Phạm Văn Đức',
    phone: '0944 567 404',
    email: 'duc.pham@gmail.com',
    transactions: [
      { date: '2026-10-10', desc: 'Tư vấn gói SEO cơ bản', amount: 1500000 },
    ],
    interactions: [
      { date: '2026-10-11', type: 'Cuộc gọi', text: 'Tư vấn các gói dịch vụ SEO, khách đang cân nhắc nâng cấp.' },
    ]
  },
  {
    id: 'c5',
    name: 'Hoàng Thị Mai',
    phone: '0955 678 505',
    email: 'mai.hoang@gmail.com',
    transactions: [
      { date: '2026-04-10', desc: 'Website thương mại điện tử',    amount: 12000000 },
      { date: '2026-06-15', desc: 'Tích hợp cổng thanh toán',       amount: 3000000  },
      { date: '2026-09-20', desc: 'Bảo trì định kỳ 6 tháng',        amount: 2400000  },
      { date: '2026-11-01', desc: 'Nâng cấp giao diện mobile',      amount: 4000000  },
    ],
    interactions: [
      { date: '2026-04-11', type: 'Cuộc gọi',   text: 'Ký hợp đồng thiết kế website TMĐT, dự án khởi động ngay.' },
      { date: '2026-07-10', type: 'Họp online',  text: 'Review tiến độ tích hợp cổng thanh toán, đúng schedule.' },
      { date: '2026-11-14', type: 'Email',        text: 'Thông báo bàn giao sản phẩm vào ngày 15/11/2026.' },
    ]
  },
  {
    id: 'c6',
    name: 'Vũ Quốc Bảo',
    phone: '0966 789 606',
    email: 'bao.vu@startup.io',
    transactions: [
      { date: '2026-11-05', desc: 'Demo và tư vấn sơ bộ', amount: 500000 },
    ],
    interactions: [
      { date: '2026-11-05', type: 'Demo', text: 'Trình bày portfolio, khách quan tâm đến gói thiết kế website startup.' },
    ]
  },
  {
    id: 'c7',
    name: 'Đặng Thị Thu',
    phone: '0977 890 707',
    email: 'thu.dang@gmail.com',
    transactions: [
      { date: '2026-05-25', desc: 'Thiết kế bộ nhận diện thương hiệu', amount: 6000000 },
    ],
    interactions: [
      { date: '2026-05-26', type: 'Email',    text: 'Gửi brief yêu cầu thiết kế nhận diện thương hiệu.' },
      { date: '2026-06-30', type: 'Cuộc gọi', text: 'Nghiệm thu bộ nhận diện, khách đánh giá cao.' },
    ]
  },
  {
    id: 'c8',
    name: 'Bùi Văn Nam',
    phone: '0988 901 808',
    email: 'nam.bui@enterprise.com',
    transactions: [
      { date: '2026-03-01', desc: 'Hệ thống quản lý nội bộ',       amount: 15000000 },
      { date: '2026-08-15', desc: 'Mô-đun báo cáo & analytics',    amount: 5000000  },
    ],
    interactions: [
      { date: '2026-03-02', type: 'Họp trực tiếp', text: 'Kickoff dự án hệ thống quản lý, thống nhất phạm vi công việc.' },
      { date: '2026-08-20', type: 'Email',          text: 'Bàn giao mô-đun báo cáo, khách yêu cầu thêm biểu đồ doanh thu.' },
    ]
  },
];

/** Lịch làm việc ngày 15/11/2026 */
const SCHEDULE = [
  { time: '08:30', customerId: 'c1', customerName: 'Nguyễn Thị Lan',  task: 'Gọi điện xác nhận thiết kế logo' },
  { time: '09:15', customerId: 'c2', customerName: 'Trần Minh Khoa',  task: 'Gửi báo giá website'               },
  { time: '10:00', customerId: 'c3', customerName: 'Lê Thị Hoa',      task: 'Họp trực tuyến review mockup'      },
  { time: '14:00', customerId: 'c5', customerName: 'Hoàng Thị Mai',   task: 'Bàn giao sản phẩm hoàn chỉnh'      },
  { time: '15:30', customerId: 'c4', customerName: 'Phạm Văn Đức',    task: 'Tư vấn gói dịch vụ SEO'            },
  { time: '17:00', customerId: 'c6', customerName: 'Vũ Quốc Bảo',    task: 'Follow-up sau demo'                 },
];

/** Dữ liệu khảo sát khách hàng */
const SURVEY_DATA = [
  {
    name: 'Nguyễn Thị Lan',
    service: 'Thiết kế logo & website',
    rating: 5,
    comment: 'Đội ngũ HQHN rất chuyên nghiệp, hiểu rõ yêu cầu và tư vấn nhiệt tình. Sản phẩm vượt kỳ vọng, tôi sẽ tiếp tục hợp tác trong các dự án sắp tới!'
  },
  {
    name: 'Hoàng Thị Mai',
    service: 'Website thương mại điện tử',
    rating: 5,
    comment: 'Website chạy mượt mà, giao diện đẹp, tích hợp thanh toán không lỗi. Thời gian bàn giao đúng hạn, hỗ trợ sau bán hàng rất tốt. Rất hài lòng!'
  },
  {
    name: 'Đặng Thị Thu',
    service: 'Bộ nhận diện thương hiệu',
    rating: 4,
    comment: 'Thiết kế sáng tạo, phù hợp với định vị thương hiệu. Có một vài chỉnh sửa nhỏ nhưng team xử lý nhanh. Nhìn chung chất lượng tốt so với chi phí.'
  },
  {
    name: 'Trần Minh Khoa',
    service: 'Dịch vụ SEO',
    rating: 4,
    comment: 'Sau 3 tháng, từ khóa chính lên top 5 Google. Báo cáo hàng tháng rõ ràng, dễ hiểu. Mong muốn có thêm phân tích đối thủ cạnh tranh chi tiết hơn.'
  },
  {
    name: 'Bùi Văn Nam',
    service: 'Hệ thống quản lý nội bộ',
    rating: 5,
    comment: 'Hệ thống ổn định, tích hợp đầy đủ các nghiệp vụ theo yêu cầu. Đội ngũ kỹ thuật giải quyết vấn đề nhanh, luôn hỗ trợ 24/7. Đây là đối tác công nghệ đáng tin cậy.'
  },
];

/* ============================================================
   STATE — Quản lý dữ liệu khách hàng
============================================================ */
let customers = [];

/** Tải khách hàng: ưu tiên dữ liệu đã lưu trong localStorage */
function loadCustomers() {
  const saved = localStorage.getItem('hqhn_customers');
  if (saved) {
    customers = JSON.parse(saved);
  } else {
    customers = JSON.parse(JSON.stringify(DEFAULT_CUSTOMERS));
    saveCustomers();
  }
}

/** Lưu danh sách khách hàng vào localStorage */
function saveCustomers() {
  localStorage.setItem('hqhn_customers', JSON.stringify(customers));
}

/** Tìm khách hàng theo ID */
function getCustomerById(id) {
  return customers.find(c => c.id === id);
}

/* ============================================================
   ĐIỀU HƯỚNG (Navigation)
============================================================ */
const tabs    = document.querySelectorAll('.nav-tab');
const screens = document.querySelectorAll('.screen');

/** Chuyển sang màn hình theo tên */
function switchScreen(name) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.screen === name));
  screens.forEach(s => s.classList.toggle('active', s.id === 'screen-' + name));

  if (name === 'directory') renderDirectory();
  if (name === 'care')      renderCareScreen();
  if (name === 'home')      renderSchedule();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => switchScreen(tab.dataset.screen));
});

/* ============================================================
   MÀN HÌNH 1 — TRANG CHỦ: Lịch làm việc
============================================================ */
function renderSchedule() {
  const list = document.getElementById('scheduleList');
  list.innerHTML = '';

  SCHEDULE.forEach(item => {
    const li = document.createElement('li');
    li.className = 'schedule-item';
    li.innerHTML = `
      <div class="sch-time">${item.time}</div>
      <div class="sch-info">
        <div class="sch-name">${item.customerName}</div>
        <div class="sch-task">${item.task}</div>
      </div>
      <button class="btn btn-sm" onclick="goToCare('${item.customerId}')">Ghi phản hồi</button>
    `;
    list.appendChild(li);
  });
}

/** Chuyển sang màn hình Chăm sóc và chọn sẵn khách hàng */
function goToCare(customerId) {
  switchScreen('care');
  const sel = document.getElementById('careCustomerSelect');
  if (sel) sel.value = customerId;
}

/* ============================================================
   MÀN HÌNH 2 — DANH BẠ KHÁCH HÀNG
============================================================ */

/** Render danh sách khách hàng (có thể lọc theo từ khóa) */
function renderDirectory(filter = '') {
  const grid = document.getElementById('customerGrid');
  grid.innerHTML = '';

  const q = filter.trim().toLowerCase();
  const filtered = customers.filter(c =>
    !q ||
    c.name.toLowerCase().includes(q) ||
    c.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
  );

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">Không tìm thấy khách hàng phù hợp.</div>';
    return;
  }

  filtered.forEach(c => {
    const total    = (c.transactions || []).reduce((s, t) => s + t.amount, 0);
    const rank     = getRank(total);
    const initials = c.name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();

    // Dòng thời gian tương tác
    const interactions = c.interactions || [];
    const tlHtml = interactions.length
      ? interactions.map(i => `
          <div class="timeline-item">
            <div><span class="tl-type">${i.type}</span></div>
            <div class="tl-date">${fmtDate(i.date)}</div>
            <div class="tl-text">${i.text}</div>
          </div>`).join('')
      : '<div style="font-size:.75rem;opacity:.4;font-style:italic;">Chưa có lịch sử tương tác.</div>';

    const card = document.createElement('div');
    card.className = 'customer-card';
    card.innerHTML = `
      <div class="card-header">
        <div class="card-avatar">${initials}</div>
        <div class="card-name-block">
          <div class="card-name">${c.name}</div>
          <div class="card-value">Tổng GD: ${fmtVND(total)}</div>
        </div>
        <span class="badge badge-${rank.key}">${rank.label}</span>
      </div>
      <div class="card-body">
        <div class="card-meta">📞 <span>${c.phone}</span></div>
        <div class="card-meta">✉️ <span>${c.email || '—'}</span></div>
        ${c.need ? `<div class="card-meta">💡 <span>${c.need}</span></div>` : ''}
        <div class="timeline">
          <div class="timeline-label">Lịch sử tương tác</div>
          ${tlHtml}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Lắng nghe sự kiện tìm kiếm
document.getElementById('searchInput').addEventListener('input', function () {
  renderDirectory(this.value);
});

/** Hiện/ẩn form thêm lead */
function toggleAddForm() {
  const form = document.getElementById('addLeadForm');
  form.classList.toggle('open');
  if (form.classList.contains('open')) {
    document.getElementById('leadName').focus();
  }
}

/** Lưu khách hàng tiềm năng mới */
function saveLead() {
  const name  = document.getElementById('leadName').value.trim();
  const phone = document.getElementById('leadPhone').value.trim();
  const email = document.getElementById('leadEmail').value.trim();
  const need  = document.getElementById('leadNeed').value.trim();

  if (!name || !phone) {
    showToast('⚠️ Vui lòng nhập họ tên và số điện thoại.');
    return;
  }

  const newCustomer = {
    id: 'c' + Date.now(),
    name, phone, email, need,
    transactions: [],
    interactions: [
      { date: new Date().toISOString().slice(0,10), type: 'Thêm mới', text: `Thêm vào hệ thống CRM${need ? ' — Nhu cầu: ' + need : ''}.` }
    ]
  };

  customers.push(newCustomer);
  saveCustomers();
  renderDirectory(document.getElementById('searchInput').value);
  updateCareSelect();

  // Reset form
  ['leadName','leadPhone','leadEmail','leadNeed'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('addLeadForm').classList.remove('open');
  showToast(`✅ Đã thêm khách hàng "${name}" thành công!`);
}

/* ============================================================
   MÀN HÌNH 3 — FORM CHĂM SÓC
============================================================ */
function renderCareScreen() {
  updateCareSelect();
  renderSurvey();
}

/** Cập nhật danh sách khách hàng trong dropdown */
function updateCareSelect() {
  const sel     = document.getElementById('careCustomerSelect');
  const current = sel.value;
  sel.innerHTML = '<option value="">— Chọn khách hàng —</option>';
  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value       = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
  // Giữ lại lựa chọn cũ nếu vẫn còn hợp lệ
  if (current && customers.find(c => c.id === current)) {
    sel.value = current;
  }
}

/** Lưu ghi nhận chăm sóc → đẩy vào lịch sử tương tác của khách */
function saveCare() {
  const selEl    = document.getElementById('careCustomerSelect');
  const response = document.getElementById('careResponse').value.trim();
  const notes    = document.getElementById('careNotes').value.trim();

  if (!selEl.value) {
    showToast('⚠️ Vui lòng chọn khách hàng.');
    return;
  }
  if (!response && !notes) {
    showToast('⚠️ Vui lòng nhập nội dung phản hồi hoặc ghi chú.');
    return;
  }

  const customer = getCustomerById(selEl.value);
  if (!customer) return;

  const today = new Date().toISOString().slice(0, 10);

  if (response) {
    customer.interactions.push({ date: today, type: 'Phản hồi',    text: response });
  }
  if (notes) {
    customer.interactions.push({ date: today, type: 'Yêu cầu KH', text: notes });
  }

  saveCustomers();

  // Hiển thị thông báo lưu thành công
  const flash = document.getElementById('saveFlash');
  flash.classList.add('show');
  setTimeout(() => flash.classList.remove('show'), 2500);

  showToast(`✅ Đã lưu ghi nhận cho "${customer.name}"`);
}

/** Xóa sạch form chăm sóc */
function clearCareForm() {
  document.getElementById('careResponse').value = '';
  document.getElementById('careNotes').value    = '';
  document.getElementById('careCustomerSelect').value = '';
}

/* ============================================================
   BẢNG KHẢO SÁT — CSS Transition toggle
============================================================ */
function renderSurvey() {
  const tbody = document.getElementById('surveyBody');
  tbody.innerHTML = '';

  SURVEY_DATA.forEach((row, idx) => {
    const stars = '★'.repeat(row.rating) + '☆'.repeat(5 - row.rating);
    const trId  = 'cmt-row-' + idx;

    // Hàng dữ liệu
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${row.name}</strong></td>
      <td>${row.service}</td>
      <td><span class="stars">${stars}</span> (${row.rating}/5)</td>
      <td>
        <button class="btn btn-sm btn-ghost" onclick="toggleComment(${idx})">
          Xem nhận xét
        </button>
      </td>
    `;

    // Hàng nhận xét (ẩn mặc định, mở bằng CSS transition)
    const ctr = document.createElement('tr');
    ctr.className = 'comment-row';
    ctr.id = trId;
    ctr.innerHTML = `
      <td colspan="5">
        <div class="comment-inner" id="cmt-inner-${idx}">
          💬 &ldquo;${row.comment}&rdquo;
        </div>
      </td>
    `;

    tbody.appendChild(tr);
    tbody.appendChild(ctr);
  });
}

/** Mở/đóng nhận xét bằng CSS transition (max-height) */
function toggleComment(idx) {
  const inner = document.getElementById('cmt-inner-' + idx);
  if (!inner) return;
  inner.classList.toggle('open');
}

/* ============================================================
   TOAST NOTIFICATION
============================================================ */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ============================================================
   HIỂN THỊ NGÀY TRÊN HEADER
============================================================ */
function setHeaderDate() {
  const el   = document.getElementById('headerDate');
  const demo = new Date('2026-11-15T08:00:00+07:00');
  const opts = { weekday:'long', day:'2-digit', month:'long', year:'numeric' };
  el.innerHTML = demo.toLocaleDateString('vi-VN', opts)
    + '<br/><span style="font-size:.7rem;opacity:.5;letter-spacing:1.5px;">PHIÊN BẢN 1.0</span>';
}

/* ============================================================
   KHỞI ĐỘNG ỨNG DỤNG
============================================================ */
(function init() {
  loadCustomers();
  setHeaderDate();
  renderSchedule();     // Trang chủ là mặc định
  renderDirectory();    // Pre-render để tìm kiếm hoạt động ngay
  updateCareSelect();   // Pre-populate dropdown chăm sóc
  renderSurvey();       // Pre-render bảng khảo sát
})();
